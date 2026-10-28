import { useId, useState } from 'react';
import { SegmentedControl, Text } from 'yahha-ui';

type View = 'all' | 'journal' | 'notes';

export default function SegmentedFiltering() {
  const descriptionId = useId();
  const [view, setView] = useState<View>('all');
  const labels = { all: '全部内容', journal: '日记', notes: '随手记' };
  const articles = [
    { title: '周末散步，遇到一朵小花', type: 'journal' },
    { title: '把今天喜欢的句子记下来', type: 'notes' },
    { title: '给自己做一顿简单的晚饭', type: 'journal' },
  ];
  const visibleArticles = articles.filter((article) => view === 'all' || article.type === view);

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 16 }}>
      <Text id={descriptionId} size="sm" tone="muted">
        按文章类型筛选下方文章。
      </Text>
      <SegmentedControl
        label="筛选文章类型"
        aria-describedby={descriptionId}
        value={view}
        onValueChange={setView}
        options={[
          { value: 'all', label: '全部' },
          { value: 'journal', label: '日记' },
          { value: 'notes', label: '随手记' },
        ]}
      />
      <Text role="status" size="sm" tone="muted">
        {labels[view]} · {visibleArticles.length} 篇文章
      </Text>
      <ul aria-label="筛选后的文章" style={{ margin: 0, paddingInlineStart: 24 }}>
        {visibleArticles.map((article) => (
          <li key={article.title}>{article.title}</li>
        ))}
      </ul>
    </div>
  );
}
