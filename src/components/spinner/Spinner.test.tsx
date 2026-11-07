import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Spinner, type SpinnerProps } from './Spinner.js';

afterEach(cleanup);

describe('Spinner', () => {
  it('keeps the default waiting mark decorative and the status text available', () => {
    render(<Spinner label="正在加载文章" />);
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('正在加载文章');
    expect(status.querySelector('[data-loading-mark="biscuit"]')).toBeNull();
    expect(status.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
    expect(screen.queryByRole('img')).toBeNull();
    expect(status.getAttribute('data-size')).toBe('md');
  });

  it.each(['sm', 'md', 'lg'] as const)(
    'opts into the biscuit at %s without changing its native span, ref or waiting text',
    (size) => {
      const ref = createRef<HTMLSpanElement>();
      const props: SpinnerProps = { variant: 'biscuit', size, ref, title: '等待文章' };
      render(<Spinner {...props} label="正在加载文章" className="custom-wait" />);
      const status = screen.getByRole('status');
      expect(status.tagName).toBe('SPAN');
      expect(ref.current).toBe(status);
      expect(status.title).toBe('等待文章');
      expect(status.classList.contains('custom-wait')).toBe(true);
      expect(status.hasAttribute('variant')).toBe(false);
      expect(status.getAttribute('data-size')).toBe(size);
      const biscuit = status.querySelector('[data-loading-mark="biscuit"]');
      expect(biscuit).not.toBeNull();
      expect(biscuit?.getAttribute('aria-hidden')).toBe('true');
      expect(status.textContent).toBe('正在加载文章');
      expect(screen.queryByRole('img')).toBeNull();
    },
  );

  it('can change its mark while remaining decorative inside a named outer status', () => {
    const view = (variant: SpinnerProps['variant']) => (
      <div role="status" aria-label="文章等待状态">
        <Spinner variant={variant} role="presentation" aria-hidden="true" />
        正在加载文章…
      </div>
    );
    const { rerender } = render(view('dots'));
    const status = screen.getByRole('status', { name: '文章等待状态' });
    const spinner = screen.getByRole('presentation', { hidden: true });
    rerender(view('biscuit'));
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(spinner.getAttribute('aria-hidden')).toBe('true');
    expect(spinner.querySelector('[data-loading-mark="biscuit"]')).not.toBeNull();
    expect(status.textContent).toContain('正在加载文章…');
  });
});
