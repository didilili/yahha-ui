import { useContext, type ReactNode } from 'react';
import type { TextDirection } from '@base-ui/react/direction-provider';
import { ThemeContext } from '../theme/theme-context.js';
import styles from '../theme/theme.module.css';

/** Keep portaled controls on their owning provider's theme without copying layout classes. */
export function PortalTheme({ children, dir }: { children: ReactNode; dir?: TextDirection }) {
  const { theme, style } = useContext(ThemeContext);
  return (
    <div className={styles.theme} data-chiikawa-theme={theme} style={style} dir={dir}>
      {children}
    </div>
  );
}
