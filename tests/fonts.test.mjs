import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { syncFontDirectories } from '../scripts/sync-fonts.mjs';
import { checkFontAssets, findMissingHan } from '../scripts/check-fonts.mjs';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'yahha-font-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = join(root, 'source', 'fonts');
  const target = join(root, 'blog', 'fonts');
  await mkdir(source, { recursive: true });
  await mkdir(target, { recursive: true });
  await writeFile(join(source, 'manifest.json'), '{"version":1}\n');
  await writeFile(join(source, 'wenkai.css'), '@font-face {}\n');
  await mkdir(join(source, 'wenkai'));
  await writeFile(join(source, 'wenkai', 'basic.woff2'), 'font bytes');
  return { root, source, target };
}

test('font synchronization copies canonical files and removes stale files only in its target', async (t) => {
  const { root, source, target } = await fixture(t);
  await writeFile(join(target, 'obsolete.woff2'), 'old font');
  await writeFile(join(root, 'blog', 'OFL-wenkai.txt'), 'keep this notice');

  await syncFontDirectories(source, target);

  assert.equal(await readFile(join(target, 'wenkai', 'basic.woff2'), 'utf8'), 'font bytes');
  assert.equal(await readFile(join(target, 'wenkai.css'), 'utf8'), '@font-face {}\n');
  assert.deepEqual((await readdir(target)).sort(), ['manifest.json', 'wenkai', 'wenkai.css']);
  assert.equal(await readFile(join(root, 'blog', 'OFL-wenkai.txt'), 'utf8'), 'keep this notice');
  await syncFontDirectories(source, target, { check: true });
});

test('font synchronization check reports changed, missing and extra files without writing', async (t) => {
  const { source, target } = await fixture(t);
  await writeFile(join(target, 'wenkai.css'), 'changed');
  await writeFile(join(target, 'extra.woff2'), 'extra');

  await assert.rejects(syncFontDirectories(source, target, { check: true }), (error) => {
    assert.match(error.message, /wenkai\.css/);
    assert.match(error.message, /manifest\.json/);
    assert.match(error.message, /extra\.woff2/);
    return true;
  });
  assert.equal(await readFile(join(target, 'wenkai.css'), 'utf8'), 'changed');
  assert.equal(await readFile(join(target, 'extra.woff2'), 'utf8'), 'extra');
  assert.deepEqual((await readdir(target)).sort(), ['extra.woff2', 'wenkai.css']);
});

test('font synchronization refuses an incomplete source or a linked destination', async (t) => {
  const { root, source, target } = await fixture(t);
  await rm(join(source, 'manifest.json'));
  await writeFile(join(target, 'keep.woff2'), 'keep');
  await assert.rejects(syncFontDirectories(source, target), /manifest\.json/);
  assert.equal(await readFile(join(target, 'keep.woff2'), 'utf8'), 'keep');

  await writeFile(join(source, 'manifest.json'), '{"version":1}\n');
  const linked = join(root, 'linked-fonts');
  await symlink(target, linked);
  await assert.rejects(syncFontDirectories(source, linked), /symbolic link/);
  assert.equal(await readFile(join(target, 'keep.woff2'), 'utf8'), 'keep');
});

const hash = (value) => createHash('sha256').update(value).digest('hex');

async function manifestFixture(t) {
  const { source } = await fixture(t);
  const fonts = [];
  for (const [id, family] of [
    ['wenkai', 'WenKai'],
    ['marker', 'Marker'],
  ]) {
    await mkdir(join(source, id), { recursive: true });
    const file = `${id}/common.woff2`;
    const bytes = Buffer.from(`${id} font bytes`);
    await writeFile(join(source, file), bytes);
    const css = `@font-face { font-family: ${family}; src: url('./${file}') format('woff2'); font-style: normal; font-weight: 400; font-display: swap; unicode-range: U+8F6E, U+20000; }\n`;
    await writeFile(join(source, `${id}.css`), css);
    fonts.push({
      id,
      family,
      version: '1.0',
      weight: 400,
      source: { url: 'https://example.test/font.ttf', sha256: hash('source') },
      coverage: [
        [0x8f6e, 0x8f6e],
        [0x20000, 0x20000],
      ],
      codepointCount: 2,
      css: `${id}.css`,
      cssSha256: hash(css),
      files: [
        {
          file,
          bytes: bytes.length,
          sha256: hash(bytes),
          ranges: [
            [0x8f6e, 0x8f6e],
            [0x20000, 0x20000],
          ],
        },
      ],
    });
  }
  await rm(join(source, 'wenkai', 'basic.woff2'));
  const manifest = { schemaVersion: 1, generator: { chunkSize: 512 }, fonts };
  const save = () => writeFile(join(source, 'manifest.json'), `${JSON.stringify(manifest)}\n`);
  await save();
  return { directory: source, manifest, save };
}

test('font checks accept matching coverage, assets and CSS and catch modified font bytes', async (t) => {
  const { directory } = await manifestFixture(t);
  await checkFontAssets(directory);
  await writeFile(join(directory, 'wenkai/common.woff2'), 'damaged bytes');
  await assert.rejects(
    checkFontAssets(directory),
    /wenkai\/common\.woff2.*(?:hash|SHA-256|bytes)/i,
  );
});

test('font checks reject overlapping chunks, incomplete coverage and incorrect counts', async (t) => {
  const { directory, manifest, save } = await manifestFixture(t);
  const font = manifest.fonts[0];
  font.files.push({ ...font.files[0], file: 'wenkai/duplicate.woff2' });
  await writeFile(join(directory, 'wenkai/duplicate.woff2'), 'wenkai font bytes');
  await save();
  await assert.rejects(checkFontAssets(directory), /overlap/i);

  font.files.pop();
  await rm(join(directory, 'wenkai/duplicate.woff2'));
  font.coverage.push([0x20001, 0x20001]);
  font.codepointCount = 3;
  await save();
  await assert.rejects(checkFontAssets(directory), /coverage/i);

  font.coverage.pop();
  await save();
  await assert.rejects(checkFontAssets(directory), /count/i);
});

test('font checks reject CSS ranges that diverge even when its recorded hash is updated', async (t) => {
  const { directory, manifest, save } = await manifestFixture(t);
  const css = (await readFile(join(directory, 'wenkai.css'), 'utf8')).replace('U+8F6E', 'U+8F6F');
  await writeFile(join(directory, 'wenkai.css'), css);
  manifest.fonts[0].cssSha256 = hash(css);
  await save();
  await assert.rejects(checkFontAssets(directory), /unicode-range/i);
});

test('source coverage reports missing Han with exact codepoints and source locations, including extension characters', () => {
  const missing = findMissingHan(
    [{ path: 'HomePage.tsx', text: '轮\n𠀀𠀁' }],
    [
      [0x8f6e, 0x8f6e],
      [0x20000, 0x20000],
    ],
  );
  assert.deepEqual(missing, [
    { path: 'HomePage.tsx', line: 2, column: 2, character: '𠀁', codepoint: 'U+20001' },
  ]);
});

test('font notices must match byte for byte across both websites without changing either copy', async (t) => {
  const { source, target } = await fixture(t);
  const canonical = dirname(source);
  const blog = dirname(target);
  for (const name of ['OFL-wenkai.txt', 'OFL-marker.txt']) {
    await writeFile(join(canonical, name), 'original notice\n');
    await writeFile(join(blog, name), 'original notice\n');
  }
  const checker = await import('../scripts/check-fonts.mjs');
  assert.equal(typeof checker.checkFontNotices, 'function');
  await checker.checkFontNotices(canonical, blog);

  await writeFile(join(blog, 'OFL-marker.txt'), 'changed notice\n');
  await assert.rejects(checker.checkFontNotices(canonical, blog), /OFL-marker\.txt/);
  assert.equal(await readFile(join(canonical, 'OFL-marker.txt'), 'utf8'), 'original notice\n');
  assert.equal(await readFile(join(blog, 'OFL-marker.txt'), 'utf8'), 'changed notice\n');
});
