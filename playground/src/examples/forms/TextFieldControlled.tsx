import { useState } from 'react';
import { TextField } from 'yahha-ui';

export default function TextFieldControlled() {
  const [keyword, setKeyword] = useState('');

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <TextField
        label="搜索文章"
        type="search"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="输入文章标题"
        leading={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
        }
        hint="可输入标题中的一部分，关键词始终由 React 状态管理。"
      />
      <p style={{ margin: 0 }} aria-live="polite">
        {keyword ? `当前关键词：${keyword}` : '输入内容，查看受控状态。'}
      </p>
    </div>
  );
}
