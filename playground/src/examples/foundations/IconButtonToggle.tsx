import { useState } from 'react';
import { BookmarkIcon, IconButton, Text } from 'yahha-ui';

export default function IconButtonToggle() {
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <IconButton
        variant="secondary"
        aria-label="收藏文章"
        aria-pressed={saved}
        onClick={() => setSaved((value) => !value)}
      >
        <BookmarkIcon filled={saved} />
      </IconButton>
      <Text size="sm" tone="muted" role="status">
        {saved ? '已收藏' : '尚未收藏'}
      </Text>
    </div>
  );
}
