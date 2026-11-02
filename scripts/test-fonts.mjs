import assert from 'node:assert/strict';
import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('..', import.meta.url));
const sites = [
  {
    name: 'docs',
    directory: resolve(root, 'demo-dist'),
    prefix: '/font-regression/docs/',
    notices: resolve(root, 'playground/src/assets'),
  },
  {
    name: 'blog',
    directory: resolve(root, 'examples/blog/dist'),
    prefix: '/font-regression/blog/',
    notices: resolve(root, 'examples/blog/src/assets'),
  },
];
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const site = sites.find(({ prefix }) => pathname.startsWith(prefix));
    if (!site) {
      response.writeHead(404).end();
      return;
    }
    const file = resolve(site.directory, pathname.slice(site.prefix.length) || 'index.html');
    if (!file.startsWith(`${site.directory}${sep}`)) {
      response.writeHead(403).end();
      return;
    }
    const body = await readFile(file);
    response.writeHead(200, {
      'Content-Type': mime[extname(file)] ?? 'application/octet-stream',
      'Content-Length': body.length,
    });
    response.end(body);
  } catch {
    response.writeHead(404).end();
  }
});

const includesCodepoint = (range, codepoint) =>
  range.split(',').some((part) => {
    const value = part.trim().replace(/^U\+/i, '');
    if (value.includes('?')) {
      return (
        codepoint >= Number.parseInt(value.replaceAll('?', '0'), 16) &&
        codepoint <= Number.parseInt(value.replaceAll('?', 'F'), 16)
      );
    }
    const [first, last = first] = value.split('-');
    return codepoint >= Number.parseInt(first, 16) && codepoint <= Number.parseInt(last, 16);
  });

async function renderedFonts(page) {
  return page.evaluate(() => {
    const faces = [];
    function visit(sheet) {
      for (const rule of sheet.cssRules) {
        if (rule.type === CSSRule.IMPORT_RULE) visit(rule.styleSheet);
        if (rule.type !== CSSRule.FONT_FACE_RULE) continue;
        const source = /url\(["']?([^"')]+)["']?\)/.exec(rule.style.src);
        if (source)
          faces.push({
            family: rule.style.fontFamily.replaceAll(/["']/g, '').trim(),
            range: rule.style.unicodeRange || 'U+0-10FFFF',
            url: new URL(source[1], sheet.href || document.baseURI).href,
          });
      }
    }
    for (const sheet of document.styleSheets) visit(sheet);
    const runs = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const element = node.parentElement;
      if (
        node.textContent.trim() &&
        element &&
        !element.closest('script,style,noscript') &&
        element.checkVisibility()
      )
        runs.push({ text: node.textContent, family: getComputedStyle(element).fontFamily });
    }
    for (const element of document.querySelectorAll('input,textarea')) {
      if (!element.checkVisibility()) continue;
      const value = element.value || element.placeholder;
      if (value)
        runs.push({
          text: value,
          family: getComputedStyle(element, element.value ? null : '::placeholder').fontFamily,
        });
    }
    for (const element of document.querySelectorAll('body *')) {
      if (!element.checkVisibility()) continue;
      for (const pseudo of ['::before', '::after']) {
        const style = getComputedStyle(element, pseudo);
        if (/^["'].*["']$/.test(style.content))
          runs.push({ text: style.content.slice(1, -1), family: style.fontFamily });
      }
    }
    return { faces, runs };
  });
}

function requiredURLs({ faces, runs }) {
  const required = new Set();
  for (const { text, family } of runs) {
    const families = family.split(',').map((value) => value.replaceAll(/["']/g, '').trim());
    for (const character of text) {
      for (const candidate of families) {
        const match = faces.find(
          (face) =>
            face.family === candidate && includesCodepoint(face.range, character.codePointAt(0)),
        );
        if (!match) continue;
        required.add(match.url);
        break;
      }
    }
  }
  return required;
}

async function expectWebfont(page, client, selector, family) {
  const element = page.locator(selector);
  await element.waitFor();
  await element.evaluate((node) => node.getBoundingClientRect());
  await page.evaluate(() => document.fonts.ready);
  const { root: document } = await client.send('DOM.getDocument');
  const { nodeId } = await client.send('DOM.querySelector', { nodeId: document.nodeId, selector });
  const { fonts } = await client.send('CSS.getPlatformFontsForNode', { nodeId });
  const text = await element.innerText();
  const postScriptName =
    family === 'LXGW WenKai' ? 'LXGWWenKai-Regular' : 'LXGWMarkerGothic-Regular';
  assert(fonts.length > 0, `${selector}: no rendered glyphs found for ${text}`);
  assert(
    fonts.every((font) => font.isCustomFont && font.postScriptName === postScriptName),
    `${selector} (${text}) must use ${family} for every rendered glyph; got ${JSON.stringify(fonts)}`,
  );
  console.log(
    `  ${selector}: ${text} → ${family} (${fonts.reduce((n, f) => n + f.glyphCount, 0)} glyphs)`,
  );
}

async function verifySite(browser, site, width, origin) {
  const context = await browser.newContext({
    viewport: { width, height: width === 390 ? 844 : 1000 },
    reducedMotion: 'reduce',
  });
  try {
    const page = await context.newPage();
    page.setDefaultTimeout(10_000);
    const downloaded = new Map();
    const failures = [];
    page.on('requestfailed', (request) => {
      if (request.resourceType() === 'font')
        failures.push(`${request.url()}: ${request.failure()?.errorText}`);
    });
    page.on('response', (response) => {
      if (response.request().resourceType() !== 'font') return;
      if (!response.ok()) failures.push(`${response.url()}: HTTP ${response.status()}`);
      downloaded.set(response.url(), Number(response.headers()['content-length'] || 0));
    });
    const baseURL = `${origin}${site.prefix}`;
    const route = site.name === 'docs' ? '#/' : '#/posts/soup-afternoon';
    await page.goto(`${baseURL}${route}`);
    await page.locator(site.name === 'docs' ? '#home-title' : '#page-heading').waitFor();
    await page.evaluate(() => document.fonts.ready);
    const initial = await renderedFonts(page);
    const required = requiredURLs(initial);
    const initialURLs = new Set(downloaded.keys());
    const initialBytes = [...downloaded.values()].reduce((sum, bytes) => sum + bytes, 0);
    console.log(
      `${site.name} ${width}px: first load ${initialURLs.size} font files, ${initialBytes.toLocaleString('en-US')} bytes`,
    );
    const client = await context.newCDPSession(page);
    await client.send('DOM.enable');
    await client.send('CSS.enable');
    if (site.name === 'docs') {
      await expectWebfont(page, client, '#home-little-site', 'LXGW WenKai');
      await page.getByRole('textbox', { name: '手记标题' }).fill('橘子汽水与晚霞龘');
      await expectWebfont(page, client, '.home-sample-article h3', 'LXGW WenKai');
      const afterInput = await renderedFonts(page);
      for (const url of requiredURLs(afterInput)) required.add(url);
      const rareFace = afterInput.faces.find(
        (face) => face.family === 'WenKai' && includesCodepoint(face.range, '龘'.codePointAt(0)),
      );
      assert(rareFace, 'The WenKai source must cover the new user-input character 龘.');
      assert(
        !initialURLs.has(rareFace.url),
        '龘 must exercise a chunk outside the initial common download.',
      );
      assert(downloaded.has(rareFace.url), 'Typing 龘 must download its unicode-range chunk.');
    } else {
      await expectWebfont(page, client, '#page-heading', 'LXGW WenKai');
      await expectWebfont(page, client, '.blog-article-prose > p', 'LXGW WenKai');
      await expectWebfont(page, client, '.blog-footer strong', 'LXGW Marker Gothic');
    }
    assert.deepEqual(failures, [], 'Every requested font must download successfully.');
    for (const url of downloaded.keys())
      assert(
        required.has(url),
        `A font chunk was downloaded without rendered text needing it: ${url}`,
      );
    const declared = new Set(initial.faces.map(({ url }) => url));
    assert(
      downloaded.size < declared.size,
      'The page must not download every declared font chunk.',
    );
    console.log(
      `  on demand: ${downloaded.size} / ${declared.size} declared font files requested; no unused chunks`,
    );
    for (const name of ['OFL-marker.txt', 'OFL-wenkai.txt']) {
      const response = await page.request.get(`${baseURL}notices/${name}`);
      assert(response.ok(), `${site.name}: built notices/${name} must be served.`);
      assert.deepEqual(
        await response.body(),
        await readFile(resolve(site.notices, name)),
        `${site.name}: ${name} must match its source declaration.`,
      );
    }
  } finally {
    await context.close();
  }
}

let browser;
try {
  for (const { directory } of sites) await readFile(resolve(directory, 'index.html'));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true });
  for (const width of [1440, 390])
    for (const site of sites) await verifySite(browser, site, width, origin);
  console.log(
    'Fonts passed: desktop/mobile rendered webfonts, lazy chunks and both built OFL notices.',
  );
} finally {
  await browser?.close();
  server.closeAllConnections();
  if (server.listening) await new Promise((done) => server.close(done));
}
