<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/guides/interactions.tsx。 -->

# 交互组合

删除确认、收藏筛选、表单反馈、撤销和章节分享的完整组件组合。

[安装与接入](../../README.md#安装与接入)

<a id="actions"></a>

## 操作与焦点

确认、移除与关闭后，保留可继续操作的入口。

<a id="button-delete-draft"></a>

### 删除确认与恢复

确认后删除本地草稿，取消时保留，删除后可恢复。

[查看示例文件](../../playground/src/examples/foundations/ButtonDeleteDraft.tsx)

<!-- example-source: playground/src/examples/foundations/ButtonDeleteDraft.tsx -->

```tsx
import { useId, useRef, useState } from 'react';
import { Button, Dialog, EmptyState, Heading, Text } from 'yahha-ui';

export default function ButtonDeleteDraft() {
  const [hasDraft, setHasDraft] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const draftTitleId = useId();
  const actionRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 520 }}>
      {hasDraft ? (
        <section aria-labelledby={draftTitleId} style={{ display: 'grid', gap: 8 }}>
          <Heading level={3} id={draftTitleId}>
            周末散步记录
          </Heading>
          <Text>沿河走了一小段，记下树影和路边新开的花。</Text>
        </section>
      ) : (
        <EmptyState title="草稿已删除" description="这份散步记录仍可通过下方按钮恢复。" />
      )}
      <div>
        <Button
          ref={actionRef}
          variant="secondary"
          destructive={hasDraft}
          onClick={() => {
            if (hasDraft) {
              setOpen(true);
              return;
            }
            setHasDraft(true);
            setMessage('草稿已恢复。');
          }}
        >
          {hasDraft ? '删除草稿' : '恢复草稿'}
        </Button>
      </div>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="删除这份草稿？"
        description="将移除当前演示中的「周末散步记录」，删除后仍可恢复。"
        initialFocus={cancelRef}
        finalFocus={actionRef}
        footer={
          <>
            <Button ref={cancelRef} variant="secondary" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button
              destructive
              onClick={() => {
                setHasDraft(false);
                setOpen(false);
                setMessage('草稿已删除，可通过“恢复草稿”按钮恢复。');
              }}
            >
              确认删除
            </Button>
          </>
        }
      />
      <Text size="sm" tone="muted" role="status">
        {message}
      </Text>
    </div>
  );
}
```

<a id="icon-button-reading-list"></a>

### 收藏列表与焦点恢复

筛选收藏后移除当前项，焦点移到相邻操作或恢复入口。

[查看示例文件](../../playground/src/examples/foundations/IconButtonReadingList.tsx)

<!-- example-source: playground/src/examples/foundations/IconButtonReadingList.tsx -->

```tsx
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
```

<a id="controlled"></a>

### 菜单触发器移除与恢复

移出草稿时转到恢复入口，恢复后返回新菜单按钮。

[查看示例文件](../../playground/src/examples/floating/MenuControlled.tsx)

<!-- example-source: playground/src/examples/floating/MenuControlled.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Button, DropdownMenu, Heading, Text, Input } from 'yahha-ui';

export default function MenuControlled() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('草稿尚未发布');
  const [removed, setRemoved] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('周末想写的一页');
  const [draftTitle, setDraftTitle] = useState(title);
  const trigger = useRef<HTMLButtonElement>(null);
  const editor = useRef<HTMLInputElement>(null);
  const recovery = useRef<HTMLButtonElement>(null);
  const [focusTarget, setFocusTarget] = useState<'editor' | 'trigger' | 'recovery' | null>(null);

  useEffect(() => {
    if (!focusTarget) return;
    const frame = requestAnimationFrame(() => {
      const target =
        focusTarget === 'editor'
          ? editor.current
          : focusTarget === 'recovery'
            ? recovery.current
            : trigger.current;
      target?.focus();
      setFocusTarget(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [focusTarget]);

  function restore() {
    setOpen(false);
    setRemoved(false);
    setMessage('草稿已恢复，内容没有丢失');
    setFocusTarget('trigger');
  }

  return (
    <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
      {!removed && (
        <article aria-label="示例草稿" style={{ display: 'grid', gap: 16, minWidth: 0 }}>
          {editing ? (
            <form
              style={{ display: 'grid', gap: 12 }}
              onSubmit={(event) => {
                event.preventDefault();
                if (!draftTitle.trim()) {
                  editor.current?.focus();
                  return;
                }
                setTitle(draftTitle.trim());
                setEditing(false);
                setMessage('草稿标题已保存在本页');
                setFocusTarget('trigger');
              }}
            >
              <Input
                ref={editor}
                label="草稿标题"
                value={draftTitle}
                required
                maxLength={60}
                hint="1–60 个字符。"
                onChange={(event) => setDraftTitle(event.target.value)}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Button type="submit" disabled={!draftTitle.trim()}>
                  保存草稿
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditing(false);
                    setMessage('已取消编辑，草稿标题没有改变');
                    setFocusTarget('trigger');
                  }}
                >
                  取消编辑
                </Button>
              </div>
            </form>
          ) : (
            <>
              <Heading level={3}>{title}</Heading>
              <Text>散步时拐进面包店，回家才发现路线图一笔也没记。</Text>
            </>
          )}
          <div style={{ justifySelf: 'start' }}>
            <DropdownMenu
              trigger={
                <Button ref={trigger} variant="secondary" aria-label={`操作草稿：${title}`}>
                  草稿操作
                </Button>
              }
              open={open}
              onOpenChange={setOpen}
              align="end"
              items={[
                {
                  id: 'edit',
                  label: '继续编辑',
                  onSelect: () => {
                    if (!editing) setDraftTitle(title);
                    setEditing(true);
                    setFocusTarget('editor');
                    setMessage('正在编辑草稿');
                  },
                },
                {
                  id: 'publish',
                  label: '发布（等待审核）',
                  disabled: true,
                  onSelect: () => setMessage('已发布'),
                },
                {
                  id: 'remove',
                  label: '移出草稿列表',
                  destructive: true,
                  onSelect: () => {
                    setOpen(false);
                    setRemoved(true);
                    setMessage('已从示例列表中移出，可恢复原草稿');
                    setFocusTarget('recovery');
                  },
                },
              ]}
            />
          </div>
        </article>
      )}
      {removed && (
        <Button ref={recovery} onClick={restore} style={{ justifySelf: 'start' }}>
          恢复草稿
        </Button>
      )}
      <Text size="sm" tone="muted" role="status">
        {message}
      </Text>
    </div>
  );
}
```

<a id="basic"></a>

### 清单操作与提示回焦

点击提示内的操作查看清单，关闭后仍可从常驻入口访问。

[查看示例文件](../../playground/src/examples/feedback/ToastBasic.tsx)

<!-- example-source: playground/src/examples/feedback/ToastBasic.tsx -->

```tsx
import { useEffect, useId, useRef, useState } from 'react';
import { Button, Heading, Text, Toast } from 'yahha-ui';

const article = {
  title: '窗边那半本书，留给周末的一页',
  summary: '把读到一半的段落留给周末，先将手记收进稍后阅读清单。',
};

export default function ToastBasic() {
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const message = useRef<HTMLDivElement>(null);
  const listHeading = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef(false);
  const listId = useId();

  useEffect(() => {
    if (open || !returnFocus.current) return;
    returnFocus.current = false;
    if (document.activeElement === document.body) trigger.current?.focus();
  }, [open]);

  function viewList() {
    returnFocus.current = false;
    setOpen(false);
    listHeading.current?.focus();
    listHeading.current?.scrollIntoView({ block: 'nearest' });
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: 20,
        maxWidth: 640,
        minWidth: 0,
        overflowWrap: 'anywhere',
      }}
    >
      <article aria-label="示例手记" style={{ display: 'grid', gap: 12, minWidth: 0 }}>
        <Heading level={3}>{article.title}</Heading>
        <Text>{article.summary}</Text>
        <Text size="sm" tone="muted">
          {saved ? '已在稍后阅读清单中。' : '尚未加入稍后阅读。'}
        </Text>
      </article>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button
          ref={trigger}
          onClick={() => {
            returnFocus.current = false;
            setSaved((current) => !current);
            setOpen(true);
          }}
        >
          {saved ? '移出稍后阅读' : '加入稍后阅读'}
        </Button>
        <Button variant="secondary" onClick={viewList}>
          查看阅读清单
        </Button>
      </div>
      <div ref={message}>
        <Toast
          appearance="receipt"
          open={open}
          onClose={() => {
            returnFocus.current = message.current?.contains(document.activeElement) ?? false;
            setOpen(false);
          }}
          tone={saved ? 'success' : 'info'}
          title={saved ? '已加入稍后阅读' : '已移出稍后阅读'}
          description={article.title}
          action={
            <Button variant="ghost" onClick={viewList}>
              查看阅读清单
            </Button>
          }
        />
      </div>
      <section aria-labelledby={listId} style={{ display: 'grid', gap: 12, minWidth: 0 }}>
        <Heading id={listId} ref={listHeading} level={3} tabIndex={-1}>
          稍后阅读清单
        </Heading>
        <Text size="sm" tone="muted">
          共 {saved ? 1 : 0} 篇手记。
        </Text>
        {saved ? (
          <ul style={{ margin: 0, paddingInlineStart: 24, minWidth: 0 }}>
            <li>{article.title}</li>
          </ul>
        ) : (
          <Text>还没有稍后阅读的手记。</Text>
        )}
      </section>
    </div>
  );
}
```

<a id="lists"></a>

## 筛选与清单

用同一份本地数据组织筛选、收藏、批量操作与栏目计数。

<a id="icon-composition"></a>

### 搜索与逐项收藏

提交关键词筛选本地手记，点击收藏切换状态；清空后回到输入框。

[查看示例文件](../../playground/src/examples/foundations/IconComposition.tsx)

<!-- example-source: playground/src/examples/foundations/IconComposition.tsx -->

```tsx
import { useRef, useState } from 'react';
import { BookmarkIcon, Button, CloseIcon, IconButton, SearchIcon, Text, Input } from 'yahha-ui';

const articles = ['周末的散步记录', '给小花换一个花盆', '散步路上的面包店'];

export default function IconComposition() {
  const [value, setValue] = useState('');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const matches = articles.filter((title) => title.includes(query.trim()));

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 480, minWidth: 0 }}>
      <form
        style={{ display: 'grid', gap: 12 }}
        onSubmit={(event) => {
          event.preventDefault();
          setQuery(value);
        }}
      >
        <Input
          ref={inputRef}
          label="搜索手记"
          type="text"
          inputMode="search"
          enterKeyHint="search"
          placeholder="试试“散步”"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          leading={<SearchIcon />}
          trailing={
            <IconButton
              variant="ghost"
              aria-label="清空手记搜索"
              disabled={!value && !query}
              onClick={() => {
                setValue('');
                setQuery('');
                inputRef.current?.focus();
              }}
            >
              <CloseIcon />
            </IconButton>
          }
        />
        <Button type="submit" startIcon={<SearchIcon />} style={{ justifySelf: 'start' }}>
          搜索
        </Button>
      </form>
      <Text size="sm" tone="muted" role="status">
        {matches.length ? `找到 ${matches.length} 篇手记` : '没有匹配的手记，试试其他关键词。'}
      </Text>
      {matches.length > 0 && (
        <ul
          aria-label="匹配的手记"
          style={{ display: 'grid', gap: 12, margin: 0, padding: 0, listStyle: 'none' }}
        >
          {matches.map((title) => (
            <li
              key={title}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <span>{title}</span>
              <IconButton
                variant="ghost"
                aria-label={`收藏《${title}》`}
                aria-pressed={saved.includes(title)}
                onClick={() => {
                  setSaved((current) =>
                    current.includes(title)
                      ? current.filter((item) => item !== title)
                      : [...current, title],
                  );
                }}
              >
                <BookmarkIcon filled={saved.includes(title)} />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

<a id="checkbox-reading-topics"></a>

### 多选筛选与地址同步

勾选多项筛选内容，通过链接或浏览器返回恢复条件。

[查看示例文件](../../playground/src/examples/new-forms/CheckboxReadingTopics.tsx)

<!-- example-source: playground/src/examples/new-forms/CheckboxReadingTopics.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, EmptyState, Heading, Link, Text } from 'yahha-ui';

const queryKey = 'checkbox-topic';
const topics = [
  { id: 'reading', label: '阅读' },
  { id: 'walking', label: '散步' },
  { id: 'stargazing', label: '观星' },
] as const;
type TopicId = (typeof topics)[number]['id'];

const notes: { id: string; title: string; summary: string; topics: TopicId[] }[] = [
  {
    id: 'half-a-book',
    title: '把周末留给半本书',
    summary: '读到半页才发现，旁边的批注比原文还长。',
    topics: ['reading'],
  },
  {
    id: 'riverside',
    title: '绕到河边再回家',
    summary: '绕过桥边的积水，鞋底还是沾了一片甩不掉的叶子。',
    topics: ['walking'],
  },
  {
    id: 'park-book',
    title: '带一本书去公园',
    summary: '本来只想在树荫下读书，结果盯着一只搬面包屑的蚂蚁看了半天。',
    topics: ['reading', 'walking'],
  },
];

function readTopics(href: string): TopicId[] {
  const values = new URL(href).searchParams.getAll(queryKey);
  return topics.filter((topic) => values.includes(topic.id)).map((topic) => topic.id);
}

export default function CheckboxReadingTopics() {
  const [href, setHref] = useState(() => window.location.href);
  const firstCheckboxRef = useRef<HTMLInputElement>(null);
  const selected = readTopics(href);
  const selectedLabels = topics.filter((topic) => selected.includes(topic.id));
  const visibleNotes = notes.filter(
    (note) => selected.length === 0 || note.topics.some((topic) => selected.includes(topic)),
  );

  useEffect(() => {
    const readHref = () => setHref(window.location.href);
    readHref();
    window.addEventListener('popstate', readHref);
    window.addEventListener('hashchange', readHref);
    return () => {
      window.removeEventListener('popstate', readHref);
      window.removeEventListener('hashchange', readHref);
    };
  }, []);

  function updateTopics(next: TopicId[]) {
    const url = new URL(window.location.href);
    const current = readTopics(url.href);
    const ordered = topics.filter((topic) => next.includes(topic.id)).map((topic) => topic.id);
    const sameSelection =
      current.length === ordered.length &&
      current.every((topic, index) => topic === ordered[index]);
    const values = url.searchParams.getAll(queryKey);
    const sameQuery =
      values.length === ordered.length && values.every((topic, index) => topic === ordered[index]);
    if (sameSelection && sameQuery) {
      setHref(url.href);
      return;
    }
    url.searchParams.delete(queryKey);
    ordered.forEach((topic) => url.searchParams.append(queryKey, topic));
    if (sameSelection) window.history.replaceState(window.history.state, '', url.href);
    else window.history.pushState(window.history.state, '', url.href);
    setHref(url.href);
  }

  return (
    <section
      aria-label="阅读兴趣与分享链接"
      style={{ display: 'grid', gap: 20, minWidth: 0, maxWidth: 640, overflowWrap: 'anywhere' }}
    >
      <fieldset style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}>
        <legend style={{ marginBottom: 12 }}>阅读兴趣</legend>
        {topics.map((topic, index) => (
          <Checkbox
            key={topic.id}
            ref={index === 0 ? firstCheckboxRef : undefined}
            label={topic.label}
            hint={topic.id === 'stargazing' ? '还没有相关手记。' : undefined}
            name={queryKey}
            value={topic.id}
            checked={selected.includes(topic.id)}
            onChange={(event) => {
              const current = readTopics(window.location.href);
              updateTopics(
                event.currentTarget.checked
                  ? [...current, topic.id]
                  : current.filter((id) => id !== topic.id),
              );
            }}
          />
        ))}
      </fieldset>
      <Text size="sm" tone="muted" role="status">
        {selected.length === 0
          ? `全部手记，共 ${visibleNotes.length} 篇。`
          : `兴趣：${selectedLabels.map((topic) => topic.label).join('、')}，共 ${visibleNotes.length} 篇手记。`}
      </Text>
      {visibleNotes.length > 0 ? (
        <ul style={{ display: 'grid', gap: 24, margin: 0, paddingInlineStart: 24, minWidth: 0 }}>
          {visibleNotes.map((note) => (
            <li key={note.id} style={{ display: 'grid', gap: 8, minWidth: 0 }}>
              <Heading level={3}>{note.title}</Heading>
              <Text size="sm">{note.summary}</Text>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="还没有相关手记" description="换一个兴趣，或清空筛选查看全部手记。" />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <Button
          variant="secondary"
          onClick={() => {
            updateTopics([]);
            firstCheckboxRef.current?.focus();
          }}
        >
          清空兴趣
        </Button>
        <Link href={href}>分享当前兴趣</Link>
      </div>
    </section>
  );
}
```

<a id="checkbox-reading-list"></a>

### 批量操作与失败恢复

选择文章后确认移出；本地模拟失败时保留选择，支持重试。

[查看示例文件](../../playground/src/examples/new-forms/CheckboxReadingList.tsx)

<!-- example-source: playground/src/examples/new-forms/CheckboxReadingList.tsx -->

```tsx
import { useEffect, useId, useRef, useState } from 'react';
import { Alert, Button, Checkbox, Dialog, EmptyState, Text } from 'yahha-ui';

const initialItems = [
  {
    id: 'river',
    title: '沿河走到面包店的那条小路',
    summary: '说好沿河散步，小八却先闻到了面包香。',
  },
  {
    id: 'reading',
    title: 'ReadingNotesForASlowWeekend：还没读完的两页书',
    summary: '书签没动，页边却多了一只长腿麻雀。',
  },
  {
    id: 'flower',
    title: '花店门口，写给朋友的一张纸条',
    summary: '把花名写在纸条上，带回家才发现忘记问价钱。',
  },
];

export default function CheckboxReadingList() {
  const [items, setItems] = useState(initialItems);
  const [selected, setSelected] = useState<string[]>([]);
  const [snapshot, setSnapshot] = useState(initialItems.slice(0, 0));
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const actionRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const request = useRef(0);
  const failNext = useRef(true);
  const removedOnClose = useRef(false);
  const restoreConfirmFocus = useRef(false);
  const restoreListFocus = useRef(false);
  const descriptionId = useId();
  const allSelected = items.length > 0 && selected.length === items.length;

  useEffect(
    () => () => {
      request.current += 1;
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  useEffect(() => {
    if (!open || busy || !error || !restoreConfirmFocus.current) return;
    if (document.activeElement === document.body || document.activeElement === popupRef.current) {
      confirmRef.current?.focus();
    }
    restoreConfirmFocus.current = false;
  }, [open, busy, error]);

  useEffect(() => {
    if (!restoreListFocus.current) return;
    restoreListFocus.current = false;
    firstItemRef.current?.focus();
  }, [items]);

  function changeOpen(next: boolean) {
    if (!next) {
      request.current += 1;
      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = null;
      restoreConfirmFocus.current = false;
      removedOnClose.current = false;
      setBusy(false);
      setError('');
    }
    setOpen(next);
  }

  function restoreList() {
    if (busy) return;
    request.current += 1;
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    failNext.current = true;
    restoreListFocus.current = true;
    setItems(initialItems);
    setSelected([]);
    setMessage('');
  }

  function confirmRemoval() {
    if (busy || timer.current !== null || !snapshot.length) return;
    const currentRequest = ++request.current;
    const ids = new Set(snapshot.map((item) => item.id));
    setError('');
    setBusy(true);
    // Local demonstration: the first completed attempt fails; retrying keeps the same selection.
    timer.current = setTimeout(() => {
      if (currentRequest !== request.current) return;
      timer.current = null;
      setBusy(false);
      if (failNext.current) {
        failNext.current = false;
        restoreConfirmFocus.current =
          document.activeElement === document.body || document.activeElement === popupRef.current;
        setError('清单和选择仍然保留，请再次点击“确认移除”。');
        return;
      }
      setItems((current) => current.filter((item) => !ids.has(item.id)));
      setSelected([]);
      setMessage(`已从稍后阅读移除 ${ids.size} 篇，文章仍然保留。`);
      removedOnClose.current = true;
      setOpen(false);
    }, 700);
  }

  return (
    <div className="yahha-checkbox-reading-list">
      <style>{`
.yahha-checkbox-reading-list {
  display: grid;
  gap: var(--yahha-space-4, 16px);
  min-width: 0;
  max-width: 38rem;
}
.yahha-checkbox-reading-list-group {
  display: grid;
  gap: var(--yahha-space-3, 12px);
  min-inline-size: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
.yahha-checkbox-reading-list-legend {
  margin-block-end: var(--yahha-space-3, 12px);
  padding: 0;
  font-weight: 600;
}
.yahha-checkbox-reading-list-list {
  display: grid;
  gap: var(--yahha-space-2, 8px);
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}
.yahha-checkbox-reading-list-item {
  min-width: 0;
  padding-inline: var(--yahha-space-2, 8px);
  border-radius: var(--yahha-radius-field, 12px 16px 14px 11px);
}
.yahha-checkbox-reading-list-item[data-selected] {
  background: var(--yahha-accent-soft, #fff0f6);
}
.yahha-checkbox-reading-list-copy {
  display: grid;
  gap: var(--yahha-space-1, 4px);
  min-width: 0;
}
.yahha-checkbox-reading-list-summary {
  color: var(--yahha-muted, #7a5c6d);
  font-size: var(--yahha-font-size-sm, 12px);
  line-height: var(--yahha-leading-caption, 1.6);
}
.yahha-checkbox-reading-list-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--yahha-space-3, 12px);
}
.yahha-checkbox-reading-list-snapshot {
  display: grid;
  gap: var(--yahha-space-2, 8px);
  margin: 0;
  padding-inline-start: var(--yahha-space-6, 24px);
  overflow-wrap: anywhere;
}
@media (forced-colors: active) {
  .yahha-checkbox-reading-list-item[data-selected] {
    background: Canvas;
  }
}
      `}</style>
      {items.length ? (
        <fieldset className="yahha-checkbox-reading-list-group">
          <legend className="yahha-checkbox-reading-list-legend">选择稍后阅读的手记</legend>
          <Checkbox
            label="全选当前清单"
            checked={allSelected}
            indeterminate={selected.length > 0 && !allSelected}
            disabled={busy}
            onChange={(event) => {
              setSelected(event.currentTarget.checked ? items.map((item) => item.id) : []);
              setMessage('');
            }}
          />
          <ul className="yahha-checkbox-reading-list-list" aria-label="稍后阅读清单">
            {items.map((item, index) => (
              <li
                className="yahha-checkbox-reading-list-item"
                data-selected={selected.includes(item.id) || undefined}
                key={item.id}
              >
                <Checkbox
                  ref={index === 0 ? firstItemRef : undefined}
                  label={
                    <span className="yahha-checkbox-reading-list-copy">
                      <strong>{item.title}</strong>
                      <span
                        className="yahha-checkbox-reading-list-summary"
                        id={`${descriptionId}-${item.id}`}
                      >
                        {item.summary}
                      </span>
                    </span>
                  }
                  aria-label={`选择手记：${item.title}`}
                  aria-describedby={`${descriptionId}-${item.id}`}
                  checked={selected.includes(item.id)}
                  disabled={busy}
                  onChange={(event) => {
                    const checked = event.currentTarget.checked;
                    setSelected((current) =>
                      checked ? [...current, item.id] : current.filter((id) => id !== item.id),
                    );
                    setMessage('');
                  }}
                />
              </li>
            ))}
          </ul>
        </fieldset>
      ) : (
        <EmptyState title="稍后阅读清单已清空" description="这里只移出了清单，文章内容仍然保留。" />
      )}
      <div className="yahha-checkbox-reading-list-actions">
        <Button
          ref={actionRef}
          type="button"
          variant="secondary"
          destructive
          disabled={!selected.length || busy}
          onClick={() => {
            const next = items.filter((item) => selected.includes(item.id));
            if (!next.length || busy) return;
            setSnapshot(next);
            setError('');
            setMessage('');
            removedOnClose.current = false;
            setOpen(true);
          }}
        >
          移除所选
        </Button>
        {items.length < initialItems.length && (
          <Button
            ref={restoreRef}
            type="button"
            variant="ghost"
            disabled={busy}
            onClick={restoreList}
          >
            恢复示例清单
          </Button>
        )}
      </div>
      <Text role="status" size="sm" tone="muted">
        {message || `已选 ${selected.length} 篇，共 ${items.length} 篇。`}
      </Text>
      <Dialog
        ref={popupRef}
        open={open}
        onOpenChange={changeOpen}
        title="从稍后阅读移除所选手记？"
        description={`将移出本次选择的 ${snapshot.length} 篇手记，文章内容不会删除。`}
        initialFocus={cancelRef}
        finalFocus={() =>
          removedOnClose.current ? (firstItemRef.current ?? restoreRef.current) : actionRef.current
        }
        footer={
          <>
            <Button
              ref={cancelRef}
              type="button"
              variant="secondary"
              onClick={() => changeOpen(false)}
            >
              取消
            </Button>
            <Button
              ref={confirmRef}
              type="button"
              destructive
              loading={busy}
              onClick={confirmRemoval}
            >
              确认移除
            </Button>
          </>
        }
      >
        <ul className="yahha-checkbox-reading-list-snapshot" aria-label="本次将移出的手记">
          {snapshot.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
        {busy && (
          <Text size="sm" tone="muted">
            正在移出所选手记…
          </Text>
        )}
        {error && (
          <Alert tone="error" role="alert" title="模拟移除失败">
            {error}
          </Alert>
        )}
      </Dialog>
    </div>
  );
}
```

<a id="counts"></a>

### 栏目计数与清单操作

归档清单中的手记，数量标记与两个面板同步更新。

[查看示例文件](../../playground/src/examples/navigation/TabsCounts.tsx)

<!-- example-source: playground/src/examples/navigation/TabsCounts.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Heading, Tabs, Text } from 'yahha-ui';

const initialNotes = [
  { id: 'rain', title: '雨天的读书笔记' },
  { id: 'walk', title: '周末散步的小发现' },
  { id: 'window', title: '窗边的植物记录' },
];

export default function TabsCounts() {
  const [archivedIds, setArchivedIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const pendingHeading = useRef<HTMLHeadingElement>(null);
  const pendingFocus = useRef<{ id?: string } | null>(null);
  const pendingNotes = initialNotes.filter((note) => !archivedIds.includes(note.id));
  const archivedNotes = initialNotes.filter((note) => archivedIds.includes(note.id));

  useEffect(() => {
    const destination = pendingFocus.current;
    if (!destination) return;
    pendingFocus.current = null;
    if (document.activeElement === document.body) {
      (destination.id ? buttons.current.get(destination.id) : pendingHeading.current)?.focus();
    }
  }, [archivedIds]);

  function archive(id: string, button: HTMLButtonElement) {
    const index = pendingNotes.findIndex((note) => note.id === id);
    const remaining = pendingNotes.filter((note) => note.id !== id);
    if (document.activeElement === button) {
      pendingFocus.current = { id: (remaining[index] ?? remaining[index - 1])?.id };
    }
    setArchivedIds((current) => [...current, id]);
    setMessage(`已归档《${initialNotes.find((note) => note.id === id)?.title}》。`);
  }

  return (
    <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
      <Tabs
        label="手记整理"
        items={[
          {
            value: 'pending',
            label: (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                待整理 <Badge>{pendingNotes.length}</Badge>
              </span>
            ),
            content: (
              <div style={{ display: 'grid', gap: 12, minWidth: 0 }}>
                {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
                <Heading level={3} ref={pendingHeading} tabIndex={-1}>
                  待整理手记
                </Heading>
                {pendingNotes.length === 0 ? (
                  <Text tone="muted">当前清单已整理完。</Text>
                ) : (
                  <ul
                    style={{ display: 'grid', gap: 12, padding: 0, margin: 0, listStyle: 'none' }}
                  >
                    {pendingNotes.map((note) => (
                      <li
                        key={note.id}
                        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}
                      >
                        <Text style={{ flex: '1 1 140px', margin: 0 }}>{note.title}</Text>
                        <Button
                          ref={(node) => {
                            if (node) buttons.current.set(note.id, node);
                            else buttons.current.delete(note.id);
                          }}
                          variant="secondary"
                          aria-label={`归档《${note.title}》`}
                          onClick={(event) => archive(note.id, event.currentTarget)}
                        >
                          归档
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ),
          },
          {
            value: 'archived',
            label: (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                已归档 <Badge tone="success">{archivedNotes.length}</Badge>
              </span>
            ),
            content: (
              <div style={{ display: 'grid', gap: 12, minWidth: 0 }}>
                <Heading level={3}>已归档手记</Heading>
                {archivedNotes.length === 0 ? (
                  <Text tone="muted">还没有归档的手记。</Text>
                ) : (
                  <ul style={{ margin: 0, paddingInlineStart: 24 }}>
                    {archivedNotes.map((note) => (
                      <li key={note.id}>{note.title}</li>
                    ))}
                  </ul>
                )}
              </div>
            ),
          },
        ]}
      />
      <Button
        variant="ghost"
        style={{ justifySelf: 'start' }}
        onClick={() => {
          setArchivedIds([]);
          setMessage('已恢复示例清单。');
        }}
      >
        恢复示例清单
      </Button>
      {message && (
        <Text size="sm" tone="muted" role="status">
          {message}
        </Text>
      )}
    </div>
  );
}
```

<a id="feedback"></a>

## 表单与反馈

条件字段、保存失败、重试和撤销由各示例管理。统一字段绑定、校验、提交与重置见 [Form 表单](../components/form.md)，使用 FormData 自行取值和管理状态见 [原生表单接入](../guides/forms.md)。

<a id="radio-comment-signature"></a>

### 条件字段与表单值

切换选项控制昵称字段，按实际表单值预览署名；本例不发布留言。

[查看示例文件](../../playground/src/examples/new-forms/RadioGroupCommentSignature.tsx)

<!-- example-source: playground/src/examples/new-forms/RadioGroupCommentSignature.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Button, RadioGroup, Text, Input } from 'yahha-ui';

type Signature = 'nickname' | 'anonymous';
const comment = '读到小八在面包店门口站住，我也饿了。那张路线图记得把店名补上。';

export default function RadioGroupCommentSignature() {
  const [signature, setSignature] = useState<Signature>('nickname');
  const [nickname, setNickname] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const nicknameRef = useRef<HTMLInputElement>(null);
  const anonymous = signature === 'anonymous';

  return (
    <form
      noValidate
      style={{ display: 'grid', gap: 16, minWidth: 0, maxWidth: 520 }}
      onInput={() => {
        setPreview(null);
        setError('');
      }}
      onReset={(event) => {
        event.preventDefault();
        setSignature('nickname');
        setNickname('');
        setPreview(null);
        setError('');
      }}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const method = data.get('signature');
        if (method !== 'nickname' && method !== 'anonymous') return;
        const author =
          method === 'anonymous' ? '匿名读者' : String(data.get('nickname') ?? '').trim();
        if (!author) {
          setError('请填写昵称，或选择匿名预览。');
          nicknameRef.current?.focus();
          return;
        }
        setError('');
        setPreview(author);
      }}
    >
      <div style={{ display: 'grid', gap: 8 }}>
        <Text size="sm" tone="muted">
          想留下的话
        </Text>
        <Text>{comment}</Text>
      </div>
      <RadioGroup<Signature>
        label="留言署名"
        name="signature"
        value={signature}
        onValueChange={(value) => {
          setSignature(value);
          setPreview(null);
          setError('');
        }}
        options={[
          { value: 'nickname', label: '使用昵称' },
          { value: 'anonymous', label: '匿名' },
        ]}
      />
      <Input
        ref={nicknameRef}
        label="昵称"
        name="nickname"
        autoComplete="nickname"
        value={nickname}
        onChange={(event) => setNickname(event.currentTarget.value)}
        required={!anonymous}
        disabled={anonymous}
        hint={anonymous ? '匿名预览不会使用昵称，草稿仍保留。' : '必填，用这个昵称署名预览。'}
        error={error || undefined}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="submit">预览留言</Button>
        <Button type="reset" variant="secondary">
          重置示例
        </Button>
      </div>
      <Text role="status" size="sm" tone="muted">
        {preview === null ? '' : '预览已更新，内容未发布。'}
      </Text>
      {preview !== null && (
        <section aria-label="留言预览" style={{ display: 'grid', gap: 8 }}>
          <Text>
            <strong>署名：{preview}</strong>
          </Text>
          <Text>{comment}</Text>
        </section>
      )}
    </form>
  );
}
```

<a id="badge-status"></a>

### 表单校验与状态摘要

根据摘要检查结果切换标记。

[查看示例文件](../../playground/src/examples/foundations/BadgeStatus.tsx)

<!-- example-source: playground/src/examples/foundations/BadgeStatus.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Badge, Button, Heading, Surface, Text, Input } from 'yahha-ui';

type Phase = 'unchecked' | 'editing' | 'missing' | 'checked';
const labels = {
  unchecked: '未检查',
  editing: '待检查',
  missing: '需补充',
  checked: '已检查',
};

export default function BadgeStatus() {
  const [phase, setPhase] = useState<Phase>('unchecked');
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tone = phase === 'checked' ? 'success' : phase === 'editing' ? 'accent' : 'neutral';

  return (
    <Surface style={{ display: 'grid', gap: 24, minWidth: 0, maxWidth: 560 }}>
      <header style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <Badge>生活手记</Badge>
        <Heading level={3}>沿着河边，慢慢走</Heading>
      </header>
      <form
        noValidate
        style={{ display: 'grid', gap: 16, minWidth: 0 }}
        onInput={() => {
          setPhase('editing');
          setPreview(null);
        }}
        onReset={() => {
          setPhase('unchecked');
          setPreview(null);
        }}
        onSubmit={(event) => {
          event.preventDefault();
          const summary = String(new FormData(event.currentTarget).get('summary') ?? '');
          if (!summary.trim()) {
            setPhase('missing');
            setPreview(null);
            inputRef.current?.focus();
            return;
          }
          setPhase('checked');
          setPreview(summary);
        }}
      >
        <Input
          ref={inputRef}
          label="手记摘要"
          name="summary"
          defaultValue=""
          required
          hint="必填，写下一两句手记的内容。"
          error={phase === 'missing' ? '请先填写摘要。' : undefined}
        />
        <div>
          <Badge tone={tone}>{labels[phase]}</Badge>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Button type="submit">检查摘要</Button>
          <Button type="reset" variant="secondary">
            恢复示例
          </Button>
        </div>
        <Text role="status" size="sm" tone="muted">
          {phase === 'checked' ? '摘要检查通过，预览已更新；内容未保存或发布。' : ''}
        </Text>
        {preview !== null && (
          <section aria-label="摘要预览" style={{ whiteSpace: 'pre-wrap' }}>
            <Text>{preview}</Text>
          </section>
        )}
      </form>
    </Surface>
  );
}
```

<a id="alert-action"></a>

### 订阅设置与失败重试

首次模拟订阅失败，重试后成功；保留已选项，不实际订阅。

[查看示例文件](../../playground/src/examples/content/AlertAction.tsx)

<!-- example-source: playground/src/examples/content/AlertAction.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Checkbox, Text } from 'yahha-ui';

export default function AlertAction() {
  const [phase, setPhase] = useState<'idle' | 'pending' | 'error' | 'success'>('idle');
  const [subscribed, setSubscribed] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const action = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);

  useEffect(() => {
    if (phase !== 'pending') return;
    // 首次模拟失败，重试成功；实际项目应根据请求结果更新状态。
    const timer = window.setTimeout(() => setPhase(attempt === 1 ? 'error' : 'success'), 700);
    return () => window.clearTimeout(timer);
  }, [phase, attempt]);

  useEffect(() => {
    if (phase === 'pending' || !returnFocus.current) return;
    returnFocus.current = false;
    if (document.activeElement === document.body || document.activeElement === action.current) {
      action.current?.focus();
    }
  }, [phase]);

  const pending = phase === 'pending';
  const successful = phase === 'success';
  const retrying = attempt > 1 || phase === 'error';

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Alert
        tone={phase === 'error' ? 'error' : successful ? 'success' : 'info'}
        title={
          phase === 'error'
            ? '订阅偏好保存失败'
            : successful
              ? '订阅偏好已保存'
              : pending
                ? '正在保存订阅偏好'
                : '订阅每周阅读推荐'
        }
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <Text size="sm">
            {phase === 'error'
              ? '选择仍然保留在这里。可以重试，也可以先调整偏好。'
              : successful
                ? subscribed
                  ? '已在本页记录为接收每周阅读推荐。'
                  : '已在本页记录为不接收每周阅读推荐。'
                : '由你决定是否接收每周整理的文章与书单。'}
          </Text>
          <Checkbox
            label="接收每周阅读推荐"
            checked={subscribed}
            disabled={pending || successful}
            onChange={(event) => setSubscribed(event.target.checked)}
          />
          <div>
            <Button
              ref={action}
              variant="secondary"
              loading={pending}
              onClick={() => {
                if (successful) {
                  setPhase('idle');
                  setAttempt(0);
                } else {
                  returnFocus.current = document.activeElement === action.current;
                  setAttempt((value) => value + 1);
                  setPhase('pending');
                }
              }}
            >
              {successful ? '修改偏好' : retrying ? '重试保存' : '保存订阅偏好'}
            </Button>
          </div>
        </div>
      </Alert>
      <Text role="status" size="sm" tone="muted">
        {phase === 'error'
          ? '保存失败，选择已保留。'
          : successful
            ? '订阅偏好已更新。'
            : pending
              ? '正在保存…'
              : '尚未保存。'}
      </Text>
    </div>
  );
}
```

<a id="timer-and-action"></a>

### 计时提示与撤销

8 秒撤销窗口中，进度条表示已用时；悬停、聚焦或页面进入后台时暂停，恢复后继续剩余时间。

[查看示例文件](../../playground/src/examples/feedback/ToastTimer.tsx)

<!-- example-source: playground/src/examples/feedback/ToastTimer.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Button, Progress, Text, Toast } from 'yahha-ui';

const undoDuration = 8000;

export default function ToastTimer() {
  const [archived, setArchived] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(() => document.hidden);
  const [elapsed, setElapsed] = useState(0);
  const remaining = useRef(undoDuration);
  const archiveButton = useRef<HTMLButtonElement>(null);
  const restoreButton = useRef<HTMLButtonElement>(null);
  const message = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<'archive' | 'restore' | null>(null);

  useEffect(() => {
    const updateVisibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    const destination = pendingFocus.current;
    if (!destination) return;
    pendingFocus.current = null;
    const active = document.activeElement;
    const unavailableAction =
      (active === archiveButton.current && archiveButton.current?.disabled) ||
      (active === restoreButton.current && restoreButton.current?.disabled);
    if (active === document.body || unavailableAction) {
      (destination === 'archive' ? archiveButton : restoreButton).current?.focus();
    }
  }, [archived, open]);

  useEffect(() => {
    if (!open || hovered || focused || hidden) return;
    const started = performance.now();
    const previousRemaining = remaining.current;
    const updateElapsed = () => {
      setElapsed(undoDuration - Math.max(0, previousRemaining - (performance.now() - started)));
    };
    const timer = window.setTimeout(() => setOpen(false), previousRemaining);
    const display = window.setInterval(updateElapsed, 100);
    return () => {
      remaining.current = Math.max(0, previousRemaining - (performance.now() - started));
      setElapsed(undoDuration - remaining.current);
      window.clearTimeout(timer);
      window.clearInterval(display);
    };
  }, [open, hovered, focused, hidden]);

  function archive() {
    if (document.activeElement === archiveButton.current) pendingFocus.current = 'restore';
    setArchived(true);
    setHovered(false);
    setFocused(false);
    remaining.current = undoDuration;
    setElapsed(0);
    setOpen(true);
  }

  function undo() {
    if (
      message.current?.contains(document.activeElement) ||
      document.activeElement === restoreButton.current
    ) {
      pendingFocus.current = 'archive';
    }
    setArchived(false);
    setOpen(false);
  }

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Text size="sm" tone="muted">
        {archived ? '《周末散步》已归档。' : '《周末散步》在文章列表中。'}
      </Text>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button ref={archiveButton} onClick={archive} disabled={archived}>
          归档文章
        </Button>
        <Button ref={restoreButton} variant="secondary" onClick={undo} disabled={!archived}>
          恢复文章
        </Button>
      </div>
      <div
        ref={message}
        style={{ display: 'grid', gap: 12, maxWidth: 400 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
      >
        <Toast
          appearance="receipt"
          open={open}
          onClose={() => {
            if (message.current?.contains(document.activeElement)) pendingFocus.current = 'restore';
            setOpen(false);
          }}
          title="文章已归档"
          description="《周末散步》已移入归档，可以随时恢复。"
          action={
            <Button size="sm" variant="ghost" onClick={undo}>
              撤销归档
            </Button>
          }
        />
        {open && (
          <Progress
            label="提示显示时间"
            value={elapsed}
            max={undoDuration}
            valueText={`剩余 ${Math.ceil((undoDuration - elapsed) / 1000)} 秒${hovered || focused || hidden ? '（已暂停）' : ''}`}
          />
        )}
      </div>
    </div>
  );
}
```

<a id="chapters"></a>

## 章节导航与分享

在文章层级之外，组织目录、定位与复制章节地址。

<a id="heading-reading-layout"></a>

### 章节导航与分享

定位章节、复制章节地址；复制失败时可手动复制。

[查看示例文件](../../playground/src/examples/content/HeadingArticle.tsx)

<!-- example-source: playground/src/examples/content/HeadingArticle.tsx -->

```tsx
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Button, Heading, Link, Text, Input } from 'yahha-ui';

export default function HeadingArticle({ hrefPrefix = '#' }: { hrefPrefix?: string }) {
  const replyId = 'heading-article-reply';
  const journalId = 'heading-article-journal';
  const replyRef = useRef<HTMLHeadingElement>(null);
  const journalRef = useRef<HTMLHeadingElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const copyRef = useRef<HTMLButtonElement>(null);
  const copyRequest = useRef(0);
  const [copyMessage, setCopyMessage] = useState('');
  const [manualCopy, setManualCopy] = useState<{
    address: string;
    request: number;
    restoreFocus: boolean;
  } | null>(null);

  useEffect(
    () => () => {
      copyRequest.current += 1;
    },
    [],
  );

  useEffect(() => {
    if (!manualCopy?.restoreFocus || manualCopy.request !== copyRequest.current) return;
    addressRef.current?.focus();
    addressRef.current?.select();
  }, [manualCopy]);

  async function copySectionAddress() {
    const request = ++copyRequest.current;
    setCopyMessage('');
    setManualCopy(null);
    const address = new URL(`${hrefPrefix}${journalId}`, window.location.href).href;

    try {
      await navigator.clipboard.writeText(address);
      if (request !== copyRequest.current) return;
      setCopyMessage('章节地址已复制。');
    } catch {
      if (request !== copyRequest.current) return;
      setCopyMessage('未能复制，请选中下方地址手动复制。');
      setManualCopy({ address, request, restoreFocus: document.activeElement === copyRef.current });
    }
  }

  function focusHeading(event: MouseEvent<HTMLAnchorElement>, heading: HTMLHeadingElement | null) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !heading
    )
      return;
    event.preventDefault();
    heading.scrollIntoView({ block: 'center' });
    heading.focus({ preventScroll: true });
  }

  return (
    <div style={{ display: 'grid', gap: 32, maxWidth: '65ch' }}>
      <nav aria-label="手记目录" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <Link
          href={`${hrefPrefix}${replyId}`}
          onClick={(event) => focusHeading(event, replyRef.current)}
        >
          写封回信
        </Link>
        <Link
          href={`${hrefPrefix}${journalId}`}
          onClick={(event) => focusHeading(event, journalRef.current)}
        >
          长手记
        </Link>
      </nav>
      <section style={{ display: 'grid', gap: 12 }}>
        <Text size="sm" tone="muted">
          章节 h2
        </Text>
        <Heading level={2}>云朵邮局的第一封来信</Heading>
        <Text>
          Yahha
          星球的云朵邮局今天收到一封信。小八读着读着笑出了声：朋友寄来的照片里，乌萨奇的耳朵刚好挡住了整张脸。
        </Text>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Text size="sm" tone="muted">
          小节 h3
        </Text>
        <Heading level={3} id={replyId} ref={replyRef} tabIndex={-1}>
          给远方的朋友写封回信
        </Heading>
        <Text>
          吉伊想重画一张合照，画到乌萨奇时，把耳朵缩短了些。乌萨奇凑过来看，又替自己添上一副墨镜。
        </Text>
        <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
          <Text size="sm" tone="muted">
            小节内标题 h4
          </Text>
          <Heading level={4}>这回总能看清脸了</Heading>
          <Text size="sm" tone="muted">
            小八把回信读了一遍，读到“下次再拍一张”时，乌萨奇已经摆好了姿势。
          </Text>
        </div>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Text size="sm" tone="muted">
          长标题 h3
        </Text>
        <Heading level={3} id={journalId} ref={journalRef} tabIndex={-1}>
          把云朵邮局里借来的铅笔、画歪的墨镜和贴到手背上的邮票，写进今天的长手记
        </Heading>
        <Text>
          信封封好以后，才发现邮票还贴在乌萨奇手背上。它举着手看了一会儿，像是在等谁把自己寄出去。
        </Text>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Link href={`${hrefPrefix}${journalId}`}>本节永久链接</Link>
          <Button ref={copyRef} variant="ghost" onClick={copySectionAddress}>
            复制本节地址
          </Button>
        </div>
        <Text size="sm" tone="muted" role="status">
          {copyMessage}
        </Text>
        {manualCopy && (
          <Input ref={addressRef} label="章节地址" readOnly value={manualCopy.address} />
        )}
      </section>
    </div>
  );
}
```
