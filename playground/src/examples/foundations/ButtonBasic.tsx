import { useState } from 'react';
import { Button, Text } from 'yahha-ui';

export default function ButtonBasic() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
      <Button onClick={() => setCount((value) => value + 1)}>打个招呼</Button>
      <Text size="sm" tone="muted" role="status">
        已收到 {count} 次问候
      </Text>
    </div>
  );
}
