// Native checkbox checked state supplies aria-checked for role=switch, including form resets.
/* oxlint-disable jsx-a11y/role-has-required-aria-props */
import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../../internal/cx.js';
import { LoadingMark } from '../../internal/LoadingMark.js';
import styles from './switch.module.css';

/** Native checkbox behavior with switch semantics. ref/style target the input; direction is mirrored to the decorative track. */
export interface SwitchProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'role' | 'children' | 'readOnly' | 'aria-checked'
> {
  label: ReactNode;
  hint?: ReactNode;
  /** Shows a loading mark and blocks activation while preserving focus and the native value. @default false */
  loading?: boolean;
  classNames?: { label?: string; input?: string; text?: string; hint?: string };
}

export function Switch({
  label,
  hint,
  loading = false,
  id,
  className,
  classNames,
  ...props
}: SwitchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasHint = hint != null && hint !== '' && typeof hint !== 'boolean';
  const hintId = hasHint ? `${inputId}-hint` : undefined;
  return (
    <div className={cx(styles.field, className)}>
      <label
        htmlFor={inputId}
        className={cx(styles.label, classNames?.label)}
        onPointerDownCapture={
          loading
            ? (event) => {
                event.preventDefault();
                event.stopPropagation();
              }
            : undefined
        }
        onClickCapture={
          loading
            ? (event) => {
                event.preventDefault();
                event.stopPropagation();
              }
            : undefined
        }
      >
        <span
          className={styles.track}
          dir={props.dir}
          style={{ direction: props.style?.direction }}
        >
          <input
            {...props}
            id={inputId}
            type="checkbox"
            role="switch"
            className={cx(styles.input, classNames?.input)}
            aria-busy={loading || props['aria-busy']}
            aria-disabled={loading || props['aria-disabled']}
            onChange={loading ? () => undefined : props.onChange}
            onClick={loading ? undefined : props.onClick}
            onKeyDown={(event) => {
              if (loading && event.key === ' ') {
                event.preventDefault();
                return;
              }
              props.onKeyDown?.(event);
            }}
            aria-describedby={
              [props['aria-describedby'], hintId].filter(Boolean).join(' ') || undefined
            }
          />
          {loading && <LoadingMark className={styles.loading} />}
        </span>
        <span className={cx(styles.text, classNames?.text)}>{label}</span>
      </label>
      {hasHint && (
        <div id={hintId} className={cx(styles.hint, classNames?.hint)}>
          {hint}
        </div>
      )}
    </div>
  );
}
