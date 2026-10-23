import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../internal/cx.js';
import styles from './badge.module.css';

export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  tone?: 'neutral' | 'accent' | 'success';
}

export function Badge({ tone = 'neutral', className, children, ...props }: BadgeProps) {
  return (
    <span {...props} className={cx(styles.badge, className)} data-tone={tone}>
      {children}
    </span>
  );
}
