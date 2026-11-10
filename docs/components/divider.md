<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Divider 分隔线

用于内容的主题或视觉分隔，支持水平、垂直和装饰模式。

[安装与接入](../../README.md#安装与接入) · [接入示例](../guides/examples.md)

```tsx
import { Divider } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

内容主题发生转折时，保留默认 hr 语义；只需分开并列元信息时，设置 decorative。

<a id="examples"></a>

## 代码演示

<a id="divider-basic"></a>

### 基础用法

在两个内容段落之间标出主题转折。

[查看示例文件](../../playground/src/examples/content/DividerBasic.tsx)

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

[查看示例文件](../../playground/src/examples/content/DividerVertical.tsx)

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

<a id="divider-directions"></a>

### 响应式内容分隔

窄屏隐藏元信息之间的装饰线，保留完整文字。

[查看示例文件](../../playground/src/examples/content/DividerExample.tsx)

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
      <Text>
        夕阳落到桥边时，小八还在翻面包袋。乌萨奇举起最后一截法棍，吉伊刚好画完今天的路线。
      </Text>
      <Divider />
      <ul className="yahha-divider-meta" aria-label="手记信息">
        <li>
          <span>作者：库米，散步时常绕到面包店，回家再写手记</span>
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

<a id="divider-chapter"></a>

### 自定义章节花线

用现有 SVG 定制一处章节转折，保留真实 hr 的分隔语义。

[查看示例文件](../../playground/src/examples/scenes/DividerChapter.tsx)

<!-- example-source: playground/src/examples/scenes/DividerChapter.tsx -->

```tsx
import type { CSSProperties } from 'react';
import { Divider } from 'yahha-ui';
import flowerLine from './artwork/decorative-elements/dividers/flower-line.svg?no-inline';

const artworkStyle = {
  width: '100%',
  '--chapter-flower-art': `url(${JSON.stringify(flowerLine)})`,
} as CSSProperties;

export default function DividerChapter() {
  return (
    <div style={artworkStyle}>
      <style>{`
        .yahha-chapter-divider {
          border: 0;
          block-size: 48px;
          background: var(--chapter-flower-art) center / 600px 48px no-repeat;
        }
        @media (forced-colors: active) {
          .yahha-chapter-divider {
            block-size: 0;
            border-block-start: var(--yahha-border-width, 1px) solid CanvasText;
            background: none;
          }
        }
      `}</style>
      <Divider className="yahha-chapter-divider" />
    </div>
  );
}
```

素材按下列路径保存，路径相对于 `Example.tsx`，保留源码中的相对导入。

| 原始文件                                                                                                     | 保存路径                                               |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| [flower-line.svg](../../playground/src/examples/scenes/artwork/decorative-elements/dividers/flower-line.svg) | `artwork/decorative-elements/dividers/flower-line.svg` |

源码使用 Vite 的 `?no-inline` 保留独立素材文件，其他工具链需配置对应资源处理。

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

分隔线默认是静态内容，无需添加 tabIndex。Divider 不接收 children 或 dangerouslySetInnerHTML，需要分组标题时单独使用标题元素。

装饰线与对应元信息成组排列，窄屏由元信息示例的布局隐藏竖线，保留完整文字；不改变 Divider 的方向或语义。

<a id="related"></a>

## 相关组件

- [Surface 内容容器](surface.md)：用于组织文章摘要、作者介绍等内容，提供背景、边框、圆角与内边距。
- [Heading 标题](heading.md)：通过原生 h1–h6 元素定义页面、文章与章节的标题层级。
