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
  /** Surface background. @default '#fffefa' */
  surface?: string;
  /** Text field background. @default '#fffefd' */
  fieldBackground?: string;
  /** Text field error border, focus outline, text and Toast error icon color. @default '#a33e4f' */
  error?: string;
}

const tokenVariables = {
  ink: '--chi-ink',
  muted: '--chi-muted',
  accent: '--chi-accent',
  accentHover: '--chi-accent-hover',
  accentSoft: '--chi-accent-soft',
  line: '--chi-line',
  focus: '--chi-focus',
  surface: '--chi-surface',
  fieldBackground: '--chi-field-background',
  error: '--chi-error',
} as const satisfies Record<keyof ThemeTokens, `--chi-${string}`>;

export function getTokenStyle(tokens?: ThemeTokens): CSSProperties | undefined {
  if (!tokens) return undefined;
  const style: CSSProperties & Partial<Record<`--chi-${string}`, string>> = {};
  for (const key of Object.keys(tokenVariables) as (keyof ThemeTokens)[]) {
    if (tokens[key] !== undefined) {
      style[tokenVariables[key]] = tokens[key];
    }
  }
  // One explicit line override covers both ink controls and quieter content paper.
  if (tokens.line !== undefined) {
    style['--chi-contour'] = tokens.line;
    style['--chi-paper-line'] = tokens.line;
  }
  return style;
}
