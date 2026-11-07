import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Badge, type BadgeProps } from './Badge.js';

afterEach(cleanup);

describe('Badge', () => {
  it.each(['neutral', 'accent', 'success'] as const)(
    'keeps %s tone and readable content when stamp appearance is toggled',
    (tone) => {
      const ref = createRef<HTMLSpanElement>();
      const { rerender } = render(
        <Badge tone={tone} ref={ref}>
          已整理
        </Badge>,
      );
      const badge = screen.getByText('已整理');
      expect(badge.getAttribute('data-appearance')).toBe('default');
      rerender(
        <Badge tone={tone} appearance="stamp" ref={ref}>
          已整理
        </Badge>,
      );
      expect(ref.current).toBe(badge);
      expect(badge.textContent).toBe('已整理');
      expect(badge.getAttribute('data-tone')).toBe(tone);
      expect(badge.getAttribute('data-appearance')).toBe('stamp');
      expect(badge.hasAttribute('appearance')).toBe(false);
      expect(badge.hasAttribute('role')).toBe(false);
    },
  );

  it('accepts native span props and ref', () => {
    const ref = createRef<HTMLSpanElement>();
    const props: BadgeProps = { ref, title: '收藏状态', style: { color: 'red' } };
    render(<Badge {...props}>已收藏</Badge>);
    const badge = screen.getByText('已收藏');
    expect(ref.current).toBe(badge);
    expect(badge.title).toBe('收藏状态');
    expect(badge.style.color).toBe('red');
  });
});
