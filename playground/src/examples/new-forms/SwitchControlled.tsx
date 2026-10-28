import { useState } from 'react';
import { Heading, Surface, Switch, Text } from 'yahha-ui';

export default function SwitchControlled() {
  const [showExcerpt, setShowExcerpt] = useState(true);
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Switch
        label="显示文章摘要"
        hint="开启后显示下方文章的摘要。"
        checked={showExcerpt}
        onChange={(event) => setShowExcerpt(event.target.checked)}
      />
      <Surface style={{ display: 'grid', gap: 12 }}>
        <Heading level={3}>沿着河边，慢慢走</Heading>
        {showExcerpt && <Text>记录今天散步时遇见的小小发现。</Text>}
      </Surface>
      <Text size="sm" tone="muted" role="status">
        {showExcerpt ? '摘要已显示。' : '摘要已隐藏，文章标题仍然保留。'}
      </Text>
    </div>
  );
}
