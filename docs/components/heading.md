<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Heading 标题

通过原生 h1–h6 元素定义页面、文章与章节的标题层级。

[安装与接入](../../README.md#安装与接入) · [接入示例](../guides/examples.md)

```tsx
import { Heading } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于页面、文章和章节标题。按内容结构选择标题层级，默认字号随层级变化。

<a id="examples"></a>

## 代码演示

<a id="heading-levels"></a>

### 标题层级对照

用相同文字比较一级至六级标题，观察各层级的默认字号。

[查看示例文件](../../playground/src/examples/content/HeadingExample.tsx)

<!-- example-source: playground/src/examples/content/HeadingExample.tsx -->

```tsx
import { Heading, Text } from 'yahha-ui';

export default function HeadingExample() {
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: '65ch' }}>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <div key={level} style={{ display: 'grid', gap: 4 }}>
          <Text size="sm" tone="muted">
            {['一级标题', '二级标题', '三级标题', '四级标题', '五级标题', '六级标题'][level - 1]} h
            {level}
            {level === 2 ? '（默认）' : ''}
          </Text>
          <Heading level={level}>星球上的点心时间</Heading>
        </div>
      ))}
    </div>
  );
}
```

<a id="heading-decoration"></a>

### 普通与短墨线

保持文字与层级相同，对比默认无装饰与可选短墨线。

[查看示例文件](../../playground/src/examples/content/HeadingDecoration.tsx)

<!-- example-source: playground/src/examples/content/HeadingDecoration.tsx -->

```tsx
import { Heading, Text } from 'yahha-ui';

export default function HeadingDecoration() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
        gap: 24,
      }}
    >
      {(['none', 'underline'] as const).map((decoration) => (
        <section
          key={decoration}
          style={{ display: 'grid', alignContent: 'start', gap: 16, minWidth: 0 }}
        >
          <Text size="sm" tone="muted">
            {decoration === 'none' ? '普通（默认）' : '短墨线'}
          </Text>
          <Heading level={2} decoration={decoration}>
            星球上的点心时间
          </Heading>
          <Heading level={3} decoration={decoration}>
            星球上的点心时间
          </Heading>
        </section>
      ))}
    </div>
  );
}
```

<a id="heading-reading-layout"></a>

### 文章标题层级

在同一段文章结构中接续 h2、h3 和 h4，并保留长标题的完整文字。

[查看示例文件](../../playground/src/examples/content/HeadingStructure.tsx)

<!-- example-source: playground/src/examples/content/HeadingStructure.tsx -->

```tsx
import { Heading, Text } from 'yahha-ui';

export default function HeadingStructure() {
  return (
    <article style={{ display: 'grid', gap: 24, maxWidth: '65ch' }}>
      <section style={{ display: 'grid', gap: 12 }}>
        <Heading level={2}>云朵邮局的第一封来信</Heading>
        <Text>朋友寄来的合照里，乌萨奇的耳朵挡住了半张脸。</Text>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Heading level={3}>给远方的朋友写封回信</Heading>
        <Text>吉伊把耳朵画短了一点，乌萨奇又替自己添上一副墨镜。</Text>
        <Heading level={4}>这回总能看清脸了</Heading>
        <Text>小八读到“下次再拍一张”，乌萨奇已经摆好了姿势。</Text>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Heading level={3}>
          把云朵邮局里借来的铅笔、画歪的墨镜和贴到手背上的邮票，写进今天的长手记
        </Heading>
        <Text>信封封好以后，才发现邮票还贴在乌萨奇手背上。</Text>
      </section>
    </article>
  );
}
```

<a id="recipes"></a>

## 相关组合

目录定位与章节分享由页面实现。原生章节链接、定位焦点和复制失败回退见[章节导航与分享组合](../recipes/interactions.md#heading-reading-layout)。

<a id="design"></a>

## 标题间距与长标题

标题默认没有外边距，使用外层布局区分章节之间与标题到正文的间距。默认 decoration="none"，不绘制短墨线；显式设置 underline 时，任意层级均增加短墨线及 0.48em 底部留白。长标题会自然换行，应保留完整文字；不要仅为缩小字号或改变装饰而调整标题层级。

<a id="api"></a>

## API

### HeadingProps

| 属性                  | 说明                                                                      | 类型                                 | 默认值   |
| --------------------- | ------------------------------------------------------------------------- | ------------------------------------ | -------- |
| `level`               | 渲染的标题层级，默认字号依次为 32 / 24 / 20 / 18 / 16 / 14px。            | `1 \| 2 \| 3 \| 4 \| 5 \| 6`         | `2`      |
| `children`            | 标题内容。                                                                | `ReactNode`                          | —        |
| `decoration`          | 可选短曲墨线，独立于语义层级；仅 underline 预留装饰所需底部空间。         | `'none' \| 'underline'`              | `'none'` |
| `className / style`   | 作用于根 h1–h6 标题 元素。                                                | `string / CSSProperties`             | —        |
| `ref`                 | 指向真实 h1–h6 标题 元素。                                                | `ComponentPropsWithRef<'h2'>['ref']` | —        |
| `其他原生属性 / 事件` | 支持对应原生元素的事件、aria-\*、data-\* 等属性；组件声明的同名属性优先。 | `ComponentPropsWithRef<'h2'>`        | —        |

<a id="behavior"></a>

## 接续页面的标题层级

文章标题使用 h1 时，下一级章节使用 h2，小节使用 h3；嵌入已有页面时，接续所在页面的结构。标题层级表达内容关系，不用于单纯调整字号。

<a id="related"></a>

## 相关组件

- [Text 段落正文](text.md)：固定使用 p 元素的段落正文，统一字号、行高与语义颜色。
- [Divider 分隔线](divider.md)：用于内容的主题或视觉分隔，支持水平、垂直和装饰模式。
