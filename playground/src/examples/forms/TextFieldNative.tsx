import { useRef, useState } from 'react';
import { Button, Text, Input } from 'yahha-ui';

export default function TextFieldNative() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState('');

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'grid', gap: 16 }}>
        <Text size="sm" tone="muted">
          输入类型
        </Text>
        <Input
          label="示例密码"
          type="password"
          autoComplete="new-password"
          placeholder="输入密码"
        />
        <Input label="记录日期" type="date" name="recordDate" defaultValue="2026-10-28" />
        <Input label="记录时间" type="time" name="recordTime" defaultValue="10:30" />
      </div>
      <div style={{ display: 'grid', gap: 16 }}>
        <Text size="sm" tone="muted">
          邮箱格式检查
        </Text>
        <form
          style={{ display: 'grid', gap: 16 }}
          onInvalidCapture={() => setResult('')}
          onSubmit={(event) => {
            event.preventDefault();
            setResult('检查结果：邮箱格式正确。');
          }}
        >
          <Input
            ref={inputRef}
            label="联系邮箱"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="hello@example.com"
            required
            onChange={() => setResult('')}
            hint="必填，请填写完整的邮箱地址。"
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Button type="submit">检查邮箱格式</Button>
            <Button variant="secondary" onClick={() => inputRef.current?.focus()}>
              聚焦邮箱输入框
            </Button>
          </div>
          <Text size="sm" tone="muted" role="status">
            {result}
          </Text>
        </form>
      </div>
    </div>
  );
}
