import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { once } from 'node:events';
import { chromium, firefox, webkit } from 'playwright';
import { verifyDocs } from '../tests/docs-site/browser.mjs';
import {
  verifyCoreComponents,
  verifyCoreControlEdges,
} from '../tests/docs-site/core-components.mjs';
import { verifySelectionComponents } from '../tests/docs-site/selection-components.mjs';
import {
  verifyBlogArchive,
  verifyNavigationExamples,
} from '../tests/docs-site/navigation-components.mjs';
import {
  verifyArticleActions,
  verifyDialogForm,
  verifyOverlayExamples,
} from '../tests/docs-site/overlay-components.mjs';

const root = resolve(fileURLToPath(new URL('../demo-dist/', import.meta.url)));
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};
// A nested deployment catches absolute asset URLs that would fail on GitHub Pages.
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!pathname.startsWith('/docs-preview/')) {
      response.writeHead(404).end();
      return;
    }
    const relative = pathname.slice('/docs-preview/'.length) || 'index.html';
    const file = resolve(root, relative);
    if (!file.startsWith(`${root}${sep}`)) {
      response.writeHead(403).end();
      return;
    }
    response.writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream' });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404).end();
  }
});
let browser;
try {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const baseURL = `http://127.0.0.1:${server.address().port}/docs-preview/`;
  if (process.argv.includes('--core-controls')) {
    for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
      browser = await engine.launch({ headless: true });
      try {
        const page = await browser.newPage();
        page.setDefaultTimeout(5000);
        await verifyCoreComponents(page, baseURL);
        await verifyCoreControlEdges(page, baseURL);
        await verifySelectionComponents(page, baseURL);
        console.log(`${name}: nine controls passed at desktop and 320px.`);
      } finally {
        await browser.close();
        browser = undefined;
      }
    }
  } else if (
    process.argv.includes('--navigation-controls') ||
    process.argv.includes('--overlay-controls')
  ) {
    const overlays = process.argv.includes('--overlay-controls');
    for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
      browser = await engine.launch({ headless: true });
      try {
        for (const width of [1280, 320]) {
          const page = await browser.newPage({
            viewport: { width, height: overlays && width === 320 ? 500 : 844 },
          });
          page.setDefaultTimeout(5000);
          try {
            if (overlays) {
              await verifyDialogForm(page, baseURL);
              await verifyOverlayExamples(page, baseURL);
              await verifyArticleActions(page, baseURL);
            } else {
              await verifyNavigationExamples(page, baseURL);
              await verifyBlogArchive(page, baseURL);
            }
            console.log(
              `${name}: ${overlays ? 'overlay examples and article actions' : 'navigation examples and blog archive'} passed at ${width}px.`,
            );
          } finally {
            await page.close();
          }
        }
      } finally {
        await browser.close();
        browser = undefined;
      }
    }
  } else {
    browser = await chromium.launch({ headless: true });
    await verifyDocs(browser, baseURL);
    console.log(
      'Documentation passed: homepage interactions, routes, all APIs/95 examples, SVG states and welcome motion controls, copy fallback, search, dialog, mobile navigation and nested deployment.',
    );
  }
} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
