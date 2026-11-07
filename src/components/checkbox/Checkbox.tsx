import {
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';
import { cx } from '../../internal/cx.js';
import { WarningIcon } from '../icon/glyphs/WarningIcon.js';
import styles from './checkbox.module.css';

/** Uses native checked/defaultChecked/onChange; ref and style target the input. */
export interface CheckboxProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'children' | 'readOnly' | 'aria-checked'
> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /** Controlled mixed appearance; independent of the submitted checked value. @default false */
  indeterminate?: boolean;
  /** Adds a paper tint to enabled checked or mixed label rows. @default false */
  highlightSelected?: boolean;
  classNames?: { label?: string; input?: string; text?: string; hint?: string; error?: string };
}

export function Checkbox({
  label,
  hint,
  error,
  indeterminate = false,
  highlightSelected = false,
  id,
  ref,
  className,
  classNames,
  onChange,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const indeterminateRef = useRef(indeterminate);
  useImperativeHandle(ref, () => inputRef.current!, []);
  useEffect(() => {
    indeterminateRef.current = indeterminate;
    const input = inputRef.current;
    if (!input) return;
    input.indeterminate = indeterminate;
    const restoreMixed = () =>
      queueMicrotask(() => {
        input.indeterminate = indeterminateRef.current;
      });
    const form = input.form;
    form?.addEventListener('reset', restoreMixed);
    return () => form?.removeEventListener('reset', restoreMixed);
  }, [indeterminate, props.form]);
  const hasHint = hint != null && hint !== '' && typeof hint !== 'boolean';
  const hasError = error != null && error !== '' && typeof error !== 'boolean';
  const hintId = hasHint ? `${inputId}-hint` : undefined;
  const errorId = hasError ? `${inputId}-error` : undefined;
  return (
    <div className={cx(styles.field, className)}>
      <label
        htmlFor={inputId}
        className={cx(styles.label, classNames?.label)}
        data-highlight-selected={highlightSelected || undefined}
      >
        <input
          {...props}
          ref={inputRef}
          id={inputId}
          type="checkbox"
          className={cx(styles.input, classNames?.input)}
          aria-checked={indeterminate ? 'mixed' : undefined}
          aria-invalid={hasError ? true : props['aria-invalid']}
          aria-describedby={
            [props['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined
          }
          onChange={(event) => {
            onChange?.(event);
            event.currentTarget.indeterminate = indeterminate;
          }}
        />
        <span className={cx(styles.text, classNames?.text)}>{label}</span>
      </label>
      {hasHint && (
        <div id={hintId} className={cx(styles.hint, classNames?.hint)}>
          {hint}
        </div>
      )}
      {hasError && (
        <div id={errorId} className={cx(styles.error, classNames?.error)}>
          <WarningIcon size={16} className={styles.errorMark} />
          {error}
        </div>
      )}
    </div>
  );
}
