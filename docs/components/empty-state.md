<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# EmptyState 空状态

用于列表为空、搜索无结果等情况，提供说明与操作插槽。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { EmptyState } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于首次使用、列表为空或搜索无结果等已确认没有内容的情况。加载和请求失败应分别使用对应状态。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 空状态与引导操作

创建示例文章，或恢复初始空态；不实际发布。

[查看示例文件](../../playground/src/examples/feedback/EmptyBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/feedback/EmptyBasic.tsx -->

```tsx
import { useEffect, useId, useRef, useState } from 'react';
import { Button, EmptyState, Heading, Text } from 'yahha-ui';

export default function EmptyBasic() {
  const headingId = useId();
  const [created, setCreated] = useState(false);
  const createRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const pendingFocus = useRef(false);

  useEffect(() => {
    if (!pendingFocus.current) return;
    if (created) headingRef.current?.focus();
    else createRef.current?.focus();
    pendingFocus.current = false;
  }, [created]);

  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 560 }}>
      {created ? (
        <section aria-labelledby={headingId} style={{ display: 'grid', gap: 16 }}>
          <Heading level={3} id={headingId} ref={headingRef} tabIndex={-1}>
            第一篇示例文章已创建
          </Heading>
          <Text>今天路过面包店，发现菜单多了一种红豆包。买回来尝了，准备下次带给朋友。</Text>
          <div>
            <Button
              variant="secondary"
              onClick={() => {
                pendingFocus.current = true;
                setCreated(false);
              }}
            >
              恢复初始空态
            </Button>
          </div>
        </section>
      ) : (
        <EmptyState
          title="还没有文章"
          description="从今天想记住的一件小事开始。"
          action={
            <Button
              ref={createRef}
              onClick={() => {
                pendingFocus.current = true;
                setCreated(true);
              }}
            >
              创建示例文章
            </Button>
          }
        />
      )}
    </div>
  );
}
```

<a id="search"></a>

### 搜索无结果与清空条件

搜索本地文章，无结果时可清空条件恢复列表。

[查看示例文件](../../playground/src/examples/feedback/EmptySearch.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/feedback/EmptySearch.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Button, EmptyState, Text, TextField } from 'yahha-ui';

const articles = ['雨天书单', '周末散步'];

export default function EmptySearch() {
  const [query, setQuery] = useState('海边');
  const inputRef = useRef<HTMLInputElement>(null);
  const matches = articles.filter((title) => title.includes(query.trim()));

  function clearSearch() {
    setQuery('');
    inputRef.current?.focus();
  }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <TextField
        ref={inputRef}
        label="搜索文章"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        hint="试试输入「书单」；清空搜索可以查看全部文章。"
      />
      <Text size="sm" tone="muted" role="status">
        {matches.length > 0 ? `找到 ${matches.length} 篇文章。` : '当前关键词没有匹配结果。'}
      </Text>
      {matches.length > 0 ? (
        <ul>
          {matches.map((title) => (
            <li key={title}>{title}</li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="未找到相关文章"
          description="换个关键词，或者先看看全部文章。"
          action={<Button onClick={clearSearch}>清空搜索</Button>}
        />
      )}
    </div>
  );
}
```

<a id="motif"></a>

### 普通与小纸页空态

使用相同标题与说明，对比默认无插画与 motif="paper" 的小纸页。

[查看示例文件](../../playground/src/examples/feedback/EmptyAppearance.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/feedback/EmptyAppearance.tsx -->

```tsx
import { EmptyState, Text } from 'yahha-ui';

export default function EmptyAppearance() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
        gap: 24,
      }}
    >
      <div>
        <Text size="sm" tone="muted">
          普通（默认）
        </Text>
        <EmptyState title="还没有手记" description="写下今天想记住的一件小事。" />
      </div>
      <div>
        <Text size="sm" tone="muted">
          小纸页
        </Text>
        <EmptyState motif="paper" title="还没有手记" description="写下今天想记住的一件小事。" />
      </div>
    </div>
  );
}
```

<a id="empty-custom-illustration"></a>

### 自定义插画

使用相同标题与说明，对比 illustration 插槽中的两张现有插画。

[查看示例文件](../../playground/src/examples/scenes/EmptyIllustrations.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/scenes/EmptyIllustrations.tsx -->

```tsx
import { EmptyState, Text } from 'yahha-ui';
import emptyCollectionArtwork from './artwork/little-days-empty-collection.svg?no-inline';
import emptySearchArtwork from './artwork/little-days-search-empty.svg?no-inline';

export default function EmptyIllustrations() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
        gap: 24,
      }}
    >
      {[
        { label: '收藏口袋', src: emptyCollectionArtwork },
        { label: '搜索纸条', src: emptySearchArtwork },
      ].map(({ label, src }) => (
        <div key={label}>
          <Text size="sm" tone="muted">
            {label}
          </Text>
          <EmptyState
            title="还没有手记"
            description="写下今天想记住的一件小事。"
            illustration={
              <img
                src={src}
                alt=""
                width="240"
                height="180"
                style={{
                  display: 'block',
                  width: 'min(240px, 100%)',
                  height: 'auto',
                  margin: 'auto',
                }}
              />
            }
          />
        </div>
      ))}
    </div>
  );
}
```

<a id="illustrations"></a>

## 进阶用法

完整场景组合保留创建、浏览与清空搜索流程；插画用于补充情境，原因和下一步仍由文字与操作说明。

<a id="empty-illustrations"></a>

### 纸页、收藏与搜索

切换场景后，可以创建内容、浏览文章或清空搜索；示例状态仅保留在当前页面。

[查看示例文件](../../playground/src/examples/scenes/EmptyScene.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/scenes/EmptyScene.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Button, EmptyState, Heading, Select, Text, TextField, ThemeProvider } from 'yahha-ui';
import 'yahha-ui/style.css';
import emptyCollectionArtwork from './artwork/little-days-empty-collection.svg?no-inline';
import emptySearchArtwork from './artwork/little-days-search-empty.svg?no-inline';

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
            motif="paper"
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
              scene === 'first' ? undefined : (
                <img
                  className="story-empty-art"
                  src={scene === 'saved' ? emptyCollectionArtwork : emptySearchArtwork}
                  alt=""
                  width="240"
                  height="180"
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
```

<a id="design"></a>

## 说明原因并给出下一步

首次无内容可引导创建，筛选无结果可引导清空或修改条件。用标题说明原因，用 action 提供下一步；长文本和多个按钮应能在窄屏换行。

<a id="api"></a>

## API

### EmptyStateProps

| 属性             | 说明                                                                                                     | 类型                | 默认值   |
| ---------------- | -------------------------------------------------------------------------------------------------------- | ------------------- | -------- |
| `title` **必填** | 标题，渲染为 h3；说明当前为什么没有内容。                                                                | `ReactNode`         | —        |
| `description`    | 说明文字，渲染在 p 内，适合文本或行内内容。                                                              | `ReactNode`         | —        |
| `motif`          | 内置装饰。仅 illustration 未提供时，paper 显示小纸页；none 不生成插画区。                                | `'none' \| 'paper'` | `'none'` |
| `illustration`   | 自定义装饰优先于 motif；null 或 false 明确隐藏全部插画。插槽带 aria-hidden，必要信息仍需写进标题或说明。 | `ReactNode`         | —        |
| `action`         | 可选按钮或链接，组件不为它绑定业务操作。                                                                 | `ReactNode`         | —        |
| `className`      | 作用于根 div。当前不透传 ref、style 或其他原生 div 属性。                                                | `string`            | —        |

<a id="accessibility"></a>

## 恢复入口与焦点

action 使用 Button 或链接等可交互元素，创建内容、清空筛选与后续焦点由调用方管理。例如清空搜索后回到输入框，创建成功后进入新内容的合理起点；不要把点击入口只放在装饰插画上。

标题固定为 h3，应与页面标题层级协调。空状态本身没有自动播报；筛选结果动态变化且需要通知时，可像搜索示例一样由外层 role="status" 说明结果数量或无匹配内容。

<a id="related"></a>

## 相关组件

- [Spinner 加载指示](spinner.md)：表示正在进行的加载或等待，提供可读的状态文字。
- [Skeleton 骨架占位](skeleton.md)：为即将出现的内容预留形状，减少布局跳动。
- [Alert 提示条](alert.md)：用于页面内持续显示的信息、结果、警告或错误提示。
