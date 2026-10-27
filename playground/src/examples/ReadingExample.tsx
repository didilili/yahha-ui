import { useEffect, useId, useRef, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Dialog,
  Divider,
  EmptyState,
  Heading,
  Image,
  Link,
  SegmentedControl,
  Surface,
  Switch,
  Text,
  TextField,
  ThemeProvider,
} from 'yahha-ui';
import 'yahha-ui/style.css';

const articles = [
  {
    id: 'river',
    category: '日常',
    title: '沿着河边，慢慢走',
    date: '2026-10-18',
    summary: '走过熟悉的街道，也会遇见一点新的东西。',
    paragraphs: [
      '周末出门时，没有特意想好要去哪里。沿着河边走了一段，看见树叶的影子落在水面上，又被风轻轻推开。',
      '路边的小店换了招牌，门口还是摆着那张旧木椅。我停下来坐了一会儿，把想记住的事情写了两行。',
      '有些日子不需要安排得很满。走一走，看看天色，也就很好。',
    ],
  },
  {
    id: 'weekend',
    category: '读书',
    title: '给周末留一页空白',
    date: '2026-10-12',
    summary: '翻几页书，把喜欢的一句话留给自己。',
    paragraphs: [
      '这周读得很慢，一本书在桌边放了好几天。有时只翻两页，有时读到一半，就把窗户打开听一会儿雨声。',
      '我开始在读书笔记里多留一些空白。以后再读到这里，也许会想到不同的事情。',
      '今天先记到这里。下一次翻开时，再接着写。',
    ],
  },
];

const categories = [
  { value: '全部', label: '全部' },
  { value: '日常', label: '日常' },
  { value: '读书', label: '读书' },
] as const;

const cover =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="800" height="450" fill="#fff6f7"/><rect x="48" y="48" width="704" height="354" rx="12" fill="#fffefa" stroke="#d7c3c0"/><text x="400" y="215" text-anchor="middle" fill="#462e31" font-family="sans-serif" font-size="42">周末手记</text><text x="400" y="275" text-anchor="middle" fill="#79656a" font-family="sans-serif" font-size="22">给喜欢的事情，留一点位置。</text></svg>',
  );

export default function ReadingExample() {
  const rootId = useId();
  const articleRef = useRef<HTMLHeadingElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const pendingArticleFocus = useRef(false);
  const [category, setCategory] = useState<'全部' | '日常' | '读书'>('全部');
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState('river');
  const [saved, setSaved] = useState<string[]>([]);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [showImage, setShowImage] = useState(true);
  const [notice, setNotice] = useState('');
  const filtered = articles.filter(
    (article) =>
      (category === '全部' || article.category === category) &&
      `${article.title}${article.summary}${article.paragraphs.join('')}`.includes(query.trim()),
  );
  const active = filtered.find((article) => article.id === activeId) ?? filtered[0];
  const isSaved = active ? saved.includes(active.id) : false;

  useEffect(() => {
    if (pendingArticleFocus.current && active) {
      articleRef.current?.focus();
      pendingArticleFocus.current = false;
    }
  }, [active]);

  function readArticle(id: string) {
    setNotice('');
    if (active?.id === id) articleRef.current?.focus();
    else pendingArticleFocus.current = true;
    setActiveId(id);
  }

  return (
    <ThemeProvider theme="chiikawa">
      <style>{`
        .reading-example { width: 100%; max-width: 68ch; margin: auto; padding: 8px 0; }
        .reading-author { display: grid; gap: 8px; margin-bottom: 24px; }
        .reading-author-identity { display: flex; align-items: center; gap: 16px; }
        .reading-author-copy { min-width: 0; flex: 1; }
        .reading-author-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; margin-inline-start: 60px; }
        .reading-tools { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; padding-block: 20px; border-block: 1px solid var(--chi-line, #d7c3c0); }
        .reading-search { flex: 1 1 210px; }
        .reading-options { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 16px; padding-top: 12px; }
        .reading-list { display: grid; gap: 8px; padding-block: 20px; border-bottom: 1px solid var(--chi-line, #d7c3c0); }
        .reading-list-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 16px; }
        .reading-article { padding-top: 32px; }
        .reading-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 16px; }
        .reading-article-header { display: grid; gap: 16px; margin-bottom: 24px; }
        .reading-figure { display: grid; gap: 8px; margin: 0 0 28px; }
        .reading-body { display: grid; gap: 24px; margin-block: 0 28px; }
        .reading-body h3 { margin-top: 12px; }
        .reading-note { display: grid; gap: 12px; margin-block: 0 24px; }
        .reading-divider { margin-block: 0 24px; }
        .reading-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
        .reading-feedback { min-height: 3em; margin-top: 16px; }
        @media (max-width: 480px) {
          .reading-tools { align-items: stretch; }
          .reading-search { flex-basis: 100%; }
        }
      `}</style>
      <div className="reading-example">
        <div className="reading-author">
          <div className="reading-author-identity">
            <Avatar name="小林" />
            <div className="reading-author-copy">
              <Text size="lg">
                <strong>小林的周末手记</strong>
              </Text>
              <Text tone="muted">写一点日常，读几页喜欢的书。</Text>
            </div>
          </div>
          <div className="reading-author-actions">
            <Link href="mailto:hello@example.com">联系作者</Link>
            <Dialog
              open={aboutOpen}
              onOpenChange={setAboutOpen}
              title="关于作者"
              description="这是用于展示组件组合的示例作者。"
              trigger={<Button variant="ghost">关于作者</Button>}
            >
              <Text>你好，我是小林。这里放着散步时的发现和读书时留下的几句话。</Text>
            </Dialog>
          </div>
        </div>
        <div className="reading-tools">
          <SegmentedControl
            label="文章分类"
            options={categories}
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              setNotice('');
            }}
          />
          <TextField
            ref={searchRef}
            label="搜索手记"
            type="search"
            placeholder="输入标题或内容"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setNotice('');
            }}
            className="reading-search"
          />
        </div>
        <div className="reading-options">
          <Text size="sm" tone="muted">
            {filtered.length} 篇手记
          </Text>
          <Switch
            label="显示文章配图"
            checked={showImage}
            onChange={(event) => setShowImage(event.target.checked)}
          />
        </div>
        {active ? (
          <>
            <nav className="reading-list" aria-label="手记列表">
              {filtered.map((article) => (
                <div key={article.id} className="reading-list-row">
                  <Button
                    variant="ghost"
                    aria-pressed={active.id === article.id}
                    onClick={() => readArticle(article.id)}
                  >
                    {article.title}
                  </Button>
                  <Text size="sm" tone="muted">
                    <time dateTime={article.date}>{article.date}</time>
                  </Text>
                </div>
              ))}
            </nav>
            <article className="reading-article" aria-labelledby={`${rootId}-article`}>
              <header className="reading-article-header">
                <div className="reading-meta">
                  <Badge tone="accent">{active.category}</Badge>
                  <Text size="sm" tone="muted">
                    <time dateTime={active.date}>{active.date}</time> · 小林 · 约 2 分钟
                  </Text>
                </div>
                <Heading level={2} id={`${rootId}-article`} ref={articleRef} tabIndex={-1}>
                  {active.title}
                </Heading>
                <Text size="lg" tone="muted">
                  {active.summary}
                </Text>
              </header>
              {showImage && (
                <figure className="reading-figure">
                  <Image
                    src={cover}
                    alt="淡粉纸面上的周末手记示例封面"
                    width={800}
                    height={450}
                    aspectRatio="16 / 9"
                    loading="eager"
                  />
                  <figcaption>
                    <Text size="sm" tone="muted">
                      手记配图示例。关闭“显示文章配图”，也可以完整阅读。
                    </Text>
                  </figcaption>
                </figure>
              )}
              <div className="reading-body">
                <Text>{active.paragraphs[0]}</Text>
                <Heading level={3}>
                  {active.id === 'river' ? '把沿途的小事留下' : '让想法慢慢展开'}
                </Heading>
                {active.paragraphs.slice(1).map((paragraph) => (
                  <Text key={paragraph}>{paragraph}</Text>
                ))}
                <Text>
                  每篇手记都留下一点余地，
                  <Link
                    href={`#${rootId}-note`}
                    onClick={(event) => {
                      event.preventDefault();
                      noteRef.current?.scrollIntoView({ block: 'nearest' });
                      noteRef.current?.focus({ preventScroll: true });
                    }}
                  >
                    读一读写在后面的话
                  </Link>
                  ，再继续往前走。
                </Text>
              </div>
              <Surface
                className="reading-note"
                role="note"
                ref={noteRef}
                id={`${rootId}-note`}
                aria-labelledby={`${rootId}-note-heading`}
                tabIndex={-1}
              >
                <Heading level={3} id={`${rootId}-note-heading`}>
                  写在手记后面
                </Heading>
                <Text>
                  不用把每天都写成特别的故事。记住一点喜欢的事情，下一次翻开时，也能想起当时的心情。
                </Text>
              </Surface>
              <Divider decorative className="reading-divider" />
              <div className="reading-actions">
                <Button
                  aria-pressed={isSaved}
                  aria-describedby={`${rootId}-saved`}
                  onClick={() => {
                    setSaved((previous) =>
                      isSaved
                        ? previous.filter((id) => id !== active.id)
                        : [...previous, active.id],
                    );
                    setNotice(
                      isSaved
                        ? `已取消收藏「${active.title}」。`
                        : '已放进收藏，想读的时候再回来。',
                    );
                  }}
                >
                  收藏这篇文章
                </Button>
              </div>
              <div className="reading-feedback" role="status" id={`${rootId}-saved`}>
                <Text size="sm" tone="muted">
                  {notice || '示例文章，收藏状态仅保留在当前页面。'}
                </Text>
              </div>
            </article>
          </>
        ) : (
          <EmptyState
            title="还没有找到这篇手记"
            description="换个词，或看看全部文章。"
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery('');
                  setCategory('全部');
                  setNotice('');
                  searchRef.current?.focus();
                }}
              >
                显示全部手记
              </Button>
            }
          />
        )}
      </div>
    </ThemeProvider>
  );
}
