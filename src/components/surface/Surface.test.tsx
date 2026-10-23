import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Surface, type SurfaceProps } from './index.js';

afterEach(cleanup);

describe('Surface', () => {
  it('exports props that accept a native div ref and attributes', () => {
    const ref = createRef<HTMLDivElement>();
    const props: SurfaceProps = { ref, title: '内容区域', style: { color: 'red' } };
    render(<Surface {...props}>内容</Surface>);
    const surface = screen.getByText('内容');
    expect(ref.current).toBe(surface);
    expect(surface.title).toBe('内容区域');
    expect(surface.style.color).toBe('red');
  });
});
