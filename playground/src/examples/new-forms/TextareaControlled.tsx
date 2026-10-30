import { useRef, useState } from 'react';
import { Button, Text, Textarea } from 'yahha-ui';

export default function TextareaControlled() {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const error = submitted && !message.trim() ? '请填写留言后再检查。' : undefined;
  return (
    <form
      noValidate
      style={{ display: 'grid', gap: 16, maxWidth: 480 }}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        if (!message.trim()) ref.current?.focus();
      }}
    >
      <Textarea
        ref={ref}
        label="留言内容"
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
          setSubmitted(false);
        }}
        required
        maxLength={200}
        hint={`已输入 ${message.length} / 200`}
        error={error}
      />
      <Button type="submit">检查留言</Button>
      <Text size="sm" tone="muted" role="status">
        {submitted && message.trim() ? '检查结果：留言符合要求。' : ''}
      </Text>
    </form>
  );
}
