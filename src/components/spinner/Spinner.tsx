import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../internal/cx.js';
import { LoadingMark } from '../../internal/LoadingMark.js';
import styles from './spinner.module.css';

export interface SpinnerProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}
export function Spinner({
  label = '加载中',
  size = 'md',
  className,
  role = 'status',
  ...props
}: SpinnerProps) {
  return (
    <span {...props} className={cx(styles.spinner, className)} data-size={size} role={role}>
      <LoadingMark />
      <span className={styles.srOnly}>{label}</span>
    </span>
  );
}
