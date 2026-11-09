import { useContext, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../internal/cx.js';
import { WarningIcon } from '../icon/glyphs/WarningIcon.js';
import { FormContext } from './form-context.js';
import styles from './form.module.css';

export interface FormErrorProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'id'> {
  /** Exact flat field name used by a binding with errorPlacement="external". */
  name: string;
}

export function FormError({ name, className, ...props }: FormErrorProps) {
  const context = useContext(FormContext);
  if (!context) throw new Error('FormError must be rendered inside Form.');
  const error = Object.hasOwn(context.errors, name) ? context.errors[name] : undefined;
  if (typeof error !== 'string' || !error) return null;
  return (
    <div {...props} id={context.errorId(name)} className={cx(styles.error, className)}>
      <WarningIcon size={16} className={styles.errorMark} />
      {error}
    </div>
  );
}
