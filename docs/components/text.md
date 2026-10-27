# Text 正文

为段落提供统一的字号、行高和语义文字颜色。

本页示例按[入门指南](../../README.md#构建与本地安装)（站内路由 `#/guides/getting-started`）在应用入口导入一次 `yahha-ui/style.css` 并包裹 ThemeProvider。交互示例和更多状态见[文档站](../../README.md#本地开发)（站内路由 `#/components/text`）。

正文保持平整、无装饰，默认 md 为 16px，sm / lg 分别为 14 / 18px。正文与控件使用独立字阶；行长和布局由调用方安排，字体始终继承使用方。

摘要、正文和图注使用 1.8 行高。完整阅读示例通过外层 68ch 阅读栏和段落留白组织连续内容；该栏宽属于示例布局，不是 Text 的固定宽度。

## API

| 参数                | 类型                              | 默认值    | 说明                                                                        |
| ------------------- | --------------------------------- | --------- | --------------------------------------------------------------------------- |
| size                | 'sm' \| 'md' \| 'lg'              | 'md'      | 正文独立字阶 14 / 16 / 18px，默认 md 为 16px；不改变控件字号。              |
| tone                | 'default' \| 'muted'              | 'default' | 正文与次要文字。                                                            |
| children            | ReactNode                         | —         | 段落内容，支持行内元素。                                                    |
| className / style   | string / CSSProperties            | —         | 作用于根 p 元素。                                                           |
| ref                 | ComponentPropsWithRef<'p'>['ref'] | —         | 指向真实 p 元素。                                                           |
| 其他原生属性 / 事件 | ComponentPropsWithRef<'p'>        | —         | 沿用对应原生元素的事件、`aria-*`、`data-*` 等属性；下表列出的组件属性优先。 |

## 使用约定

- className、style 和 ref 均作用于 p。不要在段落内嵌套 div 或另一个 p。
- 无点击、截断或展开行为。长单词默认换行；阅读宽度由调用方控制。
- 行内可以组合 Link、Badge 等 phrasing content；分类纸签保持非交互含义。长英文和地址保留完整文字，不以省略号掩盖内容。
- 连续文章建议由外层统一控制阅读宽度和段落间距；Text 自身不设置固定行长或段前段后距离。

## 示例

```tsx
import { Badge, Link, Text } from 'yahha-ui';

export default function TextExample() {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: '65ch' }}>
      <Text size="lg">记录一点小事，慢慢读也很好。</Text>
      <Text>今天沿着河边走了一会儿，把喜欢的风景留在这里。</Text>
      <Text size="sm" tone="muted">
        发布于周末 · 阅读约 3 分钟
      </Text>
      <Text>
        这篇手记标记为 <Badge tone="accent">阅读中</Badge>。可以先读完这一段，再去
        <Link href="#/guides/styling?section=reading">看看完整的阅读组合</Link>。
      </Text>
      <Text>
        中英文可以在同一段里自然换行；例如 PersonalJournalWithAVeryLongUnbrokenTitle，
        也不会因为一个长词撑开窄栏。
      </Text>
    </div>
  );
}
```
