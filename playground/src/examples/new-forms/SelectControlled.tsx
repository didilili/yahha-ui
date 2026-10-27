import { useState } from 'react';
import { Button, Select } from 'yahha-ui';

export default function SelectControlled() {
  const [sort, setSort] = useState<string | null>('newest');
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
        hint="最多阅读暂未开放，方向键可聚焦该选项，但不能选中。"
      />
      <p role="status" style={{ margin: 0 }}>
        当前值：{sort ?? '尚未选择'}
      </p>
      <Button variant="secondary" onClick={() => setSort(null)}>
        清空选择
      </Button>
    </div>
  );
}
