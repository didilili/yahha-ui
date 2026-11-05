import { Icon } from '../Icon.js';
import type { GlyphProps } from './types.js';

export function CopyIcon(props: GlyphProps) {
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
      <path d="m8.1 5.5.1-.9c0-1 .6-1.6 1.6-1.6l9.5.2c1 0 1.6.6 1.6 1.6l-.1 9.5c0 1-.6 1.6-1.6 1.6h-.9" />
      <path d="m4.7 8.2 9.7.1c1 0 1.6.6 1.6 1.6l-.1 9.6c0 1-.6 1.6-1.6 1.6l-9.7-.2c-1 0-1.6-.6-1.6-1.6l.1-9.5c0-1 .6-1.6 1.6-1.6Z" />
    </Icon>
  );
}
