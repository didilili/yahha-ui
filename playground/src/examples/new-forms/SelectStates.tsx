import { useState } from 'react';
import { Select } from 'yahha-ui';

const options = [
  { value: 'journal', label: '生活手记' },
  { value: 'reading', label: '读书笔记' },
];

export default function SelectStates() {
  const [category, setCategory] = useState<string | null>(null);
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 340 }}>
      <Select
        label="必选分类"
        options={options}
        value={category}
        onValueChange={setCategory}
        required
        error={category === null ? '请先选择文章分类。' : undefined}
        hint="选择分类后清除错误；校验状态由这个示例维护。"
      />
      <Select
        label="只读分类"
        options={options}
        defaultValue="journal"
        readOnly
        hint="可以查看选项，不能修改；仍参与表单提交。"
      />
      <Select
        label="暂不可用"
        options={options}
        defaultValue="reading"
        disabled
        hint="禁用字段不参与表单提交。"
      />
    </div>
  );
}
