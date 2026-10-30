import { useState } from 'react';
import { Button, Text, TextField } from 'yahha-ui';

export default function TextFieldForm() {
  const [title, setTitle] = useState('周末的散步记录');
  const [result, setResult] = useState('');

  return (
    <form
      style={{ display: 'grid', gap: 16 }}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setResult(`读取结果：标题为“${data.get('title')}”；分类为“${data.get('category')}”。`);
      }}
      onReset={() => {
        setTitle('周末的散步记录');
        setResult('');
      }}
    >
      <TextField
        label="文章标题"
        name="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
        hint="必填，请填写文章标题。"
      />
      <TextField label="文章分类" name="category" defaultValue="生活" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="submit">读取表单</Button>
        <Button type="reset" variant="secondary">
          恢复初始值
        </Button>
      </div>
      <Text size="sm" tone="muted" role="status">
        {result}
      </Text>
    </form>
  );
}
