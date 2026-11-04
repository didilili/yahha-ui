<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Divider 分隔线

用细线区分内容，支持水平、垂直和纯装饰模式。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Divider } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于标出内容主题的转折，或在并列元信息之间作视觉分隔。前者保留默认 hr 语义，后者设置 decorative。

<a id="examples"></a>

## 代码演示

<a id="divider-directions"></a>

### 水平与垂直

水平主题分隔与垂直装饰分隔。

[查看示例文件](../../playground/src/examples/content/DividerExample.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/DividerExample.tsx -->

```tsx
import { Divider, Text } from 'yahha-ui';

export default function DividerExample() {
  return (
    <div>
      <Text>夕阳落到桥边时，大家把剩下的半块饼干分着吃，等朋友系好鞋带再一起回家。</Text>
      <Divider />
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <span>阅读约 3 分钟</span>
        <Divider orientation="vertical" decorative />
        <span>生活手记</span>
      </div>
    </div>
  );
}
```

<a id="design"></a>

## 分隔线与分组留白

水平线默认上下各留白 20px；放进已有 gap 的布局时，可设置 `style={{ margin: 0 }}`，由外层统一安排间距，见[文章归档组合](../README.md#站内指南)。垂直分隔适合短元信息，可通过 style 或 className 调整高度。

<a id="api"></a>

## API

### DividerProps

| 属性                  | 说明                                                                      | 类型                                 | 默认值         |
| --------------------- | ------------------------------------------------------------------------- | ------------------------------------ | -------------- |
| `orientation`         | 方向，垂直默认高度 1.5em。                                                | `'horizontal' \| 'vertical'`         | `'horizontal'` |
| `decorative`          | true 时 role=presentation、aria-hidden=true。                             | `boolean`                            | `false`        |
| `className / style`   | 作用于根 hr 元素。                                                        | `string / CSSProperties`             | —              |
| `ref`                 | 指向真实 hr 元素。                                                        | `ComponentPropsWithRef<'hr'>['ref']` | —              |
| `其他原生属性 / 事件` | 支持对应原生元素的事件、aria-\*、data-\* 等属性；组件声明的同名属性优先。 | `ComponentPropsWithRef<'hr'>`        | —              |

<a id="behavior"></a>

## 主题分隔还是装饰

orientation 只决定方向；垂直线也需要按内容判断是否保留语义。设置 decorative 后，线条仍可见，但其分隔语义隐藏于辅助技术。

分隔线默认是静态内容，无需添加 tabIndex。Divider 不接收 children，需要分组标题时单独使用标题元素。

<a id="related"></a>

## 相关组件

- [Surface 内容容器](surface.md)：提供背景、边框、圆角与内边距的平面容器，用于组织轻量内容。
- [Heading 标题](heading.md)：通过真实 h1–h6 元素建立清楚的文档层级。
