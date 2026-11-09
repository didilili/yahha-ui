import { useState } from 'react';
import { Text, Input } from 'yahha-ui';

export default function TextFieldControlled() {
  const [keyword, setKeyword] = useState('');

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Input
        label="关键词"
        type="search"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="输入关键词"
      />
      <Text size="sm" tone="muted">
        当前关键词：{keyword || '未填写'}
      </Text>
    </div>
  );
}
