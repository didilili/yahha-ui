import { Icon } from '../Icon.js';
import type { GlyphProps } from './types.js';

export function SearchIcon(props: GlyphProps) {
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
      <path d="M17.2 10.5c.1 3.9-2.5 6.7-6.5 6.8-4 .1-6.9-2.6-7-6.5-.1-4 2.5-6.9 6.5-7 4-.1 6.9 2.6 7 6.7Z" />
      <path d="m15.5 15.7 5.4 5.2" />
    </Icon>
  );
}
