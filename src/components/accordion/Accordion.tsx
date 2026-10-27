import { useState, type ComponentPropsWithRef, type ReactNode } from 'react';
import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { cx } from '../../internal/cx.js';
import styles from './accordion.module.css';

export interface AccordionItem {
  /** A unique, stable string within this accordion. */
  value: string;
  /** Plain text or non-interactive content; the title is already inside a button. */
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

/** Native div attributes, className, style and ref target the root. */
export interface AccordionProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'defaultValue'
> {
  items: AccordionItem[];
  /** Controlled open values. Single mode uses only the first value. */
  value?: string[];
  /** Initially open values; empty by default. Single mode uses only the first value. */
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Allows multiple open panels; switching to single mode keeps only the first uncontrolled value. @default false */
  multiple?: boolean;
  disabled?: boolean;
  /** Keeps closed content mounted to retain form state. @default false */
  keepMounted?: boolean;
  /** Match the surrounding document heading structure. @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  classNames?: Partial<Record<'item' | 'heading' | 'trigger' | 'panel', string>>;
}

export function Accordion({
  items,
  value,
  defaultValue,
  onValueChange,
  multiple = false,
  disabled = false,
  keepMounted = false,
  headingLevel = 3,
  className,
  classNames,
  ...props
}: AccordionProps) {
  const [internalValue, setInternalValue] = useState<string[]>(() =>
    multiple ? [...(defaultValue ?? [])] : (defaultValue?.slice(0, 1) ?? []),
  );
  if (value === undefined && !multiple && internalValue.length > 1) {
    setInternalValue(internalValue.slice(0, 1));
  }
  const openValue = value ?? internalValue;
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  return (
    <BaseAccordion.Root
      {...props}
      className={cx(styles.root, className)}
      value={multiple ? openValue : openValue.slice(0, 1)}
      onValueChange={(nextValue: string[]) => {
        onValueChange?.(nextValue);
        if (value === undefined) setInternalValue(nextValue);
      }}
      multiple={multiple}
      disabled={disabled}
      keepMounted={keepMounted}
    >
      {items.map((item) => (
        <BaseAccordion.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className={cx(styles.item, classNames?.item)}
        >
          <BaseAccordion.Header
            render={<Heading />}
            className={cx(styles.heading, classNames?.heading)}
          >
            <BaseAccordion.Trigger className={cx(styles.trigger, classNames?.trigger)}>
              <span className={styles.title}>{item.title}</span>
              <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="m4 6 4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </BaseAccordion.Trigger>
          </BaseAccordion.Header>
          <BaseAccordion.Panel className={cx(styles.panel, classNames?.panel)}>
            <div className={styles.content}>{item.content}</div>
          </BaseAccordion.Panel>
        </BaseAccordion.Item>
      ))}
    </BaseAccordion.Root>
  );
}
