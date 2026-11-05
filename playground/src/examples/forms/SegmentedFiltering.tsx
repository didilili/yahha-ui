import { useId, useState } from 'react';
import { Heading, SegmentedControl, Surface, Text } from 'yahha-ui';

type Category = 'all' | 'journal' | 'notes';
type Presentation = 'list' | 'cards';
const labels = { all: '全部内容', journal: '日记', notes: '随手记' };
const articles = [
  {
    id: 'weekend-walk',
    title: '周末散步，遇到一朵小花',
    summary: '沿着小路走走，在路边发现了一朵刚开的花。',
    category: 'journal',
  },
  {
    id: 'favorite-words',
    title: '把今天喜欢的句子记下来',
    summary: '把读到的几句话抄进本子，留给以后的自己慢慢读。',
    category: 'notes',
  },
  {
    id: 'simple-dinner',
    title: '给自己做一顿简单的晚饭',
    summary: '用冰箱里的食材煮一碗热汤，让忙碌的一天好好收尾。',
    category: 'journal',
  },
] as const;

export default function SegmentedFiltering() {
  const descriptionId = useId();
  const [category, setCategory] = useState<Category>('all');
  const [presentation, setPresentation] = useState<Presentation>('list');
  const visibleArticles = articles.filter(
    (article) => category === 'all' || article.category === category,
  );

  return (
    <div
      style={{
        display: 'grid',
        justifyItems: 'start',
        gap: 16,
        width: '100%',
        maxWidth: 760,
        minWidth: 0,
        overflowWrap: 'anywhere',
      }}
    >
      <Text id={descriptionId} size="sm" tone="muted">
        按文章类型筛选下方文章。
      </Text>
      <SegmentedControl
        label="筛选文章类型"
        aria-describedby={descriptionId}
        value={category}
        onValueChange={setCategory}
        options={[
          { value: 'all', label: '全部' },
          { value: 'journal', label: '日记' },
          { value: 'notes', label: '随手记' },
        ]}
      />
      <SegmentedControl
        label="文章视图"
        value={presentation}
        onValueChange={setPresentation}
        options={[
          { value: 'list', label: '列表' },
          { value: 'cards', label: '卡片' },
        ]}
      />
      <Text role="status" size="sm" tone="muted">
        {labels[category]} · {visibleArticles.length} 篇文章 ·{' '}
        {presentation === 'cards' ? '卡片视图' : '列表视图'}
      </Text>
      <ul
        role={presentation === 'cards' ? 'list' : undefined}
        aria-label="筛选后的文章"
        data-view={presentation}
        style={{
          display: 'grid',
          gridTemplateColumns:
            presentation === 'cards'
              ? 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))'
              : 'minmax(0, 1fr)',
          gap: 16,
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
          paddingInlineStart: presentation === 'cards' ? 0 : 24,
          listStyle: presentation === 'cards' ? 'none' : undefined,
        }}
      >
        {visibleArticles.map((article) => {
          const content = (
            <>
              <Heading level={3}>{article.title}</Heading>
              <Text size="sm">{article.summary}</Text>
              <Text size="sm" tone="muted">
                {labels[article.category]}
              </Text>
            </>
          );
          return (
            <li
              key={article.id}
              data-article-id={article.id}
              style={{ minWidth: 0, display: presentation === 'cards' ? 'grid' : undefined }}
            >
              {presentation === 'cards' ? (
                <Surface style={{ display: 'grid', gap: 8 }}>{content}</Surface>
              ) : (
                <div style={{ display: 'grid', gap: 8 }}>{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
