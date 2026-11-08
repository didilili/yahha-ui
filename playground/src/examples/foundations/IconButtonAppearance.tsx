import { BookmarkIcon, IconButton } from 'yahha-ui';

export default function IconButtonAppearance() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
      {(['default', 'soft'] as const).map((appearance) => (
        <div key={appearance} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>{appearance === 'default' ? '常规（默认）' : '软团'}</span>
          <IconButton aria-label="收藏文章" appearance={appearance}>
            <BookmarkIcon />
          </IconButton>
        </div>
      ))}
    </div>
  );
}
