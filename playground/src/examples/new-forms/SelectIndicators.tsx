import { useState } from 'react';
import { Select } from 'yahha-ui';

export default function SelectIndicators() {
  const [category, setCategory] = useState<string | null>('journal');
  const options = [
    { value: 'journal', label: '生活手记' },
    { value: 'reading', label: '读书笔记' },
    { value: 'photos', label: '散步相册' },
  ];

  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 340 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <span>普通勾</span>
        <Select label="文章分类" value={category} onValueChange={setCategory} options={options} />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <span>纸章装饰</span>
        <Select
          label="文章分类"
          value={category}
          onValueChange={setCategory}
          options={options}
          selectedIndicator="stamp"
        />
      </div>
    </div>
  );
}
