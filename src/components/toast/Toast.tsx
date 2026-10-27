import type { ReactNode } from 'react';
import { IconButton } from '../button/IconButton.js';
import { CloseMark } from '../../internal/CloseMark.js';
import { cx } from '../../internal/cx.js';
import styles from './toast.module.css';

export interface ToastProps {
  /** Visibility is controlled by the caller; no timer or queue is created. */
  open: boolean;
  /** Called by the close button; update open in the caller to dismiss. */
  onClose: () => void;
  /** Accessible status content announced politely. */
  title: ReactNode;
  description?: ReactNode;
  /** Visual feedback type; defaults to success and retains role=status. */
  tone?: 'success' | 'info' | 'error';
  action?: ReactNode;
  /** Applied to the status container; positioning is controlled by the caller. */
  className?: string;
}

function StatusMark({ tone }: { tone: NonNullable<ToastProps['tone']> }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {tone === 'success' ? (
        <path d="m6 12 4 4 8-9" />
      ) : tone === 'error' ? (
        <path d="m7 7 10 10m0-10L7 17" />
      ) : (
        <>
          <path d="M12 11v6" />
          <path d="M12 7h.01" />
        </>
      )}
    </svg>
  );
}

export function Toast({
  open,
  onClose,
  title,
  description,
  tone = 'success',
  action,
  className,
}: ToastProps) {
  if (!open) return null;
  return (
    <div role="status" aria-atomic="true" className={cx(styles.toast, className)} data-tone={tone}>
      <span className={styles.toastIcon}>
        <StatusMark tone={tone} />
      </span>
      <div className={styles.toastContent}>
        <p className={styles.toastTitle}>{title}</p>
        {description != null && typeof description !== 'boolean' && description !== '' && (
          <p className={styles.toastDescription}>{description}</p>
        )}
        {action != null && typeof action !== 'boolean' && action !== '' && (
          <div className={styles.toastAction}>{action}</div>
        )}
      </div>
      <IconButton
        aria-label="关闭提示"
        variant="ghost"
        size="sm"
        onClick={onClose}
        className={styles.toastClose}
      >
        <CloseMark />
      </IconButton>
    </div>
  );
}
