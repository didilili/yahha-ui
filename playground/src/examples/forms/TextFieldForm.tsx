import { useState } from 'react';
import { Button, TextField } from 'yahha-ui';

export default function TextFieldForm() {
  const [title, setTitle] = useState('周末的散步记录');
  const [result, setResult] = useState('');

  return (
    <form
      style={{ display: 'grid', gap: 16 }}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setResult(`标题：${data.get('title')}；分类：${data.get('category')}`);
      }}
      onReset={() => {
        setTitle('周末的散步记录');
        setResult('');
      }}
    >
      <TextField
        label="文章标题（受控）"
        name="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
        hint="必填。按 Enter 可提交表单，重置会恢复初始标题。"
      />
      <TextField label="分类（非受控）" name="category" defaultValue="生活" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="submit">读取表单</Button>
        <Button type="reset" variant="secondary">
          恢复初始值
        </Button>
      </div>
      <p role="status" style={{ margin: 0 }}>
        {result || '修改两个字段后重置，观察它们恢复初始值。'}
      </p>
    </form>
  );
}
