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
      <div style={{ display: 'grid', gap: 8 }}>
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
          hint={
            <span style={{ display: 'flex', flexWrap: 'wrap', columnGap: 12, rowGap: 4 }}>
              <span>必填</span>
              <span
                style={{
                  marginInlineStart: 'auto',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                已输入 {message.length} / 200
              </span>
            </span>
          }
          error={error}
        />
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <Button type="submit">检查留言</Button>
        <Text size="sm" tone="muted" role="status">
          {submitted && message.trim() ? '检查结果：留言符合要求。' : ''}
        </Text>
      </div>
    </form>
  );
}
