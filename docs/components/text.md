<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Text 正文

为段落提供统一的字号、行高和语义文字颜色。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Text } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于正文、摘要和阅读提示。每个 Text 是一个段落，内部可以组合链接、强调和纸签等行内内容。

<a id="examples"></a>

## 代码演示

<a id="text-sizes"></a>

### 字号与文字色调

分别比较三档字号，以及主要文字与次要文字的色调。

[查看示例文件](../../playground/src/examples/content/TextExample.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/TextExample.tsx -->

```tsx
import { Text } from 'yahha-ui';

export default function TextExample() {
  return (
    <div style={{ display: 'grid', gap: 28, maxWidth: '65ch' }}>
      <section aria-label="字号对照" style={{ display: 'grid', gap: 16 }}>
        <Text size="sm" tone="muted">
          字号
        </Text>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <div key={size} style={{ display: 'grid', gap: 4 }}>
            <Text size="sm" tone="muted">
              {size === 'sm' ? '小号' : size === 'md' ? '中号' : '大号'} {size}
              {size === 'md' ? '（默认）' : ''}
            </Text>
            <Text size={size}>记录一点小事，慢慢读也很好。</Text>
          </div>
        ))}
      </section>
      <section aria-label="文字色调对照" style={{ display: 'grid', gap: 16 }}>
        <Text size="sm" tone="muted">
          文字色调
        </Text>
        {(['default', 'muted'] as const).map((tone) => (
          <div key={tone} style={{ display: 'grid', gap: 4 }}>
            <Text size="sm" tone="muted">
              {tone === 'default' ? '主要文字' : '次要文字'}
              {tone === 'default' ? '（默认）' : ''}
            </Text>
            <Text tone={tone}>今天沿着河边走了一会儿，把喜欢的风景留在这里。</Text>
          </div>
        ))}
      </section>
    </div>
  );
}
```

<a id="text-inline-composition"></a>

### 行内组合与长词换行

分别展示正文中的纸签和链接，以及 32ch 窄栏内中英文长词的自然换行。

[查看示例文件](../../playground/src/examples/content/TextComposition.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/TextComposition.tsx -->

```tsx
import { Badge, Link, Text } from 'yahha-ui';

export default function TextComposition() {
  return (
    <div style={{ display: 'grid', gap: 28, maxWidth: '65ch' }}>
      <section aria-label="行内组合" style={{ display: 'grid', gap: 8 }}>
        <Text size="sm" tone="muted">
          行内组合
        </Text>
        <Text>
          这篇手记标记为 <Badge tone="accent">阅读中</Badge>。可以先读完这一段，再去
          <Link href="#/guides/styling?section=reading">看看完整的阅读组合</Link>。
        </Text>
      </section>
      <section aria-label="长词换行" style={{ display: 'grid', gap: 8, maxWidth: '32ch' }}>
        <Text size="sm" tone="muted">
          窄栏换行
        </Text>
        <Text>
          我把这次散步的记录存成 PersonalJournalWithAVeryLongUnbrokenTitle，
          留给下个周末慢慢补上照片。
        </Text>
      </section>
    </div>
  );
}
```

<a id="design"></a>

## 长文的阅读节奏

正文采用独立字阶和较松的行高，次要提示可使用 muted。长文章的栏宽、段距和章节留白由外层布局建立；Text 默认没有外边距，不会为每一段自动增加间隔。长单词与地址可以换行，窄栏中仍应检查真实内容的阅读效果。

<a id="api"></a>

## API

### TextProps

| 参数                  | 说明                                                                      | 类型                                | 默认值      |
| --------------------- | ------------------------------------------------------------------------- | ----------------------------------- | ----------- |
| `size`                | 正文独立字阶 14 / 16 / 18px，默认 md 为 16px；不改变控件字号。            | `'sm' \| 'md' \| 'lg'`              | `'md'`      |
| `tone`                | 正文与次要文字。                                                          | `'default' \| 'muted'`              | `'default'` |
| `children`            | 段落内容，支持行内元素。                                                  | `ReactNode`                         | —           |
| `className / style`   | 作用于根 p 元素。                                                         | `string / CSSProperties`            | —           |
| `ref`                 | 指向真实 p 元素。                                                         | `ComponentPropsWithRef<'p'>['ref']` | —           |
| `其他原生属性 / 事件` | 支持对应原生元素的事件、aria-\*、data-\* 等属性；组件声明的同名属性优先。 | `ComponentPropsWithRef<'p'>`        | —           |

<a id="behavior"></a>

## 段落与行内内容

多个段落分别使用 Text；不要在其中嵌套 div、另一个 p 或标题。列表、图片与其他内容区块放在段落之外，行内链接和纸签保持各自语义。需要截断或展开长文时，由页面提供相应布局和操作。

<a id="related"></a>

## 相关组件

- [Heading 标题](heading.md)：通过真实 h1–h6 元素建立清楚的文档层级。
- [Link 链接](link.md)：保留原生链接行为，统一下划线与键盘焦点。
- [Badge 状态标记](badge.md)：在文章标题、分类或阅读信息旁展示紧凑的静态标记。
