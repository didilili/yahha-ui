import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookmarkIcon,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  CopyIcon,
  EditIcon,
  ErrorIcon,
  ExternalLinkIcon,
  InfoIcon,
  PlusIcon,
  SearchIcon,
  SuccessIcon,
  TrashIcon,
  WarningIcon,
} from './glyphs/index.js';

afterEach(cleanup);

const glyphs = [
  ['SearchIcon', SearchIcon],
  ['CloseIcon', CloseIcon],
  ['BookmarkIcon', BookmarkIcon],
  ['CopyIcon', CopyIcon],
  ['CheckIcon', CheckIcon],
  ['PlusIcon', PlusIcon],
  ['EditIcon', EditIcon],
  ['TrashIcon', TrashIcon],
  ['ArrowLeftIcon', ArrowLeftIcon],
  ['ArrowRightIcon', ArrowRightIcon],
  ['ChevronDownIcon', ChevronDownIcon],
  ['ExternalLinkIcon', ExternalLinkIcon],
  ['InfoIcon', InfoIcon],
  ['SuccessIcon', SuccessIcon],
  ['WarningIcon', WarningIcon],
  ['ErrorIcon', ErrorIcon],
] as const;

describe('named glyphs', () => {
  it.each(glyphs)(
    '%s renders its shape and forwards its accessible name and ref to svg',
    (name, Glyph) => {
      const ref = createRef<SVGSVGElement>();
      render(<Glyph ref={ref} aria-label={name} className="custom-glyph" size="lg" />);

      const svg = screen.getByRole('img', { name });
      expect(svg.tagName.toLowerCase()).toBe('svg');
      expect(svg.parentElement?.tagName.toLowerCase()).toBe('div');
      expect(svg.querySelector('path, circle, rect, line, polyline')).not.toBeNull();
      expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
      expect(svg.classList.contains('custom-glyph')).toBe(true);
      expect(ref.current).toBe(svg);
    },
  );

  it('keeps unnamed glyphs decorative and does not assign status semantics', () => {
    const { container } = render(<WarningIcon />);
    const svg = container.querySelector('svg');

    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.getAttribute('focusable')).toBe('false');
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it.each(glyphs)('%s preserves explicit paint and native svg attributes', (_name, Glyph) => {
    render(
      <Glyph
        aria-label="自定图标"
        id="custom-paint"
        size={28}
        stroke="rebeccapurple"
        strokeWidth={2.5}
        strokeLinecap="butt"
        strokeLinejoin="bevel"
        fill="gold"
        style={{ opacity: 0.7 }}
      />,
    );
    const svg = screen.getByRole('img', { name: '自定图标' });

    expect(svg.getAttribute('id')).toBe('custom-paint');
    expect(svg.getAttribute('stroke')).toBe('rebeccapurple');
    expect(svg.getAttribute('stroke-width')).toBe('2.5');
    expect(svg.getAttribute('stroke-linecap')).toBe('butt');
    expect(svg.getAttribute('stroke-linejoin')).toBe('bevel');
    expect(svg.getAttribute('fill')).toBe('gold');
    expect(svg.style.opacity).toBe('0.7');
  });

  it('fills only the bookmark body and keeps its folded corner open', () => {
    const { container, rerender } = render(<BookmarkIcon />);
    const [body, outline, fold] = container.querySelectorAll('path');

    expect(body.getAttribute('fill')).toBe('none');
    expect(body.getAttribute('fill-opacity')).toBe('0.2');
    expect(outline.getAttribute('fill')).toBe('none');
    expect(fold.getAttribute('fill')).toBe('none');

    rerender(<BookmarkIcon filled aria-label="已收藏" />);
    const svg = screen.getByRole('img', { name: '已收藏' });
    expect(body.getAttribute('fill')).toBe('currentColor');
    expect(body.getAttribute('fill-opacity')).toBe('0.2');
    expect(fold.getAttribute('fill')).toBe('none');
    expect(svg.hasAttribute('filled')).toBe(false);
    expect(svg.hasAttribute('aria-pressed')).toBe(false);
  });

  it('preserves explicit bookmark body paint without filling its folded corner', () => {
    const { container } = render(<BookmarkIcon filled fill="gold" fillOpacity={0.6} />);
    const [body, outline, fold] = container.querySelectorAll('path');

    expect(body.getAttribute('fill')).toBe('gold');
    expect(body.getAttribute('fill-opacity')).toBe('0.6');
    expect(outline.getAttribute('fill')).toBe('none');
    expect(fold.getAttribute('fill')).toBe('none');
  });
});
