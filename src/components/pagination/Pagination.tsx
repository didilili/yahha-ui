import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../internal/cx.js';
import styles from './pagination.module.css';

/** Controlled pagination. Native attributes, className, style and ref target the nav. */
export interface PaginationProps extends Omit<ComponentPropsWithRef<'nav'>, 'children'> {
  /** One-based page number; normalized to the available range for display. */
  currentPage: number;
  /** Total pages. Non-finite or non-positive values render an empty disabled navigator. */
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Adjacent page numbers on each side. Floored and clamped to 0–2. @default 1 */
  siblingCount?: number;
  classNames?: Partial<Record<'list' | 'button' | 'ellipsis', string>>;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
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

  return (
    <nav {...props} aria-label={label} className={cx(styles.root, className)}>
      <ul className={cx(styles.list, classNames?.list)}>
        <li>
          <button
            type="button"
            className={buttonClass}
            aria-label="上一页"
            disabled={page <= 1}
            onClick={() => changePage(page - 1)}
          >
            上一页
          </button>
        </li>
        {pages.map((number, index) => (
          <li key={number} className={styles.pageGroup}>
            {index > 0 && number - pages[index - 1] > 1 && (
              <span aria-hidden="true" className={cx(styles.ellipsis, classNames?.ellipsis)}>
                …
              </span>
            )}
            <button
              type="button"
              className={buttonClass}
              aria-label={`第 ${number} 页`}
              aria-current={number === page ? 'page' : undefined}
              onClick={() => changePage(number)}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            className={buttonClass}
            aria-label="下一页"
            disabled={total === 0 || page >= total}
            onClick={() => changePage(page + 1)}
          >
            下一页
          </button>
        </li>
      </ul>
    </nav>
  );
}
