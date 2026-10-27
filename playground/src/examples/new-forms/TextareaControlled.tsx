import { useRef, useState } from 'react';
import { Button, Textarea } from 'yahha-ui';

export default function TextareaControlled() {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const error = submitted && !message.trim() ? '请写下一点内容再发送。' : undefined;
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
        hint={`${message.length} / 200 字；本例不会发送数据。`}
        error={error}
      />
      <Button type="submit">检查留言</Button>
      <p role="status" style={{ margin: 0 }}>
        {submitted && message.trim() ? '内容已填写，可以继续接入发送逻辑。' : ''}
      </p>
    </form>
  );
}
