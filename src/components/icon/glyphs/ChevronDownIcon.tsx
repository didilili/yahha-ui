import { Icon } from '../Icon.js';
import type { GlyphProps } from './types.js';

export function ChevronDownIcon(props: GlyphProps) {
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
      <path d="m5.2 8.7 6.6 6.8 7-6.5" />
    </Icon>
  );
}
