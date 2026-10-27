import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../../internal/cx.js';
import styles from './text-field.module.css';

/** Native input props, including style and ref, target the input. */
export interface TextFieldProps extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  leading?: ReactNode;
  /** Class for the outer field container. */
  className?: string;
  /** Additional classes for individual parts; merged with the default styles. */
  classNames?: {
    label?: string;
    inputWrapper?: string;
    leading?: string;
    input?: string;
    hint?: string;
    error?: string;
  };
}

export function TextField({
  label,
  hint,
  error,
  leading,
  id,
  className,
  classNames,
  disabled,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasHint = hint != null && hint !== '' && typeof hint !== 'boolean';
  const hasError = error != null && error !== '' && typeof error !== 'boolean';
  const hasLeading = leading != null && leading !== '' && typeof leading !== 'boolean';
  const hintId = hasHint ? `${inputId}-hint` : undefined;
  const errorId = hasError ? `${inputId}-error` : undefined;
  const describedBy =
    [props['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div
      className={cx(styles.field, className)}
      data-invalid={hasError ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      <label className={cx(styles.fieldLabel, classNames?.label)} htmlFor={inputId}>
        {label}
      </label>
      <div className={cx(styles.inputWrap, classNames?.inputWrapper)}>
        {hasLeading && (
          <span className={cx(styles.leading, classNames?.leading)} aria-hidden="true">
            {leading}
          </span>
        )}
        <input
          {...props}
          id={inputId}
          disabled={disabled}
          className={cx(styles.input, classNames?.input)}
          aria-invalid={hasError ? true : props['aria-invalid']}
          aria-describedby={describedBy}
        />
      </div>
      {hasHint && (
        <div className={cx(styles.hint, classNames?.hint)} id={hintId}>
          {hint}
        </div>
      )}
      {hasError && (
        <div className={cx(styles.error, classNames?.error)} id={errorId}>
          {error}
        </div>
      )}
    </div>
  );
}
