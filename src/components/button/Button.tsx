import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../../internal/cx.js';
import { LoadingMark } from '../../internal/LoadingMark.js';
import styles from './button.module.css';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** Visual emphasis; defaults to primary. */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Opt-in soft silhouette and short highlight; defaults to the existing appearance. */
  appearance?: 'default' | 'soft';
  /** Marks a destructive action visually; does not add confirmation or deletion behavior. @default false */
  destructive?: boolean;
  /** Button dimensions; defaults to md. */
  size?: 'sm' | 'md' | 'lg';
  /** Shows a loading glyph and disables activation, preserving the label and any existing leading icon slot. Without startIcon, adds an icon slot and gap. */
  loading?: boolean;
  /** Loading glyph; biscuit is an opt-in decoration independent of appearance. @default dots */
  loadingVariant?: 'dots' | 'biscuit';
  /** Decorative content before the label; hidden from assistive technology. */
  startIcon?: ReactNode;
  /** Decorative content after the label; hidden from assistive technology. */
  endIcon?: ReactNode;
}

/** Native button props, className, style and ref target the button; type defaults to button. */
export function Button({
  variant = 'primary',
  appearance = 'default',
  size = 'md',
  destructive = false,
  loading = false,
  loadingVariant = 'dots',
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
      data-appearance={appearance === 'soft' ? appearance : undefined}
      data-size={size}
      data-destructive={destructive || undefined}
    >
      {hasStartIcon ? (
        <span className={styles.buttonIcon} data-loading={loading || undefined} aria-hidden="true">
          <span className={styles.startIcon} aria-hidden="true">
            {startIcon}
          </span>
          {loading && <LoadingMark variant={loadingVariant} className={styles.inlineLoading} />}
        </span>
      ) : loading ? (
        <LoadingMark variant={loadingVariant} className={styles.loadingWithoutIcon} />
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
