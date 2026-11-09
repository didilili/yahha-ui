import { useRef, useState } from 'react';
import { Button, Checkbox, Input, Text } from 'yahha-ui';

export default function FormBasics() {
  const [nickname, setNickname] = useState('库米');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const nicknameRef = useRef<HTMLInputElement>(null);

  return (
    <form
      noValidate
      style={{ display: 'grid', gap: 16, maxWidth: 440 }}
      onInput={() => {
        setError('');
        setResult('');
      }}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const author = String(data.get('nickname') ?? '').trim();
        if (!author) {
          setError('请填写昵称。');
          nicknameRef.current?.focus();
          return;
        }
        setError('');
        setResult(
          `读取结果：昵称为“${author}”；显示署名：${data.has('showAuthor') ? '是' : '否'}。`,
        );
      }}
      onReset={() => {
        setNickname('库米');
        setError('');
        setResult('');
      }}
    >
      <Input
        ref={nicknameRef}
        label="昵称"
        name="nickname"
        value={nickname}
        onChange={(event) => setNickname(event.currentTarget.value)}
        required
        hint="必填，首尾空白不计入昵称。"
        error={error || undefined}
      />
      <Checkbox label="显示署名" name="showAuthor" value="yes" defaultChecked />
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
