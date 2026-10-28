import { useId, type ComponentPropsWithRef, type ReactElement, type ReactNode } from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cx } from '../../internal/cx.js';
import { PortalTheme } from '../../internal/PortalTheme.js';
import { CloseMark } from '../../internal/CloseMark.js';
import { renderInteractivePopup } from '../../internal/InteractivePopup.js';
import { useTriggerDirection } from '../../internal/useTriggerDirection.js';
import { IconButton } from '../button/IconButton.js';
import styles from './popover.module.css';

/** A non-modal, anchored dialog. className, style and ref target its popup div. */
export interface PopoverProps extends Pick<
  ComponentPropsWithRef<'div'>,
  'className' | 'style' | 'ref'
> {
  trigger: ReactElement;
  /** Accessible heading, containing meaningful visible text. */
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  open?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Disables the trigger. @default false */
  disabled?: boolean;
  /** @default 'bottom' */
  side?: BasePopover.Positioner.Props['side'];
  /** @default 'start' */
  align?: BasePopover.Positioner.Props['align'];
  /** @default 8 */
  sideOffset?: number;
  initialFocus?: BasePopover.Popup.Props['initialFocus'];
  finalFocus?: BasePopover.Popup.Props['finalFocus'];
  portalContainer?: BasePopover.Portal.Props['container'];
  /** @default '关闭浮层' */
  closeLabel?: string;
}

export function Popover({
  trigger,
  title,
  description,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  side = 'bottom',
  align = 'start',
  sideOffset = 8,
  initialFocus,
  finalFocus,
  portalContainer,
  closeLabel = '关闭浮层',
  className,
  style,
  ref,
}: PopoverProps) {
  const triggerId = useId();
  const { direction, triggerRef } = useTriggerDirection();
  const hasDescription =
    description != null && typeof description !== 'boolean' && description !== '';
  return (
    <DirectionProvider direction={direction}>
      <BasePopover.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        triggerId={triggerId}
        modal={false}
      >
        <BasePopover.Trigger id={triggerId} ref={triggerRef} render={trigger} disabled={disabled} />
        <BasePopover.Portal container={portalContainer}>
          <PortalTheme dir={direction}>
            <BasePopover.Positioner
              side={side}
              align={align}
              sideOffset={sideOffset}
              collisionPadding={12}
              className={styles.positioner}
            >
              <BasePopover.Popup
                render={renderInteractivePopup}
                ref={ref}
                className={cx(styles.popup, className)}
                style={style}
                initialFocus={initialFocus}
                finalFocus={finalFocus}
              >
                <BasePopover.Close
                  render={
                    <IconButton
                      aria-label={closeLabel}
                      variant="ghost"
                      size="sm"
                      className={styles.close}
                    >
                      <CloseMark />
                    </IconButton>
                  }
                />
                <BasePopover.Title className={styles.title}>{title}</BasePopover.Title>
                {hasDescription && (
                  <BasePopover.Description className={styles.description}>
                    {description}
                  </BasePopover.Description>
                )}
                {children != null && typeof children !== 'boolean' && children !== '' && (
                  <div className={styles.content}>{children}</div>
                )}
              </BasePopover.Popup>
            </BasePopover.Positioner>
          </PortalTheme>
        </BasePopover.Portal>
      </BasePopover.Root>
    </DirectionProvider>
  );
}
