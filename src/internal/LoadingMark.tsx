import { cx } from './cx.js';
import styles from './loading-mark.module.css';

/** Decorative loading glyph; the owning component supplies the accessible status. */
export function LoadingMark({ className }: { className?: string }) {
  return (
    <span className={cx(styles.mark, className)} aria-hidden="true">
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </span>
  );
}
