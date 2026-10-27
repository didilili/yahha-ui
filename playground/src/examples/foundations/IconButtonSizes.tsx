import { IconButton } from 'yahha-ui';

function Star() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path
        d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function IconButtonSizes() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
      <IconButton size="sm" variant="ghost" aria-label="小号收藏按钮">
        <Star />
      </IconButton>
      <IconButton size="md" variant="secondary" aria-label="中号收藏按钮">
        <Star />
      </IconButton>
      <IconButton size="lg" variant="primary" aria-label="大号收藏按钮">
        <Star />
      </IconButton>
      <IconButton disabled aria-label="暂不可用的收藏按钮">
        <Star />
      </IconButton>
    </div>
  );
}
