import type { ReactNode } from 'react';
import { cx } from '../../internal/cx.js';
import styles from './empty-state.module.css';

export interface EmptyStateProps {
  /** Heading content, rendered as h3. */
  title: ReactNode;
  /** Supporting content, rendered inside a paragraph. */
  description?: ReactNode;
  /** Decorative artwork; the entire illustration slot is hidden from assistive technology. */
  illustration?: ReactNode;
  /** Caller-provided action, such as a Button. */
  action?: ReactNode;
  /** Applied to the outer container; no application state or persistence is managed. */
  className?: string;
}

export function EmptyState({
  title,
  description,
  illustration,
  action,
  className,
}: EmptyStateProps) {
  const hasIllustration =
    illustration != null && typeof illustration !== 'boolean' && illustration !== '';
  return (
    <div className={cx(styles.emptyState, className)}>
      {hasIllustration ? (
        <div className={styles.emptyIllustration} aria-hidden="true">
          {illustration}
        </div>
      ) : (
        <span className={styles.emptyMotif} aria-hidden="true" />
      )}
      <h3 className={styles.emptyTitle}>{title}</h3>
      {description != null && typeof description !== 'boolean' && description !== '' && (
        <p className={styles.emptyDescription}>{description}</p>
      )}
      {action != null && typeof action !== 'boolean' && action !== '' && (
        <div className={styles.emptyAction}>{action}</div>
      )}
    </div>
  );
}
