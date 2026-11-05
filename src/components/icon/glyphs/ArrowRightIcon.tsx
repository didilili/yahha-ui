import { Icon } from '../Icon.js';
import type { GlyphProps } from './types.js';

export function ArrowRightIcon(props: GlyphProps) {
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
      <path d="m4.1 11.9 15.5.2m-6.8-6.7 6.9 6.7-6.8 6.3" />
    </Icon>
  );
}
