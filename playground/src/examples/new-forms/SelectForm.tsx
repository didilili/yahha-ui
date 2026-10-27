import { useState } from 'react';
import { Button, Select } from 'yahha-ui';

export default function SelectForm() {
  const [result, setResult] = useState('');
  return (
    <form
      style={{ display: 'grid', gap: 16, maxWidth: 340 }}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(String(new FormData(event.currentTarget).get('category') ?? ''));
      }}
      onReset={() => setResult('')}
    >
      <Select
        label="归档分类"
        name="category"
        required
        defaultValue="journal"
        options={[
          { value: 'journal', label: '日常手记' },
          { value: 'reading', label: '读书笔记' },
          { value: 'walking', label: '那些沿着河边散步时记录下来的小小发现与漫长想法' },
          { value: 'photos', label: '散步相册' },
          { value: 'letters', label: '写给朋友的信' },
          { value: 'recipes', label: '厨房里的小记录' },
          { value: 'travel', label: '旅途与见闻' },
          { value: 'favorites', label: '值得再看的收藏' },
        ]}
        hint="长列表可滚动，长选项完整换行；非受控值随表单重置为日常手记。"
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="submit">读取表单</Button>
        <Button type="reset" variant="secondary">
          重置
        </Button>
      </div>
      <p role="status" style={{ margin: 0 }}>
        提交值：{result || '尚未提交'}
      </p>
    </form>
  );
}
