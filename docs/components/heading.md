# Heading 标题

通过真实 h1–h6 元素建立清楚的文档层级。

本页示例按[入门指南](../../README.md#构建与本地安装)（站内路由 `#/guides/getting-started`）在应用入口导入一次 `yahha-ui/style.css` 并包裹 ThemeProvider。交互示例和更多状态见[文档站](../../README.md#本地开发)（站内路由 `#/components/heading`）。

默认字体继承使用方。仅 h2 带一笔短曲线，h1 与 h3–h6 保持清楚的文字层级；长标题自然换行，装饰不改变语义层级。

## API

| 参数                | 类型                               | 默认值 | 说明                                                                        |
| ------------------- | ---------------------------------- | ------ | --------------------------------------------------------------------------- |
| level               | 1 \| 2 \| 3 \| 4 \| 5 \| 6         | 2      | 渲染的标题层级，默认字号依次为 32 / 24 / 20 / 18 / 16 / 14px。              |
| children            | ReactNode                          | —      | 标题内容。                                                                  |
| className / style   | string / CSSProperties             | —      | 作用于由 level 决定的标题元素。                                             |
| ref                 | ComponentPropsWithRef<'h2'>['ref'] | —      | 指向真实标题元素。                                                          |
| 其他原生属性 / 事件 | ComponentPropsWithRef<'h2'>        | —      | 沿用对应原生元素的事件、`aria-*`、`data-*` 等属性；下表列出的组件属性优先。 |

## 使用约定

- ref 指向由 level 选定的 HTMLHeadingElement，属性沿用 React 原生标题元素类型。
- 标题不管理折叠、锚点或导航。默认没有外边距，布局使用调用方的容器间距。
- 同一内容组内，标题与正文靠近，章节之间保留更多留白。使用外层布局组织节奏，不需要跳级来获取更小的字号。
- 中文长标题与不含空格的英文均可自然换行；h2 的墨弧仍只在末行下方保留一笔，不增加重复装饰。
- 文章标题、摘要和正文之间的留白由外层布局安排；添加作者区或配图时，也应根据文档层级选择标题。

## 示例

```tsx
import { Heading, Text } from 'yahha-ui';

export default function HeadingExample() {
  return (
    <div style={{ display: 'grid', gap: 32, maxWidth: '65ch' }}>
      <section style={{ display: 'grid', gap: 12 }}>
        <Heading level={2}>周末的阅读手记</Heading>
        <Text>level 同时决定标题语义与默认字号，请按文档层级选择。</Text>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Heading level={3}>在书页之间休息一下</Heading>
        <Text>同一主题下的小节用更低一级标题，节前留白大于标题与正文之间的间距。</Text>
        <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
          <Heading level={4}>摘下今天喜欢的一句话</Heading>
          <Text size="sm" tone="muted">
            标题没有默认外边距，阅读节奏由外层布局组织。
          </Text>
        </div>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Heading level={3}>把沿途遇到的小事，整理成可以慢慢读完的一篇长手记</Heading>
        <Text>长标题保留完整文字，在窄屏中自然换行，不用缩小字号或省略号隐藏内容。</Text>
      </section>
    </div>
  );
}
```
