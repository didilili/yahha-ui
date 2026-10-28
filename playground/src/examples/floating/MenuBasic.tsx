import { useState } from 'react';
import { Button, DropdownMenu, Text } from 'yahha-ui';

export default function MenuBasic() {
  const [message, setMessage] = useState('操作结果：尚未选择。');
  return (
    <div style={{ display: 'grid', justifyItems: 'center', gap: 16 }}>
      <DropdownMenu
        trigger={<Button variant="secondary">文章操作</Button>}
        items={[
          {
            id: 'save',
            label: '收藏文章',
            onSelect: () => setMessage('操作结果：已选择“收藏文章”。'),
          },
          {
            id: 'share',
            label: '生成分享摘要',
            onSelect: () => setMessage('操作结果：已选择“生成分享摘要”。'),
          },
        ]}
      />
      <Text size="sm" tone="muted" role="status">
        {message}
      </Text>
    </div>
  );
}
