import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { cx } from '../../internal/cx.js';
import styles from './skeleton.module.css';

export interface SkeletonProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  variant?: 'text' | 'rect' | 'circle';
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
}
/** Decorative placeholder; put aria-busy on the content region being loaded. */
export function Skeleton({
  variant = 'text',
  width,
  height,
  style,
  className,
  ...props
}: SkeletonProps) {
  return (
    <span
      {...props}
      className={cx(styles.skeleton, className)}
      data-variant={variant}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}
