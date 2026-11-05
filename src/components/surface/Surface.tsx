import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../internal/cx.js';
import styles from './surface.module.css';

export interface SurfaceProps extends ComponentPropsWithRef<'div'> {
  /** Visual style only; note does not assign a semantic role. @default 'paper' */
  variant?: 'paper' | 'note';
}

export function Surface({ variant = 'paper', className, children, ...props }: SurfaceProps) {
  return (
    <div {...props} className={cx(styles.surface, className)} data-variant={variant}>
      {children}
    </div>
  );
}
