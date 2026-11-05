<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# IconButton 图标按钮

为关闭、收藏等仅用图标表达的操作提供方形点击区域与明确的可访问名称。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { IconButton } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于关闭、收藏等含义明确的图标操作。`aria-label` 为必填属性，应描述动作，例如“关闭提示”，而不是“叉号”；图标与悬停提示不能替代这个名称。

需要同时展示文字时使用 [Button](button.md)。可用 [Tooltip 组合](tooltip.md#basic) 补充文字提示，帮助用户识别图标。

<a id="examples"></a>

## 代码演示

<a id="icon-button-basic"></a>

### 基础用法

关闭提示后可重新显示；示例会将焦点移到可用的按钮。

[查看示例文件](../../playground/src/examples/foundations/IconButtonBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/IconButtonBasic.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Button, IconButton } from 'yahha-ui';

export default function IconButtonBasic() {
  const [visible, setVisible] = useState(true);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reopenRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);

  useEffect(() => {
    // 只在用户切换后移动焦点，初次展示时不抢走页面焦点。
    if (!restoreFocus.current) return;
    restoreFocus.current = false;
    (visible ? closeRef : reopenRef).current?.focus();
  }, [visible]);

  const changeVisibility = (nextVisible: boolean) => {
    restoreFocus.current = true;
    setVisible(nextVisible);
  };

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 16 }}>
      {visible ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>欢迎来到手记小站。</span>
          <IconButton
            ref={closeRef}
            aria-label="关闭提示"
            variant="ghost"
            onClick={() => changeVisibility(false)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M6 18 18 6" strokeLinecap="round" />
            </svg>
          </IconButton>
        </div>
      ) : (
        <Button ref={reopenRef} variant="secondary" onClick={() => changeVisibility(true)}>
          重新显示提示
        </Button>
      )}
    </div>
  );
}
```

<a id="icon-button-variants"></a>

### 强调程度

对比主要、次要和低强调三种外观。

[查看示例文件](../../playground/src/examples/foundations/IconButtonVariants.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/IconButtonVariants.tsx -->

```tsx
import { IconButton } from 'yahha-ui';

function Bookmark() {
  return (
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
      <path d="M8 3.25h6.2l4.05 4.1v12.7c0 .6-.5.88-1 .57L12 17.4l-5.3 3.22c-.5.31-.95.02-.95-.57V5.6C5.75 4.15 6.5 3.25 8 3.25Z" />
      <path d="M14.2 3.5v3c0 .6.35.95.95.95h2.8" fill="none" />
    </svg>
  );
}

export default function IconButtonVariants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
        <div key={variant} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>
            {variant === 'primary' ? '主要' : variant === 'secondary' ? '次要' : '低强调'}
          </span>
          <IconButton variant={variant} aria-label={`${variant} 变体收藏样本`}>
            <Bookmark />
          </IconButton>
        </div>
      ))}
    </div>
  );
}
```

<a id="icon-button-sizes"></a>

### 尺寸

对比 36、44 和 52px 三档尺寸。

[查看示例文件](../../playground/src/examples/foundations/IconButtonSizes.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/IconButtonSizes.tsx -->

```tsx
import { IconButton } from 'yahha-ui';

function Bookmark() {
  return (
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
      <path d="M8 3.25h6.2l4.05 4.1v12.7c0 .6-.5.88-1 .57L12 17.4l-5.3 3.22c-.5.31-.95.02-.95-.57V5.6C5.75 4.15 6.5 3.25 8 3.25Z" />
      <path d="M14.2 3.5v3c0 .6.35.95.95.95h2.8" fill="none" />
    </svg>
  );
}

export default function IconButtonSizes() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
      {(
        [
          ['sm', '小号'],
          ['md', '中号'],
          ['lg', '大号'],
        ] as const
      ).map(([size, label]) => (
        <div key={size} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>
            {label} {size}
          </span>
          <IconButton size={size} aria-label={`${size} 尺寸收藏样本`}>
            <Bookmark />
          </IconButton>
        </div>
      ))}
    </div>
  );
}
```

<a id="icon-button-states"></a>

### 禁用与加载

静态对比禁用和加载状态。

[查看示例文件](../../playground/src/examples/foundations/IconButtonStates.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/IconButtonStates.tsx -->

```tsx
import { IconButton } from 'yahha-ui';

function Bookmark() {
  return (
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
      <path d="M8 3.25h6.2l4.05 4.1v12.7c0 .6-.5.88-1 .57L12 17.4l-5.3 3.22c-.5.31-.95.02-.95-.57V5.6C5.75 4.15 6.5 3.25 8 3.25Z" />
      <path d="M14.2 3.5v3c0 .6.35.95.95.95h2.8" fill="none" />
    </svg>
  );
}

export default function IconButtonStates() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <span>禁用</span>
        <IconButton disabled aria-label="禁用收藏样本">
          <Bookmark />
        </IconButton>
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <span>加载</span>
        <IconButton loading aria-label="加载收藏样本">
          <Bookmark />
        </IconButton>
      </div>
    </div>
  );
}
```

<a id="integration"></a>

## 进阶用法

收藏状态只保留在当前示例，刷新后恢复。

<a id="icon-button-loading"></a>

### 受控加载与选中

模拟更新收藏，展示等待与选中状态；不发送请求。

[查看示例文件](../../playground/src/examples/foundations/IconButtonLoading.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/IconButtonLoading.tsx -->

```tsx
import { useEffect, useId, useState } from 'react';
import { IconButton, Text } from 'yahha-ui';

export default function IconButtonLoading() {
  const statusId = useId();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => {
      setLoading(false);
      setSaved((value) => !value);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconButton
          aria-label="收藏文章"
          aria-describedby={statusId}
          aria-pressed={saved}
          loading={loading}
          onClick={() => setLoading(true)}
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
        <Text id={statusId} size="sm" tone="muted" role="status">
          {loading ? '正在更新收藏…' : saved ? '已收藏' : '尚未收藏'}
        </Text>
      </div>
    </div>
  );
}
```

<a id="icon-button-reading-list"></a>

### 列表操作与焦点恢复

筛选收藏后移除当前项，焦点移到相邻操作或恢复入口。

[查看示例文件](../../playground/src/examples/foundations/IconButtonReadingList.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

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

<a id="api"></a>

## API

### IconButtonProps

| 属性                  | 说明                                                                                     | 类型                                      | 默认值      |
| --------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------- | ----------- |
| `aria-label` **必填** | 必填的可访问名称，描述动作，例如“关闭提示”。                                             | `string`                                  | —           |
| `children`            | 图标内容。建议装饰图标设置 aria-hidden="true"，加载时此内容被替换。                      | `ReactNode`                               | —           |
| `destructive`         | 用危险色表达删除等破坏性动作，与 variant 分开控制；不自动确认或执行删除。                | `boolean`                                 | `false`     |
| `variant`             | 主要、次要或低强调图标按钮。                                                             | `'primary' \| 'secondary' \| 'ghost'`     | `'primary'` |
| `size`                | 最小高度依次为 36、44、52px；IconButton 对应为方形点击区域。                             | `'sm' \| 'md' \| 'lg'`                    | `'md'`      |
| `loading`             | 显示加载图标并禁用按钮，设置 aria-busy。请求与完成状态由调用方管理。                     | `boolean`                                 | `false`     |
| `type`                | 原生按钮类型。提交表单时显式传入 submit。                                                | `'button' \| 'submit' \| 'reset'`         | `'button'`  |
| `disabled`            | 禁用按钮。loading 为 true 时也会禁用，不可通过 disabled={false} 覆盖。                   | `boolean`                                 | `false`     |
| `onClick`             | 原生点击事件；键盘 Enter / Space 激活同样触发。                                          | `MouseEventHandler<HTMLButtonElement>`    | —           |
| `aria-pressed`        | 用于切换按钮，状态由调用方维护。true 时提供选中视觉。                                    | `boolean \| 'true' \| 'false' \| 'mixed'` | —           |
| `className / style`   | 作用于根 button，可局部定制尺寸与布局。                                                  | `string / CSSProperties`                  | —           |
| `ref`                 | 指向原生 button，可用于聚焦。                                                            | `Ref<HTMLButtonElement>`                  | —           |
| `其余原生属性`        | 支持 name、value、form、title、aria-\*、data-\* 等 button 属性，不支持 href 或 asChild。 | `ComponentPropsWithRef<'button'>`         | —           |

<a id="accessibility"></a>

## 可访问性与键盘

按 Tab 聚焦，Enter / Space 激活。装饰图标设置 aria-hidden="true"；收藏等切换操作通过 aria-pressed 表达状态，aria-label 保持稳定，例如始终使用“收藏文章”。

disabled 或 loading 为真时，按钮退出键盘顺序且不能激活。加载会保留可访问名称并设置 aria-busy；请求结束后，由调用方更新 loading，并提供成功或失败的提示。 系统启用减少动效时，按压位移和加载动画停止。

加载结束不会自动恢复焦点，应由调用方按任务安排。关闭提示并卸载按钮时，需把焦点移到可用入口； 基础示例在关闭与重新显示后管理回焦，初次展示不移动焦点。

同一清单有多个收藏入口时，名称包含对应文章标题，切换前后保持不变。在收藏视图取消收藏， 且移除的按钮正持有焦点时，由使用方将焦点移到下一项、上一项或空态入口；取消收藏不等于删除文章。

<a id="styling"></a>

## 布局与定制

按钮组的间距由外层 flex / grid 容器设置；在 flex 行中，可设置 `style={{ marginInlineStart: 'auto' }}` 将按钮推到行尾。 直接传入 SVG 图标时保留 viewBox，组件会按 size 调整图框。统一配色使用 [ThemeProvider](theme.md)。

阅读列表中的收藏使用 ghost 保持低强调，选中后沿用主题色与实心图标；不改变 44px 默认点击区域。需要标记删除等危险操作时，可使用继承自 Button 的 destructive。

<a id="related"></a>

## 相关组件

- [Button 按钮](button.md)：用于提交、保存和收藏等操作，提供三种强调程度，支持禁用与加载状态。
- [Tooltip 文字提示](tooltip.md)：悬停或聚焦时，为已有操作补充简短的视觉文字标签。
