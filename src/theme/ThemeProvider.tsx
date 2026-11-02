import { useMemo, type ReactNode } from 'react';
import { cx } from '../internal/cx.js';
import { ThemeContext, type ThemeName } from './theme-context.js';
import { getTokenStyle, type ThemeTokens } from './theme-tokens.js';
import styles from './theme.module.css';

const normalizedThemes = {
  pink: 'pink',
  blue: 'blue',
  yellow: 'yellow',
  chiikawa: 'pink',
  hachiware: 'blue',
  usagi: 'yellow',
} as const satisfies Record<ThemeName, string>;

export interface ThemeProviderProps {
  /** Color preset: pink, blue, or yellow. Legacy chiikawa/hachiware/usagi aliases remain supported. */
  theme: ThemeName;
  children: ReactNode;
  /** Applies only to the provider root; layout classes are not copied into portals. */
  className?: string;
  /** Color overrides also inherited by this provider's portaled dialogs. */
  tokens?: ThemeTokens;
}

export function ThemeProvider({ theme, children, className, tokens }: ThemeProviderProps) {
  const normalizedTheme = normalizedThemes[theme];
  const style = useMemo(() => getTokenStyle(tokens), [tokens]);
  const context = useMemo(() => ({ theme: normalizedTheme, style }), [normalizedTheme, style]);
  return (
    <ThemeContext.Provider value={context}>
      <div className={cx(styles.theme, className)} data-yahha-theme={normalizedTheme} style={style}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
