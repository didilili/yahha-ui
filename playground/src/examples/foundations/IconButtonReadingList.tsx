import { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, EmptyState, Heading, IconButton, Text } from 'yahha-ui';

const articles = [
  {
    id: 'spring',
    title: '河边散步时，记下春天',
    summary: '沿着河岸慢慢走，看看新叶和水面上的光。',
  },
  {
    id: 'weekend',
    title: 'WeekendReadingNotes：留给周末的阅读清单与零碎灵感',
    summary: '几篇想读的文章，和读到一半随手记下的句子。',
  },
  {
    id: 'flowers',
    title: '去花店的路上，绕了一点远',
    summary: '买花之前，先在街角的小巷里走了一会儿。',
  },
] as const;

type ArticleId = (typeof articles)[number]['id'];

export default function IconButtonReadingList() {
  const [savedIds, setSavedIds] = useState<ArticleId[]>(['spring', 'flowers']);
  const [onlySaved, setOnlySaved] = useState(false);
  const [message, setMessage] = useState('当前收藏 2 篇文章。');
  const actionRefs = useRef(new Map<ArticleId, HTMLButtonElement>());
  const showAllRef = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef<ArticleId | 'show-all' | null>(null);
  const visibleArticles = articles.filter((article) => !onlySaved || savedIds.includes(article.id));

  useEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    if (target === 'show-all') showAllRef.current?.focus();
    else actionRefs.current.get(target)?.focus();
  }, [savedIds, onlySaved]);

  function toggleSaved(id: ArticleId) {
    const article = articles.find((item) => item.id === id)!;
    const wasSaved = savedIds.includes(id);
    const nextSavedIds = wasSaved
      ? savedIds.filter((savedId) => savedId !== id)
      : [...savedIds, id];

    if (onlySaved && wasSaved && document.activeElement === actionRefs.current.get(id)) {
      const index = visibleArticles.findIndex((item) => item.id === id);
      const nextArticle = visibleArticles[index + 1] ?? visibleArticles[index - 1];
      pendingFocus.current = nextArticle?.id ?? 'show-all';
    }

    setSavedIds(nextSavedIds);
    setMessage(
      `已${wasSaved ? '取消收藏' : '收藏'}「${article.title}」，当前收藏 ${nextSavedIds.length} 篇文章。`,
    );
  }

  return (
    <div style={{ display: 'grid', gap: 20, minWidth: 0, maxWidth: 640, overflowWrap: 'anywhere' }}>
      <Checkbox
        label="只看收藏"
        checked={onlySaved}
        onChange={(event) => {
          const checked = event.target.checked;
          setOnlySaved(checked);
          setMessage(
            checked
              ? `已显示收藏文章，共 ${savedIds.length} 篇。`
              : `已显示全部文章，当前收藏 ${savedIds.length} 篇。`,
          );
        }}
      />
      {visibleArticles.length > 0 ? (
        <ul style={{ display: 'grid', gap: 24, margin: 0, paddingInlineStart: 24, minWidth: 0 }}>
          {visibleArticles.map((article) => {
            const saved = savedIds.includes(article.id);
            return (
              <li key={article.id} style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) auto',
                    alignItems: 'start',
                    gap: 12,
                    minWidth: 0,
                  }}
                >
                  <div style={{ display: 'grid', gap: 8, minWidth: 0 }}>
                    <Heading level={3}>{article.title}</Heading>
                    <Text size="sm">{article.summary}</Text>
                    <Text size="sm" tone="muted">
                      {saved ? '已收藏' : '未收藏'}
                    </Text>
                  </div>
                  <IconButton
                    ref={(element) => {
                      if (element) actionRefs.current.set(article.id, element);
                      else actionRefs.current.delete(article.id);
                    }}
                    variant="ghost"
                    aria-label={`收藏文章：${article.title}`}
                    aria-pressed={saved}
                    onClick={() => toggleSaved(article.id)}
                  >
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
                      <path
                        d="M8 3.25h6.2l4.05 4.1v12.7c0 .6-.5.88-1 .57L12 17.4l-5.3 3.22c-.5.31-.95.02-.95-.57V5.6C5.75 4.15 6.5 3.25 8 3.25Z"
                        fill={saved ? 'currentColor' : 'none'}
                        fillOpacity="0.2"
                      />
                      <path d="M14.2 3.5v3c0 .6.35.95.95.95h2.8" fill="none" />
                    </svg>
                  </IconButton>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          title="还没有收藏文章"
          description="回到全部文章，挑几篇留给下次阅读。"
          action={
            <Button
              ref={showAllRef}
              variant="secondary"
              onClick={() => {
                pendingFocus.current = articles[0].id;
                setOnlySaved(false);
                setMessage(`已显示全部文章，当前收藏 ${savedIds.length} 篇。`);
              }}
            >
              查看全部文章
            </Button>
          }
        />
      )}
      <Text size="sm" tone="muted" role="status">
        {message}
      </Text>
    </div>
  );
}
