import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstat, readFile, readdir } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { syncFontDirectories } from './sync-fonts.mjs';

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

function codepoints(ranges, label) {
  assert(Array.isArray(ranges) && ranges.length > 0, `${label}: ranges are required.`);
  const values = new Set();
  let previous = -1;
  for (const range of ranges) {
    assert(
      Array.isArray(range) &&
        range.length === 2 &&
        range.every(Number.isInteger) &&
        range[0] >= 0 &&
        range[1] <= 0x10ffff &&
        range[0] <= range[1],
      `${label}: invalid Unicode range.`,
    );
    assert(range[0] > previous, `${label}: ranges overlap or are not sorted.`);
    for (let value = range[0]; value <= range[1]; value++) values.add(value);
    previous = range[1];
  }
  return values;
}

function equalCoverage(actual, expected) {
  return actual.size === expected.size && [...actual].every((value) => expected.has(value));
}

function checkCSS(text, font) {
  const faces = [...text.matchAll(/@font-face\s*\{([^{}]*)\}/g)];
  assert.equal(faces.length, font.files.length, `${font.css}: @font-face count differs.`);
  const remaining = new Map(font.files.map((file) => [file.file, file]));
  for (const [, body] of faces) {
    const declarations = new Map(
      body
        .split(';')
        .map((value) => value.trim())
        .filter(Boolean)
        .map((value) => {
          const colon = value.indexOf(':');
          return [value.slice(0, colon).trim(), value.slice(colon + 1).trim()];
        }),
    );
    assert.equal(
      declarations.get('font-family')?.replace(/^(['"])(.*)\1$/, '$2'),
      font.family,
      `${font.css}: font-family differs.`,
    );
    assert.equal(
      declarations.get('font-weight'),
      String(font.weight),
      `${font.css}: font-weight differs.`,
    );
    assert.equal(declarations.get('font-style'), 'normal', `${font.css}: font-style differs.`);
    const urls = [...(declarations.get('src') ?? '').matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/g)];
    assert.equal(urls.length, 1, `${font.css}: each face must reference one local file.`);
    const path = urls[0][2].replace(/^\.\//, '');
    const file = remaining.get(path);
    assert(file, `${font.css}: unexpected or repeated font src: ${path}`);
    remaining.delete(path);
    const ranges = (declarations.get('unicode-range') ?? '').split(',').map((range) => {
      const match = range.trim().match(/^U\+([0-9a-f]{1,6})(?:-([0-9a-f]{1,6}))?$/i);
      assert(match, `${font.css}: invalid unicode-range: ${range}`);
      return [parseInt(match[1], 16), parseInt(match[2] ?? match[1], 16)];
    });
    assert(
      equalCoverage(codepoints(ranges, `${font.css} unicode-range`), codepoints(file.ranges, path)),
      `${font.css}: unicode-range differs from ${path}.`,
    );
  }
}

async function filesUnder(directory) {
  const paths = [];
  async function visit(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const path = join(folder, entry.name);
      assert(!entry.isSymbolicLink(), `Unexpected symbolic link: ${path}`);
      if (entry.isDirectory()) await visit(path);
      else if (entry.isFile()) paths.push(path);
    }
  }
  await visit(directory);
  return paths.sort();
}

export async function checkFontAssets(directory) {
  const manifest = JSON.parse(await readFile(join(directory, 'manifest.json'), 'utf8'));
  assert.equal(manifest.schemaVersion, 1, 'Unsupported font manifest schemaVersion.');
  assert(Array.isArray(manifest.fonts), 'Font manifest requires fonts.');
  assert.deepEqual(
    manifest.fonts.map((font) => font.id).sort(),
    ['marker', 'wenkai'],
    'Font manifest must describe both Marker and WenKai once.',
  );
  const expectedFiles = new Set(['manifest.json']);
  for (const font of manifest.fonts) {
    assert.equal(
      font.family,
      font.id === 'wenkai' ? 'WenKai' : 'Marker',
      `${font.id}: family differs.`,
    );
    assert.equal(font.weight, 400, `${font.id}: expected the existing Regular weight.`);
    assert.equal(
      new URL(font.source.url).protocol,
      'https:',
      `${font.id}: source URL must use HTTPS.`,
    );
    assert.match(font.source.sha256, /^[0-9a-f]{64}$/, `${font.id}: source SHA-256 is required.`);
    assert.match(font.css, /^[a-z][a-z0-9_-]*\.css$/, `${font.id}: invalid CSS path.`);
    assert(!expectedFiles.has(font.css), `Repeated font CSS: ${font.css}`);
    expectedFiles.add(font.css);
    const coverage = codepoints(font.coverage, `${font.id} coverage`);
    assert.equal(coverage.size, font.codepointCount, `${font.id}: codepoint count differs.`);
    assert(
      Array.isArray(font.files) && font.files.length > 0,
      `${font.id}: font files are required.`,
    );
    const combined = new Set();
    for (const file of font.files) {
      assert.match(file.file, /^[a-z0-9][a-z0-9/_-]*\.woff2$/, `${font.id}: invalid font path.`);
      assert(file.file.startsWith(`${font.id}/`), `${file.file}: wrong font directory.`);
      assert(!expectedFiles.has(file.file), `Repeated font asset: ${file.file}`);
      expectedFiles.add(file.file);
      for (const value of codepoints(file.ranges, file.file)) {
        assert(
          !combined.has(value),
          `${font.id}: chunk coverage overlaps at U+${value.toString(16).toUpperCase()}.`,
        );
        combined.add(value);
      }
      const path = join(directory, file.file);
      assert((await lstat(path)).isFile(), `${file.file}: expected a regular file.`);
      const bytes = await readFile(path);
      assert.equal(bytes.length, file.bytes, `${file.file}: bytes differ.`);
      assert.equal(sha256(bytes), file.sha256, `${file.file}: SHA-256 hash differs.`);
    }
    assert(
      equalCoverage(combined, coverage),
      `${font.id}: chunk union differs from font coverage.`,
    );
    const css = await readFile(join(directory, font.css), 'utf8');
    assert.equal(sha256(css), font.cssSha256, `${font.css}: SHA-256 hash differs.`);
    checkCSS(css, font);
  }
  const actualFiles = (await filesUnder(directory)).map((path) => relative(directory, path));
  assert.deepEqual(
    actualFiles.sort(),
    [...expectedFiles].sort(),
    'Generated font file list differs from manifest.',
  );
  return manifest;
}

export function findMissingHan(sources, ranges) {
  const coverage = codepoints(ranges, 'WenKai source coverage');
  const missing = [];
  const seen = new Set();
  for (const { path, text } of sources) {
    let line = 1;
    let column = 1;
    for (const character of text) {
      const value = character.codePointAt(0);
      if (/\p{Script=Han}/u.test(character) && !coverage.has(value) && !seen.has(value)) {
        missing.push({
          path,
          line,
          column,
          character,
          codepoint: `U+${value.toString(16).toUpperCase()}`,
        });
        seen.add(value);
      }
      if (character === '\n') {
        line++;
        column = 1;
      } else column++;
    }
  }
  return missing;
}

export async function checkFontNotices(canonical, blog) {
  for (const name of ['OFL-wenkai.txt', 'OFL-marker.txt']) {
    const original = await readFile(join(canonical, name));
    const copy = await readFile(join(blog, name));
    assert(original.equals(copy), `${name}: blog font notice differs from the canonical notice.`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    assert.equal(process.argv.length, 2, 'check-fonts does not accept arguments.');
    const root = fileURLToPath(new URL('..', import.meta.url));
    const canonical = join(root, 'playground/src/assets/fonts');
    const manifest = await checkFontAssets(canonical);
    await syncFontDirectories(canonical, join(root, 'examples/blog/src/assets/fonts'), {
      check: true,
    });
    await checkFontNotices(
      join(root, 'playground/src/assets'),
      join(root, 'examples/blog/src/assets'),
    );
    const extensions = new Set(['.ts', '.tsx', '.css', '.json', '.md']);
    const sources = [];
    for (const directory of ['playground/src', 'examples/blog/src']) {
      for (const path of await filesUnder(join(root, directory))) {
        if (extensions.has(extname(path)))
          sources.push({ path: relative(root, path), text: await readFile(path, 'utf8') });
      }
    }
    const missing = findMissingHan(
      sources,
      manifest.fonts.find((font) => font.id === 'wenkai').coverage,
    );
    assert(
      missing.length === 0,
      `Han characters missing from WenKai:\n${missing.map((item) => `${item.path}:${item.line}:${item.column} ${item.character} ${item.codepoint}`).join('\n')}`,
    );
    console.log(
      `Fonts checked: ${manifest.fonts.length} families, ${sources.length} source files; all static Han characters covered.`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
