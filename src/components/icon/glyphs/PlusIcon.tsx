import { Icon } from '../Icon.js';
import type { GlyphProps } from './types.js';

export function PlusIcon(props: GlyphProps) {
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
      <path d="m12 4.6-.1 14.9M4.6 12l14.8.1" />
    </Icon>
  );
}
