import { useContext, type ComponentPropsWithRef, type ReactElement, type ReactNode } from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { DirectionContext } from '@base-ui/react/internals/direction-context';
import { IconButton } from '../button/IconButton.js';
import { CloseMark } from '../../internal/CloseMark.js';
import { renderInteractivePopup } from '../../internal/InteractivePopup.js';
import { ThemeContext } from '../../theme/theme-context.js';
import { cx } from '../../internal/cx.js';
import { useTriggerDirection } from '../../internal/useTriggerDirection.js';
import themeStyles from '../../theme/theme.module.css';
import styles from './dialog.module.css';

/** Controlled dialog. `className`, `style`, and `ref` apply to the popup element. */
export interface DialogProps extends Pick<
  ComponentPropsWithRef<'div'>,
  'className' | 'style' | 'ref'
> {
  /** Omit for a dialog opened programmatically through the required controlled `open` prop. */
  trigger?: ReactElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  illustration?: ReactNode;
  /** Initial focus target, using Base UI's ref, boolean, or interaction callback behavior. */
  initialFocus?: BaseDialog.Popup.Props['initialFocus'];
  /** Return focus target after closing; defaults to the trigger or previously focused element. */
  finalFocus?: BaseDialog.Popup.Props['finalFocus'];
  /** Portal destination; accepts the same element, ShadowRoot, or ref as Base UI. */
  portalContainer?: BaseDialog.Portal.Props['container'];
  /** Prevents outside pointer presses from closing the dialog. @default false */
  disablePointerDismissal?: boolean;
  /** Accessible label for the built-in close button. @default '关闭弹窗' */
  closeLabel?: string;
}

export function Dialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  illustration,
  className,
  style,
  ref,
  initialFocus,
  finalFocus,
  portalContainer,
  disablePointerDismissal = false,
  closeLabel = '关闭弹窗',
}: DialogProps) {
  const { theme, style: themeStyle } = useContext(ThemeContext);
  const { direction, nativeDirection, triggerRef } = useTriggerDirection();
  // The unconfigured Base UI default is not an explicit override of portal CSS.
  const inheritedDirection = useContext(DirectionContext)?.direction;
  const explicitDirection =
    style?.direction === 'ltr' || style?.direction === 'rtl'
      ? style.direction
      : (nativeDirection ?? inheritedDirection);
  const popupDirection = explicitDirection ?? direction;
  return (
    <DirectionProvider direction={popupDirection}>
      <BaseDialog.Root
        open={open}
        onOpenChange={onOpenChange}
        disablePointerDismissal={disablePointerDismissal}
      >
        {trigger && <BaseDialog.Trigger ref={triggerRef} render={trigger} />}
        <BaseDialog.Portal container={portalContainer}>
          <div
            className={themeStyles.theme}
            data-yahha-theme={theme}
            style={themeStyle}
            dir={trigger ? explicitDirection : undefined}
          >
            <BaseDialog.Backdrop className={styles.dialogBackdrop} />
            <BaseDialog.Popup
              render={renderInteractivePopup}
              ref={ref}
              className={cx(styles.dialog, className)}
              style={style}
              initialFocus={initialFocus}
              finalFocus={finalFocus}
            >
              <BaseDialog.Close
                render={
                  <IconButton
                    aria-label={closeLabel}
                    variant="ghost"
                    size="sm"
                    className={styles.dialogClose}
                  >
                    <CloseMark />
                  </IconButton>
                }
              />
              {illustration != null && typeof illustration !== 'boolean' && illustration !== '' && (
                <div className={styles.dialogIllustration} aria-hidden="true">
                  {illustration}
                </div>
              )}
              <BaseDialog.Title className={styles.dialogTitle}>{title}</BaseDialog.Title>
              {description != null && typeof description !== 'boolean' && description !== '' && (
                <BaseDialog.Description className={styles.dialogDescription}>
                  {description}
                </BaseDialog.Description>
              )}
              {children != null && typeof children !== 'boolean' && children !== '' && (
                <div className={styles.dialogBody}>{children}</div>
              )}
              {footer != null && typeof footer !== 'boolean' && footer !== '' && (
                <div className={styles.dialogFooter}>{footer}</div>
              )}
            </BaseDialog.Popup>
          </div>
        </BaseDialog.Portal>
      </BaseDialog.Root>
    </DirectionProvider>
  );
}
