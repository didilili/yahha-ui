import { useState } from 'react';
import { Textarea } from 'yahha-ui';

export default function TextareaControlled() {
  const [message, setMessage] = useState('');

  return (
    <div style={{ maxWidth: 480 }}>
      <Textarea
        label="留言内容"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        maxLength={200}
        hint={`已输入 ${message.length} / 200`}
      />
    </div>
  );
}
