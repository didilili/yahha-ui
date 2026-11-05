import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Button } from '../button/Button.js';
import { IconButton } from '../button/IconButton.js';
import { Icon } from './Icon.js';

afterEach(cleanup);

describe('Icon', () => {
  it('renders a decorative, unfocusable SVG by default without prescribing a stroke style', () => {
    const { container } = render(
      <Icon focusable="true">
        <path d="M2 2h20v20H2Z" />
      </Icon>,
    );
    const svg = container.firstElementChild!;
    expect(svg.tagName).toBe('svg');
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg.getAttribute('fill')).toBe('currentColor');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('focusable')).toBe('false');
    expect(svg.hasAttribute('role')).toBe(false);
    expect(svg.hasAttribute('stroke')).toBe(false);
    expect(svg.hasAttribute('stroke-width')).toBe(false);
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('exposes an image named by aria-label', () => {
    render(<Icon aria-label="收藏" />);
    const svg = screen.getByRole('img', { name: '收藏' });
    expect(svg.getAttribute('aria-hidden')).not.toBe('true');
    expect(svg.getAttribute('focusable')).toBe('false');
  });

  it('exposes an image named by aria-labelledby', () => {
    render(
      <>
        <span id="status-label">保存成功</span>
        <Icon aria-labelledby="status-label" />
      </>,
    );
    expect(screen.getByRole('img', { name: '保存成功' })).toBeTruthy();
  });

  it.each([
    { 'aria-label': '' },
    { 'aria-label': '   ' },
    { 'aria-labelledby': '' },
    { 'aria-labelledby': '   ' },
  ])('does not expose an unnamed image for blank naming attributes: %j', (naming) => {
    const { container } = render(<Icon {...naming} />);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
    expect(container.firstElementChild?.hasAttribute('role')).toBe(false);
    expect(screen.queryByRole('img')).toBeNull();
  });

  it.each([true, 'true'] as const)(
    'keeps explicitly decorative icons hidden even with a name and image role: %s',
    (hidden) => {
      const { container } = render(<Icon aria-label="收藏" aria-hidden={hidden} role="img" />);
      const svg = container.firstElementChild!;
      expect(svg.getAttribute('aria-hidden')).toBe('true');
      expect(svg.hasAttribute('role')).toBe(false);
      expect(screen.queryByRole('img')).toBeNull();
    },
  );

  it('preserves an explicit native role and visibility', () => {
    const { container } = render(<Icon role="presentation" aria-hidden={false} />);
    expect(container.firstElementChild?.getAttribute('role')).toBe('presentation');
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('false');
  });

  it('forwards the ref, native attributes and paint to the original SVG without nesting', () => {
    const ref = createRef<SVGSVGElement>();
    const { container } = render(
      <Icon
        ref={ref}
        id="wide-icon"
        className="custom-icon"
        viewBox="-2 0 40 16"
        preserveAspectRatio="xMinYMid meet"
        color="navy"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="square"
        style={{ opacity: 0.7, color: 'rebeccapurple' }}
      >
        <path d="M0 8h36" fill="gold" />
      </Icon>,
    );
    const svg = container.firstElementChild!;
    expect(ref.current).toBe(svg);
    expect(svg.id).toBe('wide-icon');
    expect(svg.classList.contains('custom-icon')).toBe(true);
    expect(svg.getAttribute('viewBox')).toBe('-2 0 40 16');
    expect(svg.getAttribute('preserveAspectRatio')).toBe('xMinYMid meet');
    expect(svg.getAttribute('color')).toBe('navy');
    expect(svg.getAttribute('fill')).toBe('none');
    expect(svg.getAttribute('stroke')).toBe('currentColor');
    expect(svg.getAttribute('stroke-width')).toBe('1.5');
    expect(svg.getAttribute('stroke-linecap')).toBe('square');
    expect(ref.current?.style.opacity).toBe('0.7');
    expect(ref.current?.style.color).toBe('rebeccapurple');
    expect(svg.querySelector('path')?.getAttribute('fill')).toBe('gold');
    expect(svg.querySelector('svg')).toBeNull();
  });

  it.each([
    [undefined, '20px'],
    ['sm', '16px'],
    ['md', '20px'],
    ['lg', '24px'],
    [30.5, '30.5px'],
    [0, '20px'],
    [-8, '20px'],
    [Number.NaN, '20px'],
    [Number.POSITIVE_INFINITY, '20px'],
    [Number.NEGATIVE_INFINITY, '20px'],
  ] as const)(
    'resolves size %s through a CSS size hint without locking dimensions',
    (size, hint) => {
      const ref = createRef<SVGSVGElement>();
      render(<Icon ref={ref} size={size} />);
      expect(ref.current?.style.getPropertyValue('--icon-size')).toBe(hint);
      expect(ref.current?.style.width).toBe('');
      expect(ref.current?.style.height).toBe('');
      expect(ref.current?.hasAttribute('width')).toBe(false);
      expect(ref.current?.hasAttribute('height')).toBe(false);
    },
  );

  it('fits existing button SVG slots while the button retains its accessible name', () => {
    const ref = createRef<SVGSVGElement>();
    render(
      <>
        <IconButton aria-label="收藏手记">
          <Icon ref={ref} size={80} aria-label="书签" />
        </IconButton>
        <Button startIcon={<Icon aria-label="下载" />}>保存手记</Button>
      </>,
    );
    const iconButton = screen.getByRole('button', { name: '收藏手记' });
    expect(ref.current?.parentElement).toBe(iconButton);
    expect(ref.current?.style.width).toBe('');
    expect(ref.current?.style.height).toBe('');
    expect(screen.getByRole('button', { name: '保存手记' })).toBeTruthy();
    expect(screen.queryByRole('img', { name: '下载' })).toBeNull();
  });
});
