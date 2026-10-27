import { useState } from 'react';
import { Button, TextField } from 'yahha-ui';

export default function ButtonForm() {
  const [message, setMessage] = useState('填写称呼后提交表单。');

  return (
    <form
      style={{ display: 'grid', justifyItems: 'start', gap: 16, maxWidth: 400 }}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setMessage(`你好，${String(data.get('nickname'))}！`);
      }}
    >
      <TextField label="怎么称呼你" name="nickname" required autoComplete="nickname" />
      <Button type="submit">提交表单</Button>
      <span role="status">{message}</span>
    </form>
  );
}
