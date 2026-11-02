import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const repository = fileURLToPath(new URL('..', import.meta.url));
const execute = promisify(execFile);
const artworkDirectory = 'playground/src/examples/scenes/artwork';
const blogDirectory = 'examples/blog/src/assets/little-days';
const friendsAssets = [
  'friends-hero.svg',
  'friends-peek.svg',
  ...['chiikawa', 'hachiware', 'usagi'].flatMap((character) =>
    ['bright', 'smile', 'surprised'].map(
      (expression) => `portraits/${character}-${expression}.svg`,
    ),
  ),
];
const documentationAssets = [
  'little-days-bookmark.svg',
  'little-days-tea-cup.svg',
  'little-days-tea-cup-motion.svg',
  'little-days-page-wait.svg',
  'little-days-page-wait-motion.svg',
  'little-days-empty-collection.svg',
  'little-days-search-empty.svg',
  'little-days-collection-saved.svg',
  'little-days-collection-saved-motion.svg',
  'little-days-load-error.svg',
  'little-days-load-error-motion.svg',
  'little-days-friends-lost.svg',
  'friends-welcome.svg',
  'friends-welcome-motion.svg',
];
const blogAssets = [
  'tea-cup.svg',
  'empty-collection.svg',
  'search-empty.svg',
  'collection-saved-motion.svg',
  'friends-lost.svg',
  'friends-welcome.svg',
];
const retiredBlogAssets = [
  'bookmark.svg',
  'tea-cup-motion.svg',
  'page-wait.svg',
  'page-wait-motion.svg',
  'collection-saved.svg',
  'load-error.svg',
  'load-error-motion.svg',
  'friends-welcome-motion.svg',
];

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'yahha-artwork-sync-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await symlink(join(repository, 'node_modules'), join(root, 'node_modules'));
  await mkdir(join(root, 'scripts'));
  for (const name of [
    'sync-artwork.mjs',
    'sync-little-days-artwork.mjs',
    'build-friends-welcome.mjs',
    'generate-friends-artwork.mjs',
  ]) {
    await cp(join(repository, 'scripts', name), join(root, 'scripts', name));
  }
  await cp(
    join(repository, 'scripts/prune-svg-defs.mjs'),
    join(root, 'scripts/prune-svg-defs.mjs'),
  );
  const { scripts } = JSON.parse(await readFile(join(repository, 'package.json'), 'utf8'));
  await writeFile(
    join(root, 'package.json'),
    JSON.stringify({
      type: 'module',
      scripts: { 'sync:artwork': scripts['sync:artwork'] },
      prettier: { singleQuote: true, trailingComma: 'all', printWidth: 100 },
    }),
  );
  for (const path of [
    `${artworkDirectory}/little-days`,
    `${artworkDirectory}/friends-preview/source`,
    `${artworkDirectory}/friends-preview/friends-hero.svg`,
    `${artworkDirectory}/friends-preview/friends-peek.svg`,
    `${artworkDirectory}/friends-preview/portraits/chiikawa-smile.svg`,
    'playground/src/examples/scenes/FriendsWelcome.tsx',
  ]) {
    await mkdir(dirname(join(root, path)), { recursive: true });
    await cp(join(repository, path), join(root, path), { recursive: true });
  }
  await mkdir(join(root, blogDirectory), { recursive: true });
  const sync = (...args) =>
    execute('npm', ['run', 'sync:artwork', '--', ...args], {
      cwd: root,
    });
  return { root, sync };
}

async function generatedContents(root) {
  const paths = [
    ...friendsAssets.map((name) => `${artworkDirectory}/friends-preview/${name}`),
    ...documentationAssets.map((name) => `${artworkDirectory}/${name}`),
    ...blogAssets.map((name) => `${blogDirectory}/${name}`),
    'examples/blog/src/components/BookmarkMark.tsx',
    'examples/blog/src/components/FriendsWelcome.tsx',
    'examples/blog/src/assets/author.svg',
    'examples/blog/src/assets/peek.svg',
  ];
  return Promise.all(paths.map(async (path) => [path, await readFile(join(root, path), 'utf8')]));
}

async function generatedState(root) {
  return Promise.all(
    (await generatedContents(root)).map(async ([path, source]) => [
      path,
      source,
      (await stat(join(root, path), { bigint: true })).mtimeNs,
    ]),
  );
}

test('artwork synchronization keeps the complete documentation set and only used blog illustrations', async (t) => {
  const { root, sync } = await fixture(t);
  await sync();

  assert.deepEqual(
    (await readdir(join(root, artworkDirectory))).filter((name) => name.endsWith('.svg')).sort(),
    [...documentationAssets].sort(),
  );
  assert.deepEqual((await readdir(join(root, blogDirectory))).sort(), [...blogAssets].sort());
  assert.equal(
    await readFile(join(root, 'examples/blog/src/assets/author.svg'), 'utf8'),
    await readFile(
      join(root, artworkDirectory, 'friends-preview/portraits/chiikawa-smile.svg'),
      'utf8',
    ),
  );
  assert.equal(
    await readFile(join(root, 'examples/blog/src/assets/peek.svg'), 'utf8'),
    await readFile(join(root, artworkDirectory, 'friends-preview/friends-peek.svg'), 'utf8'),
  );
  const welcome = await readFile(
    join(root, 'playground/src/examples/scenes/FriendsWelcome.tsx'),
    'utf8',
  );
  assert.equal(
    await readFile(join(root, 'examples/blog/src/components/FriendsWelcome.tsx'), 'utf8'),
    welcome.replace(
      "'./artwork/friends-welcome.svg?raw'",
      "'../assets/little-days/friends-welcome.svg?raw'",
    ),
  );
  const bookmark = await readFile(
    join(root, 'examples/blog/src/components/BookmarkMark.tsx'),
    'utf8',
  );
  assert.match(bookmark, /stroke="currentColor"/);
  assert.equal((bookmark.match(/<path\b/g) ?? []).length, 2);
});

test('artwork synchronization retires only known old outputs and stays byte-stable on repeat', async (t) => {
  const { root, sync } = await fixture(t);
  for (const name of retiredBlogAssets) {
    await writeFile(join(root, blogDirectory, name), 'previously generated SVG');
  }
  const custom = join(root, blogDirectory, 'custom.svg');
  await writeFile(custom, '<svg><title>Keep custom artwork</title></svg>');
  const note = join(root, blogDirectory, 'custom', 'source.txt');
  await mkdir(dirname(note));
  await writeFile(note, 'Keep the unknown directory too.');

  await sync();
  for (const name of retiredBlogAssets) {
    await assert.rejects(readFile(join(root, blogDirectory, name)), { code: 'ENOENT' });
  }
  const once = await generatedContents(root);
  await sync('--check');
  await sync();
  assert.deepEqual(await generatedContents(root), once);
  assert.equal(await readFile(custom, 'utf8'), '<svg><title>Keep custom artwork</title></svg>');
  assert.equal(await readFile(note, 'utf8'), 'Keep the unknown directory too.');
});

test('artwork check rejects retired or changed output without modifying it', async (t) => {
  const { root, sync } = await fixture(t);
  await sync();
  const retired = join(root, blogDirectory, 'friends-welcome-motion.svg');
  await writeFile(retired, 'retired generated output');
  await assert.rejects(sync('--check'), /friends-welcome-motion\.svg/);
  assert.equal(await readFile(retired, 'utf8'), 'retired generated output');
  await rm(retired);

  const active = join(root, blogDirectory, 'tea-cup.svg');
  await writeFile(active, 'unexpected edit');
  await assert.rejects(sync('--check'), /tea-cup\.svg/);
  assert.equal(await readFile(active, 'utf8'), 'unexpected edit');
});

test('npm artwork check leaves every clean generated file untouched', async (t) => {
  const { root, sync } = await fixture(t);
  await sync();
  const before = await generatedState(root);

  await sync('--check');

  assert.deepEqual(await generatedState(root), before);
});

test('npm artwork check rejects character drift without overwriting it', async (t) => {
  const { root, sync } = await fixture(t);
  await sync();
  const hero = join(root, artworkDirectory, 'friends-preview/friends-hero.svg');
  await writeFile(hero, (await readFile(hero, 'utf8')).replace('</svg>', '<!-- drift -->\n</svg>'));
  const before = await generatedState(root);

  await assert.rejects(sync('--check'), /Generated artwork drift: friends-hero\.svg/);

  assert.deepEqual(await generatedState(root), before);
});

test('npm artwork check rejects derived drift without writing either stage', async (t) => {
  const { root, sync } = await fixture(t);
  await sync();
  await writeFile(join(root, blogDirectory, 'tea-cup.svg'), 'derived artwork drift');
  const before = await generatedState(root);

  await assert.rejects(sync('--check'), /tea-cup\.svg is out of sync/);

  assert.deepEqual(await generatedState(root), before);
});

test('npm artwork sync restores both character and derived outputs', async (t) => {
  const { root, sync } = await fixture(t);
  await sync();
  const before = await generatedContents(root);
  await writeFile(
    join(root, artworkDirectory, 'friends-preview/friends-hero.svg'),
    'character artwork drift',
  );
  await writeFile(join(root, blogDirectory, 'tea-cup.svg'), 'derived artwork drift');

  await sync();

  assert.deepEqual(await generatedContents(root), before);
  await sync('--check');
});

test('npm artwork sync rejects unsupported arguments before writing files', async (t) => {
  const { root, sync } = await fixture(t);
  await sync();
  const before = await generatedState(root);

  await assert.rejects(sync('--unsupported'), /Only --check is supported/);

  assert.deepEqual(await generatedState(root), before);
});
