import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { once } from 'node:events';
import { readFileSync } from 'node:fs';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { basename, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { chromium } from 'playwright';
import { verifyBlog } from '../tests/blog-site/browser.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const npmEntry = process.env.npm_execpath;
assert(npmEntry, 'Run with npm run test:blog after npm run build:lib.');
const temporary = await mkdtemp(join(tmpdir(), 'yahha-blog-consumer-'));
const consumer = join(temporary, 'consumer');
const exec = promisify(execFile);
let server;
let browser;

async function run(command, args, cwd = consumer) {
  try {
    const result = await exec(command, args, {
      cwd,
      env: { ...process.env, HUSKY: '0' },
      maxBuffer: 8 * 1024 * 1024,
      timeout: 180_000,
    });
    return result.stdout;
  } catch (error) {
    throw new Error(
      `${command} ${args.join(' ')} failed\n${error.stdout ?? ''}${error.stderr ?? ''}`,
      { cause: error },
    );
  }
}
const npm = (args, cwd = consumer) => run(process.execPath, [npmEntry, ...args], cwd);
const version = (name) =>
  JSON.parse(readFileSync(join(root, 'node_modules', name, 'package.json'), 'utf8')).version;

try {
  console.log(
    'Blog: packing the library and copying the same examples/blog website into an independent consumer.',
  );
  const result = await npm(
    ['pack', '--json', '--ignore-scripts', '--pack-destination', temporary],
    root,
  );
  const start = result.search(/\[\s*\{/);
  assert(start >= 0, 'npm pack must return a file manifest.');
  const [packed] = JSON.parse(result.slice(start));
  assert(
    packed.files.every(({ path }) => !path.startsWith('examples/')),
    'The website must stay outside the library package.',
  );
  await mkdir(consumer);
  await cp(join(root, 'examples/blog'), consumer, {
    recursive: true,
    filter: (file) => !['dist', 'node_modules'].includes(basename(file)),
  });
  await writeFile(
    join(consumer, 'package.json'),
    JSON.stringify(
      {
        name: 'yahha-ui-blog-consumer',
        private: true,
        type: 'module',
        dependencies: {
          'yahha-ui': `file:${join(temporary, packed.filename)}`,
          react: version('react'),
          'react-dom': version('react-dom'),
          'lucide-react': version('lucide-react'),
        },
        devDependencies: Object.fromEntries(
          [
            'typescript',
            'vite',
            '@vitejs/plugin-react',
            '@types/node',
            '@types/react',
            '@types/react-dom',
          ].map((name) => [name, version(name)]),
        ),
      },
      null,
      2,
    ),
  );
  await npm(['install', '--ignore-scripts', '--no-audit', '--no-fund']);
  const installed = JSON.parse(
    await readFile(join(consumer, 'node_modules/yahha-ui/package.json'), 'utf8'),
  );
  assert.equal(installed.name, 'yahha-ui');
  const viteConfig = await readFile(join(consumer, 'vite.config.ts'), 'utf8');
  const tsconfig = JSON.parse(await readFile(join(consumer, 'tsconfig.json'), 'utf8'));
  assert(
    !viteConfig.includes('alias') && !tsconfig.compilerOptions.paths,
    'Blog acceptance must use installed public exports without source aliases.',
  );
  await run(process.execPath, [
    join(consumer, 'node_modules/typescript/bin/tsc'),
    '--noEmit',
    '-p',
    'tsconfig.json',
  ]);
  await run(process.execPath, [
    join(consumer, 'node_modules/vite/bin/vite.js'),
    'build',
    '--config',
    'vite.config.ts',
  ]);
  console.log('Blog: installed-package types and production build passed.');

  const directory = join(consumer, 'dist');
  const prefix = '/examples/blog/';
  const mime = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
  };
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (!pathname.startsWith(prefix)) {
        response.writeHead(404).end();
        return;
      }
      const file = resolve(directory, pathname.slice(prefix.length) || 'index.html');
      if (!file.startsWith(`${directory}${sep}`)) {
        response.writeHead(403).end();
        return;
      }
      response.writeHead(200, {
        'Content-Type': mime[extname(file)] ?? 'application/octet-stream',
      });
      response.end(await readFile(file));
    } catch {
      response.writeHead(404).end();
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  browser = await chromium.launch({ headless: true });
  await verifyBlog(browser, `http://127.0.0.1:${server.address().port}${prefix}`);
  console.log(
    'Blog example passed: installed tarball, three pages, URL filters, browser back, bookmarks, focus and nested deployment.',
  );
} finally {
  await browser?.close();
  if (server) {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
  await rm(temporary, { recursive: true, force: true });
}
