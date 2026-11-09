import { BookmarkIcon, IconButton } from 'yahha-ui';

export default function IconButtonVariants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
        <div key={variant} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>
            {variant === 'primary' ? '主要' : variant === 'secondary' ? '次要' : '低强调'}
          </span>
          <IconButton variant={variant} aria-label={`${variant} 变体收藏样本`}>
            <BookmarkIcon />
          </IconButton>
        </div>
      ))}
    </div>
  );
}
