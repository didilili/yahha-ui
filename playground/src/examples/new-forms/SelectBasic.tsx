import { Select } from 'yahha-ui';

export default function SelectBasic() {
  const options = [
    { value: 'journal', label: '生活手记' },
    { value: 'reading', label: '读书笔记' },
    { value: 'photos', label: '散步相册' },
  ];
  return (
    <div style={{ maxWidth: 340 }}>
      <Select label="文章分类" defaultValue="journal" options={options} />
    </div>
  );
}
