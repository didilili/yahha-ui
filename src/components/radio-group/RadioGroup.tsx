import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../../internal/cx.js';
import styles from './radio-group.module.css';

export interface RadioOption<T extends string> {
  value: T;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}
/** Controlled native radios. ref/style/className target the fieldset. */
export interface RadioGroupProps<T extends string> extends Omit<
  ComponentPropsWithRef<'fieldset'>,
  'defaultValue' | 'defaultChecked'
> {
  label: ReactNode;
  options: readonly RadioOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  classNames?: {
    legend?: string;
    options?: string;
    option?: string;
    input?: string;
    label?: string;
    description?: string;
    hint?: string;
    error?: string;
  };
}

export function RadioGroup<T extends string>({
  label,
  options,
  value,
  onValueChange,
  hint,
  error,
  id,
  name,
  form,
  required,
  disabled,
  className,
  classNames,
  ...props
}: RadioGroupProps<T>) {
  const generatedId = useId();
  const groupId = id ?? generatedId;
  const radioName = name ?? generatedId;
  const hasHint = hint != null && hint !== '' && typeof hint !== 'boolean';
  const hasError = error != null && error !== '' && typeof error !== 'boolean';
  const hintId = hasHint ? `${groupId}-hint` : undefined;
  const errorId = hasError ? `${groupId}-error` : undefined;
  const describedBy =
    [props['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <fieldset
      {...props}
      id={groupId}
      name={name}
      form={form}
      disabled={disabled}
      className={cx(styles.group, className)}
      aria-describedby={describedBy}
      aria-invalid={hasError ? true : props['aria-invalid']}
    >
      <legend className={cx(styles.legend, classNames?.legend)}>{label}</legend>
      <div className={cx(styles.options, classNames?.options)}>
        {options.map((option, index) => {
          const hasDescription =
            option.description != null &&
            option.description !== '' &&
            typeof option.description !== 'boolean';
          const descriptionId = hasDescription ? `${groupId}-option-${index}` : undefined;
          return (
            <label key={option.value} className={cx(styles.option, classNames?.option)}>
              <input
                type="radio"
                className={cx(styles.input, classNames?.input)}
                name={radioName}
                form={form}
                required={required}
                value={option.value}
                checked={value === option.value}
                disabled={disabled || option.disabled}
                aria-labelledby={`${groupId}-label-${index}`}
                aria-describedby={
                  [describedBy, descriptionId].filter(Boolean).join(' ') || undefined
                }
                onChange={() => onValueChange(option.value)}
              />
              <span className={styles.content}>
                <span
                  id={`${groupId}-label-${index}`}
                  className={cx(styles.label, classNames?.label)}
                >
                  {option.label}
                </span>
                {hasDescription && (
                  <span
                    id={descriptionId}
                    className={cx(styles.description, classNames?.description)}
                  >
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
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
    </fieldset>
  );
}
