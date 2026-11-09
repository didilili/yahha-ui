import { useRef, useState } from 'react';
import { Button, Text, Input } from 'yahha-ui';

export default function TextFieldValidation() {
  const [nickname, setNickname] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const valid = nickname.trim().length >= 2 && nickname.trim().length <= 12;
  const error = submitted && !valid ? '昵称长度须为 2～12，部分表情会占多个长度单位。' : undefined;

  return (
    <form
      noValidate
      style={{ display: 'grid', gap: 16 }}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        setResult('');
        if (!valid) {
          inputRef.current?.focus();
          return;
        }
        setResult(`检查结果：昵称“${nickname.trim()}”符合要求。`);
      }}
    >
      <Input
        ref={inputRef}
        label="你的昵称"
        name="nickname"
        autoComplete="nickname"
        required
        value={nickname}
        onChange={(event) => {
          setNickname(event.target.value);
          setResult('');
        }}
        hint="必填，去除首尾空格后长度为 2～12；部分表情会占多个长度单位。"
        error={error}
      />
      <div>
        <Button type="submit">检查昵称</Button>
      </div>
      <Text size="sm" tone="muted" role="status">
        {result}
      </Text>
    </form>
  );
}
