import { useState } from 'react';
import { Button, Form, Input, Text } from 'yahha-ui';

export default function FormSubmission() {
  const [result, setResult] = useState('');

  return (
    <Form
      aria-label="保存公开昵称"
      initialValues={{ nickname: '库米' }}
      validate={(values) =>
        values.nickname !== '' && values.nickname.trim() === ''
          ? { nickname: '昵称不能只包含空格。' }
          : {}
      }
      style={{ display: 'grid', gap: 16, maxWidth: 440 }}
      onInput={() => setResult('')}
      onReset={() => setResult('')}
      onSubmit={async (values, { signal }) => {
        await Promise.resolve();
        if (signal.aborted) return;
        if (values.nickname.trim() === '库米') {
          return { nickname: '这个示例昵称已被使用，请换一个。' };
        }
        setResult(`已保存昵称“${values.nickname.trim()}”。`);
      }}
    >
      {(form) => (
        <>
          <Input
            {...form.input('nickname')}
            label="公开昵称"
            required
            hint="必填，尝试保存默认昵称，再换一个昵称重试。"
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Button type="submit" loading={form.isSubmitting}>
              保存昵称
            </Button>
            <Button type="reset" variant="secondary">
              恢复初始值
            </Button>
          </div>
          <Text size="sm" tone="muted" role={form.submitError ? 'alert' : 'status'}>
            {form.submitError || result}
          </Text>
        </>
      )}
    </Form>
  );
}
