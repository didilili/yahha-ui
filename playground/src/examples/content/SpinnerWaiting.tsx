import { useState } from 'react';
import { Button, Spinner, Text } from 'yahha-ui';

export default function SpinnerWaiting() {
  const [loading, setLoading] = useState(true);
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div
        role="status"
        aria-label="文章等待状态"
        style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 36 }}
      >
        {loading && <Spinner role="presentation" aria-hidden="true" />}
        <Text>{loading ? '正在加载文章…' : '文章已准备好，可以继续阅读。'}</Text>
      </div>
      <div>
        <Button variant="secondary" onClick={() => setLoading(!loading)}>
          {loading ? '显示完成状态' : '重新显示等待'}
        </Button>
      </div>
    </div>
  );
}
