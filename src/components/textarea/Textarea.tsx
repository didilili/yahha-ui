import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../../internal/cx.js';
import styles from './textarea.module.css';

/** Native attributes, style and ref target the textarea; className targets the field. */
export interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  classNames?: { label?: string; textarea?: string; hint?: string; error?: string };
}

export function Textarea({
  label,
  hint,
  error,
  id,
  className,
  classNames,
  rows = 4,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasHint = hint != null && hint !== '' && typeof hint !== 'boolean';
  const hasError = error != null && error !== '' && typeof error !== 'boolean';
  const hintId = hasHint ? `${inputId}-hint` : undefined;
  const errorId = hasError ? `${inputId}-error` : undefined;
  const describedBy =
    [props['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cx(styles.field, className)}>
      <label className={cx(styles.label, classNames?.label)} htmlFor={inputId}>
        {label}
      </label>
      <textarea
        {...props}
        id={inputId}
        rows={rows}
        className={cx(styles.textarea, classNames?.textarea)}
        aria-invalid={hasError ? true : props['aria-invalid']}
        aria-describedby={describedBy}
      />
      {hasHint && (
        <div id={hintId} className={cx(styles.hint, classNames?.hint)}>
          {hint}
        </div>
      )}
      {hasError && (
        <div id={errorId} className={cx(styles.error, classNames?.error)}>
          {error}
        </div>
      )}
    </div>
  );
}
