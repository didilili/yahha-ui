import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Badge, type BadgeProps } from './Badge.js';

afterEach(cleanup);

describe('Badge', () => {
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
