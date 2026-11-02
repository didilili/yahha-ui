import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

/** Serve only the bundled snapshot; no dependency installation or project source access. */
export async function createDocumentationServer(directory) {
  const root = await realpath(directory);
  const inside = (path) => path === root || path.startsWith(`${root}${sep}`);
  return createServer(async (request, response) => {
    try {
      if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, { Allow: 'GET, HEAD' }).end();
        return;
      }
      const url = new URL(request.url, 'http://localhost');
      const pathname = decodeURIComponent(url.pathname);
      let file = resolve(root, `.${pathname}`);
      if (!inside(file)) {
        response.writeHead(403).end();
        return;
      }
      file = await realpath(file);
      if (!inside(file)) {
        response.writeHead(403).end();
        return;
      }
      if ((await stat(file)).isDirectory()) {
        if (!pathname.endsWith('/')) {
          response.writeHead(308, { Location: `${url.pathname}/${url.search}` }).end();
          return;
        }
        file = await realpath(join(file, 'index.html'));
        if (!inside(file)) {
          response.writeHead(403).end();
          return;
        }
      }
      const body = await readFile(file);
      response.writeHead(200, {
        'Content-Type': types[extname(file)] ?? 'application/octet-stream',
        'Content-Length': body.length,
      });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch {
      response.writeHead(404).end();
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const directory = fileURLToPath(new URL('../documentation/', import.meta.url));
    const server = await createDocumentationServer(directory);
    server.listen(0, '127.0.0.1', () => {
      console.log(`本地组件文档：http://127.0.0.1:${server.address().port}/#/components`);
      console.log('包含 API、使用指南、素材下载和博客预览。按 Ctrl+C 停止。');
    });
  } catch (error) {
    console.error(`无法打开配套文档：${error.message}`);
    process.exitCode = 1;
  }
}
