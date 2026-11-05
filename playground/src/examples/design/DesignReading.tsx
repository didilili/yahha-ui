import { useId, useLayoutEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  EmptyState,
  Heading,
  Link,
  SegmentedControl,
  Tabs,
  Text,
  ThemeProvider,
} from 'yahha-ui';
import 'yahha-ui/style.css';

const notes = [
  {
    id: 'river',
    date: '2026-10-18',
    title: '窗台上的葱又长高了',
    summary: '吉伊刚拿起画笔，乌萨奇已经拿来剪刀，小八开始找锅。',
    paragraphs: [
      '窗台上的葱又长出一截。吉伊搬来椅子，想把它画进手记；刚画好花盆，就发现葱叶少了一段。',
      '乌萨奇举着剪刀，把剪下来的葱递给小八。小八捧着锅跑进厨房，又探头问：“一碗面够不够？”',
      '最后煮了三碗。吉伊把画里的葱改短，顺手在花盆旁边添了一碗面。',
    ],
  },
  {
    id: 'book',
    date: '2026-10-12',
    title: '杯底多了一个圆',
    summary: '读书笔记翻开，多了一个茶杯留下的圆印。',
    paragraphs: [
      '读到一半去开门，回来时杯子被放在笔记本上。纸上多了一个淡淡的圆，刚好圈住了昨天抄的句子。',
      '我拿笔给圆添上耳朵，本来想画只猫，画着画着却像一只带把手的茶壶。',
      '小八看了半天，说猫也许只是喝得太饱。那页笔记就这样多了一只肚子圆圆的猫。',
    ],
  },
  {
    id: 'rain',
    date: '2026-10-05',
    title: '雨停以后，绕一点远路',
    summary: '熟悉的回家路，也可以换一个走法。',
    paragraphs: [
      '下楼时雨已经停了。路边的叶子还挂着水，我把伞收起来，决定绕过平时不走的那条小路。',
      '一扇窗里传出收音机的声音，有人正把晾着的衣服搬到阳台。我没有走得更快，只是记住了这个下午。',
      '回到家，鞋边沾了一点泥。把它擦干净，再写下今天的日期。',
    ],
  },
];

type Scope = 'all' | 'saved';

/** Reading uses the same public defaults as every component page. */
export default function DesignReading() {
  const instance = useId();
  const rootId = `yahha-reading-${instance.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [tab, setTab] = useState<string | null>('article');
  const [scope, setScope] = useState<Scope>('all');
  const [activeId, setActiveId] = useState('river');
  const [saved, setSaved] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const articleRef = useRef<HTMLHeadingElement>(null);
  const emptyRef = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef<'article' | 'empty' | null>(null);
  const visible = scope === 'saved' ? notes.filter((note) => saved.includes(note.id)) : notes;
  const active = visible.find((note) => note.id === activeId) ?? visible[0] ?? notes[0];
  const isSaved = saved.includes(active.id);
  const showEmpty = scope === 'saved' && visible.length === 0;

  useLayoutEffect(() => {
    if (!pendingFocus.current) return;
    (pendingFocus.current === 'article' ? articleRef.current : emptyRef.current)?.focus();
    pendingFocus.current = null;
  }, [activeId, tab, scope, saved]);

  function changeScope(nextScope: Scope) {
    setScope(nextScope);
    setNotice('');
    if (nextScope === 'saved' && !saved.includes(activeId)) {
      setActiveId(notes.find((note) => saved.includes(note.id))?.id ?? notes[0].id);
    }
  }

  function toggleSaved() {
    const nextSaved = isSaved ? saved.filter((id) => id !== active.id) : [...saved, active.id];
    setSaved(nextSaved);
    if (scope === 'saved' && isSaved) {
      setActiveId(notes.find((note) => nextSaved.includes(note.id))?.id ?? notes[0].id);
      pendingFocus.current = nextSaved.length ? 'article' : 'empty';
    }
    setNotice(isSaved ? `已取消收藏「${active.title}」。` : `已收藏「${active.title}」。`);
  }

  const empty = (
    <EmptyState
      title="还没有收藏手记"
      description="从全部手记中找到想读的文章，再试试收藏。"
      action={
        <Button
          ref={emptyRef}
          variant="secondary"
          onClick={() => {
            pendingFocus.current = 'article';
            changeScope('all');
            setTab('article');
          }}
        >
          显示全部手记
        </Button>
      }
    />
  );

  return (
    <ThemeProvider theme="pink">
      <section
        aria-label="规范阅读"
        style={{ display: 'grid', gap: 24, maxWidth: '68ch', marginInline: 'auto' }}
      >
        <header style={{ display: 'grid', gap: 8 }}>
          <Heading level={3}>文章、栏目与收藏</Heading>
          <Text size="sm" tone="muted">
            正文使用默认 16px
            字阶，栏目和筛选各有用途。文字为虚构示例，收藏只保留在当前页面，刷新后恢复。
          </Text>
        </header>
        <SegmentedControl
          label="阅读范围"
          name={`${rootId}-scope`}
          value={scope}
          onValueChange={changeScope}
          options={[
            { value: 'all', label: '全部手记' },
            { value: 'saved', label: '已收藏' },
          ]}
        />
        <Tabs
          label="阅读视图"
          value={tab}
          onValueChange={setTab}
          items={[
            {
              value: 'article',
              label: '读正文',
              content: showEmpty ? (
                empty
              ) : (
                <article aria-label={active.title} style={{ display: 'grid', gap: 24 }}>
                  <header style={{ display: 'grid', gap: 12 }}>
                    <Text size="sm" tone="muted">
                      <time dateTime={active.date}>{active.date}</time> · 库米的星球手记
                    </Text>
                    <Heading level={4} ref={articleRef} tabIndex={-1}>
                      {active.title}
                    </Heading>
                    <Text size="sm" tone="muted">
                      {active.summary}
                    </Text>
                  </header>
                  <div style={{ display: 'grid', gap: 20 }}>
                    {active.paragraphs.map((paragraph) => (
                      <Text key={paragraph}>{paragraph}</Text>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
                    <Button variant="secondary" aria-pressed={isSaved} onClick={toggleSaved}>
                      收藏这篇手记
                    </Button>
                    <Link
                      href={`#${rootId}-note`}
                      onClick={(event) => {
                        event.preventDefault();
                        const target = document.getElementById(`${rootId}-note`);
                        target?.scrollIntoView({ block: 'nearest' });
                        target?.focus({ preventScroll: true });
                      }}
                    >
                      关于这篇示例
                    </Link>
                  </div>
                  <div id={`${rootId}-note`} tabIndex={-1}>
                    <Text size="sm" tone="muted">
                      本例直接使用组件库样式，没有另设按钮、字段、选中状态或排版主题。
                    </Text>
                  </div>
                </article>
              ),
            },
            {
              value: 'list',
              label: '看目录',
              content: showEmpty ? (
                empty
              ) : (
                <div style={{ display: 'grid', gap: 16 }}>
                  {visible.map((note) => (
                    <div key={note.id} style={{ display: 'grid', gap: 4, justifyItems: 'start' }}>
                      <Text size="sm" tone="muted">
                        <time dateTime={note.date}>{note.date}</time>
                      </Text>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          pendingFocus.current = 'article';
                          setActiveId(note.id);
                          setTab('article');
                          setNotice('');
                        }}
                      >
                        {note.title}
                      </Button>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />
        <div role="status" style={{ minHeight: '3em' }}>
          {notice && <Alert tone="info">{notice}</Alert>}
        </div>
      </section>
    </ThemeProvider>
  );
}
