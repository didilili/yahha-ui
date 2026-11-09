import { useState } from 'react';
import { Alert, Button } from 'yahha-ui';

export default function AlertRecovery() {
  const [recovered, setRecovered] = useState(false);

  return (
    <Alert
      tone={recovered ? 'success' : 'error'}
      title={recovered ? '手记已重新载入' : '手记暂时无法载入'}
      role="status"
    >
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <p style={{ margin: 0 }}>
          {recovered
            ? '《周末散步》回来了。小八在页角画的面包，一个也没少。'
            : '《周末散步》的内容仍然保留，可以重新载入。'}
        </p>
        <Button variant="secondary" onClick={() => setRecovered(!recovered)}>
          {recovered ? '再次显示错误' : '重新载入手记'}
        </Button>
      </div>
    </Alert>
  );
}
