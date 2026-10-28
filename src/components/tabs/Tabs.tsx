import {
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import {
  DirectionProvider,
  useDirection,
  type TextDirection,
} from '@base-ui/react/direction-provider';
import { cx } from '../../internal/cx.js';
import { observeNativeDirection } from '../../internal/observeNativeDirection.js';
import styles from './tabs.module.css';

export interface TabItem {
  /** A unique, stable string within this group. */
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

/** Native div attributes, className, style and ref target the root, not the tab list. */
export interface TabsProps extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'defaultValue'> {
  /** Accessible name for the tab list. */
  label: string;
  items: TabItem[];
  /** Controlled selection. null leaves every panel closed. */
  value?: string | null;
  /** Initial uncontrolled selection; defaults to the first enabled item. */
  defaultValue?: string | null;
  /** Also reports Base UI's automatic uncontrolled fallback when an item is removed or disabled. */
  onValueChange?: (value: string | null) => void;
  /** Automatically selects tabs on arrow-key focus. @default false */
  activateOnFocus?: boolean;
  /** Retains hidden panels and their local state. @default false */
  keepMounted?: boolean;
  classNames?: Partial<Record<'list' | 'tab' | 'panel', string>>;
}

export function Tabs({
  label,
  items,
  value,
  defaultValue,
  onValueChange,
  activateOnFocus = false,
  keepMounted = false,
  className,
  classNames,
  ...props
}: TabsProps) {
  const inheritedDirection = useDirection();
  const rootRef = useRef<HTMLDivElement>(null);
  const [domDirection, setDomDirection] = useState<TextDirection>();
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return observeNativeDirection(root, setDomDirection);
  }, []);
  const direction =
    props.dir === 'rtl' || props.dir === 'ltr' ? props.dir : (domDirection ?? inheritedDirection);
  const [initialValue] = useState(() =>
    defaultValue === undefined
      ? (items.find((item) => !item.disabled)?.value ?? null)
      : defaultValue,
  );
  return (
    <DirectionProvider direction={direction}>
      <BaseTabs.Root
        {...props}
        render={<div ref={rootRef} />}
        className={cx(styles.root, className)}
        value={value}
        defaultValue={initialValue}
        onValueChange={(nextValue: string | null) => onValueChange?.(nextValue)}
      >
        <BaseTabs.List
          aria-label={label}
          className={cx(styles.list, classNames?.list)}
          activateOnFocus={activateOnFocus}
        >
          {items.map((item) => (
            <BaseTabs.Tab
              key={item.value}
              value={item.value}
              disabled={item.disabled}
              className={cx(styles.tab, classNames?.tab)}
            >
              {item.label}
            </BaseTabs.Tab>
          ))}
        </BaseTabs.List>
        {items.map((item) => (
          <BaseTabs.Panel
            key={item.value}
            value={item.value}
            keepMounted={keepMounted}
            className={cx(styles.panel, classNames?.panel)}
          >
            {item.content}
          </BaseTabs.Panel>
        ))}
      </BaseTabs.Root>
    </DirectionProvider>
  );
}
