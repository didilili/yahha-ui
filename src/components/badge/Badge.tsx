import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../internal/cx.js';
import styles from './badge.module.css';

export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  tone?: 'neutral' | 'accent' | 'success';
  /** Dashed stamp outline; success stamps also show a decorative tick. @default 'default' */
  appearance?: 'default' | 'stamp';
}

export function Badge({
  tone = 'neutral',
  appearance = 'default',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={cx(styles.badge, className)}
      data-tone={tone}
      data-appearance={appearance}
    >
      {children}
    </span>
  );
}
