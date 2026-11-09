import { BookmarkIcon, IconButton } from 'yahha-ui';

export default function IconButtonSizes() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
      {(
        [
          ['sm', '小号'],
          ['md', '中号'],
          ['lg', '大号'],
        ] as const
      ).map(([size, label]) => (
        <div key={size} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>
            {label} {size}
          </span>
          <IconButton size={size} aria-label={`${size} 尺寸收藏样本`}>
            <BookmarkIcon />
          </IconButton>
        </div>
      ))}
    </div>
  );
}
