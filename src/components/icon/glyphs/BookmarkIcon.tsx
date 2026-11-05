import { Icon } from '../Icon.js';
import type { GlyphProps } from './types.js';

export interface BookmarkIconProps extends GlyphProps {
  /** Fill the bookmark body with a light wash; the folded corner stays open. */
  filled?: boolean;
}

export function BookmarkIcon({ filled = false, ...props }: BookmarkIconProps) {
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
      <path
        d="M8 3.25h6.2V6.5c0 .6.35.95.95.95h3.1v12.6c0 .6-.5.88-1 .57L12 17.4l-5.3 3.22c-.5.31-.95.02-.95-.57V5.6C5.75 4.15 6.5 3.25 8 3.25Z"
        fill={props.fill ?? (filled ? 'currentColor' : 'none')}
        fillOpacity={props.fillOpacity ?? 0.2}
        stroke="none"
      />
      <path
        d="M8 3.25h6.2l4.05 4.1v12.7c0 .6-.5.88-1 .57L12 17.4l-5.3 3.22c-.5.31-.95.02-.95-.57V5.6C5.75 4.15 6.5 3.25 8 3.25Z"
        fill="none"
      />
      <path d="M14.2 3.5v3c0 .6.35.95.95.95h2.8" fill="none" />
    </Icon>
  );
}
