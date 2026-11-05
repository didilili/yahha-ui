import type { DocSectionKind } from '../docs/types';

const colors = {
  paper: 'var(--site-paper, #fff)',
  pink: 'var(--site-pink, #f8bed2)',
  blue: 'var(--site-sky, #def2ff)',
  yellow: '#ffe5a1',
};

function SectionArtwork({ name }: { name: DocSectionKind }) {
  switch (name) {
    case 'usage':
      return (
        <>
          <path d="M12 5.5C9.3 4 5.7 3.9 3.2 4.8l.1 14.1c2.7-.8 6-.4 8.7 1.1Z" fill={colors.blue} />
          <path
            d="M12 5.5c2.8-1.4 6.2-1.5 8.8-.6l-.1 14c-2.8-.8-6-.4-8.7 1.1Z"
            fill={colors.paper}
          />
          <path d="M5.9 8.7c1.2-.1 2.3 0 3.4.4m-3.4 3.2c1.2-.1 2.3 0 3.4.3m5.3-3.5c1.1-.4 2.3-.5 3.5-.3m-3.5 3.9c1.2-.4 2.3-.5 3.5-.3" />
        </>
      );
    case 'examples':
      return (
        <>
          <path
            d="m4.6 4.5 14.9.2c1.2 0 1.8.7 1.8 1.8L21.1 18c0 1.2-.7 1.8-1.9 1.8l-14.8-.2c-1.2 0-1.8-.7-1.8-1.9l.1-11.4c0-1.2.7-1.8 1.9-1.8Z"
            fill={colors.paper}
          />
          <path d="m3.6 5.4 16.7.2v3L3.5 8.4Z" fill={colors.blue} stroke="none" />
          <path d="m3 8.8 17.9.1m-12.2 2.4-2.4 2.2 2.4 2.3m6.5-4.4 2.4 2.2-2.4 2.2m-2.6-5.2-1.4 5.8" />
        </>
      );
    case 'integration':
      return (
        <>
          <path
            d="M12 4.6h7.2c1.1 0 1.7.6 1.7 1.7l-.1 9.1c0 1.1-.6 1.7-1.7 1.7H12v-3.2c1.8.7 3.6-.3 3.6-2s-1.8-2.7-3.6-2Z"
            fill={colors.blue}
          />
          <path
            d="M4.7 6.5H12v3.4c1.8-.7 3.6.3 3.6 2s-1.8 2.7-3.6 2v5.6H4.7c-1.1 0-1.7-.6-1.7-1.7V8.2c0-1.1.6-1.7 1.7-1.7Z"
            fill={colors.pink}
          />
        </>
      );
    case 'api':
      return (
        <>
          <path
            d="M6.4 3.2h8.3L19 7.4l-.2 11.8c0 1.1-.6 1.8-1.8 1.8l-10.7-.2c-1.1 0-1.7-.7-1.7-1.8l.1-14c0-1.1.6-1.8 1.7-1.8Z"
            fill={colors.paper}
          />
          <path d="m14.7 3.3-.1 4.2 4.3-.1" fill={colors.blue} />
          <path d="M9.1 10H7.8v6.8h1.3m5.6-6.7H16v6.7h-1.3m-3.8-5h2m-2 3.2h2" />
        </>
      );
    case 'accessibility':
      return (
        <>
          <path
            d="m6.1 4.8 12 .2c1.8 0 2.8 1.2 2.8 3l-.1 9.3c0 1.8-1.1 2.8-2.9 2.8l-11.9-.2c-1.8 0-2.8-1-2.8-2.8l.1-9.4c0-1.8 1-2.9 2.8-2.9Z"
            fill={colors.blue}
          />
          <path
            d="m7.5 7.4 9.2.1c1 0 1.6.6 1.6 1.6l-.1 6.3c0 1-.6 1.6-1.6 1.6l-9.2-.1c-1 0-1.6-.6-1.6-1.6l.1-6.3c0-1 .6-1.6 1.6-1.6Z"
            fill={colors.paper}
          />
          <path d="M15.3 10v3.1H8.9m1.7-1.8-1.8 1.8 1.8 1.8" />
        </>
      );
    case 'behavior':
      return (
        <>
          <path d="m10.7 6.8 6.5.1-.1 5.4m-2-2.1 2 2.2 2.1-2.1" />
          <path
            d="M10.5 6.8c0 2.2-1.4 3.7-3.6 3.7S3.2 9 3.2 6.8s1.5-3.6 3.7-3.6 3.6 1.4 3.6 3.6Z"
            fill={colors.pink}
          />
          <path
            d="m14.3 14.1 5.1.1c1 0 1.6.6 1.6 1.6l-.1 4c0 1-.6 1.6-1.6 1.6l-5-.1c-1 0-1.6-.6-1.6-1.6v-4c0-1 .6-1.6 1.6-1.6Z"
            fill={colors.blue}
          />
        </>
      );
    case 'styling':
      return (
        <>
          <path d="M3 17.5 14.8 4.6l4.1 3.8L7.1 21.2Z" fill={colors.yellow} />
          <path d="m6.1 14.3 1.7 1.5m1.3-4.8 1.6 1.6m1.4-4.8 1.6 1.6" />
          <path
            d="m5.2 5.7 2-2c.6-.6 1.1-.5 1.7.1l10.8 11.9 1.1 4.7-4.5-1.6L5.2 7.3c-.5-.6-.5-1.1 0-1.6Z"
            fill={colors.pink}
          />
          <path d="m6.5 4.5 2.7 2.9m7 11.3 3.5-3" />
        </>
      );
    case 'related':
      return (
        <>
          <path d="m10.8 7.7 6.5.1-.1 5.1" />
          <path
            d="m4.3 3.5 5.1.1c1.1 0 1.6.6 1.6 1.7l-.1 5c0 1.1-.6 1.7-1.7 1.7l-5.1-.1c-1.1 0-1.6-.6-1.6-1.7l.1-5c0-1.1.6-1.7 1.7-1.7Z"
            fill={colors.blue}
          />
          <path
            d="m14.7 12.5 5 .1c1.1 0 1.7.6 1.7 1.7l-.1 5c0 1.1-.6 1.7-1.7 1.7l-5-.1c-1.1 0-1.7-.6-1.7-1.7l.1-5c0-1.1.6-1.7 1.7-1.7Z"
            fill={colors.pink}
          />
          <path d="m5 7.7 3.4.1m7.2 8.9 3.3.1" />
        </>
      );
    case 'guidance':
      return (
        <>
          <path
            d="m5.8 4 12.6.3c1.1 0 1.8.7 1.8 1.8l-.1 9.2-5 5.1-9.6-.2c-1.1 0-1.7-.6-1.7-1.8L4 5.7C4 4.6 4.6 4 5.8 4Z"
            fill={colors.yellow}
          />
          <path d="m15.1 20.4.1-3.9c0-.9.4-1.3 1.3-1.3l3.6.1" fill={colors.paper} />
          <path d="m7.7 8.7 8.4.2m-8.4 3.4 6 .1" />
        </>
      );
  }
}

/** Reusable chapter identities; the adjacent heading provides the accessible name. */
export default function SectionIcon({
  name,
  className,
}: {
  name: DocSectionKind;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="29"
      height="29"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      data-section-icon={name}
    >
      <SectionArtwork name={name} />
    </svg>
  );
}
