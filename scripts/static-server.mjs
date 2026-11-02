import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';

export const siteContentTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

// Private acceptance-script helper; each mount serves only its own built files.
export async function startStaticServer(
  mounts,
  { contentTypes = siteContentTypes, contentLength = false, favicon = false } = {},
) {
  const directories = mounts.map(({ directory, prefix }) => ({
    directory: resolve(directory),
    prefix,
  }));
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (favicon && pathname === '/favicon.ico') {
        response.writeHead(204).end();
        return;
      }
      const mount = directories.find(({ prefix }) => pathname.startsWith(prefix));
      if (!mount) {
        response.writeHead(404).end();
        return;
      }
      // The root package runner treats leading slashes as relative to its output.
      const relative = mount.prefix === '/' ? `.${pathname}` : pathname.slice(mount.prefix.length);
      const file = resolve(mount.directory, pathname === mount.prefix ? 'index.html' : relative);
      if (!file.startsWith(`${mount.directory}${sep}`)) {
        response.writeHead(403).end();
        return;
      }
      const body = await readFile(file);
      response.writeHead(200, {
        'Content-Type': contentTypes[extname(file)] ?? 'application/octet-stream',
        ...(contentLength ? { 'Content-Length': body.length } : {}),
      });
      response.end(body);
    } catch {
      response.writeHead(404).end();
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return {
    origin: `http://127.0.0.1:${server.address().port}`,
    async close() {
      server.closeAllConnections();
      if (server.listening) await new Promise((done) => server.close(done));
    },
  };
}
