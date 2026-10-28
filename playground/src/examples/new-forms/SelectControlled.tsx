import { useState } from 'react';
import { Button, Select, Text } from 'yahha-ui';

export default function SelectControlled() {
  const [sort, setSort] = useState<string | null>('newest');
  const labels: Record<string, string> = {
    newest: '最近发布',
    oldest: '从第一篇开始',
    popular: '最多阅读',
  };
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 340 }}>
      <Select
        label="排列方式"
        value={sort}
        onValueChange={setSort}
        options={[
          { value: 'newest', label: '最近发布' },
          { value: 'oldest', label: '从第一篇开始' },
          { value: 'popular', label: '最多阅读', disabled: true },
        ]}
        hint="“最多阅读”暂未开放。"
      />
      <Text size="sm" tone="muted" role="status">
        当前值：{sort === null ? '未选择' : labels[sort]}。
      </Text>
      <Button variant="secondary" onClick={() => setSort(null)}>
        清空选择
      </Button>
    </div>
  );
}
