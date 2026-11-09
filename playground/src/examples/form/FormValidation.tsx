import { useState } from 'react';
import { Button, Form, Input, Text } from 'yahha-ui';

export default function FormValidation() {
  const [result, setResult] = useState('');

  return (
    <Form
      aria-label="读者资料校验"
      initialValues={{ nickname: '', email: '' }}
      validationMode="onBlur"
      validate={(values) =>
        values.nickname !== '' && values.nickname.trim() === ''
          ? { nickname: '昵称不能只包含空格。' }
          : {}
      }
      style={{ display: 'grid', gap: 16, maxWidth: 440 }}
      onInput={() => setResult('')}
      onReset={() => setResult('')}
      onSubmit={(values) => setResult(`校验通过：${values.nickname} · ${values.email}`)}
    >
      {(form) => (
        <>
          <Input
            {...form.input('nickname')}
            label="公开昵称"
            required
            hint="必填，请填写可辨认的昵称。"
          />
          <Input
            {...form.input('email')}
            label="联系邮箱"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            hint="必填，请使用有效的邮箱格式。"
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Button type="submit">检查并读取</Button>
            <Button type="reset" variant="secondary">
              重置资料
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
