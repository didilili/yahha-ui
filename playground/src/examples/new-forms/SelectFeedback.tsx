import { useState } from 'react';
import { Select } from 'yahha-ui';

export default function SelectFeedback() {
  const [category, setCategory] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: 340 }}>
      <Select
        label="必选分类"
        options={[
          { value: 'journal', label: '生活手记' },
          { value: 'reading', label: '读书笔记' },
        ]}
        value={category}
        onValueChange={setCategory}
        required
        hint="请选择一个文章分类。"
        error={category === null ? '请先选择文章分类。' : undefined}
      />
    </div>
  );
}
