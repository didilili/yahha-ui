import { useEffect, useRef, useState } from 'react';
import { IconButton, Text, TextField } from 'yahha-ui';

const address = 'https://example.com/notes/feed.xml';

export default function TextFieldCopy() {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const request = useRef(0);
  const [message, setMessage] = useState('');
  useEffect(
    () => () => {
      request.current += 1;
    },
    [],
  );

  async function copyAddress() {
    const currentRequest = ++request.current;
    setMessage('');
    try {
      await navigator.clipboard.writeText(address);
      if (currentRequest === request.current) setMessage('示例地址已复制。');
    } catch {
      if (currentRequest !== request.current) return;
      if (document.activeElement === buttonRef.current) {
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      setMessage('未能复制，请选中地址后使用系统复制。');
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
      <TextField
        ref={inputRef}
        label="示例订阅地址"
        value={address}
        readOnly
        hint="这是示例地址；也可直接选中文字，使用系统复制。"
        trailing={
          <IconButton
            ref={buttonRef}
            type="button"
            variant="ghost"
            aria-label="复制示例订阅地址"
            onClick={copyAddress}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="8" y="8" width="12" height="13" rx="2" />
              <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
            </svg>
          </IconButton>
        }
      />
      <Text role="status" size="sm" tone="muted">
        {message}
      </Text>
    </div>
  );
}
