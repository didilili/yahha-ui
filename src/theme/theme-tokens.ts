import type { CSSProperties } from 'react';

/** Optional color overrides shared by the provider root and portaled components. */
export interface ThemeTokens {
  ink?: string;
  muted?: string;
  accent?: string;
  accentHover?: string;
  accentSoft?: string;
  /** Overrides control contours, content paper edges and action bases together. */
  line?: string;
  focus?: string;
  /** Surface background. @default '#ffffff' */
  surface?: string;
  /** Text field background. @default '#ffffff' */
  fieldBackground?: string;
  /** Text field error border, focus outline, text and Toast error icon color. @default '#a33e4f' */
  error?: string;
}

const tokenVariables = {
  ink: '--yahha-ink',
  muted: '--yahha-muted',
  accent: '--yahha-accent',
  accentHover: '--yahha-accent-hover',
  accentSoft: '--yahha-accent-soft',
  line: '--yahha-line',
  focus: '--yahha-focus',
  surface: '--yahha-surface',
  fieldBackground: '--yahha-field-background',
  error: '--yahha-error',
} as const satisfies Record<keyof ThemeTokens, `--yahha-${string}`>;

export function getTokenStyle(tokens?: ThemeTokens): CSSProperties | undefined {
  if (!tokens) return undefined;
  const style: CSSProperties & Partial<Record<`--yahha-${string}`, string>> = {};
  for (const key of Object.keys(tokenVariables) as (keyof ThemeTokens)[]) {
    if (tokens[key] !== undefined) {
      style[tokenVariables[key]] = tokens[key];
    }
  }
  // One explicit line override covers both ink controls and quieter content paper.
  if (tokens.line !== undefined) {
    style['--yahha-contour'] = tokens.line;
    style['--yahha-paper-line'] = tokens.line;
  }
  return style;
}
