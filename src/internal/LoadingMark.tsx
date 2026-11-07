import { cx } from './cx.js';
import { BiscuitLoadingGlyph } from './BiscuitLoadingGlyph.js';
import styles from './loading-mark.module.css';

/** Decorative loading glyph; the owning component supplies the accessible status. */
export function LoadingMark({
  className,
  variant = 'dots',
}: {
  className?: string;
  variant?: 'dots' | 'biscuit';
}) {
  if (variant === 'biscuit') {
    return (
      <span
        className={cx(styles.mark, styles.biscuit, className)}
        data-loading-mark="biscuit"
        aria-hidden="true"
      >
        <BiscuitLoadingGlyph />
      </span>
    );
  }
  return (
    <span className={cx(styles.mark, className)} data-loading-mark="dots" aria-hidden="true">
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </span>
  );
}
