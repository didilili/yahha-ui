import { useRef, useState } from 'react';
import { Button, TextField } from 'yahha-ui';

export default function TextFieldValidation() {
  const [nickname, setNickname] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState('');
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
        setSaved('');
        if (!valid) {
          inputRef.current?.focus();
          return;
        }
        setSaved(`已保存：${nickname.trim()}`);
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
          setSaved('');
        }}
        hint="必填，2～12 个字符，会显示在你的个人主页。"
        error={error}
      />
      <div>
        <Button type="submit">保存昵称</Button>
      </div>
      <p role="status" style={{ margin: 0 }}>
        {saved || (error ? '尚未保存，请检查上方输入。' : '填写后提交，试试空白或过长的昵称。')}
      </p>
    </form>
  );
}
