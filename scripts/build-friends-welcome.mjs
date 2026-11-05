import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { pruneSvgDefs } from './prune-svg-defs.mjs';

const namespace = 'http://www.w3.org/2000/svg';

/** Derive the animated welcome scene without changing the reviewed character source. */
export function createWelcomeScene(characterSource, heroSource) {
  const models = new JSDOM(characterSource, { contentType: 'image/svg+xml' }).window.document;
  const document = new JSDOM(heroSource, { contentType: 'image/svg+xml' }).window.document;
  const root = document.documentElement;
  const definitions = root.querySelector('defs');
  const reviewed = models.querySelector('defs');
  assert(
    root.localName === 'svg' && definitions && reviewed,
    'Welcome scene needs both SVG sources.',
  );
  const body = models.getElementById('hachiware-body');
  const paw = body?.querySelector('#hachiware-left-paw');
  assert(paw, 'The reviewed model must expose its hachiware-left-paw contour.');
  const leftArm = paw.getAttribute('d');
  const origin = paw.getAttribute('data-wave-origin')?.trim().split(/\s+/).map(Number);
  assert(leftArm && /^M/.test(leftArm), 'The reviewed paw needs its own path start.');
  assert(
    origin?.length === 2 && origin.every(Number.isFinite),
    'The reviewed paw needs a two-coordinate wave origin.',
  );

  function element(name, attributes = {}, children = []) {
    const node = document.createElementNS(namespace, name);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
    for (const child of children) node.append(child);
    return node;
  }

  // Keep every reviewed model, including facial features, byte-equivalent in geometry.
  for (const model of reviewed.children) {
    const existing = document.getElementById(model.id);
    const copy = document.importNode(model, true);
    if (existing) existing.replaceWith(copy);
    else definitions.append(copy);
  }
  root.setAttribute('data-artwork', 'friends-welcome');
  root.setAttribute('data-motion', 'off');
  root.setAttribute('data-paused', 'false');
  root.querySelector('title').textContent = '风轻轻经过，小八挥两下手，朋友们欢迎你来到小站。';

  const style = element('style');
  style.textContent = `
    svg[data-artwork="friends-welcome"][data-motion="on"] .fw-moving { animation-timing-function: ease-in-out; transform-box: view-box; }
    svg[data-artwork="friends-welcome"][data-motion="on"] .fw-cloud-near { animation: fw-cloud-near 24s ease-in-out infinite; }
    svg[data-artwork="friends-welcome"][data-motion="on"] .fw-cloud-far { animation: fw-cloud-far 30s ease-in-out infinite; }
    svg[data-artwork="friends-welcome"][data-motion="on"] .fw-grass-one { transform-origin: 182px 481px; animation: fw-grass-breeze 4.8s ease-in-out infinite; }
    svg[data-artwork="friends-welcome"][data-motion="on"] .fw-grass-two { transform-origin: 560px 487px; animation: fw-grass-breeze 5.4s .6s ease-in-out infinite; }
    svg[data-artwork="friends-welcome"][data-motion="on"] .fw-grass-three { transform-origin: 111px 447px; animation: fw-grass-breeze 5.8s .2s ease-in-out infinite; }
    svg[data-artwork="friends-welcome"][data-motion="on"] .fw-grass-four { transform-origin: 158px 483px; animation: fw-grass-breeze 5.1s .4s ease-in-out infinite; }
    svg[data-artwork="friends-welcome"][data-motion="on"] .fw-grass-five { transform-origin: 586px 491px; animation: fw-grass-breeze 5.6s .9s ease-in-out infinite; }
    svg[data-artwork="friends-welcome"][data-motion="on"] .fw-flower-one { transform-origin: 123.2px 460.7px; animation: fw-flower-breeze 5.4s .5s ease-in-out infinite; }
    svg[data-artwork="friends-welcome"][data-motion="on"] .fw-flower-two { transform-origin: 652.7px 472.4px; animation: fw-flower-breeze 5.9s 1s ease-in-out infinite; }
    svg[data-artwork="friends-welcome"][data-motion="on"] .fw-flower-three { transform-origin: 604.9px 498.4px; animation: fw-flower-breeze 6.2s 1.2s ease-in-out infinite; }
    svg[data-artwork="friends-welcome"][data-motion="on"] .fw-wave { transform-origin: ${origin[0]}px ${origin[1]}px; animation: fw-wave-hello 1.8s ease-in-out 1 both; }
    svg[data-artwork="friends-welcome"][data-motion="on"][data-paused="true"] .fw-moving { animation-play-state: paused; }
    @keyframes fw-cloud-near { 0%,100% { transform: translateX(0); } 50% { transform: translateX(18px); } }
    @keyframes fw-cloud-far { 0%,100% { transform: translateX(0); } 50% { transform: translateX(14px); } }
    @keyframes fw-grass-breeze { 0%,18%,100% { transform: rotate(0); } 48% { transform: rotate(7deg); } 73% { transform: rotate(-3deg); } }
    @keyframes fw-flower-breeze { 0%,20%,100% { transform: rotate(0); } 50% { transform: rotate(3deg); } 76% { transform: rotate(-1.5deg); } }
    @keyframes fw-wave-hello { 0%,10%,100% { transform: rotate(0); } 27%,65% { transform: rotate(12deg); } 45%,83% { transform: rotate(-7deg); } }
    @media (max-width: 600px) {
      svg[data-artwork="friends-welcome"][data-motion="on"] .fw-cloud-far,
      svg[data-artwork="friends-welcome"][data-motion="on"] .fw-grass-three,
      svg[data-artwork="friends-welcome"][data-motion="on"] .fw-flower-three { animation: none; }
    }
    @media (prefers-reduced-motion: reduce) {
      svg[data-artwork="friends-welcome"][data-motion="on"] .fw-moving { animation: none; transform: none; }
    }
  `;
  root.insertBefore(style, definitions);

  function wrap(node, attributes) {
    const group = element('g', attributes);
    node.replaceWith(group);
    group.append(node);
    return group;
  }

  const cloudUses = [...root.children].filter(
    (node) => node.getAttribute('href') === '#scene-cloud',
  );
  assert.equal(cloudUses.length, 2, 'The reviewed scene must retain its two clouds.');
  cloudUses.forEach((node, index) =>
    wrap(node, {
      class: `fw-moving fw-cloud-${index === 0 ? 'near' : 'far'}`,
      'data-part': 'cloud',
    }),
  );

  const flowers = [...root.children].filter(
    (node) => node.getAttribute('href') === '#scene-flower',
  );
  assert.equal(flowers.length, 3, 'The reviewed scene must retain its three flowers.');
  flowers.forEach((node, index) =>
    wrap(node, {
      class: `fw-moving fw-flower-${['one', 'two', 'three'][index]}`,
      'data-part': 'flower',
    }),
  );

  const grass = [...root.children].find((node) => node.getAttribute('stroke') === '#8ba271');
  assert(grass, 'The reviewed scene must retain its grass.');
  // Resolve the original relative moves into equivalent separate tufts, anchored at their roots.
  grass.replaceChildren();
  for (const [name, path] of [
    ['one', 'M182 481l-4-9m4 9 4-6'],
    ['two', 'M560 487l-1-10m1 10 6-7'],
    ['three', 'M111 447l-1-8m1 8 5-6'],
    ['four', 'M158 483c-2-8-1-16 3-24m-3 24c-5-6-8-10-10-14m10 14c4-7 9-11 14-13'],
    ['five', 'M586 491c-1-8 0-17-4-24m4 24c-5-7-9-11-14-14m14 14c4-7 8-11 12-14'],
  ]) {
    grass.append(
      element('g', { class: `fw-moving fw-grass-${name}`, 'data-part': 'grass' }, [
        element('path', { d: path }),
      ]),
    );
  }

  // Separate the named, reviewed paw from the silhouette without changing the face.
  // A local white shoulder keeps the moving root connected to the shorter body.
  definitions.append(
    element(
      'mask',
      {
        id: 'fw-left-paw-cut',
        maskUnits: 'userSpaceOnUse',
        x: -125,
        y: -115,
        width: 250,
        height: 300,
      },
      [
        element('rect', { x: -125, y: -115, width: 250, height: 300, fill: '#fff' }),
        element('path', {
          d: `${leftArm}Z`,
          fill: '#000',
          stroke: '#000',
          'stroke-width': 5.4,
          'stroke-linejoin': 'round',
          'stroke-linecap': 'round',
        }),
      ],
    ),
  );
  const original = [...root.children].find(
    (node) => node.getAttribute('href') === '#hachiware-smile',
  );
  assert(original, 'The welcome scene must retain its original smiling Hachiware.');
  const rig = element(
    'g',
    {
      transform: original.getAttribute('transform'),
      'data-character': 'hachiware',
    },
    [
      element('g', { mask: 'url(#fw-left-paw-cut)' }, [
        element('use', { href: '#hachiware-body' }),
      ]),
      element('path', {
        d: 'M-73 54Q-61 54-59 65L-59 87Q-66 87-71 80Z',
        fill: '#fffdfb',
        stroke: 'none',
      }),
      element('path', {
        d: 'M-65 79c3 17 13 34 31 43',
        fill: 'none',
        stroke: '#50312e',
        'stroke-width': 3.8,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      }),
      element('g', { class: 'fw-moving fw-wave', 'data-part': 'wave-arm' }, [
        element('path', {
          d: leftArm,
          fill: '#fffdfb',
          stroke: '#50312e',
          'stroke-width': 3.8,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        }),
      ]),
      element('use', { href: '#hachiware-face-smile' }),
    ],
  );
  original.replaceWith(rig);

  return pruneSvgDefs(new document.defaultView.XMLSerializer().serializeToString(root));
}
