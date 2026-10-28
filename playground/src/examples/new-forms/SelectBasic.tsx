import { Select } from 'yahha-ui';

export default function SelectBasic() {
  return (
    <div style={{ maxWidth: 340 }}>
      <Select
        label="文章分类"
        placeholder="选择一个分类"
        options={[
          { value: 'journal', label: '生活手记' },
          { value: 'reading', label: '读书笔记' },
          { value: 'photos', label: '散步相册' },
        ]}
      />
    </div>
  );
}
