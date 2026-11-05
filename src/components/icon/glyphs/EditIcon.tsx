import { Icon } from '../Icon.js';
import type { GlyphProps } from './types.js';

export function EditIcon(props: GlyphProps) {
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
      <path d="m4.4 15.8 10.9-11c.9-.9 1.8-.8 2.7.1l1.1 1.2c.8.9.8 1.8-.1 2.6L8 19.5l-4.6 1.1Z" />
      <path d="m13.8 6.5 3.8 3.7M4.4 15.8 8 19.5" />
    </Icon>
  );
}
