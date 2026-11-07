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
import { JSDOM } from 'jsdom';
import { createFriendsHeads } from '../scripts/build-friends-heads.mjs';

const repository = fileURLToPath(new URL('..', import.meta.url));
const execute = promisify(execFile);
const artworkDirectory = 'playground/src/examples/scenes/artwork';
const friendsAssets = [
  'friends-hero.svg',
  'friends-peek.svg',
  ...['chiikawa', 'hachiware', 'usagi'].flatMap((character) =>
    ['bright', 'smile', 'surprised'].map(
      (expression) => `portraits/${character}-${expression}.svg`,
    ),
  ),
  ...['chiikawa', 'hachiware', 'usagi'].flatMap((character) =>
    ['bright', 'smile', 'surprise'].map((expression) => `heads/${character}-${expression}.svg`),
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
const friendsDecorations = [
  'chiikawa-sticker.svg',
  'hachiware-sticker.svg',
  'usagi-sticker.svg',
  'friends-note.svg',
  'friends-pattern.svg',
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
    'build-friends-decorations.mjs',
    'generate-friends-artwork.mjs',
    'build-friends-heads.mjs',
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
    'playground/src/examples/scenes/FriendsWelcome.tsx',
  ]) {
    await mkdir(dirname(join(root, path)), { recursive: true });
    await cp(join(repository, path), join(root, path), { recursive: true });
  }
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
    ...friendsDecorations.map((name) => `${artworkDirectory}/decorative-elements/friends/${name}`),
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

test('artwork synchronization keeps the complete documentation set without creating an example site', async (t) => {
  const { root, sync } = await fixture(t);
  await sync();

  assert.deepEqual(
    (await readdir(join(root, artworkDirectory))).filter((name) => name.endsWith('.svg')).sort(),
    [...documentationAssets].sort(),
  );
  await assert.rejects(stat(join(root, 'examples')), { code: 'ENOENT' });
  await sync('--check');
  await assert.rejects(stat(join(root, 'examples')), { code: 'ENOENT' });
});

test('artwork synchronization stays byte-stable on repeat and preserves unrelated files', async (t) => {
  const { root, sync } = await fixture(t);
  const custom = join(root, artworkDirectory, 'custom.svg');
  await writeFile(custom, '<svg><title>Keep custom artwork</title></svg>');
  const note = join(root, artworkDirectory, 'custom', 'source.txt');
  await mkdir(dirname(note));
  await writeFile(note, 'Keep the unknown directory too.');

  await sync();
  const once = await generatedContents(root);
  await sync('--check');
  await sync();
  assert.deepEqual(await generatedContents(root), once);
  assert.equal(await readFile(custom, 'utf8'), '<svg><title>Keep custom artwork</title></svg>');
  assert.equal(await readFile(note, 'utf8'), 'Keep the unknown directory too.');
});

test('artwork check rejects changed output without modifying it', async (t) => {
  const { root, sync } = await fixture(t);
  await sync();
  const active = join(root, artworkDirectory, 'little-days-tea-cup.svg');
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

test('npm artwork check rejects scene drift without writing any generated stage', async (t) => {
  const { root, sync } = await fixture(t);
  await sync();
  await writeFile(join(root, artworkDirectory, 'little-days-tea-cup.svg'), 'derived artwork drift');
  const before = await generatedState(root);

  await assert.rejects(sync('--check'), /tea-cup\.svg is out of sync/);

  assert.deepEqual(await generatedState(root), before);
});

test('npm artwork check rejects decorative drift without modifying any generated file', async (t) => {
  const { root, sync } = await fixture(t);
  await sync();
  const note = join(root, artworkDirectory, 'decorative-elements/friends/friends-note.svg');
  await writeFile(note, 'decorative artwork drift');
  const before = await generatedState(root);

  await assert.rejects(sync('--check'), /friends-note\.svg is out of sync/);

  assert.deepEqual(await generatedState(root), before);
});

test('npm artwork sync restores character, scene and decorative outputs', async (t) => {
  const { root, sync } = await fixture(t);
  await sync();
  const before = await generatedContents(root);
  await writeFile(
    join(root, artworkDirectory, 'friends-preview/friends-hero.svg'),
    'character artwork drift',
  );
  await writeFile(join(root, artworkDirectory, 'little-days-tea-cup.svg'), 'derived artwork drift');
  await writeFile(
    join(root, artworkDirectory, 'decorative-elements/friends/chiikawa-sticker.svg'),
    'decorative artwork drift',
  );

  await sync();

  assert.deepEqual(await generatedContents(root), before);
  await sync('--check');
});

test('friends decorations retain reviewed model geometry and resolve every SVG reference locally', async (t) => {
  const { root, sync } = await fixture(t);
  const sourcePath = join(root, artworkDirectory, 'friends-preview/source/characters.svg');
  const source = await readFile(sourcePath, 'utf8');
  const models = new JSDOM(source, { contentType: 'image/svg+xml' });
  t.after(() => models.window.close());
  await sync();
  assert.equal(
    await readFile(sourcePath, 'utf8'),
    source,
    'Generation must not rewrite the source.',
  );

  // Ignore XML indentation while comparing every attribute and child that defines
  // a reviewed contour, fill, expression or the composition of a complete model.
  const geometry = (node) => [
    node.localName,
    [...node.attributes].map(({ name, value }) => [name, value]).sort(),
    [...node.children].map(geometry),
  ];
  for (const filename of friendsDecorations) {
    const path = join(root, artworkDirectory, 'decorative-elements/friends', filename);
    const drawing = new JSDOM(await readFile(path, 'utf8'), { contentType: 'image/svg+xml' });
    try {
      const document = drawing.window.document;
      const ids = [...document.querySelectorAll('[id]')].map((node) => node.id);
      assert.equal(new Set(ids).size, ids.length, `${filename} has duplicate SVG IDs.`);
      assert.equal(
        document.querySelector('image, script, foreignObject'),
        null,
        `${filename} must be a standalone vector drawing.`,
      );
      let retainedModel = false;
      for (const node of document.querySelectorAll('defs [id]')) {
        const reviewed = models.window.document.getElementById(node.id);
        if (!reviewed) continue;
        retainedModel = true;
        assert.deepEqual(geometry(node), geometry(reviewed), `${filename}: ${node.id} changed.`);
      }
      assert.ok(retainedModel, `${filename} must retain the reviewed character definitions.`);

      for (const node of document.querySelectorAll('*')) {
        for (const { name, localName, value } of node.attributes) {
          if (localName === 'href') {
            assert.ok(
              value.startsWith('#') && ids.includes(value.slice(1)),
              `${filename}: ${name} must resolve inside the same SVG.`,
            );
          }
          for (const [, reference] of value.matchAll(/url\(\s*["']?([^\s)'"\\]+)["']?\s*\)/g)) {
            assert.ok(
              reference.startsWith('#') && ids.includes(reference.slice(1)),
              `${filename}: paint, filters and clips must resolve inside the same SVG.`,
            );
          }
        }
      }
    } finally {
      drawing.window.close();
    }
  }
});

test('npm artwork sync rejects unsupported arguments before writing files', async (t) => {
  const { root, sync } = await fixture(t);
  await sync();
  const before = await generatedState(root);

  await assert.rejects(sync('--unsupported'), /Only --check is supported/);

  assert.deepEqual(await generatedState(root), before);
});

test('derived heads retain every reviewed face definition and exclude bodies and paws', async () => {
  const source = await readFile(
    join(repository, artworkDirectory, 'friends-preview/source/characters.svg'),
    'utf8',
  );
  const original = new JSDOM(source, { contentType: 'image/svg+xml' });
  const geometry = (node) => [
    node.localName,
    [...node.attributes].map(({ name, value }) => [name, value]).sort(),
    [...node.children].map(geometry),
  ];
  try {
    const outputs = createFriendsHeads(source);
    assert.equal(outputs.size, 9);
    for (const [name, svg] of outputs) {
      const image = new JSDOM(svg, { contentType: 'image/svg+xml' });
      try {
        const doc = image.window.document;
        const ids = [...doc.querySelectorAll('[id]')].map((node) => node.id);
        assert.equal(new Set(ids).size, ids.length, `${name}: duplicate IDs`);
        assert.equal(
          doc.querySelector(
            'image, script, foreignObject, [id$="-body"], [id*="paw"], [id$="-grip"]',
          ),
          null,
          `${name}: head only`,
        );
        let faceFound = false;
        for (const node of doc.querySelectorAll('defs [id]')) {
          if (node.id.endsWith('-head')) continue;
          const reviewed = original.window.document.getElementById(node.id);
          assert.ok(reviewed, `${name}: unreviewed face definition ${node.id}`);
          assert.deepEqual(
            geometry(node),
            geometry(reviewed),
            `${name}: changed reviewed geometry ${node.id}`,
          );
          if (node.id.includes('-face-')) faceFound = true;
        }
        assert.equal(faceFound, true, `${name}: original face required`);
        for (const use of doc.querySelectorAll('use'))
          assert.ok(
            ids.includes(use.getAttribute('href').slice(1)),
            `${name}: unresolved reference`,
          );
      } finally {
        image.window.close();
      }
    }
  } finally {
    original.window.close();
  }
});
