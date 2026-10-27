type MotifName = 'flower' | 'sprout' | 'cloud' | 'star' | 'letter';

/** Small, decorative vector vocabulary used only by this review surface. */
export default function Motif({ name, className }: { name: MotifName; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {name === 'flower' && (
        <>
          <path
            d="M31 27C12 22 13 6 25 9c8-15 23-8 19 4 18-1 19 17 7 20 8 15-10 25-18 12-12 13-27 0-18-11-8-8 0-18 16-7Z"
            fill="#f8c4d2"
          />
          <circle cx="34" cy="28" r="8" fill="#ffe8a3" />
          <path d="M33 46v12m0-5c-10 1-15-5-14-9 8-1 13 3 14 9Z" fill="#bad7a4" />
        </>
      )}
      {name === 'sprout' && (
        <>
          <path
            d="M32 55V29M31 39C12 40 7 26 9 16c15-1 24 9 22 23Zm2-10C32 14 43 7 55 10c0 13-8 23-22 19Z"
            fill="#b8d69f"
          />
          <path d="M13 58c9-3 28-3 38 0" />
        </>
      )}
      {name === 'cloud' && (
        <path
          d="M15 46C1 45 1 29 12 26 9 10 31 6 37 20c13-7 25 2 22 12 10 11-1 18-12 16-10 1-22-2-32-2Z"
          fill="#fffefa"
        />
      )}
      {name === 'star' && (
        <path d="m31 7 8 15 17 3-12 12 2 18-15-8-16 7 3-18L6 24l18-2Z" fill="#ffe5a1" />
      )}
      {name === 'letter' && (
        <>
          <path d="m8 18 47-4 3 35-47 5Z" fill="#fffefa" />
          <path d="m9 20 25 17 21-21M12 51l16-20m27 16L40 30" />
          <path d="M32 32c-8-8-15 3 1 11 13-11 5-19-1-11Z" fill="#f8bacb" />
        </>
      )}
    </svg>
  );
}
