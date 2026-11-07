/** A small jam biscuit from the friends' everyday world; decorative, never an action icon. */
export function BiscuitLoadingGlyph() {
  const edge =
    'M12 1.95C13.75 1.95 14.9 4.09 16.15 4.81C17.4 5.54 19.83 5.46 20.7 6.97C21.58 8.49 20.3 10.55 20.3 12C20.3 13.45 21.58 15.51 20.7 17.02C19.83 18.54 17.4 18.46 16.15 19.19C14.9 19.91 13.75 22.05 12 22.05C10.25 22.05 9.1 19.91 7.85 19.19C6.6 18.46 4.17 18.54 3.3 17.03C2.42 15.51 3.7 13.45 3.7 12C3.7 10.55 2.42 8.49 3.3 6.97C4.17 5.46 6.6 5.54 7.85 4.81C9.1 4.09 10.25 1.95 12 1.95';
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        data-biscuit-shell=""
        d={edge}
        fill="#e6b878"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
      <path
        data-biscuit-crumb=""
        d={edge}
        transform="translate(12 12) scale(.82) translate(-12 -12)"
        fill="#fff0d3"
      />
      <path
        data-biscuit-jam=""
        d="M11.9 14c-1-.8-3.2-1.9-3-3.5.1-1.4 1.9-1.6 2.7-.5.6-1.5 2.5-1.4 2.8.1.3 1.4-1.5 3-2.5 3.9Z"
        fill="#df9bb3"
        stroke="currentColor"
        strokeWidth=".8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
