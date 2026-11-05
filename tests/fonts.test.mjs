import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { checkFontAssets, findMissingHan } from '../scripts/check-fonts.mjs';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'yahha-font-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = join(root, 'source', 'fonts');
  await mkdir(source, { recursive: true });
  await writeFile(join(source, 'manifest.json'), '{"version":1}\n');
  await writeFile(join(source, 'wenkai.css'), '@font-face {}\n');
  await mkdir(join(source, 'wenkai'));
  await writeFile(join(source, 'wenkai', 'basic.woff2'), 'font bytes');
  return { root, source };
}

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
