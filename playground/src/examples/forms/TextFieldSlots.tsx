import { useRef, useState } from 'react';
import { IconButton, Input } from 'yahha-ui';

export default function TextFieldSlots() {
  const [keyword, setKeyword] = useState('散步');
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Input
      ref={inputRef}
      label="关键词"
      value={keyword}
      onChange={(event) => setKeyword(event.currentTarget.value)}
      leading={
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </svg>
      }
      trailing={
        <IconButton
          type="button"
          variant="ghost"
          aria-label="清空关键词"
          disabled={!keyword}
          onClick={() => {
            setKeyword('');
            inputRef.current?.focus();
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
            focusable="false"
          >
            <path d="m6 6 12 12M6 18 18 6" strokeLinecap="round" />
          </svg>
        </IconButton>
      }
    />
  );
}
