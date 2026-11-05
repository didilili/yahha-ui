// The four approved F2 sequences animate only the component symbol.
// Keep the original picture and wordmark as the static, exact fallback.
export type MotionVariant = 'A' | 'B' | 'C' | 'D';
const variants: readonly MotionVariant[] = ['A', 'B', 'C', 'D'];
const durations: Record<MotionVariant, number> = { A: 1450, B: 1700, C: 1350, D: 1800 };

const frames = (steps: readonly (readonly [number, string])[]): Keyframe[] =>
  steps.map(([offset, transform]) => ({ offset, transform, easing: 'cubic-bezier(.35,0,.2,1)' }));
const R = (a: number) => `rotate(${a}deg)`;
const T = (y: number, sx = 1, sy = 1) => `translate(0px,${y}px) scale(${sx},${sy})`;
const S = (x: number, y = x) => `scale(${x},${y})`;
function choreography(v: MotionVariant): Record<string, Keyframe[]> {
  if (v === 'A')
    return {
      'ear-left': frames([
        [0, R(0)],
        [0.13, R(0)],
        [0.32, R(-7)],
        [0.49, R(2.5)],
        [0.66, R(-1.8)],
        [0.82, R(0.5)],
        [1, R(0)],
      ]),
      'ear-right': frames([
        [0, R(0)],
        [0.21, R(0)],
        [0.41, R(8)],
        [0.59, R(-3)],
        [0.75, R(1.8)],
        [0.9, R(-0.4)],
        [1, R(0)],
      ]),
      character: frames([
        [0, T(0)],
        [0.15, T(0)],
        [0.38, T(-6)],
        [0.56, T(1.5)],
        [0.72, T(-1.6)],
        [0.9, T(0)],
        [1, T(0)],
      ]),
      mouth: frames([
        [0, S(1)],
        [0.15, S(1)],
        [0.38, S(1.045, 1.12)],
        [0.67, S(1.015, 1.035)],
        [1, S(1)],
      ]),
      cheeks: frames([
        [0, S(1)],
        [0.4, S(1.055, 1.07)],
        [0.74, S(1.015)],
        [1, S(1)],
      ]),
    };
  if (v === 'B')
    return {
      character: frames([
        [0, T(0)],
        [0.12, T(2, 1.022, 0.965)],
        [0.26, T(-12, 0.99, 1.025)],
        [0.39, T(0, 1.025, 0.968)],
        [0.51, T(-6, 0.995, 1.015)],
        [0.64, T(0, 1.012, 0.985)],
        [0.81, T(0)],
        [1, T(0)],
      ]),
      'ear-left': frames([
        [0, R(0)],
        [0.13, R(3)],
        [0.3, R(-6)],
        [0.43, R(3)],
        [0.55, R(-3)],
        [0.7, R(1)],
        [0.85, R(0)],
        [1, R(0)],
      ]),
      'ear-right': frames([
        [0, R(0)],
        [0.16, R(-3)],
        [0.33, R(6)],
        [0.45, R(-3)],
        [0.58, R(3)],
        [0.74, R(-1)],
        [0.9, R(0)],
        [1, R(0)],
      ]),
      mouth: frames([
        [0, S(1)],
        [0.12, S(0.98, 0.94)],
        [0.27, S(1.08, 1.2)],
        [0.4, S(1.02, 1.04)],
        [0.53, S(1.05, 1.13)],
        [0.76, S(1)],
        [1, S(1)],
      ]),
      cheeks: frames([
        [0, S(1)],
        [0.28, S(1.09, 1.1)],
        [0.4, S(1)],
        [0.54, S(1.055, 1.07)],
        [0.8, S(1)],
        [1, S(1)],
      ]),
    };
  if (v === 'C')
    return {
      'ear-left': frames([
        [0, R(0)],
        [0.12, R(0)],
        [0.3, R(4)],
        [0.46, R(-9)],
        [0.64, R(2.4)],
        [0.82, R(-0.9)],
        [1, R(0)],
      ]),
      'ear-right': frames([
        [0, R(0)],
        [0.12, R(0)],
        [0.3, R(-4)],
        [0.46, R(9)],
        [0.64, R(-2.4)],
        [0.82, R(0.9)],
        [1, R(0)],
      ]),
      character: frames([
        [0, T(0)],
        [0.3, T(1, 1.01, 0.99)],
        [0.47, T(-7, 0.995, 1.012)],
        [0.66, T(0, 1.012, 0.99)],
        [0.84, T(0)],
        [1, T(0)],
      ]),
      lines: frames([
        [0, S(1)],
        [0.14, S(0.92)],
        [0.32, S(1.22)],
        [0.54, S(1.04)],
        [0.76, S(1)],
        [1, S(1)],
      ]),
      mouth: frames([
        [0, S(1)],
        [0.3, S(1)],
        [0.47, S(1.055, 1.16)],
        [0.75, S(1.015, 1.04)],
        [1, S(1)],
      ]),
    };
  return {
    character: frames([
      [0, R(0)],
      [0.12, R(0)],
      [0.28, R(-2.6)],
      [0.48, R(2.6)],
      [0.67, R(-1.4)],
      [0.84, R(0.55)],
      [1, R(0)],
    ]),
    'ear-left': frames([
      [0, R(0)],
      [0.18, R(0)],
      [0.34, R(6)],
      [0.54, R(-5)],
      [0.72, R(2.4)],
      [0.89, R(-0.7)],
      [1, R(0)],
    ]),
    'ear-right': frames([
      [0, R(0)],
      [0.23, R(0)],
      [0.4, R(-5)],
      [0.59, R(5)],
      [0.77, R(-2)],
      [0.93, R(0.5)],
      [1, R(0)],
    ]),
    mouth: frames([
      [0, S(1)],
      [0.3, S(1.035, 1.1)],
      [0.54, S(1.035, 1.1)],
      [0.82, S(1.01)],
      [1, S(1)],
    ]),
    cheeks: frames([
      [0, S(1)],
      [0.43, S(1.05)],
      [0.8, S(1.01)],
      [1, S(1)],
    ]),
  };
}

export interface BrandMotionController {
  play(): boolean;
  stop(): void;
  destroy(): void;
}

/** Mount a private SVG rig without changing the branded picture or its wordmark. */
export function createBrandMotion(
  container: HTMLSpanElement,
  overlay: HTMLSpanElement,
  markup: string,
  prefix: string,
): BrandMotionController | null {
  const parsed = new DOMParser().parseFromString(markup, 'image/svg+xml');
  const source = parsed.querySelector('svg');
  if (!source || parsed.querySelector('parsererror')) return null;
  const svg = document.importNode(source, true);
  const parts = new Map<string, SVGElement>();
  for (const element of svg.querySelectorAll<SVGElement>('[id]')) {
    const id = element.id;
    if (id.startsWith('rig-')) parts.set(id.slice(4), element);
    element.id = prefix + id;
    const pivot = element.getAttribute('data-pivot');
    if (pivot) {
      const [x, y] = pivot.split(' ');
      element.style.transformOrigin = `${x}px ${y}px`;
      element.style.transformBox = 'view-box';
    }
  }
  for (const element of [svg, ...svg.querySelectorAll('*')]) {
    for (const attribute of [...element.attributes]) {
      let value = attribute.value.replace(
        /url\(#([^)]+)\)/g,
        (_, id: string) => `url(#${prefix}${id})`,
      );
      if (attribute.localName === 'href' && value.startsWith('#'))
        value = `#${prefix}${value.slice(1)}`;
      if (value !== attribute.value) {
        element.setAttributeNS(attribute.namespaceURI, attribute.name, value);
      }
    }
  }
  // Keep these tiny symbol parts on the same raster path while idle and playing.
  // Otherwise WAAPI promotion can resnap a neutral outline by one device pixel.
  for (const name of ['character', 'ear-left', 'ear-right', 'mouth', 'cheeks', 'lines']) {
    const part = parts.get(name);
    if (part) {
      part.style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
      part.style.willChange = 'transform';
    }
  }
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('brand-logo-motion-artwork');
  overlay.replaceChildren(svg);
  container.dataset.motionReady = 'true';
  let animations: Animation[] = [];
  let playing = false;
  let run = 0;
  let last: MotionVariant | undefined;

  function stop() {
    run++;
    // Finish in the same neutral rig and raster layers used before playback.
    container.dataset.motionState = 'idle';
    playing = false;
    for (const animation of animations) animation.cancel();
    animations = [];
  }

  function play() {
    if (playing) return false;
    const candidates = variants.filter((variant) => variant !== last);
    const variant = candidates[Math.floor(Math.random() * candidates.length)];
    const sequence = choreography(variant);
    if (Object.keys(sequence).some((part) => typeof parts.get(part)?.animate !== 'function')) {
      return false;
    }
    const token = ++run;
    const started: Animation[] = [];
    try {
      for (const [part, keyframes] of Object.entries(sequence)) {
        started.push(
          parts.get(part)!.animate(keyframes, { duration: durations[variant], fill: 'none' }),
        );
      }
    } catch {
      // A partially supported animation API must never replace the original logo.
      for (const animation of started) {
        void animation.finished.catch(() => {});
        animation.cancel();
      }
      return false;
    }
    animations = started;
    playing = true;
    last = variant;
    container.dataset.motionVariant = variant;
    container.dataset.motionState = 'playing';
    void Promise.all(started.map((animation) => animation.finished))
      .then(() => {
        if (run === token) stop();
      })
      .catch(() => {});
    return true;
  }

  return {
    play,
    stop,
    destroy() {
      stop();
      delete container.dataset.motionReady;
      overlay.replaceChildren();
    },
  };
}
