// Native checkbox checked state supplies aria-checked for role=switch, including form resets.
/* oxlint-disable jsx-a11y/role-has-required-aria-props */
import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../../internal/cx.js';
import styles from './switch.module.css';

/** Native checkbox behavior with switch semantics. ref/style target the input. */
export interface SwitchProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'role' | 'children' | 'readOnly' | 'aria-checked'
> {
  label: ReactNode;
  hint?: ReactNode;
  classNames?: { label?: string; input?: string; text?: string; hint?: string };
}

export function Switch({ label, hint, id, className, classNames, ...props }: SwitchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasHint = hint != null && hint !== '' && typeof hint !== 'boolean';
  const hintId = hasHint ? `${inputId}-hint` : undefined;
  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={inputId} className={cx(styles.label, classNames?.label)}>
        <input
          {...props}
          id={inputId}
          type="checkbox"
          role="switch"
          className={cx(styles.input, classNames?.input)}
          aria-describedby={
            [props['aria-describedby'], hintId].filter(Boolean).join(' ') || undefined
          }
        />
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
