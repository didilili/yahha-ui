import { useId, type ComponentPropsWithRef, type ReactElement } from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cx } from '../../internal/cx.js';
import { PortalTheme } from '../../internal/PortalTheme.js';
import styles from './tooltip.module.css';

/** Supplemental plain text only; trigger must have its own accessible name. */
export interface TooltipProps extends Pick<
  ComponentPropsWithRef<'div'>,
  'className' | 'style' | 'ref'
> {
  trigger: ReactElement;
  /** No links, buttons or form controls. Use Popover for interactive content. */
  content: string;
  open?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Disables only the tooltip, not the trigger element. @default false */
  disabled?: boolean;
  /** Hover delay in milliseconds. Focus opens immediately. @default 400 */
  delay?: number;
  /** @default 'top' */
  side?: BaseTooltip.Positioner.Props['side'];
  /** @default 'center' */
  align?: BaseTooltip.Positioner.Props['align'];
  /** @default 8 */
  sideOffset?: number;
  portalContainer?: BaseTooltip.Portal.Props['container'];
}

export function Tooltip({
  trigger,
  content,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  delay = 400,
  side = 'top',
  align = 'center',
  sideOffset = 8,
  portalContainer,
  className,
  style,
  ref,
}: TooltipProps) {
  const triggerId = useId();
  return (
    <BaseTooltip.Provider delay={delay}>
      <BaseTooltip.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        disabled={disabled}
        triggerId={triggerId}
      >
        <BaseTooltip.Trigger id={triggerId} render={trigger} />
        <BaseTooltip.Portal container={portalContainer}>
          <PortalTheme>
            <BaseTooltip.Positioner
              side={side}
              align={align}
              sideOffset={sideOffset}
              collisionPadding={12}
              className={styles.positioner}
            >
              <BaseTooltip.Popup ref={ref} className={cx(styles.popup, className)} style={style}>
                {content}
              </BaseTooltip.Popup>
              <BaseTooltip.Arrow className={styles.arrow} />
            </BaseTooltip.Positioner>
          </PortalTheme>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}
