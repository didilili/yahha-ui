import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';
import { format, resolveConfig } from 'prettier';
import { pruneSvgDefs } from './prune-svg-defs.mjs';

const namespace = 'http://www.w3.org/2000/svg';
const artwork = new URL(
  '../playground/src/examples/scenes/artwork/friends-preview/',
  import.meta.url,
);

// Natural head bounds, including the complete ears, with room for the original stroke.
// Keep the source proportions: the long-eared Usagi deliberately has a taller viewport.
export const friendsHeadModels = Object.freeze({
  chiikawa: { name: '吉伊', viewBox: '-102 -88 204 179' },
  hachiware: { name: '小八', viewBox: '-105 -107 210 191' },
  usagi: { name: '乌萨奇', viewBox: '-98 -181 198 274' },
});
export const friendsHeadExpressions = Object.freeze({
  bright: { source: 'bright', name: '自然睁眼' },
  smile: { source: 'smile', name: '闭眼笑' },
  surprise: { source: 'surprised', name: '惊讶' },
});

function splitOnce(path, marker, label) {
  const at = path.indexOf(marker);
  assert(at >= 0 && path.indexOf(marker, at + marker.length) === -1, label);
  return [path.slice(0, at), path.slice(at)];
}

/** Derive head silhouettes from the reviewed contours; never redraw facial features. */
export function createFriendsHeads(characterSource) {
  assert(
    !/<(?:image|script)\b|(?:href|xlink:href)=["'](?:https?:|data:)/i.test(characterSource),
    'Character artwork must be self-contained vector paths.',
  );
  const dom = new JSDOM(characterSource, { contentType: 'image/svg+xml' });
  try {
    const document = dom.window.document;
    const definitions = document.querySelector('svg > defs');
    assert(definitions, 'Head artwork needs the reviewed character definitions.');
    const serialize = (node) => new dom.window.XMLSerializer().serializeToString(node);
    const definitionMarkup = [...definitions.children].map(serialize).join('\n');

    function pathAt(character, index) {
      const path = document.getElementById(`${character}-body`)?.children[index];
      assert(path?.localName === 'path', `Missing reviewed ${character} contour ${index}.`);
      return path;
    }

    function silhouette(character, contour, { beforeOutline = [], afterOutline = [] } = {}) {
      const body = document.getElementById(`${character}-body`);
      assert(body, `Missing reviewed ${character} body.`);
      const head = body.cloneNode(false);
      head.id = `${character}-head`;
      const path = document.createElementNS(namespace, 'path');
      path.setAttribute(
        'fill',
        pathAt(character, character === 'chiikawa' ? 0 : 1).getAttribute('fill'),
      );
      path.setAttribute('d', contour);
      if (beforeOutline.length) path.setAttribute('stroke', 'none');
      head.append(path, ...beforeOutline.map((detail) => detail.cloneNode(true)));
      if (beforeOutline.length) {
        // Hachiware's blue forehead sits beneath the full-width outer ink line.
        const outline = path.cloneNode(true);
        outline.setAttribute('fill', 'none');
        outline.removeAttribute('stroke');
        head.append(outline);
      }
      head.append(...afterOutline.map((detail) => detail.cloneNode(true)));
      return serialize(head);
    }

    // The source joins each head directly to its body. Preserve the original ears,
    // forehead and cheek segments verbatim; only bridge the two neck junctions.
    // These short chin curves are the sole new geometry in the derived silhouettes.
    const chiikawa = pathAt('chiikawa', 0).getAttribute('d');
    const [chiikawaLeft] = splitOnce(
      chiikawa,
      ' 2 13 3 25 10 36',
      'The reviewed Chiikawa left head/body junction changed.',
    );
    const [, chiikawaRight] = splitOnce(
      chiikawa,
      'C84 52 95 33 95 10',
      'The reviewed Chiikawa right head/body junction changed.',
    );
    const chiikawaHead = silhouette(
      'chiikawa',
      `${chiikawaLeft}C-47 79-23 84 0 84 23 84 48 78 65.5 65${chiikawaRight}`,
    );

    const hachiware = pathAt('hachiware', 1).getAttribute('d');
    const [hachiwareRight] = splitOnce(
      hachiware,
      'q-5 3-1 5',
      'The reviewed Hachiware right head/body junction changed.',
    );
    const [, hachiwareLeftWithMove] = splitOnce(
      pathAt('hachiware', 3).getAttribute('d'),
      'M-69 57',
      'The reviewed Hachiware left cheek contour changed.',
    );
    const hachiwareLeft = hachiwareLeftWithMove.slice('M-69 57'.length);
    const hachiwareHead = silhouette(
      'hachiware',
      `${hachiwareRight}C53 67 24 77 0 77-24 77-49 69-69 57${hachiwareLeft}Z`,
      {
        beforeOutline: [pathAt('hachiware', 2)],
        afterOutline: [pathAt('hachiware', 5)],
      },
    );

    const usagi = pathAt('usagi', 1).getAttribute('d');
    const [usagiRight] = splitOnce(
      usagi,
      'q-3 2-1 4',
      'The reviewed Usagi right head/body junction changed.',
    );
    const [, usagiLeft] = splitOnce(
      usagi,
      'C-80 50-91 31-90 9',
      'The reviewed Usagi left head/body junction changed.',
    );
    const usagiHead = silhouette(
      'usagi',
      `${usagiRight}C45 80 23 86 0 86-23 86-45 75-61 61${usagiLeft}`,
      { afterOutline: [pathAt('usagi', 2)] },
    );

    const heads = { chiikawa: chiikawaHead, hachiware: hachiwareHead, usagi: usagiHead };
    const outputs = new Map();
    for (const [character, model] of Object.entries(friendsHeadModels)) {
      for (const [expression, mood] of Object.entries(friendsHeadExpressions)) {
        const faceId = `${character}-face-${mood.source}`;
        assert(document.getElementById(faceId), `Missing reviewed face: ${faceId}.`);
        outputs.set(
          `${character}-${expression}.svg`,
          pruneSvgDefs(`<svg xmlns="${namespace}" viewBox="${model.viewBox}" fill="none" role="img" aria-labelledby="title">
  <title id="title">${model.name}头像：${mood.name}。</title>
  <!-- Generated by scripts/build-friends-heads.mjs from the reviewed source/characters.svg. -->
  <defs>${definitionMarkup}${heads[character]}</defs>
  <use href="#${character}-head"/>
  <use href="#${faceId}"/>
</svg>`),
        );
      }
    }
    return outputs;
  } finally {
    dom.window.close();
  }
}

export async function syncFriendsHeads({ check = false } = {}) {
  const source = await readFile(new URL('source/characters.svg', artwork), 'utf8');
  const config = (await resolveConfig(fileURLToPath(new URL('README.md', artwork)))) ?? {};
  const outputs = createFriendsHeads(source);
  for (const [name, svg] of outputs) {
    const url = new URL(`heads/${name}`, artwork);
    const content = await format(svg, { ...config, parser: 'html' });
    if (check) {
      assert.equal(await readFile(url, 'utf8'), content, `Generated head artwork drift: ${name}`);
    } else {
      await mkdir(new URL('.', url), { recursive: true });
      await writeFile(url, content);
    }
  }
  return outputs.size;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const check = process.argv.includes('--check');
  const count = await syncFriendsHeads({ check });
  console.log(
    `${check ? 'Verified' : 'Generated'} ${count} heads from the reviewed character source.`,
  );
}
