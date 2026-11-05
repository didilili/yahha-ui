import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';

export type AutoSize = boolean | { minRows?: number; maxRows?: number };
const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const sizingProperties = [
  'box-sizing',
  'width',
  'scrollbar-gutter',
  'font-family',
  'font-size',
  'font-style',
  'font-weight',
  'font-stretch',
  'font-variant',
  'font-feature-settings',
  'font-variation-settings',
  'font-size-adjust',
  'letter-spacing',
  'word-spacing',
  'line-height',
  'padding',
  'border-width',
  'border-style',
  'tab-size',
  'text-indent',
  'text-transform',
  'white-space',
  'word-break',
  'overflow-wrap',
  'direction',
];
const positiveRows = (value: number | undefined, fallback: number) =>
  value !== undefined && Number.isFinite(value) && value > 0
    ? Math.max(1, Math.floor(value))
    : fallback;

export function useAutoSize(
  root: RefObject<HTMLDivElement | null>,
  autoSize: AutoSize,
  rows: number,
  callerHeight: string | number | undefined,
) {
  const enabled = autoSize !== false;
  const managed = useRef(false);
  const mirror = useRef<HTMLTextAreaElement | null>(null);
  const frame = useRef<number | undefined>(undefined);
  const resetPending = useRef(false);
  const measure = useRef<() => void>(() => {});

  useClientLayoutEffect(() => {
    if (!enabled && !managed.current) return;
    const node = root.current?.querySelector<HTMLTextAreaElement>(':scope > textarea');
    const view = node?.ownerDocument.defaultView;
    if (!node || !view) return;
    // A reset handler may render before the browser restores the textarea's value.
    if (frame.current !== undefined && (!enabled || !resetPending.current)) {
      view.cancelAnimationFrame(frame.current);
      frame.current = undefined;
    }
    if (!enabled) {
      node.style.height =
        typeof callerHeight === 'number' ? `${callerHeight}px` : (callerHeight ?? '');
      managed.current = false;
      resetPending.current = false;
      measure.current = () => {};
      return;
    }
    managed.current = true;
    measure.current = () => {
      if (!node.isConnected || !node.getClientRects().length || !node.clientWidth) return;
      const style = view.getComputedStyle(node);
      const probe = (mirror.current ??= node.ownerDocument.createElement('textarea'));
      if (!probe.isConnected) {
        probe.disabled = true;
        probe.tabIndex = -1;
        probe.setAttribute('aria-hidden', 'true');
        node.ownerDocument.body.append(probe);
      }
      for (const property of sizingProperties) {
        probe.style.setProperty(property, style.getPropertyValue(property), 'important');
      }
      // The real node keeps its value, selection, height and document scroll during measurement.
      for (const [property, value] of Object.entries({
        display: 'block',
        position: 'fixed',
        left: '0',
        top: '0',
        height: '0',
        'min-width': '0',
        'max-width': 'none',
        'min-height': '0',
        'max-height': 'none',
        overflow: 'hidden',
        visibility: 'hidden',
        'pointer-events': 'none',
        margin: '0',
      })) {
        probe.style.setProperty(property, value, 'important');
      }
      probe.wrap = node.wrap;
      probe.value = node.value || node.placeholder;
      const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      const border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
      const contentHeight = probe.scrollHeight - padding;
      let lineHeight = parseFloat(style.lineHeight);
      if (!Number.isFinite(lineHeight) || lineHeight <= 0) {
        probe.value = Array(100).fill('x').join('\n');
        lineHeight = (probe.scrollHeight - padding) / 100;
      }
      if (!Number.isFinite(lineHeight) || lineHeight <= 0 || !Number.isFinite(contentHeight))
        return;
      const options = typeof autoSize === 'object' ? autoSize : {};
      const min = positiveRows(options.minRows, positiveRows(rows, 4));
      const max = Math.max(min, positiveRows(options.maxRows, Infinity));
      const content = Math.max(min * lineHeight, Math.min(max * lineHeight, contentHeight));
      const height = Math.ceil(content + (style.boxSizing === 'border-box' ? padding + border : 0));
      if (Number.isFinite(height) && node.style.height !== `${height}px`) {
        node.style.height = `${height}px`;
      }
    };
    measure.current();
  });

  useEffect(() => {
    if (!enabled) return;
    const node = root.current?.querySelector<HTMLTextAreaElement>(':scope > textarea');
    const view = node?.ownerDocument.defaultView;
    if (!node || !view) return;
    let disposed = false;
    const schedule = () => {
      if (disposed || frame.current !== undefined) return;
      frame.current = view.requestAnimationFrame(() => {
        frame.current = undefined;
        resetPending.current = false;
        if (!disposed) measure.current();
      });
    };
    const eventRoot = node.getRootNode();
    const reset = (event: Event) => {
      if (event.target !== node.form) return;
      resetPending.current = true;
      schedule();
    };
    let lastWidth = -1;
    const observer =
      typeof view.ResizeObserver === 'function'
        ? new view.ResizeObserver(([entry]) => {
            const width = entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
            if (width === lastWidth) return;
            lastWidth = width;
            schedule();
          })
        : undefined;
    observer?.observe(node);
    node.addEventListener('input', schedule);
    eventRoot.addEventListener('reset', reset, true);
    view.addEventListener('resize', schedule);
    const fonts = node.ownerDocument.fonts;
    fonts?.ready.then(schedule);
    fonts?.addEventListener('loadingdone', schedule);
    fonts?.addEventListener('loadingerror', schedule);
    return () => {
      disposed = true;
      observer?.disconnect();
      node.removeEventListener('input', schedule);
      eventRoot.removeEventListener('reset', reset, true);
      view.removeEventListener('resize', schedule);
      fonts?.removeEventListener('loadingdone', schedule);
      fonts?.removeEventListener('loadingerror', schedule);
      if (frame.current !== undefined) view.cancelAnimationFrame(frame.current);
      frame.current = undefined;
      resetPending.current = false;
      mirror.current?.remove();
      mirror.current = null;
    };
  }, [enabled, root]);
}
