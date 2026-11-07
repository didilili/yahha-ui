import { useState } from 'react';
import { BookmarkIcon, IconButton, Text } from 'yahha-ui';

export default function IconButtonSoftActions() {
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>常规</span>
          <IconButton aria-label="收藏文章">
            <BookmarkIcon />
          </IconButton>
        </div>
        <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>软团</span>
          <IconButton aria-label="收藏文章" appearance="soft">
            <BookmarkIcon />
          </IconButton>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
        <IconButton
          aria-label="收藏这篇文章"
          appearance="soft"
          variant="secondary"
          aria-pressed={saved}
          onClick={() => setSaved((value) => !value)}
        >
          <BookmarkIcon filled={saved} />
        </IconButton>
        <Text size="sm" tone="muted" role="status">
          {saved ? '已收藏' : '尚未收藏'}
        </Text>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>禁用</span>
          <IconButton aria-label="收藏文章" appearance="soft" disabled>
            <BookmarkIcon />
          </IconButton>
        </div>
        <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>默认三墨点</span>
          <IconButton aria-label="收藏文章" appearance="soft" loading>
            <BookmarkIcon />
          </IconButton>
        </div>
        <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>可选小花饼</span>
          <IconButton aria-label="收藏文章" appearance="soft" loading loadingVariant="biscuit">
            <BookmarkIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
