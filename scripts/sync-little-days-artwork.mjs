import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';
import { createWelcomeScene } from './build-friends-welcome.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const sourceDirectory = 'playground/src/examples/scenes/artwork/little-days';
const check = process.argv.includes('--check');
const formatting = await resolveConfig(join(root, 'package.json'));
assert(
  process.argv.slice(2).every((argument) => argument === '--check'),
  'Only --check is supported.',
);
const drawings = [
  'bookmark',
  'tea-cup',
  'page-wait',
  'empty-collection',
  'search-empty',
  'collection-saved',
  'load-error',
  'friends-lost',
  'friends-welcome',
];
const animated = new Set([
  'tea-cup',
  'page-wait',
  'collection-saved',
  'load-error',
  'friends-welcome',
]);
let outputs = 0;

async function output(path, source) {
  const destination = join(root, path);
  if (check) {
    assert.equal(await readFile(destination, 'utf8'), source, `${path} is out of sync.`);
  } else {
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, source);
  }
  outputs++;
}

for (const drawing of drawings) {
  let source;
  if (drawing === 'friends-welcome') {
    const characterSource = await readFile(
      join(root, 'playground/src/examples/scenes/artwork/friends-preview/source/characters.svg'),
      'utf8',
    );
    const heroSource = await readFile(
      join(root, 'playground/src/examples/scenes/artwork/friends-preview/friends-hero.svg'),
      'utf8',
    );
    source = await format(createWelcomeScene(characterSource, heroSource), {
      ...formatting,
      parser: 'html',
    });
  } else if (drawing === 'friends-lost') {
    const layout = await readFile(
      join(root, sourceDirectory, 'source/friends-lost-layout.svg'),
      'utf8',
    );
    const models = await readFile(
      join(root, 'playground/src/examples/scenes/artwork/friends-preview/source/characters.svg'),
      'utf8',
    );
    const definitions = models.match(/<defs\b[^>]*>([\s\S]*?)<\/defs>/)?.[1];
    assert(definitions, 'The reviewed character source must provide its existing models.');
    assert.equal(
      layout.split('<!-- LD_CHARACTER_DEFINITIONS -->').length,
      2,
      'The 404 layout must contain exactly one character-model insertion point.',
    );
    source = await format(layout.replace('<!-- LD_CHARACTER_DEFINITIONS -->', definitions), {
      ...formatting,
      parser: 'html',
    });
  } else {
    source = await readFile(join(root, sourceDirectory, `${drawing}.svg`), 'utf8');
  }
  assert(source.includes(`data-artwork="${drawing}"`), `${drawing} needs its artwork identity.`);
  assert(source.includes('data-motion="off"'), `${drawing} needs a complete static default.`);
  assert(
    !/<(?:image|script|foreignObject)\b|\son\w+\s*=|@import/i.test(source),
    `${drawing} must remain a self-contained vector drawing.`,
  );
  const ids = [...source.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${drawing} must not contain duplicate IDs.`);
  for (const [, reference] of source.matchAll(/\b(?:href|xlink:href)\s*=\s*["']([^"']+)["']/g)) {
    assert(
      reference.startsWith('#') && ids.includes(reference.slice(1)),
      `${drawing} may only reference a defined local vector group.`,
    );
  }
  const versions = animated.has(drawing)
    ? [
        [drawing, source],
        [`${drawing}-motion`, source.replace('data-motion="off"', 'data-motion="on"')],
      ]
    : [[drawing, source]];
  for (const [name, svg] of versions) {
    const filename = drawing === 'friends-welcome' ? name : `little-days-${name}`;
    await output(`playground/src/examples/scenes/artwork/${filename}.svg`, svg);
    await output(`examples/blog/src/assets/little-days/${name}.svg`, svg);
  }
  if (drawing === 'bookmark') {
    const paths = source.match(/<path\b[^>]*\/>/g) ?? [];
    assert(
      paths.length === 2 && paths.every((path) => /^<path\s+d="[^"]+"\s*\/>$/.test(path)),
      'The small bookmark must retain two simple paths; update the native icon export when its anatomy changes.',
    );
    const component =
      `// Generated from artwork/little-days/bookmark.svg; run npm run sync:artwork.\n` +
      `export default function BookmarkMark() {\n  return (\n` +
      `    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">\n` +
      paths.map((path) => `      ${path}`).join('\n') +
      `\n    </svg>\n  );\n}\n`;
    await output(
      'examples/blog/src/components/BookmarkMark.tsx',
      await format(component, { ...formatting, parser: 'typescript' }),
    );
  }
}

await output(
  'examples/blog/src/assets/author.svg',
  await readFile(
    join(
      root,
      'playground/src/examples/scenes/artwork/friends-preview/portraits/chiikawa-smile.svg',
    ),
    'utf8',
  ),
);

const welcomeExample = await readFile(
  join(root, 'playground/src/examples/scenes/FriendsWelcome.tsx'),
  'utf8',
);
const welcomeImport = "'./artwork/friends-welcome.svg?raw'";
assert.equal(
  welcomeExample.split(welcomeImport).length,
  2,
  'The portable welcome scene must retain one canonical artwork import.',
);
await output(
  'examples/blog/src/components/FriendsWelcome.tsx',
  welcomeExample.replace(welcomeImport, "'../assets/little-days/friends-welcome.svg?raw'"),
);

console.log(
  `Little days artwork: ${outputs} derived/copy files ${check ? 'verified' : 'synchronized'}.`,
);
