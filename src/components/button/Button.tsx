import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../../internal/cx.js';
import styles from './button.module.css';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** Visual emphasis; defaults to primary. */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Button dimensions; defaults to md. */
  size?: 'sm' | 'md' | 'lg';
  /** Shows a spinner and disables activation without replacing the accessible label. */
  loading?: boolean;
  /** Decorative content before the label; hidden from assistive technology. */
  startIcon?: ReactNode;
  /** Decorative content after the label; hidden from assistive technology. */
  endIcon?: ReactNode;
}

/** Native button props, className, style and ref target the button; type defaults to button. */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  startIcon,
  endIcon,
  className,
  disabled,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || props['aria-busy']}
      className={cx(styles.button, className)}
      data-variant={variant}
      data-size={size}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : startIcon ? (
        <span className={styles.buttonIcon} aria-hidden="true">
          {startIcon}
        </span>
      ) : null}
      {children}
      {endIcon && (
        <span className={styles.buttonIcon} aria-hidden="true">
          {endIcon}
        </span>
      )}
    </button>
  );
}
