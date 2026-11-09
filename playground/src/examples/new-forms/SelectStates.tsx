import { Select } from 'yahha-ui';

const options = [
  { value: 'journal', label: '生活手记' },
  { value: 'reading', label: '读书笔记' },
];

export default function SelectStates() {
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 340 }}>
      <Select
        label="单项禁用"
        options={[...options, { value: 'photos', label: '散步相册', disabled: true }]}
        defaultValue="journal"
        hint="“散步相册”暂不可选，其他分类仍可切换。"
      />
      <Select
        label="只读分类"
        options={options}
        defaultValue="journal"
        readOnly
        hint="可以查看选项，不能修改。"
      />
      <Select
        label="暂不可用"
        options={options}
        defaultValue="reading"
        disabled
        hint="此分类暂不可更改。"
      />
    </div>
  );
}
