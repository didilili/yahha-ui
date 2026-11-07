<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Checkbox 复选框

用于独立选择、多项选择或确认事项，支持半选状态。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Checkbox } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于可独立勾选的选项、多项偏好和需要主动确认的同意事项。互斥选择使用 [RadioGroup](radio-group.md)；打开或关闭一个即时生效的设置使用 [Switch](switch.md)。汇总一组子项时，可用 indeterminate 表达部分已选。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 基础用法

对比默认勾选与显式整行高亮，点击或按空格分别切换。

[查看示例文件](../../playground/src/examples/new-forms/CheckboxBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/CheckboxBasic.tsx -->

```tsx
import { Checkbox } from 'yahha-ui';

export default function CheckboxBasic() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <span>默认</span>
        <Checkbox label="接收每月阅读来信" defaultChecked />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <span>可选整行高亮</span>
        <Checkbox label="接收每月阅读来信" defaultChecked highlightSelected />
      </div>
    </div>
  );
}
```

<a id="checkbox-disabled"></a>

### 禁用状态

对比禁用时未勾选与已勾选的外观。

[查看示例文件](../../playground/src/examples/new-forms/CheckboxDisabled.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/CheckboxDisabled.tsx -->

```tsx
import { Checkbox } from 'yahha-ui';

export default function CheckboxDisabled() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Checkbox label="站内消息提醒" disabled defaultChecked hint="暂不可更改。" />
      <Checkbox label="接收每日来信" disabled hint="此功能暂未开放。" />
    </div>
  );
}
```

<a id="mixed"></a>

### 受控选择与半选

逐项勾选或全选分类，查看半选状态和已选数量。

[查看示例文件](../../playground/src/examples/new-forms/CheckboxMixed.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/CheckboxMixed.tsx -->

```tsx
import { useState } from 'react';
import { Button, Checkbox, Text } from 'yahha-ui';

export default function CheckboxMixed() {
  const [selected, setSelected] = useState(['journal']);
  const items = [
    { value: 'journal', label: '生活手记' },
    { value: 'reading', label: '读书笔记' },
  ];
  return (
    <form
      style={{ display: 'grid', gap: 16, maxWidth: 440 }}
      onReset={(event) => {
        event.preventDefault();
        setSelected(['journal']);
      }}
    >
      <fieldset style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}>
        <legend>分类订阅</legend>
        <Checkbox
          label="订阅所有分类"
          checked={selected.length === items.length}
          indeterminate={selected.length > 0 && selected.length < items.length}
          onChange={(event) =>
            setSelected(event.target.checked ? items.map((item) => item.value) : [])
          }
        />
        <div style={{ paddingInlineStart: 24 }}>
          {items.map((item) => (
            <Checkbox
              key={item.value}
              label={item.label}
              name="topics"
              value={item.value}
              checked={selected.includes(item.value)}
              onChange={(event) => {
                const checked = event.target.checked;
                setSelected((current) =>
                  checked
                    ? [...current, item.value]
                    : current.filter((value) => value !== item.value),
                );
              }}
            />
          ))}
        </div>
      </fieldset>
      <Text size="sm" tone="muted" role="status">
        已选 {selected.length} 项，共 {items.length} 项。
      </Text>
      <div>
        <Button type="reset" variant="secondary">
          恢复初始选择
        </Button>
      </div>
    </form>
  );
}
```

<a id="integration"></a>

## 进阶用法

兴趣条件记录在当前地址中；清单和表单操作只保留在当前示例。

<a id="checkbox-long-label"></a>

### 长标签换行

窄栏中保留完整标签。

[查看示例文件](../../playground/src/examples/new-forms/CheckboxLongLabel.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/CheckboxLongLabel.tsx -->

```tsx
import { Checkbox } from 'yahha-ui';

export default function CheckboxLongLabel() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Checkbox label="在个人主页展示收藏，并允许读者查看我分享的阅读清单与文章分类" />
    </div>
  );
}
```

<a id="form"></a>

### 表单提交、必选与重置

读取已勾选分类或重置；改选后清除上次读取结果。

[查看示例文件](../../playground/src/examples/new-forms/CheckboxForm.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/CheckboxForm.tsx -->

```tsx
import { useState } from 'react';
import { Button, Checkbox, Text } from 'yahha-ui';

export default function CheckboxForm() {
  const [result, setResult] = useState('');
  const [agreementError, setAgreementError] = useState(false);
  return (
    <form
      style={{ display: 'grid', gap: 16, maxWidth: 440 }}
      onInput={() => setResult('')}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(new FormData(event.currentTarget).getAll('topics').join('、') || '未选择分类');
      }}
      onReset={() => {
        setResult('');
        setAgreementError(false);
      }}
    >
      <fieldset style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        <legend>订阅分类</legend>
        <Checkbox label="生活手记" name="topics" value="journal" defaultChecked />
        <Checkbox label="读书笔记" name="topics" value="reading" />
      </fieldset>
      <Checkbox
        label="我确认读取以上订阅分类"
        name="agreement"
        value="accepted"
        required
        hint="必选，请先确认已选择的订阅分类。"
        error={agreementError ? '请勾选确认后再读取订阅分类。' : undefined}
        onInvalid={(event) => {
          event.preventDefault();
          setAgreementError(true);
          event.currentTarget.focus();
        }}
        onInput={(event) => {
          if (event.currentTarget.checked) setAgreementError(false);
        }}
      />
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button type="submit">读取订阅</Button>
        <Button type="reset" variant="secondary">
          重置
        </Button>
      </div>
      <Text size="sm" tone="muted" role="status">
        {result && `读取结果：${result}。`}
      </Text>
    </form>
  );
}
```

<a id="checkbox-reading-topics"></a>

### 多选筛选与地址同步

勾选多项筛选内容，通过链接或浏览器返回恢复条件。

[查看示例文件](../../playground/src/examples/new-forms/CheckboxReadingTopics.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

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

### 批量选择与失败重试

选择文章后确认移出；本地模拟失败时保留选择，支持重试。

[查看示例文件](../../playground/src/examples/new-forms/CheckboxReadingList.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

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

<a id="design"></a>

## 状态与表单

- 默认通过方框内的勾或半选短横表达选择，整条标签可点击。显式设置 `highlightSelected` 后，已选和半选的可用标签行增加轻纸色；禁用项保留勾或短横，但取消活跃纸色。 错误说明带装饰性提醒标记，长文字换行齐文字起点，标记不单独命名或播报。
- checked / onChange 用于受控状态，defaultChecked 设置非受控初始状态。原生变化事件通过 event.target.checked 读取是否勾选。
- 设置 name 与 value 后，只有勾选且未禁用的项参与提交；同名多项使用 FormData.getAll 读取。非受控勾选随表单重置，受控勾选需在 onReset 中恢复。
- indeterminate 表达部分选择，由调用方根据子项计算；它与 checked 独立，实际提交仍由 checked 决定，重置时也应同步父子状态。
- required 逐项要求勾选；一组中“至少选一项”的规则由调用方校验，并维护 error。 需要锁定选择时使用 disabled，Checkbox 不提供只读模式。
- 表单例使用 onInput 清除旧读取结果，确认项勾选后清除该项错误；原生重置继续恢复初始勾选。
- 兴趣例按任一所选主题匹配，未选择时显示全部；地址仅使用专属 query 键记录条件，保留其他参数和当前路由。 返回、前进与分享链接恢复条件，URL 管理由示例完成。
- 清单例只从稍后阅读移出，文章内容仍保留。确认、首次失败、重试与取消等待均由示例管理， 成功后聚焦仍存在的复选项或恢复入口。

<a id="api"></a>

## API

### CheckboxProps

| 属性                                 | 说明                                                                              | 类型                                                      | 默认值                |
| ------------------------------------ | --------------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------- |
| `label` **必填**                     | 可点击标签。不要在 label 中嵌套链接或按钮。                                       | `ReactNode`                                               | —                     |
| `hint / error`                       | 通过 aria-describedby 关联；error 设置 aria-invalid，不自动校验。                 | `ReactNode`                                               | —                     |
| `checked / defaultChecked`           | 分别用于受控状态或非受控初始状态。                                                | `boolean`                                                 | `false（原生）`       |
| `onChange`                           | 原生事件，从 event.target.checked 读取状态。                                      | `ChangeEventHandler<HTMLInputElement>`                    | —                     |
| `indeterminate`                      | 受控半选状态，向辅助技术表达部分选择；不改变 checked 或提交值。                   | `boolean`                                                 | `false`               |
| `highlightSelected`                  | 为可用的已选和半选标签行增加轻纸色；不改变勾选、焦点或表单值。                    | `boolean`                                                 | `false`               |
| `name / value / form`                | 原生表单入口。仅勾选且未禁用时提交，通常传字符串 value。                          | `string / string \| number \| readonly string[] / string` | `value 为 on（原生）` |
| `disabled / required`                | 原生禁用与必选；支持父 fieldset disabled。                                        | `boolean`                                                 | `false（原生）`       |
| `className`                          | 根字段 div 的附加类名。                                                           | `string`                                                  | —                     |
| `classNames`                         | 各部分附加类名，每个值为 string。                                                 | `{ label?, input?, text?, hint?, error? }`                | —                     |
| `ref / style / id / 其他 input 属性` | 作用于真实 input。type 固定为 checkbox；不提供 readOnly、children、aria-checked。 | `ComponentPropsWithRef<"input">`                          | `id 自动生成`         |

<a id="keyboard"></a>

## 可访问性与键盘

- Tab 聚焦，Space 切换，点击整条标签也可切换。label 提供名称，避免在标签内嵌套链接或按钮。
- 相关复选项使用 fieldset / legend 命名整组。校验失败时，用 error 说明原因，并可通过 ref 聚焦需要修正的复选框。

<a id="limits"></a>

## 样式定制

一组复选框的间距可通过外层 flex / grid 的 gap 设置；标签文字和辅助说明可分别用 classNames.text、classNames.hint 定制。长标签应允许换行，避免固定行高裁切文字或缩小可点击范围。

<a id="related"></a>

## 相关组件

- [RadioGroup 单选组](radio-group.md)：用于在一组互斥选项中选择单个值，可为选项提供说明。
- [Switch 开关](switch.md)：打开或关闭即时生效的设置，例如显示文章摘要。
