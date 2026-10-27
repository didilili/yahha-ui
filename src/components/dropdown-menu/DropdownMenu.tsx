import { useId, type ComponentPropsWithRef, type ReactElement } from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cx } from '../../internal/cx.js';
import { renderInteractivePopup } from '../../internal/InteractivePopup.js';
import { PortalTheme } from '../../internal/PortalTheme.js';
import styles from './dropdown-menu.module.css';

export interface DropdownMenuItem {
  /** Unique key within this menu. */
  id: string;
  /** Visible text, also used for keyboard type-ahead. */
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

/** An action menu, not a form value selector. Popup props target its menu div. */
export interface DropdownMenuProps extends Pick<
  ComponentPropsWithRef<'div'>,
  'className' | 'style' | 'ref'
> {
  /** A native button or a component forwarding button props and ref, such as Button. */
  trigger: ReactElement;
  items: readonly DropdownMenuItem[];
  open?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Disables opening the menu. @default false */
  disabled?: boolean;
  /** @default 'bottom' */
  side?: BaseMenu.Positioner.Props['side'];
  /** @default 'start' */
  align?: BaseMenu.Positioner.Props['align'];
  /** Offset in pixels. @default 8 */
  sideOffset?: number;
  portalContainer?: BaseMenu.Portal.Props['container'];
}

export function DropdownMenu({
  trigger,
  items,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  side = 'bottom',
  align = 'start',
  sideOffset = 8,
  portalContainer,
  className,
  style,
  ref,
}: DropdownMenuProps) {
  const triggerId = useId();
  return (
    <BaseMenu.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      triggerId={triggerId}
      modal={false}
    >
      <BaseMenu.Trigger id={triggerId} render={trigger} disabled={disabled} />
      <BaseMenu.Portal container={portalContainer}>
        <PortalTheme>
          <BaseMenu.Positioner
            side={side}
            align={align}
            sideOffset={sideOffset}
            collisionPadding={12}
            className={styles.positioner}
          >
            <BaseMenu.Popup
              render={renderInteractivePopup}
              ref={ref}
              className={cx(styles.popup, className)}
              style={style}
            >
              {items.map((item) => (
                <BaseMenu.Item
                  key={item.id}
                  label={item.label}
                  disabled={item.disabled}
                  onClick={item.onSelect}
                  className={cx(styles.item, item.destructive && styles.destructive)}
                >
                  {item.label}
                </BaseMenu.Item>
              ))}
            </BaseMenu.Popup>
          </BaseMenu.Positioner>
        </PortalTheme>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}
