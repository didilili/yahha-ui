import { Icon } from '../Icon.js';
import type { GlyphProps } from './types.js';

export function WarningIcon(props: GlyphProps) {
  return (
    <Icon
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10.4 4.6c.8-1.4 2.2-1.4 3 .1l7 12.9c.8 1.4.1 2.6-1.5 2.6L5 20c-1.6 0-2.3-1.2-1.5-2.6Z" />
      <path d="m12 8.8-.1 4.6m0 3.4.01.01" />
    </Icon>
  );
}
