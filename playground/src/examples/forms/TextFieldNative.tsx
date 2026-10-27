import { useRef } from 'react';
import { Button, TextField } from 'yahha-ui';

export default function TextFieldNative() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <TextField
        label="暂不可编辑"
        disabled
        defaultValue="等待同步"
        hint="disabled 不参与表单提交。"
      />
      <TextField
        label="公开地址"
        readOnly
        defaultValue="https://example.com"
        hint="readOnly 可聚焦和复制。"
      />
      <TextField
        ref={inputRef}
        label="联系邮箱"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="hello@example.com"
        required
        hint="必填。type=email 保留浏览器的邮箱格式约束。"
      />
      <TextField
        label="示例密码"
        type="password"
        name="demoPassword"
        autoComplete="new-password"
        placeholder="输入任意内容，查看原生掩码"
        hint="仅演示 password 输入；组件不增加显隐切换，也不校验或保存密码。"
      />
      <div>
        <Button variant="secondary" onClick={() => inputRef.current?.focus()}>
          聚焦邮箱输入框
        </Button>
      </div>
    </div>
  );
}
