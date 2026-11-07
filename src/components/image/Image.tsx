import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cx } from '../../internal/cx.js';
import styles from './image.module.css';

export interface ImageProps extends Omit<ComponentPropsWithRef<'img'>, 'alt'> {
  alt: string;
  aspectRatio?: CSSProperties['aspectRatio'];
  fallback?: ReactNode;
  /** Root frame class; native style and ref target img. */
  className?: string;
  classNames?: { image?: string; fallback?: string };
}
export function Image({
  alt,
  src,
  srcSet,
  aspectRatio,
  fallback = '图片暂时无法显示',
  className,
  classNames,
  onLoad,
  onError,
  loading = 'lazy',
  hidden,
  ...props
}: ImageProps) {
  const source = JSON.stringify([src, srcSet]);
  const [image, setImage] = useState({ source, status: 'loading' });
  if (image.source !== source) {
    setImage({ source, status: 'loading' });
  }
  const status =
    !src?.trim() && !srcSet?.trim() ? 'error' : image.source === source ? image.status : 'loading';
  const failed = status === 'error';
  const ratio = String(aspectRatio ?? '')
    .trim()
    .toLowerCase();
  const hasFixedRatio = Boolean(aspectRatio) && ratio !== '' && ratio !== 'auto';
  const hasAlternativeText = alt.trim().length > 0;
  const fallbackRef = useRef<HTMLDivElement>(null);
  const fallbackContentRef = useRef<HTMLSpanElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const container = fallbackRef.current;
    const content = fallbackContentRef.current;
    if (!failed || !hasFixedRatio || !container || !content) {
      setOverflowing(false);
      return;
    }
    const measure = () => setOverflowing(container.scrollHeight > container.clientHeight + 1);
    measure();
    if (typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver(measure);
      observer.observe(container);
      observer.observe(content);
      return () => observer.disconnect();
    }
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [failed, hasFixedRatio, aspectRatio, source, fallback]);

  return (
    <div
      className={cx(styles.frame, className)}
      data-status={status}
      data-framed={hasFixedRatio ? '' : undefined}
      style={{ aspectRatio }}
      hidden={hidden}
      aria-hidden={props['aria-hidden']}
    >
      <img
        {...props}
        key={source}
        className={cx(styles.image, classNames?.image)}
        src={src?.trim() ? src : undefined}
        srcSet={srcSet?.trim() ? srcSet : undefined}
        alt={alt}
        loading={loading}
        hidden={failed}
        onLoad={(event) => {
          setImage({ source, status: 'loaded' });
          onLoad?.(event);
        }}
        onError={(event) => {
          setImage({ source, status: 'error' });
          onError?.(event);
        }}
      />
      {failed && (
        <div
          ref={fallbackRef}
          className={cx(styles.fallback, classNames?.fallback)}
          role={hasAlternativeText ? 'img' : undefined}
          aria-label={hasAlternativeText ? alt : undefined}
          aria-hidden={!hasAlternativeText || undefined}
          tabIndex={
            overflowing &&
            hasAlternativeText &&
            !hidden &&
            props['aria-hidden'] !== true &&
            props['aria-hidden'] !== 'true'
              ? 0
              : -1
          }
        >
          <span ref={fallbackContentRef} className={styles.fallbackContent} aria-hidden="true">
            <svg width="32" height="28" viewBox="0 0 32 28" fill="none">
              <path
                d="M5 3.5h21c2 0 3 1.5 3 3.5v15c0 2-1.5 3-3.5 3H6c-2 0-3-1.5-3-3.5V7c0-2 0-3.5 2-3.5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m4 21 8-8 6 6 4-4 7 7M21 9h.01"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {fallback}
          </span>
        </div>
      )}
    </div>
  );
}
