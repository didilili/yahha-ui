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

<a id="divider-basic"></a>

### 基础用法

在两个内容段落之间标出主题转折。

[查看示例文件](../../playground/src/examples/content/DividerBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/DividerBasic.tsx -->

```tsx
import { Divider, Text } from 'yahha-ui';

export default function DividerBasic() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Text>沿着河边，慢慢走。</Text>
      <Divider />
      <Text>回家以后，记下一件小事。</Text>
    </div>
  );
}
```

<a id="divider-vertical"></a>

### 垂直分隔

用装饰性竖线分开并列短文字。

[查看示例文件](../../playground/src/examples/content/DividerVertical.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/DividerVertical.tsx -->

```tsx
import { Divider } from 'yahha-ui';

export default function DividerVertical() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span>手记</span>
      <Divider orientation="vertical" decorative style={{ margin: 0 }} />
      <span>随笔</span>
    </div>
  );
}
```

<a id="integration"></a>

## 进阶用法

<a id="divider-directions"></a>

### 响应式内容分隔

窄屏隐藏元信息之间的装饰线，保留完整文字。

[查看示例文件](../../playground/src/examples/content/DividerExample.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/DividerExample.tsx -->

```tsx
import { Divider, Text } from 'yahha-ui';

export default function DividerExample() {
  return (
    <div>
      <style>{`
        .yahha-divider-meta { display: flex; flex-wrap: wrap; gap: 8px 16px; margin: 0; padding: 0; list-style: none; }
        .yahha-divider-meta li { display: flex; align-items: center; gap: 16px; min-width: 0; max-width: 100%; }
        .yahha-divider-meta span { min-width: 0; overflow-wrap: anywhere; }
        @media (max-width: 480px) { .yahha-divider-meta .yahha-divider-meta-line { display: none; } }
      `}</style>
      <Text>夕阳落到桥边时，大家把剩下的半块饼干分着吃，等朋友系好鞋带再一起回家。</Text>
      <Divider />
      <ul className="yahha-divider-meta" aria-label="手记信息">
        <li>
          <span>作者：库米，一位喜欢散步、阅读和记录日常生活的手记作者</span>
        </li>
        <li>
          <Divider
            className="yahha-divider-meta-line"
            orientation="vertical"
            decorative
            style={{ margin: 0 }}
          />
          <span>
            发布于 <time dateTime="2026-10-18">2026 年 10 月 18 日</time>
          </span>
        </li>
        <li>
          <Divider
            className="yahha-divider-meta-line"
            orientation="vertical"
            decorative
            style={{ margin: 0 }}
          />
          <span>栏目：每个周末和朋友交换零碎灵感与阅读记录</span>
        </li>
      </ul>
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

| 属性                  | 说明                                                                 | 类型                                                                         | 默认值         |
| --------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------- |
| `orientation`         | 方向，垂直默认高度 1.5em。                                           | `'horizontal' \| 'vertical'`                                                 | `'horizontal'` |
| `decorative`          | true 时 role=presentation、aria-hidden=true。                        | `boolean`                                                                    | `false`        |
| `className / style`   | 作用于根 hr 元素。                                                   | `string / CSSProperties`                                                     | —              |
| `ref`                 | 指向真实 hr 元素。                                                   | `ComponentPropsWithRef<'hr'>['ref']`                                         | —              |
| `其他原生属性 / 事件` | 支持有效 hr 事件、aria-\*、data-\* 等属性，不接收子内容或注入 HTML。 | `Omit<ComponentPropsWithRef<'hr'>, 'children' \| 'dangerouslySetInnerHTML'>` | —              |

<a id="behavior"></a>

## 主题分隔还是装饰

orientation 只决定方向；垂直线也需要按内容判断是否保留语义。设置 decorative 后，线条仍可见，但其分隔语义隐藏于辅助技术。

分隔线默认是静态内容，无需添加 tabIndex。Divider 不接收 children 或 dangerouslySetInnerHTML，需要分组标题时单独使用标题元素。 类型检查会拒绝这两种本就无效的 hr 用法；有效原生属性与运行时绘制保持。

装饰线与对应元信息成组排列，窄屏由进阶示例的布局隐藏竖线，保留完整文字；不改变 Divider 的方向或语义。

<a id="related"></a>

## 相关组件

- [Surface 内容容器](surface.md)：提供背景、边框、圆角与内边距的平面容器，用于组织轻量内容。
- [Heading 标题](heading.md)：通过真实 h1–h6 元素建立清楚的文档层级。
