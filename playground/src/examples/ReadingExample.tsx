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
    summary: '朋友的鞋带散了，我们就在河边等一等。',
    paragraphs: [
      '周末在 Yahha 星球的河边散步，小八走着走着停了下来。原来鞋带散了，大家就在桥边等他，顺手数了数水面上的叶子。',
      '路边小店门口还是那张旧木椅。我们挤着坐了一会儿，把带来的饼干掰成几份，也给迟到的朋友留下一份。',
      '回家才发现，今天没有走多远。不过等到了朋友，也记下了饼干掉进衣领的事，已经够写一页。',
    ],
  },
  {
    id: 'weekend',
    category: '读书',
    title: '给周末留一页空白',
    date: '2026-10-12',
    summary: '书读到一半，先给打瞌睡的朋友留个书签。',
    paragraphs: [
      '窗边的读书会才开始没多久，就有朋友抱着书睡着了。大家把声音放轻，在读到的地方夹上书签。',
      '我的笔记只写了两行，还画歪了一只小猫。旁边的朋友说，留点空白吧，下次可以一起画。',
      '今天先记到这里。没读完的那一段，等大家都醒着的时候，再接着读。',
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
    <ThemeProvider theme="pink">
      <style>{`
        .reading-example { width: 100%; max-width: 68ch; margin: auto; padding: 8px 0; }
        .reading-author { display: grid; gap: 8px; margin-bottom: 24px; }
        .reading-author-identity { display: flex; align-items: center; gap: 16px; }
        .reading-author-copy { min-width: 0; flex: 1; }
        .reading-author-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; margin-inline-start: 60px; }
        .reading-tools { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; padding-block: 20px; border-block: 1px solid var(--yahha-line, #c58ba1); }
        .reading-search { flex: 1 1 210px; }
        .reading-options { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 16px; padding-top: 12px; }
        .reading-list { display: grid; gap: 8px; padding-block: 20px; border-bottom: 1px solid var(--yahha-line, #c58ba1); }
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
            <Avatar name="库米" />
            <div className="reading-author-copy">
              <Text size="lg">
                <strong>库米的星球手记</strong>
              </Text>
              <Text tone="muted">在星球上散步，和朋友交换手记。</Text>
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
              <Text>
                你好，我是库米。我在 Yahha
                星球记一点日常：有人迟到，留块饼干；有人读得慢，就把这一页留着。
              </Text>
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
                    <time dateTime={active.date}>{active.date}</time> · 库米 · 约 2 分钟
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
                  不是每一天都有大事发生。有人把鞋带系好了，有人把半块饼干分给你，这一页也就有了想留下的事。
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
                        : '已在当前示例中收藏，刷新后恢复。',
                    );
                  }}
                >
                  收藏这篇文章
                </Button>
              </div>
              <div className="reading-feedback" role="status" id={`${rootId}-saved`}>
                <Text size="sm" tone="muted">
                  {notice || '示例文章，收藏状态仅在当前页面生效，刷新后恢复。'}
                </Text>
              </div>
            </article>
          </>
        ) : (
          <EmptyState
            title="未找到相关手记"
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
