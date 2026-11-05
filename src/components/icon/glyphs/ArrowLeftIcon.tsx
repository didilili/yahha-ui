import { Icon } from '../Icon.js';
import type { GlyphProps } from './types.js';

export function ArrowLeftIcon(props: GlyphProps) {
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
      <path d="m19.9 12.1-15.5-.2m6.8-6.3-6.9 6.3 6.6 6.7" />
    </Icon>
  );
}
