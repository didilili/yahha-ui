<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Icon 图标

显示自定义 SVG 或直接使用手绘功能图标，统一尺寸、颜色和可访问名称。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Icon, SearchIcon, BookmarkIcon } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

Icon 是绘制 SVG 的基础容器，统一尺寸、色调与可访问名称。SearchIcon、BookmarkIcon 等命名图标提供现成的手绘图形，可以直接使用。

图标按钮使用 [IconButton](icon-button.md)，带文字的操作使用 [Button](button.md)。Icon 只承载图形，业务动作与状态由使用方管理；原生 SVG 或其他图标库的 SVG 也可以直接放进已有插槽，无需再包一层 Icon。

<a id="examples"></a>

## 代码演示

<a id="icon-basic"></a>

### 基础用法

直接使用命名图标；独立表达含义时通过 aria-label 提供名称。

[查看示例文件](../../playground/src/examples/foundations/IconBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/IconBasic.tsx -->

```tsx
import { SearchIcon } from 'yahha-ui';

export default function IconBasic() {
  return <SearchIcon aria-label="搜索" />;
}
```

<a id="icon-gallery"></a>

### 手绘功能图标

16 种图标的静态样张，按图形用途查找。

[查看示例文件](../../playground/src/examples/foundations/IconGallery.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/IconGallery.tsx -->

```tsx
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookmarkIcon,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  CopyIcon,
  EditIcon,
  ErrorIcon,
  ExternalLinkIcon,
  InfoIcon,
  PlusIcon,
  SearchIcon,
  SuccessIcon,
  Text,
  TrashIcon,
  WarningIcon,
} from 'yahha-ui';

const icons = [
  { component: SearchIcon, label: '搜索' },
  { component: CloseIcon, label: '关闭' },
  { component: BookmarkIcon, label: '收藏' },
  { component: CopyIcon, label: '复制' },
  { component: CheckIcon, label: '完成' },
  { component: PlusIcon, label: '新增' },
  { component: EditIcon, label: '编辑' },
  { component: TrashIcon, label: '删除' },
  { component: ArrowLeftIcon, label: '上一页' },
  { component: ArrowRightIcon, label: '下一页' },
  { component: ChevronDownIcon, label: '展开' },
  { component: ExternalLinkIcon, label: '外链' },
  { component: InfoIcon, label: '信息' },
  { component: SuccessIcon, label: '成功' },
  { component: WarningIcon, label: '注意' },
  { component: ErrorIcon, label: '错误' },
];

export default function IconGallery() {
  return (
    <ul
      aria-label="手绘功能图标"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 80px), 1fr))',
        gap: 24,
        padding: 0,
        margin: 0,
        listStyle: 'none',
      }}
    >
      {icons.map(({ component: Glyph, label }) => (
        <li key={label} style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Glyph size="lg" />
          <Text size="sm">{label}</Text>
        </li>
      ))}
    </ul>
  );
}
```

<a id="icon-sizes"></a>

### 尺寸与色调

分别保持图形不变，对比图框尺寸和语义色调。

[查看示例文件](../../playground/src/examples/foundations/IconSizes.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/IconSizes.tsx -->

```tsx
import { SearchIcon } from 'yahha-ui';

export default function IconSizes() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <div key={size} style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
            <span>{size}</span>
            <SearchIcon size={size} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
        {(
          [
            ['default', '主要'],
            ['muted', '次要'],
            ['accent', '主题色'],
          ] as const
        ).map(([tone, label]) => (
          <div key={tone} style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
            <span>{label}</span>
            <SearchIcon tone={tone} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

<a id="icon-accessibility"></a>

### 装饰与可访问名称

对比默认装饰图标与两种可访问命名方式。

[查看示例文件](../../playground/src/examples/foundations/IconAccessibility.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/IconAccessibility.tsx -->

```tsx
import { useId } from 'react';
import { BookmarkIcon, InfoIcon, SuccessIcon, Text } from 'yahha-ui';

export default function IconAccessibility() {
  const labelId = useId();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'start', gap: 32 }}>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 12 }}>
        <Text size="sm" tone="muted">
          装饰图标
        </Text>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <BookmarkIcon filled />
          已收藏
        </span>
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 12 }}>
        <Text size="sm" tone="muted">
          aria-label
        </Text>
        <InfoIcon tone="info" aria-label="阅读提示" />
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 12 }}>
        <Text size="sm" tone="muted">
          aria-labelledby
        </Text>
        <span id={labelId} hidden>
          已同步
        </span>
        <SuccessIcon tone="success" aria-labelledby={labelId} />
      </div>
    </div>
  );
}
```

<a id="icon-slots"></a>

### 按钮与输入框中的图标

通过 startIcon 和 leading 插槽放入图标，由宿主控件安排图框。

[查看示例文件](../../playground/src/examples/foundations/IconSlots.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/IconSlots.tsx -->

```tsx
import { Button, SearchIcon, TextField } from 'yahha-ui';

export default function IconSlots() {
  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 16, maxWidth: 360 }}>
      <Button startIcon={<SearchIcon />}>搜索手记</Button>
      <TextField label="搜索关键词" leading={<SearchIcon />} defaultValue="散步" />
    </div>
  );
}
```

<a id="icon-custom"></a>

### 自定义 SVG

分组展示自定义坐标与多色路径，外部尺寸由 size 控制。

[查看示例文件](../../playground/src/examples/foundations/IconCustom.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/IconCustom.tsx -->

```tsx
import { Icon, Text } from 'yahha-ui';

export default function IconCustom() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'start', gap: 32 }}>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 12 }}>
        <Text size="sm" tone="muted">
          自定坐标
        </Text>
        <Icon
          size="lg"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13.5 2.5c-4-.7-8.2.8-9.2 4.4-.7 2.5.7 4.6 3.2 4.6 3.7 0 6.5-4 6-9Z" />
          <path d="m2.5 13.5 7.7-7.7" />
        </Icon>
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 12 }}>
        <Text size="sm" tone="muted">
          多色路径
        </Text>
        <Icon size={32}>
          <path
            d="m4.5 5.5 15 .3-.2 13-15-.3Z"
            fill="#def2ff"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="m4.8 5.8 7.1 6 7.3-5.7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16.5" cy="17.5" r="3.5" fill="#f8bed2" />
        </Icon>
      </div>
    </div>
  );
}
```

<a id="integration"></a>

## 进阶用法

<a id="icon-composition"></a>

### 搜索与收藏组合

提交关键词筛选本地手记，点击收藏切换状态；清空后回到输入框。

[查看示例文件](../../playground/src/examples/foundations/IconComposition.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/IconComposition.tsx -->

```tsx
import { useRef, useState } from 'react';
import { BookmarkIcon, Button, CloseIcon, IconButton, SearchIcon, Text, TextField } from 'yahha-ui';

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
        <TextField
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

<a id="api"></a>

## API

### IconProps

| 属性                           | 说明                                                                                                | 类型                                                                                           | 默认值             |
| ------------------------------ | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------ |
| `children`                     | SVG 图形内容，例如 path、circle 或 g。命名图标已提供图形。                                          | `ReactNode`                                                                                    | —                  |
| `size`                         | 独立图框的宽高，sm / md / lg 对应 16 / 20 / 24px；数字须为有限正数，无效数字回退到 20px。           | `'sm' \| 'md' \| 'lg' \| number`                                                               | `'md'`             |
| `tone`                         | inherit 沿用当前文字颜色；accent 使用主题 focus 墨色，其余值使用对应的主题语义色。                  | `'inherit' \| 'default' \| 'muted' \| 'accent' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'inherit'`        |
| `viewBox`                      | SVG 内部坐标系，与外部图框尺寸分开设置。                                                            | `string`                                                                                       | `'0 0 24 24'`      |
| `fill / stroke`                | 原生绘制属性。Icon 默认填充当前颜色，不自动添加描边；多色图形可在子路径上分别设置颜色。             | `string`                                                                                       | `currentColor / —` |
| `aria-label / aria-labelledby` | 为独立表达信息的图标命名；提供非空名称时默认 role="img"，没有名称时默认 aria-hidden="true"。        | `string`                                                                                       | —                  |
| `role / aria-hidden`           | aria-hidden 的显式值优先；隐藏图标不保留 role，其余图标可显式设置 role。                            | `AriaRole / boolean`                                                                           | —                  |
| `className / style`            | 作用于根 svg。size 控制图框，style 仍可按原生 CSS 规则覆盖。                                        | `string / CSSProperties`                                                                       | —                  |
| `ref`                          | 指向原生 svg 元素。                                                                                 | `Ref<SVGSVGElement>`                                                                           | —                  |
| `其他原生 SVG 属性 / 事件`     | 转发 strokeWidth、aria-\*、data-\* 及原生事件等属性；宽高统一由 size 设置，focusable 固定为 false。 | `ComponentPropsWithRef<'svg'>（省略 width / height）`                                          | —                  |

### 命名图标

| 属性                  | 说明                                                                                                             | 类型         | 默认值  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------ | ------- |
| `通用属性`            | 省略 IconProps 的 children。复用尺寸、色调、命名、原生 SVG 属性、样式与 ref；命名图标直接渲染 svg。              | `GlyphProps` | —       |
| `BookmarkIcon.filled` | 主体以 20% 当前颜色浅填，折角保持不填充；fill / fillOpacity 可显式覆盖主体。收藏状态由按钮的 aria-pressed 表达。 | `boolean`    | `false` |

<a id="accessibility"></a>

## 装饰、命名与操作

旁边已有同义文字时，保持图标默认的装饰状态，避免重复朗读。图标独立表达信息时，使用 `aria-label` 或 `aria-labelledby` 提供名称；后者引用页面内唯一的 id，示例使用隐藏文字作为命名来源。

可操作入口由按钮或链接承载，名称描述动作，例如“收藏文章”。装饰图标不重复命名；收藏状态由 `aria-pressed` 表达，切换前后保留按钮名称。Icon 固定设置 `focusable="false"`，不提供按钮的键盘或加载行为。

<a id="limits"></a>

## 尺寸与插槽

独立图标用 size 控制图框。Button、IconButton 与 TextField 已设置自己的插槽尺寸，图标放入后沿用宿主的图框，不会扩大按钮的点击区域。 命名图标的路径按 24 单位坐标绘制，修改 viewBox 不会重新计算路径；调整显示尺寸使用 size。

tone="inherit" 随当前文字颜色变化。统一配色使用 [ThemeProvider](theme.md)，局部多色图形在路径上设置 fill 或 stroke。插槽也接受原生 SVG，保留原始 viewBox 即可。

系统强制配色时，语义色跟随周围文字或控件的前景色；自定义多色路径沿用原生 SVG 的颜色处理方式。信息与状态同时使用可辨的形状或文字说明。

<a id="related"></a>

## 相关组件

- [IconButton 图标按钮](icon-button.md)：用于仅以图标呈现的操作，提供方形点击区域，并要求明确的可访问名称。
- [Button 按钮](button.md)：用于触发操作，支持不同强调程度、禁用、加载和切换状态。
- [TextField 单行输入](text-field.md)：带可见标签、辅助说明和错误反馈的单行输入框。
