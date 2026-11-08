import { useState } from 'react';
import { IconButton, PlusIcon, Text } from 'yahha-ui';

export default function IconButtonMinimal() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <IconButton aria-label="添加一页手记" onClick={() => setCount((value) => value + 1)}>
        <PlusIcon />
      </IconButton>
      <Text size="sm" tone="muted" role="status">
        已添加 {count} 页
      </Text>
    </div>
  );
}
