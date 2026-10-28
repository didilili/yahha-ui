import { useRef, useState } from 'react';
import { Button, Text, TextField } from 'yahha-ui';

export default function TextFieldValidation() {
  const [nickname, setNickname] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const valid = nickname.trim().length >= 2 && nickname.trim().length <= 12;
  const error = submitted && !valid ? '请填写 2～12 个字符的昵称。' : undefined;

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
      <TextField
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
        hint="必填，2～12 个字符。"
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
