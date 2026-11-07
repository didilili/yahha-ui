import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../../internal/cx.js';
import { WarningIcon } from '../icon/glyphs/WarningIcon.js';
import styles from './text-field.module.css';

/** Native props, including style and ref, target the input; explicit direction also aligns the slots. */
export interface TextFieldProps extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  leading?: ReactNode;
  /** Trailing content; actions, naming and disabled state belong to the caller. */
  trailing?: ReactNode;
  /** Class for the outer field container. */
  className?: string;
  /** Additional classes for individual parts; merged with the default styles. */
  classNames?: {
    label?: string;
    inputWrapper?: string;
    leading?: string;
    trailing?: string;
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
  trailing,
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
  const hasTrailing = trailing != null && trailing !== '' && typeof trailing !== 'boolean';
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
      <div
        className={cx(styles.inputWrap, classNames?.inputWrapper)}
        dir={props.dir}
        style={{ direction: props.style?.direction }}
      >
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
        {hasTrailing && (
          <span className={cx(styles.trailing, classNames?.trailing)}>{trailing}</span>
        )}
      </div>
      {hasHint && (
        <div className={cx(styles.hint, classNames?.hint)} id={hintId}>
          {hint}
        </div>
      )}
      {hasError && (
        <div className={cx(styles.error, classNames?.error)} id={errorId}>
          <WarningIcon size={16} className={styles.errorMark} />
          {error}
        </div>
      )}
    </div>
  );
}
