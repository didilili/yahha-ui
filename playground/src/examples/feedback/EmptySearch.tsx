import { useRef, useState } from 'react';
import { Button, EmptyState, Text, Input } from 'yahha-ui';

const articles = ['雨天书单', '周末散步'];

export default function EmptySearch() {
  const [query, setQuery] = useState('海边');
  const inputRef = useRef<HTMLInputElement>(null);
  const matches = articles.filter((title) => title.includes(query.trim()));

  function clearSearch() {
    setQuery('');
    inputRef.current?.focus();
  }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Input
        ref={inputRef}
        label="搜索文章"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        hint="试试输入「书单」；清空搜索可以查看全部文章。"
      />
      <Text size="sm" tone="muted" role="status">
        {matches.length > 0 ? `找到 ${matches.length} 篇文章。` : '当前关键词没有匹配结果。'}
      </Text>
      {matches.length > 0 ? (
        <ul>
          {matches.map((title) => (
            <li key={title}>{title}</li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="未找到相关文章"
          description="换个关键词，或者先看看全部文章。"
          action={<Button onClick={clearSearch}>清空搜索</Button>}
        />
      )}
    </div>
  );
}
