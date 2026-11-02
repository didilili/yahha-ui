import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { pruneSvgDefs } from '../scripts/prune-svg-defs.mjs';
import { createWelcomeScene } from '../scripts/build-friends-welcome.mjs';

const namespace = 'http://www.w3.org/2000/svg';
const svg = (content) =>
  `<svg xmlns="${namespace}" xmlns:xlink="http://www.w3.org/1999/xlink">${content}</svg>`;
const documentOf = (source) => new JSDOM(source, { contentType: 'image/svg+xml' }).window.document;
const definitionIds = (document) =>
  [...document.querySelectorAll('defs [id]')].map((node) => node.id);

test('keeps transitive use, paint, clip and mask references in their original order', () => {
  const source = svg(`
    <title id="title">A tiny scene</title>
    <defs>
      <g id="unused"><use href="#also-unused"/></g>
      <g id="also-unused"><path d="M0 0h1"/></g>
      <linearGradient id="base"><stop stop-color="pink"/></linearGradient>
      <linearGradient id="paint" xlink:href="#base"/>
      <g id="mask-shape"><path d="M0 0h2"/></g>
      <mask id="mask"><use href="#mask-shape"/></mask>
      <path id="leaf" d="M1 1h3" fill="url( '#paint' )" mask="url(#mask)"/>
      <g id="model:1.part"><use xlink:href="#leaf"/></g>
      <clipPath id="clip"><path d="M0 0h4v4z"/></clipPath>
    </defs>
    <use href="#model:1.part" clip-path="url(#clip)"/>
  `);
  const document = documentOf(pruneSvgDefs(source));
  assert.deepEqual(definitionIds(document), [
    'base',
    'paint',
    'mask-shape',
    'mask',
    'leaf',
    'model:1.part',
    'clip',
  ]);
  assert.equal(document.getElementById('leaf').getAttribute('d'), 'M1 1h3');
  assert.equal(document.querySelector('title').textContent, 'A tiny scene');
  assert.equal(pruneSvgDefs(pruneSvgDefs(source)), pruneSvgDefs(source));
});

test('a reachable nested ID retains its containing definition and nested dependencies', () => {
  const document = documentOf(
    pruneSvgDefs(
      svg(`
    <defs>
      <g id="container" transform="translate(3 4)">
        <defs><linearGradient id="nested-paint"><stop stop-color="blue"/></linearGradient></defs>
        <g id="nested-model"><path fill="url(#nested-paint)"/><use href="#shared"/></g>
      </g>
      <path id="shared" d="M0 0h5"/>
      <path id="unused" d="M0 0h6"/>
    </defs>
    <use href="#nested-model"/>
  `),
    ),
  );
  assert.deepEqual(definitionIds(document), [
    'container',
    'nested-paint',
    'nested-model',
    'shared',
  ]);
  assert.equal(document.getElementById('container').getAttribute('transform'), 'translate(3 4)');
});

test('reachable reference cycles terminate while disconnected cycles are removed', () => {
  const document = documentOf(
    pruneSvgDefs(
      svg(`
    <defs>
      <g id="a"><use href="#b"/></g><g id="b"><use href="#a"/></g>
      <g id="c"><use href="#d"/></g><g id="d"><use href="#c"/></g>
    </defs>
    <use href="#a"/>
  `),
    ),
  );
  assert.deepEqual(definitionIds(document), ['a', 'b']);
});

test('preserves styles and animations in defs together with their local dependencies', () => {
  const source = svg(`
    <defs>
      <style>.painted { fill: url("#paint"); animation: pulse 1s infinite; } @keyframes pulse { to { opacity: .5; } }</style>
      <linearGradient id="paint"><stop stop-color="pink"/></linearGradient>
      <animate id="fade" href="#visible" attributeName="opacity" values="1;.5;1" dur="1s"/>
      <path id="unused" d="M0 0h7"/>
    </defs>
    <path id="visible" class="painted" d="M0 0h2"/>
  `);
  const document = documentOf(pruneSvgDefs(source));
  assert.deepEqual(definitionIds(document), ['paint', 'fade']);
  assert.equal(
    document.querySelector('style').textContent,
    documentOf(source).querySelector('style').textContent,
  );
  assert.equal(document.getElementById('fade').getAttribute('values'), '1;.5;1');
});

test('keeps title and ARIA token-list targets, including their transitive descriptions', () => {
  const document = documentOf(
    pruneSvgDefs(
      svg(`
    <title id="title">Shared title</title>
    <defs>
      <g id="label" aria-describedby="detail"><text>Label</text></g>
      <g id="detail"><text>Detail</text></g>
      <g id="other-label"><text>Other label</text></g>
      <path id="unused"/>
    </defs>
    <g aria-labelledby="title label other-label"><path d="M0 0h1"/></g>
  `),
    ),
  );
  assert.deepEqual(definitionIds(document), ['label', 'detail', 'other-label']);
  assert.equal(document.getElementById('title').textContent, 'Shared title');
});

test('rejects duplicate IDs rather than hiding an ambiguous reference by pruning', () => {
  assert.throws(
    () => pruneSvgDefs(svg('<defs><path id="same"/><circle id="same"/></defs><use href="#same"/>')),
    /duplicate|unique/i,
  );
});

test('leaves an SVG without redundant definitions unchanged', () => {
  const source = svg(
    '<title>Keep formatting</title>\n<defs><path id="shape" d="M0 0h1"/></defs>\n<use href="#shape"/>',
  );
  assert.equal(pruneSvgDefs(source), source);
});

test('the derived welcome scene drops unused expressions and retains its paw mask and animation', async () => {
  const artwork = new URL(
    '../playground/src/examples/scenes/artwork/friends-preview/',
    import.meta.url,
  );
  const [models, hero] = await Promise.all([
    readFile(new URL('source/characters.svg', artwork), 'utf8'),
    readFile(new URL('friends-hero.svg', artwork), 'utf8'),
  ]);
  const document = documentOf(createWelcomeScene(models, hero));
  assert.equal(document.querySelectorAll('defs [id]').length, 17);
  assert.equal(document.getElementById('chiikawa-face-smile'), null);
  assert.equal(document.querySelector('[mask]').getAttribute('mask'), 'url(#fw-left-paw-cut)');
  assert.ok(document.getElementById('fw-left-paw-cut'));
  assert.match(document.querySelector('style').textContent, /@keyframes fw-wave-hello/);
  assert.equal(documentOf(models).querySelectorAll('defs [id]').length, 26);
});
