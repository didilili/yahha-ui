import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { Agent, get } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { siteContentTypes, startStaticServer } from '../scripts/static-server.mjs';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'yahha-static-server-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const docs = join(root, 'docs');
  const site = join(root, 'site');
  await mkdir(join(docs, 'assets'), { recursive: true });
  await mkdir(join(docs, 'notices'));
  await mkdir(site);
  await mkdir(join(root, 'docs-private'));
  await writeFile(join(root, 'docs-private', 'secret.txt'), 'outside');
  await writeFile(join(docs, 'index.html'), '<h1>Docs</h1>');
  await writeFile(join(site, 'index.html'), '<h1>Site</h1>');
  for (const extension of ['js', 'css', 'svg', 'png', 'woff2', 'bin'])
    await writeFile(join(docs, 'assets', `file.${extension}`), `asset ${extension}`);
  await writeFile(join(docs, 'space name.txt'), 'decoded name');
  await writeFile(join(docs, 'favicon.ico'), 'favicon');
  await writeFile(join(docs, 'notices', 'OFL-wenkai.txt'), '字体许可\n');
  return { root, docs, site };
}

function request(origin, path, agent = false) {
  // Pass the raw path so the HTTP client cannot normalize traversal cases away.
  const { hostname, port } = new URL(origin);
  return new Promise((resolve, reject) => {
    get({ hostname, port, path, agent }, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('error', reject);
      response.on('end', () =>
        resolve({
          status: response.statusCode,
          headers: response.headers,
          body: Buffer.concat(chunks),
        }),
      );
    }).on('error', reject);
  });
}

async function serve(t, mounts, options) {
  const server = await startStaticServer(mounts, options);
  t.after(() => server.close());
  return server;
}

test('nested mounts serve their own index and assets with the existing MIME types', async (t) => {
  const { docs, site } = await fixture(t);
  const { origin } = await serve(t, [
    { directory: docs, prefix: '/docs/' },
    { directory: site, prefix: '/site/' },
  ]);
  assert.equal((await request(origin, '/docs/')).body.toString(), '<h1>Docs</h1>');
  assert.equal((await request(origin, '/site/?preview=1')).body.toString(), '<h1>Site</h1>');
  for (const [extension, type] of Object.entries({
    html: 'text/html',
    js: 'text/javascript',
    css: 'text/css',
    png: 'image/png',
    svg: 'image/svg+xml',
    woff2: 'font/woff2',
    bin: 'application/octet-stream',
  })) {
    const path = extension === 'html' ? '/docs/' : `/docs/assets/file.${extension}`;
    const response = await request(origin, path);
    assert.equal(response.status, 200, path);
    assert.equal(response.headers['content-type'], type, path);
  }
  const decoded = await request(origin, '/docs/space%20name.txt?download=1');
  assert.equal(decoded.body.toString(), 'decoded name');
  assert.equal(decoded.headers['content-type'], 'application/octet-stream');
  assert.equal((await request(origin, '/docs/favicon.ico')).body.toString(), 'favicon');
});

test('unmatched mounts, missing files, directories and malformed encodings return 404', async (t) => {
  const { docs } = await fixture(t);
  const { origin } = await serve(t, [{ directory: docs, prefix: '/docs/' }]);
  for (const path of ['/', '/docs', '/docs-other/', '/docs/missing.js', '/docs/assets/', '/docs/%'])
    assert.equal((await request(origin, path)).status, 404, path);
  assert.equal((await request(origin, '/docs/')).status, 200, 'server survives missing files');
});

test('decoded traversal cannot escape the mount or enter a sibling with the same prefix', async (t) => {
  const { docs } = await fixture(t);
  const { origin } = await serve(t, [{ directory: docs, prefix: '/docs/' }]);
  for (const path of [
    '/docs/%2e%2e%2fdocs-private/secret.txt',
    '/docs/%2e%2e%2Fdocs-private%2Fsecret.txt',
    '/docs/%2fetc/passwd',
    '/docs/%2e%2f',
  ])
    assert.equal((await request(origin, path)).status, 403, path);
  // URL dot-segment normalization moves these outside /docs/ before mount selection.
  for (const path of ['/docs/../docs-private/secret.txt', '/docs/%2e%2e/docs-private/secret.txt'])
    assert.equal((await request(origin, path)).status, 404, path);
});

test('font mounts retain UTF-8 OFL notices and byte-accurate content lengths', async (t) => {
  const { docs, site } = await fixture(t);
  await writeFile(join(site, 'OFL-marker.txt'), 'Marker OFL');
  const { origin } = await serve(
    t,
    [
      { directory: docs, prefix: '/font-regression/docs/' },
      { directory: site, prefix: '/font-regression/site/' },
    ],
    {
      contentTypes: { ...siteContentTypes, '.txt': 'text/plain; charset=utf-8' },
      contentLength: true,
    },
  );
  for (const [path, contents] of [
    ['/font-regression/docs/notices/OFL-wenkai.txt', '字体许可\n'],
    ['/font-regression/site/OFL-marker.txt', 'Marker OFL'],
  ]) {
    const response = await request(origin, path);
    assert.equal(response.status, 200);
    assert.equal(response.headers['content-type'], 'text/plain; charset=utf-8');
    assert.equal(response.headers['content-length'], String(Buffer.byteLength(contents)));
    assert.equal(response.body.toString(), contents);
  }
});

test('the root package mount retains favicon 204 and its narrower MIME table', async (t) => {
  const { docs } = await fixture(t);
  const { origin } = await serve(t, [{ directory: docs, prefix: '/' }], {
    contentTypes: { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' },
    favicon: true,
  });
  assert.equal((await request(origin, '/')).body.toString(), '<h1>Docs</h1>');
  const favicon = await request(origin, '/favicon.ico');
  assert.equal(favicon.status, 204);
  assert.equal(favicon.body.length, 0);
  assert.equal(
    (await request(origin, '/assets/file.svg')).headers['content-type'],
    'application/octet-stream',
  );
  assert.equal((await request(origin, '/%2fassets/file.js')).body.toString(), 'asset js');
  assert.equal((await request(origin, '/%2e%2e%2fdocs-private/secret.txt')).status, 403);
});

test('a symlink used as the mount directory still serves normal files', async (t) => {
  const { root, docs } = await fixture(t);
  const linked = join(root, 'linked-docs');
  await symlink(docs, linked);
  const { origin } = await serve(t, [{ directory: linked, prefix: '/linked/' }]);
  assert.equal((await request(origin, '/linked/')).body.toString(), '<h1>Docs</h1>');
  assert.equal((await request(origin, '/linked/%2e%2e%2fdocs-private/secret.txt')).status, 403);
});

test('closing the server disconnects idle keep-alive clients and releases its port', async (t) => {
  const { docs } = await fixture(t);
  const agent = new Agent({ keepAlive: true });
  t.after(() => agent.destroy());
  const server = await serve(t, [{ directory: docs, prefix: '/' }]);
  assert.equal((await request(server.origin, '/', agent)).status, 200);
  const [socket] = Object.values(agent.freeSockets).flat();
  assert(socket, 'request must leave a live keep-alive connection');
  socket.ref();
  const disconnected = once(socket, 'close');
  await server.close();
  await disconnected;
  await assert.rejects(request(server.origin, '/'), { code: 'ECONNREFUSED' });
});
