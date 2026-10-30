import { useState } from 'react';
import { Button, DropdownMenu, Text } from 'yahha-ui';

export default function MenuOpen() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'grid', justifyItems: 'center', gap: 16 }}>
      <DropdownMenu
        trigger={<Button variant="secondary">文章操作</Button>}
        open={open}
        onOpenChange={setOpen}
        items={[
          {
            id: 'save',
            label: '收藏到本页',
            onSelect: () => setOpen(false),
          },
        ]}
      />
      <Text size="sm" tone="muted" role="status">
        菜单状态：{open ? '展开' : '收起'}
      </Text>
    </div>
  );
}
