/** The site's collection mark, matching the Little Days folded bookmark. */
export default function BookmarkMark({
  filled = false,
  size = 20,
}: {
  filled?: boolean;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8 3.25h6.2l4.05 4.1v12.7c0 .6-.5.88-1 .57L12 17.4l-5.3 3.22c-.5.31-.95.02-.95-.57V5.6C5.75 4.15 6.5 3.25 8 3.25Z"
        fill={filled ? 'currentColor' : 'none'}
        fillOpacity="0.2"
      />
      <path d="M14.2 3.5v3c0 .6.35.95.95.95h2.8" fill="none" />
    </svg>
  );
}
