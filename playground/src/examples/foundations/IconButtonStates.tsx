import { BookmarkIcon, IconButton } from 'yahha-ui';

export default function IconButtonStates() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <span>禁用</span>
        <IconButton disabled aria-label="禁用收藏样本">
          <BookmarkIcon />
        </IconButton>
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <span>加载 · 三墨点</span>
        <IconButton loading aria-label="加载收藏样本">
          <BookmarkIcon />
        </IconButton>
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <span>加载 · 小花饼</span>
        <IconButton loading loadingVariant="biscuit" aria-label="小花饼加载收藏样本">
          <BookmarkIcon />
        </IconButton>
      </div>
    </div>
  );
}
