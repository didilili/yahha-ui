import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../../internal/cx.js';
import { LoadingMark } from '../../internal/LoadingMark.js';
import styles from './button.module.css';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** Visual emphasis; defaults to primary. */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Marks a destructive action visually; does not add confirmation or deletion behavior. @default false */
  destructive?: boolean;
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
  destructive = false,
  loading = false,
  startIcon,
  endIcon,
  className,
  disabled,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const hasStartIcon = startIcon != null && typeof startIcon !== 'boolean' && startIcon !== '';

  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || props['aria-busy']}
      className={cx(styles.button, className)}
      data-variant={variant}
      data-size={size}
      data-destructive={destructive || undefined}
    >
      {hasStartIcon ? (
        <span className={styles.buttonIcon} data-loading={loading || undefined} aria-hidden="true">
          <span className={styles.startIcon} aria-hidden="true">
            {startIcon}
          </span>
          {loading && <LoadingMark className={styles.inlineLoading} />}
        </span>
      ) : loading ? (
        <LoadingMark className={styles.loadingWithoutIcon} />
      ) : null}
      {children}
      {endIcon != null && typeof endIcon !== 'boolean' && endIcon !== '' && (
        <span className={styles.buttonIcon} aria-hidden="true">
          {endIcon}
        </span>
      )}
    </button>
  );
}
