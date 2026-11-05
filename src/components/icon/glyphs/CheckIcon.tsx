import { Icon } from '../Icon.js';
import type { GlyphProps } from './types.js';

export function CheckIcon(props: GlyphProps) {
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
      <path d="m4.8 12 4.6 4.8L19.5 6.8" />
    </Icon>
  );
}
