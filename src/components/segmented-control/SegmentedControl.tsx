import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../../internal/cx.js';
import styles from './segmented-control.module.css';

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

/** A controlled radio group. Native attributes and ref target the fieldset; options supply the content. */
export interface SegmentedControlProps<T extends string> extends Omit<
  ComponentPropsWithRef<'fieldset'>,
  'children' | 'defaultValue' | 'defaultChecked'
> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  label: string;
  classNames?: { options?: string; option?: string };
  /** Require a checked radio using native form validation. */
  required?: boolean;
  /** Radio field name; a stable unique name is generated when omitted. */
  name?: string;
  /** Associate both the fieldset and its radios with a form by ID. */
  form?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
  label,
  className,
  classNames,
  name,
  form,
  disabled,
  required,
  ...props
}: SegmentedControlProps<T>) {
  const generatedName = useId();
  const radioName = name ?? generatedName;
  return (
    <fieldset
      {...props}
      name={name}
      form={form}
      disabled={disabled}
      className={cx(styles.segmented, className)}
      data-disabled={disabled ? '' : undefined}
    >
      <legend className={styles.srOnly}>{label}</legend>
      <div className={cx(styles.segmentedOptions, classNames?.options)}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cx(styles.segment, classNames?.option)}
            data-checked={value === option.value ? '' : undefined}
            data-disabled={disabled || option.disabled ? '' : undefined}
          >
            <input
              type="radio"
              name={radioName}
              form={form}
              value={option.value}
              checked={value === option.value}
              disabled={disabled || option.disabled}
              required={required}
              aria-describedby={props['aria-describedby']}
              onChange={() => onValueChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
