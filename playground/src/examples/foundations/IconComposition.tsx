import { useRef, useState } from 'react';
import { BookmarkIcon, Button, CloseIcon, IconButton, SearchIcon, Text, TextField } from 'yahha-ui';

const articles = ['周末的散步记录', '给小花换一个花盆', '散步路上的面包店'];

export default function IconComposition() {
  const [value, setValue] = useState('');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const matches = articles.filter((title) => title.includes(query.trim()));

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 480, minWidth: 0 }}>
      <form
        style={{ display: 'grid', gap: 12 }}
        onSubmit={(event) => {
          event.preventDefault();
          setQuery(value);
        }}
      >
        <TextField
          ref={inputRef}
          label="搜索手记"
          type="text"
          inputMode="search"
          enterKeyHint="search"
          placeholder="试试“散步”"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          leading={<SearchIcon />}
          trailing={
            <IconButton
              variant="ghost"
              aria-label="清空手记搜索"
              disabled={!value && !query}
              onClick={() => {
                setValue('');
                setQuery('');
                inputRef.current?.focus();
              }}
            >
              <CloseIcon />
            </IconButton>
          }
        />
        <Button type="submit" startIcon={<SearchIcon />} style={{ justifySelf: 'start' }}>
          搜索
        </Button>
      </form>
      <Text size="sm" tone="muted" role="status">
        {matches.length ? `找到 ${matches.length} 篇手记` : '没有匹配的手记，试试其他关键词。'}
      </Text>
      {matches.length > 0 && (
        <ul
          aria-label="匹配的手记"
          style={{ display: 'grid', gap: 12, margin: 0, padding: 0, listStyle: 'none' }}
        >
          {matches.map((title) => (
            <li
              key={title}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <span>{title}</span>
              <IconButton
                variant="ghost"
                aria-label={`收藏《${title}》`}
                aria-pressed={saved.includes(title)}
                onClick={() => {
                  setSaved((current) =>
                    current.includes(title)
                      ? current.filter((item) => item !== title)
                      : [...current, title],
                  );
                }}
              >
                <BookmarkIcon filled={saved.includes(title)} />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
