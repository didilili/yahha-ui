import { useState, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../../internal/cx.js';
import styles from './avatar.module.css';

const nameSegmenter =
  typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : undefined;

export interface AvatarProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  fallback?: ReactNode;
}
/** Noninteractive avatar. className, style and ref target span; name supplies its accessible label. */
export function Avatar({ name, src, size = 'md', fallback, className, ...props }: AvatarProps) {
  const source = src?.trim() || undefined;
  const authorName = name.trim();
  const [image, setImage] = useState<{
    source: string | undefined;
    status: 'loading' | 'loaded' | 'error';
  }>({ source, status: 'loading' });
  if (image.source !== source) {
    setImage({ source, status: 'loading' });
  }
  const status = image.source === source ? image.status : 'loading';
  const initials = [];
  for (const part of nameSegmenter?.segment(authorName) ?? authorName) {
    initials.push(typeof part === 'string' ? part : part.segment);
    if (initials.length === 2) break;
  }
  return (
    <span
      {...props}
      className={cx(styles.avatar, className)}
      data-size={size}
      role="img"
      aria-label={authorName || '匿名用户'}
    >
      {status !== 'loaded' && (
        <span aria-hidden="true" className={styles.fallback}>
          {fallback ?? (initials.join('') || '?')}
        </span>
      )}
      {source && status !== 'error' && (
        <img
          key={source}
          className={styles.image}
          data-loaded={status === 'loaded' ? '' : undefined}
          src={source}
          alt=""
          aria-hidden="true"
          onLoad={() =>
            setImage((current) =>
              current.source === source ? { source, status: 'loaded' } : current,
            )
          }
          onError={() =>
            setImage((current) =>
              current.source === source ? { source, status: 'error' } : current,
            )
          }
        />
      )}
    </span>
  );
}
