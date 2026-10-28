import {
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import {
  DirectionProvider,
  useDirection,
  type TextDirection,
} from '@base-ui/react/direction-provider';
import { cx } from '../../internal/cx.js';
import { observeNativeDirection } from '../../internal/observeNativeDirection.js';
import { PortalTheme } from '../../internal/PortalTheme.js';
import styles from './select.module.css';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  /** Plain label for keyboard typeahead when label contains decoration. */ textValue?: string;
}
/** Native button attributes, ref and style target the trigger. className targets the field. */
export interface SelectProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'value' | 'defaultValue' | 'onChange' | 'type'
> {
  label: ReactNode;
  options: readonly SelectOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  portalContainer?: BaseSelect.Portal.Props['container'];
  classNames?: {
    label?: string;
    trigger?: string;
    value?: string;
    popup?: string;
    option?: string;
    hint?: string;
    error?: string;
  };
}

export function Select({
  label,
  options,
  value,
  defaultValue = null,
  onValueChange,
  placeholder = '请选择',
  hint,
  error,
  id,
  name,
  form,
  required,
  readOnly,
  autoComplete,
  disabled,
  ref,
  portalContainer,
  className,
  classNames,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const inheritedDirection = useDirection();
  const fieldRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useImperativeHandle(ref, () => triggerRef.current!, []);
  const [domDirection, setDomDirection] = useState<TextDirection>();
  useLayoutEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    // Exclude the field itself: its dir is the resolved value written below.
    return observeNativeDirection(field, setDomDirection, false);
  }, []);
  const explicitDirection = props.dir?.toLowerCase();
  const direction =
    explicitDirection === 'rtl' || explicitDirection === 'ltr'
      ? explicitDirection
      : (domDirection ?? inheritedDirection);
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
  const initialValue = useRef(defaultValue);
  const currentValue = value === undefined ? internalValue : value;
  const openRef = useRef(false);
  useEffect(() => {
    if (value !== undefined) return;
    // Reset events stay within their document or shadow root.
    const eventRoot = triggerRef.current?.getRootNode();
    const reset = (event: Event) => {
      // External forms can mount or be replaced without changing the form prop.
      if (event.target !== triggerRef.current?.form) return;
      queueMicrotask(() => {
        if (!event.defaultPrevented) setInternalValue(initialValue.current);
      });
    };
    eventRoot?.addEventListener('reset', reset, true);
    return () => eventRoot?.removeEventListener('reset', reset, true);
  }, [form, value]);
  const hasHint = hint != null && hint !== '' && typeof hint !== 'boolean';
  const hasError = error != null && error !== '' && typeof error !== 'boolean';
  const hintId = hasHint ? `${selectId}-hint` : undefined;
  const errorId = hasError ? `${selectId}-error` : undefined;
  return (
    <DirectionProvider direction={direction}>
      <BaseSelect.Root<string>
        id={selectId}
        items={options}
        value={currentValue}
        onValueChange={(next, details) => {
          // Portal options can outlive closing for a frame. Reject a stale item activation,
          // while preserving closed-state autofill, reset and option-list reconciliation.
          if (
            triggerRef.current?.matches(':disabled') ||
            (details.reason === 'item-press' && !openRef.current)
          ) {
            details.cancel();
            return;
          }
          if (value === undefined) setInternalValue(next);
          onValueChange?.(next);
        }}
        onOpenChange={(nextOpen, details) => {
          if (nextOpen && triggerRef.current?.matches(':disabled')) {
            details.cancel();
            return;
          }
          openRef.current = nextOpen;
        }}
        name={name}
        form={form}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        autoComplete={autoComplete}
        modal={false}
      >
        <div ref={fieldRef} dir={direction} className={cx(styles.field, className)}>
          <BaseSelect.Label className={cx(styles.label, classNames?.label)}>
            {label}
          </BaseSelect.Label>
          <BaseSelect.Trigger
            {...props}
            ref={triggerRef}
            form={form}
            type="button"
            className={cx(styles.trigger, classNames?.trigger)}
            aria-invalid={hasError ? true : props['aria-invalid']}
            aria-describedby={
              [props['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined
            }
          >
            <BaseSelect.Value
              placeholder={placeholder}
              className={cx(styles.value, classNames?.value)}
            />
            <BaseSelect.Icon className={styles.icon}>
              <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
                <path
                  d="m4 6 4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </BaseSelect.Icon>
          </BaseSelect.Trigger>
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
        <BaseSelect.Portal container={portalContainer}>
          <PortalTheme>
            <BaseSelect.Positioner
              dir={direction}
              sideOffset={6}
              align="start"
              alignItemWithTrigger={false}
              className={styles.positioner}
            >
              <BaseSelect.Popup
                className={cx(styles.popup, classNames?.popup)}
                // Base UI may retain the closing DOM for a frame; it must not accept another key.
                render={(popupProps, state) => <div {...popupProps} inert={!state.open} />}
              >
                <BaseSelect.List className={styles.list}>
                  {options.map((option) => (
                    <BaseSelect.Item
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                      label={option.textValue}
                      className={cx(styles.option, classNames?.option)}
                    >
                      <BaseSelect.ItemIndicator className={styles.indicator}>
                        <svg
                          viewBox="0 0 16 16"
                          width="16"
                          height="16"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="m3 8 3 3 7-7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </BaseSelect.ItemIndicator>
                      <BaseSelect.ItemText className={styles.optionText}>
                        {option.label}
                      </BaseSelect.ItemText>
                    </BaseSelect.Item>
                  ))}
                </BaseSelect.List>
              </BaseSelect.Popup>
            </BaseSelect.Positioner>
          </PortalTheme>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </DirectionProvider>
  );
}
