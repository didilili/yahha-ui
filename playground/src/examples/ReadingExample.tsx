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
    summary: '说好沿河散步，小八却先闻到了面包香。',
    paragraphs: [
      '周末沿着 Yahha 星球的河边散步，小八忽然转了个弯。大家跟过去，才发现他已经站在面包店的橱窗前，连想买哪块都挑好了。',
      '吉伊对着菜单犹豫，小八把喜欢的口味一个个指给他看。乌萨奇已经叼着纸袋往河边走，袋口露出一截刚出炉的法棍。',
      '回家才发现，口袋里的散步路线画得很认真，面包店却根本不在上面。下次得补上，不然小八又要负责带路。',
    ],
  },
  {
    id: 'weekend',
    category: '读书',
    title: '读了三遍的那一页',
    date: '2026-10-12',
    summary: '窗外的麻雀太忙，书里的故事只好停一停。',
    paragraphs: [
      '窗边读书，小八忽然说这一页好像读过。翻回去一看，书签还夹在昨天的位置，窗外的麻雀倒是已经搬了三趟草枝。',
      '吉伊把看到的鸟画在笔记页边，画到脚爪时卡了壳。乌萨奇凑过来看，添了两条长腿，麻雀一下子像是要去参加长跑。',
      '小八笑得忘了读到哪一句，又把这页从头念了一遍。今天的读书笔记多了一只长腿麻雀，书签还是没挪。',
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
              <Text tone="muted">散步常绕到面包店，读书常被窗外的小鸟打断。</Text>
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
                你好，我是库米。喜欢沿河散步，出门常常忘带笔，倒记得哪家面包刚出炉。回家就把这些小事补进手记。
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
                  {active.id === 'river' ? '路线图上没有的那一站' : '书签还是没挪'}
                </Heading>
                {active.paragraphs.slice(1).map((paragraph) => (
                  <Text key={paragraph}>{paragraph}</Text>
                ))}
                <Text>
                  这页还有一点补记，
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
                  。
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
                  写手记时总有人凑过来看。小八检查点心有没有写漏，吉伊添了一幅画，乌萨奇的字挤到了纸边。
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
            description="当前分类中没有匹配的手记，换个关键词，或显示全部手记。"
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
