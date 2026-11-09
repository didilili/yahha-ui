import { useState } from 'react';
import { Button, Form, Input, Text } from 'yahha-ui';

export default function FormBasic() {
  const [result, setResult] = useState('');

  return (
    <Form
      aria-label="昵称设置"
      initialValues={{ nickname: '库米' }}
      style={{ display: 'grid', gap: 16, maxWidth: 440 }}
      onInput={() => setResult('')}
      onReset={() => setResult('')}
      onSubmit={(values) => setResult(`读取结果：昵称为“${values.nickname}”。`)}
    >
      {(form) => (
        <>
          <Input {...form.input('nickname')} label="昵称" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Button type="submit">读取表单</Button>
            <Button type="reset" variant="secondary">
              恢复初始值
            </Button>
          </div>
          <Text size="sm" tone="muted" role="status">
            {result}
          </Text>
        </>
      )}
    </Form>
  );
}
