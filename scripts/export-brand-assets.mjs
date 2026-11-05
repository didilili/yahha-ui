import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

// SVG paths are the editable masters. Inkscape and cwebp are export tools only;
// neither is needed to build, serve or consume the component library.
assert.ok(process.argv.length <= 3, 'Usage: node export-brand-assets.mjs [asset-directory]');
const directory = process.argv[2]
  ? resolve(process.argv[2])
  : fileURLToPath(new URL('../playground/src/assets/brand/', import.meta.url));
const logoPath = join(directory, 'yahha-ui-logo.svg');
const symbolPath = join(directory, 'yahha-ui-favicon.svg');

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8' });
  if (result.error)
    throw new Error(`${command} is required to export brand assets.`, { cause: result.error });
  assert.equal(result.status, 0, result.stderr || `${command} export failed.`);
}

function png(source, output, width) {
  run('inkscape', [
    source,
    '--export-area-page',
    '--export-background-opacity=0',
    `--export-width=${width}`,
    `--export-filename=${output}`,
  ]);
}

for (const path of [logoPath, symbolPath]) {
  const source = await readFile(path, 'utf8');
  assert.match(source, /<path\b/, 'Brand masters must contain real vector paths.');
  assert.doesNotMatch(source, /<(?:image|feImage|text|foreignObject)\b|data:image/i);
}

const logo = await readFile(logoPath, 'utf8');
const lettering = /<linearGradient\b[^>]*\bid="lettering"[^>]*>[\s\S]*?<\/linearGradient>/;
assert.match(logo, lettering, 'The wordmark gradient is the only dark-surface color change.');
const dark = logo.replace(
  lettering,
  '<linearGradient id="lettering"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#fff0d9"/></linearGradient>',
);
const darkPath = join(directory, 'yahha-ui-logo-on-dark.svg');
await writeFile(darkPath, dark);

for (const [source, name] of [
  [logoPath, 'yahha-ui-logo'],
  [darkPath, 'yahha-ui-logo-on-dark'],
]) {
  const output = join(directory, `${name}.png`);
  png(source, output, 3388);
  if (name === 'yahha-ui-logo') {
    run('cwebp', ['-lossless', '-exact', '-m', '6', output, '-o', join(directory, `${name}.webp`)]);
  }
}

const sizes = [16, 32, 48, 180, 192, 512];
for (const size of sizes) {
  png(symbolPath, join(directory, `yahha-ui-favicon-${size}.png`), size);
}

// An ICO container can carry the exact PNG exports, without a second resampler.
const icons = await Promise.all(
  sizes.slice(0, 3).map(async (size) => ({
    size,
    bytes: await readFile(join(directory, `yahha-ui-favicon-${size}.png`)),
  })),
);
const header = Buffer.alloc(6 + 16 * icons.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icons.length, 4);
let offset = header.length;
icons.forEach(({ size, bytes }, index) => {
  const entry = 6 + 16 * index;
  header[entry] = size;
  header[entry + 1] = size;
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(bytes.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += bytes.length;
});
await writeFile(
  join(directory, 'yahha-ui-favicon.ico'),
  Buffer.concat([header, ...icons.map(({ bytes }) => bytes)]),
);
console.log('Brand exports: transparent 4× wordmarks, six icon sizes and a 16/32/48px ICO.');
