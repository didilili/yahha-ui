import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../internal/cx.js';
import styles from './surface.module.css';

export interface SurfaceProps extends ComponentPropsWithRef<'div'> {}

export function Surface({ className, children, ...props }: SurfaceProps) {
  return (
    <div {...props} className={cx(styles.surface, className)}>
      {children}
    </div>
  );
}
