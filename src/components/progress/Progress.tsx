import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { cx } from '../../internal/cx.js';
import styles from './progress.module.css';

export interface ProgressProps extends Omit<
  ComponentPropsWithRef<'div'>,
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'role'
  | 'aria-valuemin'
  | 'aria-valuemax'
  | 'aria-valuenow'
  | 'aria-valuetext'
> {
  /** Visible task label and default accessible name. */
  label: string;
  /** Controlled task progress. Missing, null or non-finite values are indeterminate. */
  value?: number | null;
  /** Positive finite maximum. Invalid values fall back to 100. @default 100 */
  max?: number;
  /** The bookmark follows known progress and gains a check only at completion. @default 'default' */
  appearance?: 'default' | 'bookmark';
  /** Overrides both visible value text and aria-valuetext without changing progress. */
  valueText?: string;
}

function BookmarkMark({ complete }: { complete: boolean }) {
  return (
    <svg
      className={styles.marker}
      viewBox="0 0 24 28"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path className={styles.paper} d="M4 2.5h11.5l5 5v18l-4-2.25L12 25.5l-4-2.25-4 2.25Z" />
      <path className={styles.fold} d="M15.5 2.5v5h5Z" />
      {complete ? <path d="m8 15 3 3 5.5-7" /> : <path d="M8 12h8m-8 4h5.5" />}
    </svg>
  );
}

/** Read-only task progress. Timing, requests and completion announcements belong to the caller. */
export function Progress({
  label,
  value,
  max = 100,
  appearance = 'default',
  valueText,
  className,
  style,
  'aria-label': ariaLabel,
  ...props
}: ProgressProps) {
  const maximum = Number.isFinite(max) && max > 0 ? max : 100;
  const known = typeof value === 'number' && Number.isFinite(value);
  const current = known ? Math.min(maximum, Math.max(0, value)) : undefined;
  const complete = current === maximum;
  const fraction = current === undefined ? 0 : (current / maximum) * 100;
  const percentage = complete ? 100 : Math.min(99, Math.floor(fraction + Number.EPSILON * 100));
  const text = valueText ?? (known ? `${percentage}%` : '计算中');
  const progressStyle = {
    ...style,
    '--progress-value': `${fraction}%`,
  } as CSSProperties;

  return (
    <div
      {...props}
      className={cx(styles.progress, className)}
      style={progressStyle}
      role="progressbar"
      aria-label={ariaLabel ?? label}
      aria-valuemin={0}
      aria-valuemax={maximum}
      aria-valuenow={current}
      aria-valuetext={valueText ?? (known ? undefined : text)}
      data-appearance={appearance}
      data-state={known ? (complete ? 'complete' : 'loading') : 'indeterminate'}
    >
      <div className={styles.header} aria-hidden="true">
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{text}</span>
      </div>
      <div className={styles.meter} aria-hidden="true">
        <div className={styles.track}>
          <span className={styles.fill} />
        </div>
        {appearance === 'bookmark' && known && <BookmarkMark complete={complete} />}
      </div>
    </div>
  );
}
