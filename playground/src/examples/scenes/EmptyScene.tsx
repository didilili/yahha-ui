import { useEffect, useRef, useState } from 'react';
import { Button, EmptyState, Heading, Select, Text, TextField, ThemeProvider } from 'yahha-ui';
import 'yahha-ui/style.css';
import emptyArtwork from './artwork/empty.png';

const options = [
  { value: 'first', label: '首次没有内容' },
  { value: 'saved', label: '暂无收藏' },
  { value: 'search', label: '搜索无结果' },
];
const articles = ['雨天的读书笔记', '周末散步的小发现'];

export default function EmptyScene() {
  const [scene, setScene] = useState<string | null>('first');
  const [created, setCreated] = useState(false);
  const [query, setQuery] = useState('海边');
  const search = useRef<HTMLInputElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const matches =
    scene === 'search' ? articles.filter((title) => title.includes(query.trim())) : articles;
  const hasContent = scene === 'search' ? matches.length > 0 : created;

  useEffect(() => {
    if (created) resultHeading.current?.focus({ preventScroll: true });
  }, [created]);

  return (
    <ThemeProvider theme="pink">
      <style>{`
        .story-empty { max-width: 660px; margin: auto; }
        .story-empty-tools { display: flex; align-items: end; flex-wrap: wrap; gap: 16px; }
        .story-empty-tools > * { flex: 1 1 220px; }
        .story-empty-art { display: block; width: min(240px, 100%); height: auto; margin: auto; }
        .story-empty-result { min-height: 200px; padding-block: 32px; }
        .story-empty-result ul { margin: 16px 0; padding-inline-start: 22px; line-height: 2; }
        .story-empty-reset { margin-top: 16px; }
      `}</style>
      <div className="story-empty">
        <div className="story-empty-tools">
          <Select
            label="空态场景"
            value={scene}
            options={options}
            onValueChange={(value) => {
              setScene(value);
              setCreated(false);
              setQuery('海边');
            }}
          />
          {scene === 'search' && (
            <TextField
              ref={search}
              label="搜索关键词"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          )}
        </div>
        {hasContent ? (
          <div className="story-empty-result">
            <Heading level={3} ref={resultHeading} tabIndex={-1}>
              {scene === 'first' ? '第一篇手记已创建' : '可以读这些文章'}
            </Heading>
            <ul>
              {(scene === 'first' ? ['今天想记住的小事'] : matches).map((title) => (
                <li key={title}>{title}</li>
              ))}
            </ul>
            <Text size="sm" tone="muted">
              示例状态仅保留在当前页面，刷新后恢复。
            </Text>
          </div>
        ) : (
          <EmptyState
            title={
              scene === 'search'
                ? '未找到相关文章'
                : scene === 'saved'
                  ? '还没有收藏'
                  : '还没有手记'
            }
            description={
              scene === 'search'
                ? `没有找到包含“${query}”的标题，试试其他关键词。`
                : scene === 'saved'
                  ? '把想再读的文章收起来，会在这里找到它们。'
                  : '先写下今天想记住的一件小事。'
            }
            illustration={
              scene === 'search' ? undefined : (
                <img
                  className="story-empty-art"
                  src={emptyArtwork}
                  alt=""
                  width="1024"
                  height="768"
                  loading="lazy"
                />
              )
            }
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  if (scene === 'search') {
                    setQuery('');
                    search.current?.focus();
                  } else setCreated(true);
                }}
              >
                {scene === 'search'
                  ? '清空搜索'
                  : scene === 'saved'
                    ? '浏览示例文章'
                    : '创建示例手记'}
              </Button>
            }
          />
        )}
        <Button
          className="story-empty-reset"
          variant="ghost"
          onClick={() => {
            setCreated(false);
            setQuery('海边');
          }}
        >
          重置空态示例
        </Button>
      </div>
    </ThemeProvider>
  );
}
