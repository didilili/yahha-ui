import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../../internal/cx.js';
import styles from './alert.module.css';

export interface AlertProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  title?: ReactNode;
  tone?: 'info' | 'success' | 'warning' | 'error';
}
/** Persistent note by default. Set role="alert" explicitly for urgent dynamic feedback. */
export function Alert({
  title,
  tone = 'info',
  children,
  role = 'note',
  className,
  ...props
}: AlertProps) {
  return (
    <div {...props} role={role} className={cx(styles.alert, className)} data-tone={tone}>
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {tone === 'warning' ? (
          <>
            <path d="M10.5 4.5a1.7 1.7 0 0 1 3 0l7 13A1.7 1.7 0 0 1 19 20H5a1.7 1.7 0 0 1-1.5-2.5Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </>
        ) : (
          <>
            <circle cx="12" cy="12" r="9" />
            {tone === 'success' ? (
              <path d="m7.5 12 3 3 6-6" />
            ) : tone === 'error' ? (
              <path d="m9 9 6 6m0-6-6 6" />
            ) : (
              <>
                <path d="M12 11v6" />
                <path d="M12 7h.01" />
              </>
            )}
          </>
        )}
      </svg>
      <div className={styles.body}>
        {title != null && title !== '' && typeof title !== 'boolean' && (
          <p className={styles.title}>{title}</p>
        )}
        {children != null && children !== '' && typeof children !== 'boolean' && (
          <div className={styles.content}>{children}</div>
        )}
      </div>
    </div>
  );
}
