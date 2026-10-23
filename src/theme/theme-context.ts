import { createContext, type CSSProperties } from 'react';

export type ThemeName = 'chiikawa' | 'hachiware' | 'usagi';

interface ThemeContextValue {
  theme: ThemeName;
  style?: CSSProperties;
}

export const ThemeContext = createContext<ThemeContextValue>({ theme: 'chiikawa' });
