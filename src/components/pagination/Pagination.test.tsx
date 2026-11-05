import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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

  it('provides real URLs while ordinary clicks use one controlled callback and retain nav props', () => {
    const onPageChange = vi.fn();
    const getPageHref = vi.fn((page: number) => `#/archive?page=${page}`);
    const ref = createRef<HTMLElement>();
    render(
      <Pagination
        ref={ref}
        aria-label="链接归档"
        currentPage={2}
        totalPages={3}
        onPageChange={onPageChange}
        getPageHref={getPageHref}
        classNames={{ button: 'archive-control' }}
        data-archive="reading"
        style={{ marginTop: 12 }}
      />,
    );
    const nav = screen.getByRole('navigation', { name: '链接归档' });
    expect(ref.current).toBe(nav);
    expect(nav.getAttribute('data-archive')).toBe('reading');
    expect(nav.style.marginTop).toBe('12px');
    expect(nav.hasAttribute('getPageHref')).toBe(false);
    expect(
      screen.getAllByRole('link').every((link) => link.classList.contains('archive-control')),
    ).toBe(true);
    const third = screen.getByRole('link', { name: '第 3 页' });
    expect(third.getAttribute('href')).toBe('#/archive?page=3');
    const click = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    fireEvent(third, click);
    expect(click.defaultPrevented).toBe(true);
    expect(onPageChange).toHaveBeenCalledExactlyOnceWith(3);
    const current = screen.getByRole('link', { name: '第 2 页' });
    expect(current.getAttribute('aria-current')).toBe('page');
    const samePage = new MouseEvent('click', { bubbles: true, cancelable: true });
    fireEvent(current, samePage);
    expect(samePage.defaultPrevented).toBe(true);
    expect(onPageChange).toHaveBeenCalledTimes(1);
  });

  it.each([
    { current: 1, total: 0, labels: ['上一页', '下一页'] },
    { current: 1, total: 1, labels: ['上一页', '下一页'] },
    { current: 1, total: 3, labels: ['上一页'] },
    { current: 3, total: 3, labels: ['下一页'] },
  ])(
    'keeps unavailable links inert for $current/$total and never requests invalid URLs',
    ({ current, total, labels }) => {
      const onPageChange = vi.fn();
      const getPageHref = vi.fn((page: number) => `#/archive?page=${page}`);
      render(
        <Pagination
          currentPage={current}
          totalPages={total}
          onPageChange={onPageChange}
          getPageHref={getPageHref}
          classNames={{ button: 'archive-control' }}
        />,
      );
      for (const label of labels) {
        const boundary = screen.getByRole('link', { name: label });
        expect(boundary.tagName).toBe('SPAN');
        expect(boundary.getAttribute('aria-disabled')).toBe('true');
        expect(boundary.hasAttribute('href')).toBe(false);
        expect(boundary.tabIndex).toBe(-1);
        expect(boundary.classList.contains('archive-control')).toBe(true);
        fireEvent.click(boundary);
      }
      expect(onPageChange).not.toHaveBeenCalled();
      expect(getPageHref.mock.calls.every(([page]) => page >= 1 && page <= total)).toBe(true);
      if (total === 0) expect(getPageHref).not.toHaveBeenCalled();
    },
  );

  it.each([
    { name: 'Control', flags: { ctrlKey: true } },
    { name: 'Meta', flags: { metaKey: true } },
    { name: 'Shift', flags: { shiftKey: true } },
    { name: 'Alt', flags: { altKey: true } },
    { name: 'non-primary', flags: { button: 1 } },
  ])('does not consume a $name click or call the controlled callback', ({ flags }) => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={2}
        onPageChange={onPageChange}
        getPageHref={(page) => `#/archive?page=${page}`}
      />,
    );
    const link = screen.getByRole('link', { name: '第 2 页' });
    let preventedByComponent: boolean | undefined;
    document.addEventListener(
      'click',
      (event) => {
        preventedByComponent = event.defaultPrevented;
        // Observe the component first, then stop jsdom's unsupported navigation.
        event.preventDefault();
      },
      { once: true },
    );
    fireEvent(
      link,
      new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...flags }),
    );
    expect(preventedByComponent).toBe(false);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('respects a click already canceled by the caller in capture', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={2}
        onPageChange={onPageChange}
        getPageHref={(page) => `#/archive?page=${page}`}
        onClickCapture={(event) => event.preventDefault()}
      />,
    );
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    fireEvent(screen.getByRole('link', { name: '第 2 页' }), event);
    expect(event.defaultPrevented).toBe(true);
    expect(onPageChange).not.toHaveBeenCalled();
  });
});
