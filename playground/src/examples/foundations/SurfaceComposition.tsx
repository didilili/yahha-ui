import { useId, useState } from 'react';
import { Badge, Button, Heading, Surface, Text } from 'yahha-ui';

export default function SurfaceComposition() {
  const headingId = useId();
  const [saved, setSaved] = useState(false);

  return (
    <Surface
      role="region"
      aria-labelledby={headingId}
      style={{ display: 'grid', gap: 24, maxWidth: 560 }}
    >
      <header style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <Badge>生活随笔</Badge>
        <Heading level={3} id={headingId}>
          沿着河边，等一等朋友
        </Heading>
        <Text>一篇约 5 分钟的手记：有人系鞋带，大家就站在桥边等一等。</Text>
      </header>
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <Button
          variant="secondary"
          aria-pressed={saved}
          onClick={() => setSaved((value) => !value)}
        >
          收藏文章
        </Button>
        <Text role="status" size="sm" tone="muted">
          {saved ? '已加入收藏' : '尚未收藏'}
        </Text>
      </div>
    </Surface>
  );
}
