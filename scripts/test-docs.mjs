import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { once } from 'node:events';
import { chromium } from 'playwright';
import { verifyDocs } from '../tests/docs-site/browser.mjs';

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
  browser = await chromium.launch({ headless: true });
  await verifyDocs(browser, `http://127.0.0.1:${server.address().port}/docs-preview/`);
  console.log(
    'Documentation passed: homepage interactions, routes, all APIs/86 examples, SVG states and welcome motion controls, copy fallback, search, dialog, mobile navigation and nested deployment.',
  );
} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
