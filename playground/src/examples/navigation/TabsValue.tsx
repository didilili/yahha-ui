import { useState } from 'react';
import { Tabs, Text } from 'yahha-ui';

export default function TabsValue() {
  const [value, setValue] = useState<string | null>('notes');

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Tabs
        label="小站栏目"
        value={value}
        onValueChange={setValue}
        items={[
          { value: 'notes', label: '手记', content: <p>今天想记下的一件小事。</p> },
          { value: 'photos', label: '相册', content: <p>这一周拍下的树影与晚霞。</p> },
        ]}
      />
      <Text size="sm" tone="muted" role="status">
        当前栏目：{value === 'notes' ? '手记' : '相册'}
      </Text>
    </div>
  );
}
