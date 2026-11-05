import { Icon } from '../Icon.js';
import type { GlyphProps } from './types.js';

export function CloseIcon(props: GlyphProps) {
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
      <path d="m6.1 5.8 12.1 12.4m-.1-12.3L5.8 18.1" />
    </Icon>
  );
}
