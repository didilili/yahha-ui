import { useRef, useState } from 'react';
import { IconButton, Text, Input } from 'yahha-ui';

const articles = ['周末的散步记录', '给小花换一个花盆', 'Weekend reading notes'];

export default function TextFieldSearch() {
  const [value, setValue] = useState('');
  const [query, setQuery] = useState('');
  const composing = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const matches = articles.filter((title) =>
    title.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
      <Input
        ref={inputRef}
        label="搜索本地手记"
        type="text"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        placeholder="试试“散步”或 Weekend"
        value={value}
        onCompositionStart={() => {
          composing.current = true;
        }}
        onCompositionEnd={(event) => {
          composing.current = false;
          setValue(event.currentTarget.value);
          setQuery(event.currentTarget.value);
        }}
        onChange={(event) => {
          const nextValue = event.currentTarget.value;
          setValue(nextValue);
          if (!composing.current && !(event.nativeEvent as InputEvent).isComposing) {
            setQuery(nextValue);
          }
        }}
        leading={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 5 5" strokeLinecap="round" />
          </svg>
        }
        trailing={
          <IconButton
            type="button"
            variant="ghost"
            aria-label="清空手记搜索"
            disabled={!value}
            onClick={() => {
              composing.current = false;
              setValue('');
              setQuery('');
              inputRef.current?.focus();
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M6 18 18 6" strokeLinecap="round" />
            </svg>
          </IconButton>
        }
      />
      <Text role="status" size="sm" tone="muted">
        {query ? `“${query}”：` : ''}找到 {matches.length} 篇手记。
      </Text>
      {matches.length ? (
        <ul aria-label="匹配的手记" style={{ margin: 0, paddingInlineStart: 24 }}>
          {matches.map((title) => (
            <li key={title}>{title}</li>
          ))}
        </ul>
      ) : (
        <Text>没有匹配的手记，可以换个关键词或清空搜索。</Text>
      )}
    </div>
  );
}
