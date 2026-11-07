import { useState } from 'react';
import { BookmarkIcon, Button, Text } from 'yahha-ui';

export default function ButtonSoftActions() {
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 24, width: '100%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
        <Button
          appearance="soft"
          variant="secondary"
          startIcon={<BookmarkIcon filled={saved} />}
          aria-pressed={saved}
          onClick={() => setSaved((value) => !value)}
        >
          收藏文章
        </Button>
        <Text size="sm" tone="muted" role="status">
          {saved ? '已收藏' : '尚未收藏'}
        </Text>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>禁用</span>
          <Button appearance="soft" disabled>
            保存草稿
          </Button>
        </div>
        <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>默认三墨点</span>
          <Button appearance="soft" loading>
            保存草稿
          </Button>
        </div>
        <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>可选小花饼</span>
          <Button appearance="soft" loading loadingVariant="biscuit">
            保存草稿
          </Button>
        </div>
      </div>
      <div style={{ display: 'grid', gap: 8, width: 'min(100%, 240px)' }}>
        <span>长文案</span>
        <Button
          appearance="soft"
          variant="secondary"
          startIcon={<BookmarkIcon />}
          style={{ width: '100%' }}
        >
          将这篇周末散步记录加入稍后阅读
        </Button>
      </div>
    </div>
  );
}
