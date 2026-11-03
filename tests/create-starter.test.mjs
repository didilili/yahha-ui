import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
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
  const directory = await mkdtemp(join(tmpdir(), 'yahha-starter-test-'));
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
  await assert.rejects(exec(process.execPath, [script, '--output', output]), (error) =>
    /压缩包已存在/.test(error.stderr),
  );
  assert.equal(await readFile(`${output}.zip`, 'utf8'), 'keep my archive');
  assert.deepEqual(await readdir(output), []);
});

test('export rejects missing values, unknown options and unknown examples', async () => {
  for (const args of [['--output'], ['--unknown'], ['--example'], ['--example', 'missing']]) {
    await assert.rejects(exec(process.execPath, [script, ...args]), (error) =>
      /用法/.test(error.stderr),
    );
  }
});

test('missing zip is explained before creating output or building anything', async (t) => {
  const directory = await fixture(t);
  const output = join(directory, 'project');
  await assert.rejects(
    exec(process.execPath, [script, '--output', output], {
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
  await cp(
    join(root, 'scripts/blog-export-readme.md'),
    join(repository, 'scripts/blog-export-readme.md'),
  );
  await cp(
    join(root, 'scripts/blog-export-assets-readme.md'),
    join(repository, 'scripts/blog-export-assets-readme.md'),
  );
  await mkdir(join(repository, 'examples/blog/src/assets/fonts'), { recursive: true });
  await cp(
    join(root, 'examples/blog/src/assets/README.md'),
    join(repository, 'examples/blog/src/assets/README.md'),
  );
  for (const path of ['src/assets/OFL-marker.txt', 'src/assets/OFL-wenkai.txt'])
    await writeFile(join(repository, 'examples/blog', path), `${path} fixture font license`);
  const artwork = Buffer.from([0, 255, 12, 128]);
  await writeFile(join(repository, 'examples/blog/src/assets/reading.png'), artwork);
  for (const path of [
    'src/assets.ts',
    'src/data/site.ts',
    'src/data/posts.ts',
    'src/pages/HomePage.tsx',
    'src/pages/ArchivePage.tsx',
    'src/pages/ArticlePage.tsx',
    'src/router.ts',
    'index.html',
  ]) {
    const target = join(repository, 'examples/blog', path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, '');
  }
  for (const path of ['LICENSE', 'THIRD_PARTY_NOTICES.md'])
    await cp(join(root, path), join(repository, path));
  const dependencies = Object.fromEntries(
    [
      'react',
      'react-dom',
      'lucide-react',
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
    `import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const args = process.argv.slice(2);
if (args[0] === 'run' && ['check:docs', 'check:fonts', 'build:lib'].includes(args[1])) {
  // The fixture already contains its small library outputs.
} else if (args[0] === 'exec' && args.includes('--outDir')) {
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
    artwork,
    async exportProject(name, example = 'starter') {
      const output = join(directory, name);
      await exec(
        process.execPath,
        [join(repository, 'scripts/create-starter.mjs'), '--output', output, '--example', example],
        {
          env: { ...process.env, npm_execpath: npmEntry },
          timeout: 15_000,
        },
      );
      return output;
    },
  };
}

test('export preserves project and archive contents when the output directory is named starter.zip', async (t) => {
  const { exportProject } = await exportFixture(t);
  const output = await exportProject('starter.zip');
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
    'documentation/blog/index.html',
    'starter-manifest.json',
    manifest.library.tarball,
  ]) {
    const { stdout } = await exec('unzip', ['-p', `${output}.zip`, `starter.zip/${path}`]);
    assert.equal(stdout, await readFile(join(output, path), 'utf8'), `ZIP must preserve ${path}`);
  }
});

for (const example of ['starter', 'blog']) {
  test(`${example} export carries the project license and third-party notices in the directory and ZIP`, async (t) => {
    const { repository, exportProject } = await exportFixture(t);
    const output = await exportProject(example, example);
    const pkg = JSON.parse(await readFile(join(output, 'package.json'), 'utf8'));
    assert.equal(pkg.license, 'MIT');
    for (const path of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
      const source = await readFile(join(repository, path), 'utf8');
      assert.equal(await readFile(join(output, path), 'utf8'), source);
      await assertLocalLinksExist(join(output, path), source);
      const { stdout } = await exec('unzip', ['-p', `${output}.zip`, `${example}/${path}`]);
      assert.equal(stdout, source, `ZIP must preserve ${path}`);
    }
    const readme = await readFile(join(output, 'README.md'), 'utf8');
    await assertLocalLinksExist(join(output, 'README.md'), readme);
    assert.match(readme, /\[MIT[^\]]*\]\(LICENSE\)/);
    assert.match(readme, /\[[^\]]+\]\(THIRD_PARTY_NOTICES\.md\)/);
    assert.doesNotMatch(readme, /许可证尚未确定/);
  });
}

async function assertLocalLinksExist(file, markdown) {
  for (const match of markdown.matchAll(/\]\(([^)]+)\)/g)) {
    const path = match[1].split('#')[0];
    if (path && !/^[a-z]+:/i.test(path)) await readFile(join(dirname(file), path));
  }
}

test('blog export explains editable asset snapshots using only available project commands and links', async (t) => {
  const { artwork, exportProject } = await exportFixture(t);
  const output = await exportProject('my-blog', 'blog');
  const assetsPath = join(output, 'src/assets');
  const notes = await readFile(join(assetsPath, 'README.md'), 'utf8');
  const pkg = JSON.parse(await readFile(join(output, 'package.json'), 'utf8'));
  const commands = [...notes.matchAll(/npm run ([\w:-]+)/g)].map((match) => match[1]);
  assert.ok(
    commands.length > 0,
    'asset notes should explain how to build or read the exported project',
  );
  for (const command of commands)
    assert.ok(
      Object.hasOwn(pkg.scripts, command),
      `${command} must be runnable in the exported project`,
    );
  await assertLocalLinksExist(join(assetsPath, 'README.md'), notes);
  assert.match(notes, /快照/);
  assert.match(notes, /修改|替换/);
  assert.match(notes, /源仓库/);
  assert.match(notes, /重新导出/);
  assert.match(notes, /OFL-marker\.txt/);
  assert.match(notes, /OFL-wenkai\.txt/);
  assert.doesNotMatch(notes, /playground\/|local-archives\/|\.\.\/\.\.\/\.\.\/\.\.\/docs\//);
  assert.deepEqual(await readFile(join(assetsPath, 'reading.png')), artwork);
  const { stdout } = await exec('unzip', ['-p', `${output}.zip`, 'my-blog/src/assets/README.md']);
  assert.equal(stdout, notes);
});

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

test('zero-dependency docs preview serves the snapshot and blog without exposing sibling files', async (t) => {
  const directory = await fixture(t);
  const snapshot = join(directory, 'documentation');
  await mkdir(join(snapshot, 'blog'), { recursive: true });
  await mkdir(join(snapshot, 'assets'));
  await writeFile(join(snapshot, 'index.html'), '<h1>Component documentation</h1>');
  await writeFile(join(snapshot, 'blog/index.html'), '<h1>Blog example</h1>');
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
  assert.match((await request(origin, '/blog/')).body, /Blog example/);
  assert.equal((await request(origin, '/blog')).location, '/blog/');
  assert.equal((await request(origin, '/assets/example.svg')).type, 'image/svg+xml');
  assert.equal((await request(origin, '/..%2fprivate.txt')).status, 403);
  assert.equal((await request(origin, '/escaped.txt')).status, 403);
  assert.equal((await request(origin, '/missing.js')).status, 404);
});
