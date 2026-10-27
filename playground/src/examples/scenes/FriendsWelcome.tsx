import { createElement, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { Button, Text } from 'yahha-ui';
import sceneSource from './artwork/friends-welcome.svg?raw';

interface SceneNode {
  tag: string;
  attributes: [string, string][];
  children: (SceneNode | string)[];
}

const allowedTags = new Set([
  'svg',
  'g',
  'defs',
  'path',
  'circle',
  'ellipse',
  'rect',
  'line',
  'polygon',
  'polyline',
  'clipPath',
  'mask',
  'use',
  'style',
  'title',
  'desc',
]);

// This parses the accompanying, project-owned SVG; it does not accept user markup.
function readScene(source: string): SceneNode {
  const document = new DOMParser().parseFromString(source, 'image/svg+xml');
  if (document.querySelector('parsererror') || document.documentElement.localName !== 'svg')
    throw new Error('The welcome artwork must be a valid SVG document.');
  const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
  if (new Set(ids).size !== ids.length) throw new Error('Welcome SVG IDs must be unique.');

  function read(element: Element): SceneNode {
    if (!allowedTags.has(element.localName))
      throw new Error(`Unsupported welcome SVG element: ${element.localName}`);
    const attributes: [string, string][] = [...element.attributes].map(({ name, value }) => {
      if (/^on/i.test(name) || name === 'style')
        throw new Error('Welcome artwork must use its scoped stylesheet, without handlers.');
      if (
        (name === 'href' || name === 'xlink:href') &&
        (!value.startsWith('#') || !ids.includes(value.slice(1)))
      )
        throw new Error('Welcome artwork may only reference its own vector groups.');
      for (const [, paint] of value.matchAll(/url\(([^)]+)\)/gi)) {
        const target = paint.trim().replace(/^['"]|['"]$/g, '');
        if (!target.startsWith('#') || !ids.includes(target.slice(1)))
          throw new Error('Welcome artwork may only use its own paint definitions.');
      }
      return [name, value];
    });
    if (element.localName === 'style') {
      const stylesheet = element.textContent ?? '';
      if (/@import/i.test(stylesheet))
        throw new Error('The welcome stylesheet must remain self-contained.');
      for (const [, paint] of stylesheet.matchAll(/url\(([^)]+)\)/gi)) {
        const target = paint.trim().replace(/^['"]|['"]$/g, '');
        if (!target.startsWith('#') || !ids.includes(target.slice(1)))
          throw new Error('The welcome stylesheet may only use its own paint definitions.');
      }
    }
    return {
      tag: element.localName,
      attributes,
      children: [...element.childNodes].flatMap<SceneNode | string>((node) => {
        if (node.nodeType === 1) return [read(node as Element)];
        if (node.nodeType === 3 || node.nodeType === 4) return [node.nodeValue ?? ''];
        return [];
      }),
    };
  }
  return read(document.documentElement);
}

function attributeName(name: string) {
  if (name === 'class') return 'className';
  if (name === 'xlink:href') return 'href';
  if (name === 'xmlns:xlink') return 'xmlnsXlink';
  if (name === 'xml:space') return 'xmlSpace';
  if (name.startsWith('aria-') || name.startsWith('data-')) return name;
  return name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function localReferences(value: string, prefix: string) {
  return value.replace(
    /url\(\s*(['"]?)#([^\s)'"\\]+)\1\s*\)/g,
    (_, _quote: string, id: string) => `url(#${prefix}-${id})`,
  );
}

function drawScene(
  node: SceneNode,
  prefix: string,
  wave: number,
  root: { label: string; running: boolean; reduced: boolean },
  path = 'scene',
): ReactNode {
  const properties: Record<string, string | boolean | number> = {};
  for (const [name, original] of node.attributes) {
    let value = localReferences(original, prefix);
    if (name === 'id') value = `${prefix}-${original}`;
    if (name === 'href' || name === 'xlink:href') value = `#${prefix}-${original.slice(1)}`;
    if (name === 'aria-labelledby' || name === 'aria-describedby')
      value = original
        .split(/\s+/)
        .map((id) => `${prefix}-${id}`)
        .join(' ');
    properties[attributeName(name)] = value;
  }
  properties.key = properties['data-part'] === 'wave-arm' ? `${path}-wave-${wave}` : path;
  if (node.tag === 'svg') {
    delete properties['aria-labelledby'];
    properties.id = `${prefix}-scene`;
    properties.role = 'img';
    properties['aria-label'] = root.label;
    properties.focusable = 'false';
    properties['data-motion'] = root.reduced ? 'off' : 'on';
    properties['data-paused'] = String(!root.running);
  }
  return createElement(
    node.tag,
    properties,
    ...node.children.map((child, index) =>
      typeof child === 'string'
        ? localReferences(child, prefix)
        : drawScene(child, prefix, wave, root, `${path}-${index}`),
    ),
  );
}

/** A browser-only website example, with its SVG source kept alongside the copied file. */
export default function FriendsWelcome({
  label = '吉伊扶着小站卡片，小八笑着挥手，乌萨奇陪在旁边。',
  onRunningChange,
}: {
  label?: string;
  onRunningChange?: (running: boolean) => void;
} = {}) {
  const prefix = `friends-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const picture = useRef<HTMLDivElement>(null);
  const hasEntered = useRef(false);
  const callback = useRef(onRunningChange);
  const scene = useMemo(() => readScene(sceneSource), []);
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [wave, setWave] = useState(0);
  const [announcement, setAnnouncement] = useState('小八会短暂挥手，随后安静下来。');
  const running = !userPaused && !reducedMotion && inView && pageVisible;

  useEffect(() => {
    callback.current = onRunningChange;
  }, [onRunningChange]);
  useEffect(() => {
    callback.current?.(running);
  }, [running]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Save the first greeting until the friends are visible, including on short screens.
        const requiredRatio = Math.min(
          0.6,
          (window.innerHeight * 0.65) / entry.boundingClientRect.height,
        );
        if (entry.isIntersecting && entry.intersectionRatio >= requiredRatio)
          hasEntered.current = true;
        setInView(hasEntered.current && entry.isIntersecting);
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1] },
    );
    if (picture.current) observer.observe(picture.current);
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    updateMotion();
    updateVisibility();
    return () => {
      observer.disconnect();
      media.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  const drawing = useMemo(
    () => drawScene(scene, prefix, wave, { label, running, reduced: reducedMotion }),
    [scene, prefix, wave, label, running, reducedMotion],
  );

  return (
    <div
      className="friends-welcome"
      data-running={running}
      data-user-paused={userPaused}
      data-reduced-motion={reducedMotion}
    >
      <style>{`
        .friends-welcome { display: grid; gap: 12px; min-width: 0; width: 100%; }
        .friends-welcome-picture { min-width: 0; }
        .friends-welcome-picture > svg { display: block; width: 100%; height: auto; }
        .friends-welcome-controls { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 8px 12px; }
        .friends-welcome-caption { text-align: center; }
      `}</style>
      <div ref={picture} className="friends-welcome-picture">
        {drawing}
      </div>
      <div className="friends-welcome-controls" role="group" aria-label="欢迎场景动效控制">
        <Button
          variant="secondary"
          aria-controls={`${prefix}-scene`}
          aria-pressed={userPaused}
          disabled={reducedMotion}
          onClick={() => {
            setUserPaused((value) => !value);
            setAnnouncement(userPaused ? '场景动效已继续。' : '场景动效已暂停。');
          }}
        >
          {userPaused ? '继续场景动效' : '暂停场景动效'}
        </Button>
        <Button
          variant="ghost"
          aria-controls={`${prefix}-scene`}
          disabled={userPaused || reducedMotion}
          onClick={() => {
            setWave((value) => value + 1);
            setAnnouncement('已再次和小八打招呼。');
          }}
        >
          再打个招呼
        </Button>
      </div>
      <div className="friends-welcome-caption">
        <Text size="sm" tone="muted" role="status" aria-atomic="true">
          {reducedMotion ? '已按系统偏好显示静止场景。' : announcement}
        </Text>
      </div>
    </div>
  );
}
