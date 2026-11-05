import { IconButton } from 'yahha-ui';

function Bookmark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 3.25h6.2l4.05 4.1v12.7c0 .6-.5.88-1 .57L12 17.4l-5.3 3.22c-.5.31-.95.02-.95-.57V5.6C5.75 4.15 6.5 3.25 8 3.25Z" />
      <path d="M14.2 3.5v3c0 .6.35.95.95.95h2.8" fill="none" />
    </svg>
  );
}

export default function IconButtonStates() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <span>禁用</span>
        <IconButton disabled aria-label="禁用收藏样本">
          <Bookmark />
        </IconButton>
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <span>加载</span>
        <IconButton loading aria-label="加载收藏样本">
          <Bookmark />
        </IconButton>
      </div>
    </div>
  );
}
