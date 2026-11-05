import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react';
import { cx } from '../../internal/cx.js';
import styles from './pagination.module.css';

/** Controlled pagination. Native attributes, className, style and ref target the nav. */
export interface PaginationProps extends Omit<ComponentPropsWithRef<'nav'>, 'children'> {
  /** One-based page number; normalized to the available range for display. */
  currentPage: number;
  /** Total pages. Non-finite or non-positive values render an empty disabled navigator. */
  totalPages: number;
  onPageChange: (page: number) => void;
  /**
   * Optional native page URLs. Ordinary primary clicks prevent navigation and call
   * onPageChange; that callback owns URL updates. Modified/non-primary clicks keep
   * native link behavior. Unavailable controls never request a URL.
   */
  getPageHref?: (page: number) => string;
  /** Adjacent page numbers on each side. Floored and clamped to 0–2. @default 1 */
  siblingCount?: number;
  classNames?: Partial<Record<'list' | 'button' | 'ellipsis', string>>;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  getPageHref,
  siblingCount = 1,
  className,
  classNames,
  'aria-label': label = '文章分页',
  ...props
}: PaginationProps) {
  const total = Number.isFinite(totalPages)
    ? Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, Math.floor(totalPages)))
    : 0;
  const page =
    total === 0
      ? 0
      : Math.min(total, Math.max(1, Number.isFinite(currentPage) ? Math.floor(currentPage) : 1));
  const siblings = Number.isFinite(siblingCount)
    ? Math.min(2, Math.max(0, Math.floor(siblingCount)))
    : 1;
  const visible = new Set<number>();
  if (total > 0) {
    visible.add(1);
    visible.add(total);
    for (
      let number = Math.max(1, page - siblings);
      number <= Math.min(total, page + siblings);
      number++
    )
      visible.add(number);
  }
  const pages = [...visible].sort((a, b) => a - b);
  const buttonClass = cx(styles.button, classNames?.button);
  const changePage = (next: number) => {
    if (next >= 1 && next <= total && next !== page) onPageChange(next);
  };

  const action = (
    next: number,
    label: string,
    children: ReactNode,
    disabled = false,
    current = false,
  ) => {
    const shared = {
      className: buttonClass,
      'aria-label': label,
      'aria-current': current ? ('page' as const) : undefined,
    };
    if (!getPageHref)
      return (
        <button {...shared} type="button" disabled={disabled} onClick={() => changePage(next)}>
          {children}
        </button>
      );
    if (disabled)
      return (
        <span {...shared} role="link" aria-disabled="true">
          {children}
        </span>
      );
    const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      event.preventDefault();
      changePage(next);
    };
    return (
      <a {...shared} href={getPageHref(next)} onClick={onClick}>
        {children}
      </a>
    );
  };
  return (
    <nav {...props} aria-label={label} className={cx(styles.root, className)}>
      <ul className={cx(styles.list, classNames?.list)}>
        <li>{action(page - 1, '上一页', '上一页', page <= 1)}</li>
        {pages.map((number, index) => (
          <li key={number} className={styles.pageGroup}>
            {index > 0 && number - pages[index - 1] > 1 && (
              <span aria-hidden="true" className={cx(styles.ellipsis, classNames?.ellipsis)}>
                …
              </span>
            )}
            {action(number, `第 ${number} 页`, number, false, number === page)}
          </li>
        ))}
        <li>{action(page + 1, '下一页', '下一页', total === 0 || page >= total)}</li>
      </ul>
    </nav>
  );
}
