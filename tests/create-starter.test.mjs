import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { once } from 'node:events';
import { get } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { createDocumentationServer } from '../scripts/starter-template/scripts/serve-documentation.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const script = join(root, 'scripts/create-starter.mjs');
const exec = promisify(execFile);

async function fixture(t) {
  const directory = await realpath(await mkdtemp(join(tmpdir(), 'yahha-starter-test-')));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

test('export refuses a non-empty directory and preserves its contents', async (t) => {
  const directory = await fixture(t);
  await writeFile(join(directory, 'keep.txt'), 'my existing project');
  await assert.rejects(exec(process.execPath, [script, '--output', directory]), (error) =>
    /非空目录/.test(error.stderr),
  );
  assert.equal(await readFile(join(directory, 'keep.txt'), 'utf8'), 'my existing project');
  assert.deepEqual(await readdir(directory), ['keep.txt']);
});

test('export refuses an existing zip instead of replacing it', async (t) => {
  const directory = await fixture(t);
  const output = join(directory, 'starter');
  await mkdir(output);
  await writeFile(`${output}.zip`, 'keep my archive');
  await assert.rejects(exec(process.execPath, [script, '--zip', '--output', output]), (error) =>
    /压缩包已存在/.test(error.stderr),
  );
  assert.equal(await readFile(`${output}.zip`, 'utf8'), 'keep my archive');
  assert.deepEqual(await readdir(output), []);
});

test('export rejects missing values, unknown options and duplicate flags', async () => {
  for (const args of [
    ['--output'],
    ['--unknown'],
    ['--example'],
    ['--example', 'starter'],
    ['--zip', '--zip'],
    ['--with-docs', '--with-docs'],
    ['--zip', 'true'],
  ]) {
    await assert.rejects(exec(process.execPath, [script, ...args]), (error) =>
      /用法/.test(error.stderr),
    );
  }
});

test('missing zip is explained before creating output or building anything', async (t) => {
  const directory = await fixture(t);
  const output = join(directory, 'project');
  await assert.rejects(
    exec(process.execPath, [script, '--output', output, '--zip'], {
      env: { ...process.env, PATH: directory },
    }),
    (error) => /需要系统 zip 命令/.test(error.stderr),
  );
  assert.deepEqual(await readdir(directory), []);
});

async function exportFixture(t) {
  const directory = await fixture(t);
  const repository = join(directory, 'repository');
  await mkdir(join(repository, 'scripts'), { recursive: true });
  await mkdir(join(repository, 'src'));
  await mkdir(join(repository, 'dist'));
  await cp(script, join(repository, 'scripts/create-starter.mjs'));
  await cp(join(root, 'scripts/starter-template'), join(repository, 'scripts/starter-template'), {
    recursive: true,
  });
  for (const path of ['LICENSE', 'THIRD_PARTY_NOTICES.md'])
    await writeFile(join(repository, path), 'Fixture notice.\n');
  const dependencies = Object.fromEntries(
    [
      'react',
      'react-dom',
      '@types/node',
      '@types/react',
      '@types/react-dom',
      '@vitejs/plugin-react',
      'typescript',
      'vite',
    ].map((name) => [name, '1.0.0']),
  );
  await writeFile(
    join(repository, 'package.json'),
    JSON.stringify({
      name: 'yahha-ui',
      version: '0.0.1',
      type: 'module',
      engines: { node: '>=22.22.3' },
      devDependencies: dependencies,
    }),
  );
  await writeFile(
    join(repository, 'package-lock.json'),
    JSON.stringify({
      packages: {
        '': { devDependencies: dependencies },
        ...Object.fromEntries(
          Object.keys(dependencies).map((name) => [`node_modules/${name}`, { version: '1.0.0' }]),
        ),
      },
    }),
  );
  for (const path of [
    'vite.lib.config.ts',
    'tsconfig.json',
    'tsconfig.lib.json',
    'dist/index.js',
    'dist/index.d.ts',
    'dist/style.css',
  ]) {
    await writeFile(join(repository, path), '');
  }
  // Exercise the real export and zip steps without building sites or accessing the network.
  const npmEntry = join(directory, 'fake-npm.mjs');
  await writeFile(
    npmEntry,
    `import { appendFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const args = process.argv.slice(2);
await appendFile('npm-calls.jsonl', JSON.stringify(args) + '\\n');
if (args[0] === 'run' && ['check:docs', 'check:fonts', 'build:lib'].includes(args[1])) {
  // The fixture already contains its small library outputs.
} else if (args[0] === 'exec' && args.includes('--outDir') && !args.includes('--config')) {
  const output = args[args.indexOf('--outDir') + 1];
  await mkdir(output, { recursive: true });
  await writeFile(join(output, 'index.html'), '<h1>Bundled snapshot</h1>');
  await mkdir(join(output, 'notices'));
  for (const name of ['OFL-marker.txt', 'OFL-wenkai.txt'])
    await writeFile(join(output, 'notices', name), name + ' fixture font license');
} else if (args[0] === 'pack') {
  const destination = args[args.indexOf('--pack-destination') + 1];
  await writeFile(join(destination, 'yahha-ui-0.0.1.tgz'), 'fixture package bytes');
  console.log(JSON.stringify([{ name: 'yahha-ui', version: '0.0.1',
    filename: 'yahha-ui-0.0.1.tgz',
    files: [{ path: 'dist/index.js' }, { path: 'LICENSE' }, { path: 'THIRD_PARTY_NOTICES.md' }] }]));
} else {
  throw new Error('Unexpected npm invocation: ' + args.join(' '));
}
`,
  );
  return {
    repository,
    async exportProject(name, args = [], environment = {}) {
      const output = join(directory, name ?? 'yahha-ui-starter');
      await exec(
        process.execPath,
        [
          join(repository, 'scripts/create-starter.mjs'),
          ...(name ? ['--output', output] : []),
          ...args,
        ],
        {
          env: { ...process.env, npm_execpath: npmEntry, ...environment },
          timeout: 15_000,
        },
      );
      return output;
    },
  };
}

test('default exports run without zip or website builds and preserve an unrelated archive', async (t) => {
  const { repository, exportProject } = await exportFixture(t);
  const output = join(dirname(repository), 'yahha-ui-starter');
  await writeFile(`${output}.zip`, 'existing archive');
  assert.equal(await exportProject(undefined, [], { PATH: repository }), output);
  const pkg = JSON.parse(await readFile(join(output, 'package.json'), 'utf8'));
  assert.ok(pkg.scripts.dev);
  assert.ok(pkg.scripts.build);
  assert.equal(pkg.scripts.docs, undefined);
  assert.deepEqual(Object.keys(pkg.dependencies).sort(), ['react', 'react-dom', 'yahha-ui']);
  for (const path of ['documentation', 'scripts/serve-documentation.mjs'])
    await assert.rejects(readFile(join(output, path)), { code: 'ENOENT' });
  assert.equal(await readFile(`${output}.zip`, 'utf8'), 'existing archive');
  await assertLocalLinksExist(
    join(output, 'README.md'),
    await readFile(join(output, 'README.md'), 'utf8'),
  );
  const calls = (await readFile(join(repository, 'npm-calls.jsonl'), 'utf8'))
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));
  assert.ok(calls.every((args) => args[0] === 'pack' || args[1] === 'build:lib'));
});

test('offline documentation is opt-in without requiring a zip archive', async (t) => {
  const { repository, exportProject } = await exportFixture(t);
  const output = await exportProject('docs-starter', ['--with-docs'], { PATH: repository });
  const pkg = JSON.parse(await readFile(join(output, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts.docs, 'node scripts/serve-documentation.mjs');
  assert.match(await readFile(join(output, 'README.md'), 'utf8'), /npm run docs/);
  assert.match(await readFile(join(output, 'documentation/index.html'), 'utf8'), /Bundled/);
  assert.deepEqual((await readdir(join(output, 'documentation'))).sort(), [
    'index.html',
    'notices',
  ]);
  const manifest = JSON.parse(await readFile(join(output, 'starter-manifest.json'), 'utf8'));
  assert.deepEqual(manifest.documentation, { directory: 'documentation', entry: '#/components' });
  await readFile(join(output, 'scripts/serve-documentation.mjs'));
  await assert.rejects(readFile(`${output}.zip`), { code: 'ENOENT' });
});

test('export preserves project and archive contents when the output directory is named starter.zip', async (t) => {
  const { exportProject } = await exportFixture(t);
  const output = await exportProject('starter.zip', ['--zip', '--with-docs']);
  const manifest = JSON.parse(await readFile(join(output, 'starter-manifest.json'), 'utf8'));
  assert.equal(manifest.library.tarball, 'vendor/yahha-ui-0.0.1.tgz');
  assert.equal(
    await readFile(join(output, manifest.library.tarball), 'utf8'),
    'fixture package bytes',
  );
  for (const path of [
    '.gitignore',
    'package.json',
    'src/App.tsx',
    'documentation/index.html',
    'documentation/notices/OFL-marker.txt',
    'starter-manifest.json',
    manifest.library.tarball,
  ]) {
    const { stdout } = await exec('unzip', ['-p', `${output}.zip`, `starter.zip/${path}`]);
    assert.equal(stdout, await readFile(join(output, path), 'utf8'), `ZIP must preserve ${path}`);
  }
});

test('exports still work when optional project notice files are absent', async (t) => {
  const { repository, exportProject } = await exportFixture(t);
  for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) await rm(join(repository, name));
  const output = await exportProject('starter', ['--zip']);
  const pkg = JSON.parse(await readFile(join(output, 'package.json'), 'utf8'));
  assert.ok(pkg.scripts.build);
  assert.equal(
    await readFile(join(output, 'vendor/yahha-ui-0.0.1.tgz'), 'utf8'),
    'fixture package bytes',
  );
  const { stdout } = await exec('unzip', ['-p', `${output}.zip`, 'starter/package.json']);
  assert.deepEqual(JSON.parse(stdout), pkg);
});

async function assertLocalLinksExist(file, markdown) {
  for (const match of markdown.matchAll(/\]\(([^)]+)\)/g)) {
    const path = match[1].split('#')[0];
    if (path && !/^[a-z]+:/i.test(path)) await readFile(join(dirname(file), path));
  }
}

function request(origin, path) {
  return new Promise((resolve, reject) => {
    get(`${origin}${path}`, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () =>
        resolve({
          status: response.statusCode,
          type: response.headers['content-type'],
          location: response.headers.location,
          body: Buffer.concat(chunks).toString(),
        }),
      );
    }).on('error', reject);
  });
}

test('zero-dependency docs preview serves nested pages without exposing sibling files', async (t) => {
  const directory = await fixture(t);
  const snapshot = join(directory, 'documentation');
  await mkdir(join(snapshot, 'guide'), { recursive: true });
  await mkdir(join(snapshot, 'assets'));
  await writeFile(join(snapshot, 'index.html'), '<h1>Component documentation</h1>');
  await writeFile(join(snapshot, 'guide/index.html'), '<h1>Documentation guide</h1>');
  await writeFile(join(snapshot, 'assets/example.svg'), '<svg/>');
  await writeFile(join(directory, 'private.txt'), 'not documentation');
  await symlink(join(directory, 'private.txt'), join(snapshot, 'escaped.txt'));
  const server = await createDocumentationServer(snapshot);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(
    () =>
      new Promise((done) => {
        server.closeAllConnections();
        server.close(done);
      }),
  );
  const origin = `http://127.0.0.1:${server.address().port}`;
  assert.match((await request(origin, '/')).body, /Component documentation/);
  assert.match((await request(origin, '/guide/')).body, /Documentation guide/);
  assert.equal((await request(origin, '/guide')).location, '/guide/');
  assert.equal((await request(origin, '/assets/example.svg')).type, 'image/svg+xml');
  assert.equal((await request(origin, '/..%2fprivate.txt')).status, 403);
  assert.equal((await request(origin, '/escaped.txt')).status, 403);
  assert.equal((await request(origin, '/missing.js')).status, 404);
});
