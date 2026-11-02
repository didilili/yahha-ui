import { useMemo, type ReactNode } from 'react';
import { cx } from '../internal/cx.js';
import { ThemeContext, type ThemeName } from './theme-context.js';
import { getTokenStyle, type ThemeTokens } from './theme-tokens.js';
import styles from './theme.module.css';

export interface ThemeProviderProps {
  theme: ThemeName;
  children: ReactNode;
  /** Applies only to the provider root; layout classes are not copied into portals. */
  className?: string;
  /** Color overrides also inherited by this provider's portaled dialogs. */
  tokens?: ThemeTokens;
}

export function ThemeProvider({ theme, children, className, tokens }: ThemeProviderProps) {
  const style = useMemo(() => getTokenStyle(tokens), [tokens]);
  const context = useMemo(() => ({ theme, style }), [theme, style]);
  return (
    <ThemeContext.Provider value={context}>
      <div className={cx(styles.theme, className)} data-yahha-theme={theme} style={style}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
