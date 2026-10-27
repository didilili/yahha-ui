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
    title: '沿着河边，慢慢走',
    summary: '出门没有安排，回家时却多了两行想写下的话。',
    paragraphs: [
      '周末出门时，没有特意想好要去哪里。沿着河边走了一段，看见树叶的影子落在水面上，又被风轻轻推开。',
      '路边的小店换了招牌，门口还是摆着那张旧木椅。我停下来坐了一会儿，把想记住的事情写了两行。',
      '有些日子不需要安排得很满。走一走，看看天色，也就很好。',
    ],
  },
  {
    id: 'book',
    date: '2026-10-12',
    title: '给周末留一页空白',
    summary: '书读得慢一点，笔记也不必写满。',
    paragraphs: [
      '这周读得很慢，一本书在桌边放了好几天。有时只翻两页，有时读到一半，就把窗户打开听一会儿雨声。',
      '我开始在读书笔记里多留一些空白。以后再读到这里，也许会想到不同的事情。',
      '今天先记到这里。下一次翻开时，再接着写。',
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
  const rootId = `chi-reading-${instance.replace(/[^a-zA-Z0-9_-]/g, '')}`;
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
      description="先看看全部手记，把想再读的那篇留下。"
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
    <ThemeProvider theme="chiikawa">
      <section
        aria-label="规范阅读"
        style={{ display: 'grid', gap: 24, maxWidth: '68ch', marginInline: 'auto' }}
      >
        <header style={{ display: 'grid', gap: 8 }}>
          <Heading level={3}>文章、栏目与小小的回应</Heading>
          <Text size="sm" tone="muted">
            正文使用默认 16px 字阶，栏目和筛选各有用途。文字为虚构示例，收藏只保留在当前页面。
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
                      <time dateTime={active.date}>{active.date}</time> · 小林的周末手记
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
                      {isSaved ? '已收藏这篇' : '收藏这篇'}
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
