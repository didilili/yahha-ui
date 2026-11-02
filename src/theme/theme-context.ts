import { createContext, type CSSProperties } from 'react';

type ColorThemeName = 'pink' | 'blue' | 'yellow';

/** @deprecated Use 'pink', 'blue', or 'yellow' instead of the character-name aliases. */
type LegacyThemeName = 'chiikawa' | 'hachiware' | 'usagi';

export type ThemeName = ColorThemeName | LegacyThemeName;

interface ThemeContextValue {
  theme: ColorThemeName;
  style?: CSSProperties;
}

export const ThemeContext = createContext<ThemeContextValue>({ theme: 'pink' });
