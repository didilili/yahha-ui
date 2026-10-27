import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination.js';

afterEach(cleanup);

describe('Pagination', () => {
  it('navigates controlled article pages and prevents moving outside boundaries', async () => {
    const user = userEvent.setup();
    function Example() {
      const [page, setPage] = useState(1);
      return <Pagination currentPage={page} totalPages={3} onPageChange={setPage} />;
    }
    render(<Example />);
    expect((screen.getByRole('button', { name: '上一页' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    expect(screen.getByRole('button', { name: '第 1 页' }).getAttribute('aria-current')).toBe(
      'page',
    );
    await user.click(screen.getByRole('button', { name: '下一页' }));
    expect(screen.getByRole('button', { name: '第 2 页' }).getAttribute('aria-current')).toBe(
      'page',
    );
    await user.click(screen.getByRole('button', { name: '第 3 页' }));
    expect((screen.getByRole('button', { name: '下一页' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it('bounds the page list for huge totals and supports native nav attributes/ref', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Pagination
        ref={ref}
        aria-label="归档页"
        currentPage={500}
        totalPages={1000000}
        siblingCount={99}
        onPageChange={() => {}}
        data-section="archive"
        style={{ marginTop: 8 }}
      />,
    );
    const nav = screen.getByRole('navigation', { name: '归档页' });
    expect(ref.current).toBe(nav);
    expect(nav.getAttribute('data-section')).toBe('archive');
    expect(nav.style.marginTop).toBe('8px');
    expect(screen.getAllByRole('button').length).toBeLessThanOrEqual(9);
    expect(screen.getByRole('button', { name: '第 1 页' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '第 1000000 页' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '第 500 页' }).getAttribute('aria-current')).toBe(
      'page',
    );
  });

  it('handles empty and invalid input without emitting normalization callbacks', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const { rerender } = render(
      <Pagination currentPage={NaN} totalPages={-1} onPageChange={onPageChange} />,
    );
    expect(
      screen.getAllByRole('button').every((button) => (button as HTMLButtonElement).disabled),
    ).toBe(true);
    expect(onPageChange).not.toHaveBeenCalled();
    rerender(<Pagination currentPage={100} totalPages={3.9} onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: '第 3 页' }).getAttribute('aria-current')).toBe(
      'page',
    );
    await user.click(screen.getByRole('button', { name: '上一页' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
    await user.click(screen.getByRole('button', { name: '第 3 页' }));
    expect(onPageChange).toHaveBeenCalledTimes(1);
  });
});
