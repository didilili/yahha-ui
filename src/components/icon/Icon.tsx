import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { cx } from '../../internal/cx.js';
import styles from './icon.module.css';

export type IconSize = 'sm' | 'md' | 'lg' | number;
export type IconTone =
  'inherit' | 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'info';

export interface IconProps extends Omit<ComponentPropsWithRef<'svg'>, 'width' | 'height'> {
  /** Standalone size: sm 16px, md 20px, lg 24px, or a finite positive number. Host controls own their icon size. */
  size?: IconSize;
  /** Optional semantic ink color; inherit leaves the native color and parent color intact. */
  tone?: IconTone;
}

const sizes = { sm: 16, md: 20, lg: 24 };

/** Native SVG attributes, style, className and ref target the root SVG. Unnamed icons are decorative. */
export function Icon({
  size = 'md',
  tone = 'inherit',
  viewBox = '0 0 24 24',
  fill = 'currentColor',
  className,
  style,
  role,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-hidden': ariaHidden,
  ...props
}: IconProps) {
  const dimension =
    typeof size === 'number'
      ? Number.isFinite(size) && size > 0
        ? size
        : sizes.md
      : (sizes[size] ?? sizes.md);
  const hasName = Boolean(ariaLabel?.trim() || ariaLabelledBy?.trim());
  const hidden = ariaHidden ?? (hasName ? undefined : true);
  const decorative = hidden === true || hidden === 'true';

  return (
    <svg
      {...props}
      viewBox={viewBox}
      fill={fill}
      className={cx(styles.icon, className)}
      style={{ '--icon-size': `${dimension}px`, ...style } as CSSProperties}
      data-tone={tone}
      role={decorative ? undefined : (role ?? (hasName ? 'img' : undefined))}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-hidden={hidden}
      focusable="false"
    />
  );
}
