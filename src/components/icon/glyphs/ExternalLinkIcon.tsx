import { Icon } from '../Icon.js';
import type { GlyphProps } from './types.js';

export function ExternalLinkIcon(props: GlyphProps) {
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
      <path d="m10 4.5-4.9-.1c-1.1 0-1.7.6-1.7 1.7l.1 12.8c0 1.1.6 1.7 1.7 1.7l12.8-.1c1.1 0 1.7-.6 1.7-1.7l-.1-4.9m-6.2-10.3 7 .1-.1 7m-11.1 4L20.1 4.3" />
    </Icon>
  );
}
