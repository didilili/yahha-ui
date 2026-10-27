import { useContext, type ReactNode } from 'react';
import { ThemeContext } from '../theme/theme-context.js';
import styles from '../theme/theme.module.css';

/** Keep portaled controls on their owning provider's theme without copying layout classes. */
export function PortalTheme({ children }: { children: ReactNode }) {
  const { theme, style } = useContext(ThemeContext);
  return (
    <div className={styles.theme} data-chiikawa-theme={theme} style={style}>
      {children}
    </div>
  );
}
