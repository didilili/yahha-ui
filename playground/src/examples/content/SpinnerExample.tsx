import { useState } from 'react';
import { Button, Spinner, Text } from 'yahha-ui';

export default function SpinnerExample() {
  const [loading, setLoading] = useState(true);
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', gap: 24 }}>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Spinner size="sm" label="小号示例正在加载" />
          <Text size="sm" tone="muted">
            小号 · 16px
          </Text>
        </div>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Spinner label="中号示例正在加载" />
          <Text size="sm" tone="muted">
            常规 · 24px
          </Text>
        </div>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Spinner size="lg" label="大号示例正在加载" />
          <Text size="sm" tone="muted">
            大号 · 36px
          </Text>
        </div>
      </div>
      <div
        role="status"
        aria-label="文章等待状态"
        style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 36 }}
      >
        {loading && <Spinner role="presentation" aria-hidden="true" />}
        <Text>{loading ? '稍等一下，文章还在路上。' : '文章已准备好，可以继续阅读。'}</Text>
      </div>
      <div>
        <Button variant="secondary" onClick={() => setLoading(!loading)}>
          {loading ? '显示完成状态' : '重新显示等待'}
        </Button>
      </div>
      <Text size="sm" tone="muted">
        示例按钮切换等待结果；真实请求和超时处理由使用方管理，墨点不表示百分比进度。
      </Text>
    </div>
  );
}
