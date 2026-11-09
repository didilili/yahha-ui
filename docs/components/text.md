<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Text 段落正文

固定使用 p 元素的段落正文，统一字号、行高与语义颜色。

[安装与接入](../../README.md#安装与接入)

```tsx
import { Text } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于段落正文、摘要和阅读提示。Text 固定渲染为 `p` 元素，内部可以组合链接、强调和纸签等行内内容。

<a id="examples"></a>

## 代码演示

<a id="text-sizes"></a>

### 字号

用相同文字比较三档字号。

[查看示例文件](../../playground/src/examples/content/TextExample.tsx)

<!-- example-source: playground/src/examples/content/TextExample.tsx -->

```tsx
import { Text } from 'yahha-ui';

export default function TextExample() {
  return (
    <div style={{ display: 'grid', gap: 28, maxWidth: '65ch' }}>
      <section aria-label="字号对照" style={{ display: 'grid', gap: 16 }}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <div key={size} style={{ display: 'grid', gap: 4 }}>
            <Text size="sm" tone="muted">
              {size === 'sm' ? '小号' : size === 'md' ? '中号' : '大号'} {size}
              {size === 'md' ? '（默认）' : ''}
            </Text>
            <Text size={size}>饼干掰成两半，一半留给你。</Text>
          </div>
        ))}
      </section>
    </div>
  );
}
```

<a id="text-tones"></a>

### 文字色调

比较主要文字与次要文字。

[查看示例文件](../../playground/src/examples/content/TextTones.tsx)

<!-- example-source: playground/src/examples/content/TextTones.tsx -->

```tsx
import { Text } from 'yahha-ui';

export default function TextTones() {
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: '65ch' }}>
      {(['default', 'muted'] as const).map((tone) => (
        <div key={tone} style={{ display: 'grid', gap: 4 }}>
          <Text size="sm" tone="muted">
            {tone === 'default' ? '主要文字' : '次要文字'}
          </Text>
          <Text tone={tone}>河边散步走了一半，小八先闻到了面包香。</Text>
        </div>
      ))}
    </div>
  );
}
```

<a id="text-inline-composition"></a>

### 行内组合

在段落中组合强调、纸签和链接。

[查看示例文件](../../playground/src/examples/content/TextComposition.tsx)

<!-- example-source: playground/src/examples/content/TextComposition.tsx -->

```tsx
import { Badge, Link, Text } from 'yahha-ui';

export default function TextComposition() {
  return (
    <div style={{ display: 'grid', gap: 28, maxWidth: '65ch' }}>
      <section aria-label="行内组合" style={{ display: 'grid', gap: 8 }}>
        <Text>
          <strong>这篇手记</strong>标记为 <Badge tone="accent">阅读中</Badge>
          。可以先读完这一段，再去
          <Link href="#/guides/reading?section=reading-example">看看完整的阅读组合</Link>。
        </Text>
      </section>
    </div>
  );
}
```

<a id="text-wrapping"></a>

### 长词与地址换行

观察窄栏中的中英文长词和完整地址换行。

[查看示例文件](../../playground/src/examples/content/TextWrapping.tsx)

<!-- example-source: playground/src/examples/content/TextWrapping.tsx -->

```tsx
import { Link, Text } from 'yahha-ui';

const paragraphReference = 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/p';

export default function TextWrapping() {
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: '32ch' }}>
      <Text>
        我把这次散步的记录存成
        PersonalJournalWithAVeryLongUnbrokenTitle，纸袋里装着刚出炉的面包，口袋里却找不到准备记路线的笔。
      </Text>
      <Text>
        段落参考：
        <Link href={paragraphReference} external>
          {paragraphReference}（新标签页）
        </Link>
      </Text>
    </div>
  );
}
```

<a id="text-quotation"></a>

### 引用与出处

组合引用段落、行内标记与出处链接。

[查看示例文件](../../playground/src/examples/content/TextQuotation.tsx)

<!-- example-source: playground/src/examples/content/TextQuotation.tsx -->

```tsx
import { Link, Text } from 'yahha-ui';

const source = '#/guides/reading?section=reading-example';

export default function TextQuotation() {
  return (
    <div style={{ display: 'grid', gap: 24, minWidth: 0, maxWidth: '65ch' }}>
      <figure style={{ display: 'grid', gap: 12, margin: 0, minWidth: 0 }}>
        <blockquote
          cite={source}
          style={{
            margin: 0,
            paddingInlineStart: 20,
            borderInlineStart: '1px solid var(--yahha-paper-line, #c9deec)',
          }}
        >
          <Text>
            回家才发现，口袋里的散步路线画得很认真，<em>面包店却根本不在上面</em>。下次得补上，
            <mark style={{ color: 'inherit', background: 'var(--yahha-accent-soft, #fff0f6)' }}>
              不然小八又要负责带路
            </mark>
            。
          </Text>
        </blockquote>
        <figcaption>
          <Text size="sm" tone="muted">
            出自 Yahha UI 原创示例手记《
            <cite>
              <Link href={source}>沿着河边，慢慢走</Link>
            </cite>
            》
          </Text>
        </figcaption>
      </figure>
      <Text size="sm" tone="muted">
        <strong>读后批注：</strong>原来最管用的路线图，是小八的鼻子。
      </Text>
    </div>
  );
}
```

<a id="design"></a>

## 长文的阅读节奏

Text 默认行高为 1.8，段落不带外边距；栏宽、段距和章节留白由外层布局设置。 长词与地址可以换行，连续正文的组合写法见 [完整阅读示例](../README.md#站内指南)。

<a id="api"></a>

## API

### TextProps

| 属性                  | 说明                                                                      | 类型                                | 默认值      |
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

引用使用外层 blockquote，出处放在引用之外；cite 标记作品名。引用示例摘自本库已有的原创手记， 接入时将出处链接替换为自己的原文地址。纸边与留白由外层容器设置，Text 保持默认字阶与行高。

<a id="related"></a>

## 相关组件

- [Heading 标题](heading.md)：通过原生 h1–h6 元素定义页面、文章与章节的标题层级。
- [Link 链接](link.md)：用于页面导航和资源跳转，保留原生链接行为、下划线与焦点样式。
- [Badge 状态标记](badge.md)：用于展示分类、标签或当前状态的静态标记。
