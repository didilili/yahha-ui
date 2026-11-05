import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../internal/cx.js';
import styles from './typography.module.css';

export interface TextProps extends ComponentPropsWithRef<'p'> {
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'muted';
}
/** A paragraph. Native attributes, className, style and ref target p. */
export function Text({ size = 'md', tone = 'default', className, ...props }: TextProps) {
  return <p {...props} className={cx(styles.text, className)} data-size={size} data-tone={tone} />;
}

export interface HeadingProps extends ComponentPropsWithRef<'h2'> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}
/** Heading level is semantic and determines the rendered native element. */
export function Heading({ level = 2, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  return <Tag {...props} className={cx(styles.heading, className)} />;
}

export interface LinkProps extends ComponentPropsWithRef<'a'> {
  href: string;
  external?: boolean;
}
/** Native anchor; external opens a new tab and adds safe rel tokens. */
export function Link({ external = false, target, rel, className, children, ...props }: LinkProps) {
  const resolvedTarget = target ?? (external ? '_blank' : undefined);
  const resolvedRel =
    resolvedTarget === '_blank'
      ? [...new Set([...(rel?.split(/\s+/).filter(Boolean) ?? []), 'noopener', 'noreferrer'])].join(
          ' ',
        )
      : rel;
  return (
    <a {...props} target={resolvedTarget} rel={resolvedRel} className={cx(styles.link, className)}>
      {children}
    </a>
  );
}

/** Native hr attributes without content, because hr is a void element. */
export interface DividerProps extends Omit<
  ComponentPropsWithRef<'hr'>,
  'children' | 'dangerouslySetInnerHTML'
> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}
export function Divider({
  orientation = 'horizontal',
  decorative = false,
  className,
  ...props
}: DividerProps) {
  return (
    <hr
      {...props}
      role={decorative ? 'presentation' : props.role}
      aria-hidden={decorative || props['aria-hidden']}
      aria-orientation={decorative ? undefined : orientation}
      data-orientation={orientation}
      className={cx(styles.divider, className)}
    />
  );
}
