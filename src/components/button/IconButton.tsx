import { cx } from '../../internal/cx.js';
import { Button, type ButtonProps } from './Button.js';
import styles from './button.module.css';

export type IconButtonProps = Omit<ButtonProps, 'startIcon' | 'endIcon'> & {
  /** Required accessible name for an icon-only button. */
  'aria-label': string;
};

export function IconButton({ className, loading, children, ...props }: IconButtonProps) {
  return (
    <Button {...props} loading={loading} className={cx(styles.iconButton, className)}>
      {loading ? null : children}
    </Button>
  );
}
