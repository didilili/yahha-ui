import { Icon } from '../Icon.js';
import type { GlyphProps } from './types.js';

export function SuccessIcon(props: GlyphProps) {
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
      <path d="M20.6 11.8c.1 5-3.3 8.6-8.4 8.7-5 .1-8.7-3.3-8.8-8.3-.1-5 3.4-8.7 8.4-8.8 5-.1 8.7 3.4 8.8 8.4Z" />
      <path d="m7.7 12 2.9 3 5.8-6.1" />
    </Icon>
  );
}
