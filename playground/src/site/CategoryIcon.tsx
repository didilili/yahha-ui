export type CategoryIconName =
  | 'components'
  | 'general'
  | 'typography'
  | 'layout'
  | 'forms'
  | 'content'
  | 'navigation'
  | 'overlays'
  | 'feedback'
  | 'theme';

type CategoryIconProps = {
  name: CategoryIconName;
  className?: string;
  size?: 'compact' | 'regular';
};

const colors = {
  paper: 'var(--site-paper, #fff)',
  pink: 'var(--site-pink, #f8bed2)',
  blue: 'var(--site-sky, #def2ff)',
  yellow: '#ffe5a1',
};

function CategoryArtwork({ name, compact }: { name: CategoryIconName; compact: boolean }) {
  switch (name) {
    case 'components':
      return (
        <>
          <path
            d="M4.6 3.4 9 3.2c1 0 1.5.6 1.5 1.5l-.1 4.1c0 1-.6 1.5-1.6 1.5l-4.2-.1C3.5 10.2 3 9.6 3 8.7l.1-3.8c0-1 .5-1.5 1.5-1.5Z"
            fill={colors.pink}
          />
          <path
            d="m15.1 3.3 4.1.1c1 0 1.6.5 1.6 1.5l-.1 4c0 1-.5 1.6-1.5 1.6l-4.1-.1c-1 0-1.6-.5-1.6-1.5l.1-4.1c0-.9.5-1.5 1.5-1.5Z"
            fill={colors.blue}
          />
          <path
            d="m4.6 13.6 4.2.1c1 0 1.6.5 1.6 1.5l-.1 4.1c0 1-.6 1.5-1.6 1.5l-4.1-.1c-1 0-1.5-.5-1.5-1.5v-4.1c0-1 .5-1.5 1.5-1.5Z"
            fill={colors.yellow}
          />
          <path
            d="m15 13.6 4.3-.1c1 0 1.5.6 1.5 1.6l-.1 4.1c0 1-.5 1.6-1.5 1.6h-4.1c-1 0-1.6-.6-1.6-1.6v-4c0-1 .5-1.6 1.5-1.6Z"
            fill={colors.paper}
          />
        </>
      );
    case 'general':
      return (
        <>
          <path
            d="M7.4 4.3c2.8-.7 6.7-.6 9.3.1 2.5.7 3.8 3.4 3.6 7.8-.1 4.5-1.8 7.4-4.7 7.8-2.5.4-5.9.4-8.1-.1C4.8 19.3 3.6 16.5 3.6 12c0-4.3 1.3-7.1 3.8-7.7Z"
            fill={colors.pink}
          />
          <path d="M5 15.1c3.7 1.6 10.3 1.7 14.2.1" />
          {!compact && <path d="M7.2 8c1.1-.7 2.7-1 4.3-1" />}
        </>
      );
    case 'typography':
      return (
        <>
          <path
            d="m6.4 3.2 11.2.3c1.1 0 1.8.7 1.8 1.8l-.2 13.9c0 1.1-.6 1.8-1.8 1.8L6.1 20.7c-1.1 0-1.7-.7-1.7-1.8l.2-13.8c0-1.2.6-1.9 1.8-1.9Z"
            fill={colors.paper}
          />
          <path d="m8 8 .1-1.1 7.8.1v1.2M12 7.1l-.1 7.2m-1.7 0h3.4" />
          <path d="m8.1 17.6 7.7.1" />
        </>
      );
    case 'layout':
      return (
        <>
          <path
            d="m4.4 4.6 15.1.2c1.2 0 1.8.7 1.8 1.9l-.2 11.2c0 1.2-.7 1.8-1.9 1.8l-14.9-.2c-1.2 0-1.8-.7-1.8-1.9l.1-11.1c0-1.2.6-1.9 1.8-1.9Z"
            fill={colors.paper}
          />
          <path d="m3 8.8 17.8.1M8.7 9l-.1 10.2" />
          <path d="m3.4 5.6 16.9.2v2.9L3.3 8.5Z" fill={colors.blue} stroke="none" />
          <path d="m3.4 9.6 4.6.1-.1 9-4.5-.1Z" fill={colors.pink} stroke="none" />
          {!compact && <path d="m11.8 12.5 5.9.1m-5.9 3.2h4.1" />}
        </>
      );
    case 'forms':
      return (
        <>
          <path
            d="m7 4.6 10.3.2c1.2 0 1.9.7 1.9 1.9L19 19.1c0 1.2-.7 1.8-1.9 1.8l-10.2-.2c-1.1 0-1.8-.6-1.8-1.8l.2-12.4c0-1.2.6-1.9 1.7-1.9Z"
            fill={colors.paper}
          />
          <path
            d="m10.2 2.9 3.8.1c.8 0 1.3.5 1.3 1.2v2.1L9 6.2V4.1c0-.8.4-1.2 1.2-1.2Z"
            fill={colors.pink}
          />
          <path d="m8 10.3.8.9 1.5-1.9m2.1 1.1h3.8M8 14.6l.8.9 1.5-1.9m2.1 1.2h3.6" />
          {!compact && <path d="M8.1 18h2m2.3 0h3.7" />}
        </>
      );
    case 'content':
      return (
        <>
          <path
            d="m4.6 4.1 15 .3c1.1 0 1.7.7 1.7 1.8L21 18.7c0 1.1-.7 1.8-1.8 1.8l-14.7-.3c-1.1 0-1.7-.7-1.7-1.8L3 5.9c0-1.1.5-1.8 1.6-1.8Z"
            fill={colors.paper}
          />
          <path d="m5.1 6.4 14 .2-.2 10.8-14-.2Z" fill={colors.blue} stroke="none" />
          <circle cx="15.4" cy="9.4" r="1.5" fill={colors.yellow} stroke="none" />
          <path d="m5.1 14.6 4.1-4.1 4.4 4.6 2.2-2.1 3.2 3.1v1.3L5 17.2Z" fill={colors.pink} />
        </>
      );
    case 'navigation':
      return (
        <>
          <path d="m11.8 2.8-.1 18.5" />
          <path d="m4.2 5.1 13.6.1 3.1 2.7-3.2 2.6-13.5-.2Z" fill={colors.blue} />
          <path d="m6.3 12.6 12.7.2-.1 5.1-12.7-.1-3.1-2.6Z" fill={colors.yellow} />
          {!compact && <path d="m7.1 7.8 7.5.1m-5.6 7.4h6.9" />}
        </>
      );
    case 'overlays':
      return (
        <>
          <path
            d="m4.6 3.8 10.5-.6c1.1-.1 1.7.6 1.8 1.6l.6 10.1c.1 1.1-.5 1.8-1.6 1.8l-10.5.6c-1.1.1-1.7-.5-1.8-1.6L3 5.6c-.1-1.1.5-1.7 1.6-1.8Z"
            fill={colors.blue}
          />
          <path
            d="m8.9 7.3 10.3.3c1.1 0 1.7.7 1.7 1.8l-.3 10.1c0 1.1-.7 1.7-1.8 1.7l-10.2-.3c-1.1 0-1.8-.6-1.8-1.7l.3-10.2c0-1.1.7-1.7 1.8-1.7Z"
            fill={colors.paper}
          />
          <path d="m10.1 11.8 7.3.2" />
          {!compact && <path d="m10 16.2 5.1.1" />}
        </>
      );
    case 'feedback':
      return (
        <>
          <path
            d="M11.8 3.2c1.5-.5 2.6.9 4 1.1 1.5.3 3 .7 3.4 2.3.4 1.4 1.9 2.4 1.6 4-.3 1.5.4 3-.6 4.2-1 1.1-1.2 2.9-2.7 3.4-1.4.5-2.3 2.1-3.9 1.8-1.5-.2-3.1.7-4.3-.3-1.2-.9-3-.9-3.7-2.3-.7-1.4-2.3-2-2.1-3.6.1-1.6-1-3-.2-4.3.8-1.4.6-3.1 2-3.9 1.2-.8 1.9-2.5 3.4-2.3 1.1.1 2.1.2 3.1-.1Z"
            fill={colors.yellow}
          />
          <path d="m12 7.4.1 5.8" />
          <circle cx="12.1" cy="16.5" r=".85" fill="currentColor" stroke="none" />
        </>
      );
    case 'theme':
      return (
        <>
          <path
            d="M11.9 3.2C6.7 3.1 3 6.5 3.1 11.6c.1 5.3 3.7 8.9 8.7 9.1 2.4.1 4.4-1.4 3.5-3.5-.5-1.3-1.6-2.2-.6-3.6 1-1.4 3 .1 4.5-1.2 1.8-1.4 1.7-4.5-.1-6.2-1.6-1.7-4.4-2.9-7.2-3Z"
            fill={colors.paper}
          />
          <circle cx="7.3" cy="10.8" r="1.65" fill={colors.blue} stroke="none" />
          <circle cx="10.2" cy="6.9" r="1.65" fill={colors.pink} stroke="none" />
          <circle cx="14.9" cy="7" r="1.65" fill={colors.yellow} stroke="none" />
          <circle cx="7.8" cy="16" r="1.25" />
        </>
      );
  }
}

/** Stable category marks for the site; decorative and separate from the library API. */
export default function CategoryIcon({ name, className, size = 'regular' }: CategoryIconProps) {
  const compact = size === 'compact';
  const dimension = compact ? 20 : 29;

  return (
    <svg
      viewBox="0 0 24 24"
      width={dimension}
      height={dimension}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      data-category-icon={name}
      data-icon-size={size}
    >
      <CategoryArtwork name={name} compact={compact} />
    </svg>
  );
}
