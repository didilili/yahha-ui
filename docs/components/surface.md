<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Surface 内容容器

提供背景、边框、圆角与内边距的平面容器，用于组织轻量内容。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Surface } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于组织文章摘要、作者介绍和阅读提示等内容。Surface 提供平面纸面与轻边框，标题、正文和操作在容器内按内容需要组合。

<a id="examples"></a>

## 代码演示

<a id="surface-basic"></a>

### 基础用法

平面白纸内容面使用轻纸边和 24px 默认内边距；通过 style 或 className 调整宽度、标题与段落间距。

[查看示例文件](../../playground/src/examples/foundations/SurfaceBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/SurfaceBasic.tsx -->

```tsx
import { Heading, Surface, Text } from 'yahha-ui';

export default function SurfaceBasic() {
  return (
    <Surface style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
      <Heading level={3}>给路过的小星星写封信</Heading>
      <Text>
        在 Yahha
        星球的云朵邮局，信纸可以借，铅笔也可以借。写好后，别忘了告诉小星星：下次来，给你留块饼干。
      </Text>
    </Surface>
  );
}
```

<a id="surface-composition"></a>

### 组合文章摘要

与 Badge、Heading、Text 和 Button 组合，用标题为文章区域命名，并提供收藏操作。

[查看示例文件](../../playground/src/examples/foundations/SurfaceComposition.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/SurfaceComposition.tsx -->

```tsx
import { useId, useState } from 'react';
import { Badge, Button, Heading, Surface, Text } from 'yahha-ui';

export default function SurfaceComposition() {
  const headingId = useId();
  const [saved, setSaved] = useState(false);

  return (
    <Surface
      role="region"
      aria-labelledby={headingId}
      style={{ display: 'grid', gap: 24, maxWidth: 560 }}
    >
      <header style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <Badge>生活随笔</Badge>
        <Heading level={3} id={headingId}>
          沿着河边，等一等朋友
        </Heading>
        <Text>一篇约 5 分钟的手记：有人系鞋带，大家就站在桥边等一等。</Text>
      </header>
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <Button
          variant="secondary"
          aria-pressed={saved}
          onClick={() => setSaved((value) => !value)}
        >
          收藏文章
        </Button>
        <Text role="status" size="sm" tone="muted">
          {saved ? '已加入收藏' : '尚未收藏'}
        </Text>
      </div>
    </Surface>
  );
}
```

<a id="design"></a>

## 内容容器的层次

平面纸色和轻纸边将一组内容从页面中分出，内部通过标题、段距与操作留白建立层次。连续正文可以直接开放排布，不必把每一段都包进卡片；外层宽度与内部布局按实际内容安排。

<a id="api"></a>

## API

### SurfaceProps

| 属性                | 说明                                                                             | 类型                           | 默认值 |
| ------------------- | -------------------------------------------------------------------------------- | ------------------------------ | ------ |
| `children`          | 容器内容。                                                                       | `ReactNode`                    | —      |
| `className / style` | 作用于根 div，可调整布局与外观。                                                 | `string / CSSProperties`       | —      |
| `ref`               | 指向根 div。                                                                     | `Ref<HTMLDivElement>`          | —      |
| `其余原生属性`      | 透传 div 属性，例如 role、aria-labelledby、id、data-\*。没有额外的组件专属属性。 | `ComponentPropsWithRef<'div'>` | —      |

<a id="accessibility"></a>

## 为内容区域命名

Surface 默认是普通 div。内容确实构成需要单独导航的区域时，再提供 role="region"，并用 aria-labelledby 关联内部标题；标题层级应接续所在页面。

阅读文章使用标题链接，收藏文章使用独立按钮。仅给整个 Surface 绑定点击事件，不会提供相应的键盘操作或链接语义。

<a id="related"></a>

## 相关组件

- [Divider 分隔线](divider.md)：用细线区分内容，支持水平、垂直和纯装饰模式。
- [Text 正文](text.md)：为段落提供统一的字号、行高和语义文字颜色。
- [Dialog 弹窗](dialog.md)：需要用户暂时集中注意力时，显示一段独立内容或简短表单。
