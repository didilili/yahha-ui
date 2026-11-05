import { Icon } from '../Icon.js';
import type { GlyphProps } from './types.js';

export function TrashIcon(props: GlyphProps) {
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
      <path d="m5.9 7.4.7 12c.1 1 .6 1.5 1.6 1.5l7.8-.1c1 0 1.5-.5 1.6-1.5l.7-11.9M3.9 7.3l16.2.1M8.6 7.3l.1-2.4c0-.9.5-1.3 1.4-1.3h3.8c.9 0 1.4.5 1.4 1.4v2.3m-5.8 3.4.2 6.5m4.7-6.5-.2 6.5" />
    </Icon>
  );
}
