<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Skeleton 骨架占位

为即将出现的内容预留形状，减少布局跳动。

[安装与接入](../../README.md#安装与接入)

```tsx
import { Skeleton } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于内容结构已知、数据仍在加载的区域，例如文章摘要、头像或封面。按真实内容的形状预留空间，数据就绪后替换为内容。

<a id="examples"></a>

## 代码演示

<a id="skeleton-shapes"></a>

### 基本形状

对比文本、矩形与圆形占位。

[查看示例文件](../../playground/src/examples/content/SkeletonShapes.tsx)

<!-- example-source: playground/src/examples/content/SkeletonShapes.tsx -->

```tsx
import { Skeleton, Text } from 'yahha-ui';

export default function SkeletonShapes() {
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 320, minWidth: 0 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <Text size="sm" tone="muted">
          文本
        </Text>
        <Skeleton variant="text" width="80%" />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <Text size="sm" tone="muted">
          矩形
        </Text>
        <Skeleton variant="rect" width={160} height={64} />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <Text size="sm" tone="muted">
          圆形
        </Text>
        <Skeleton variant="circle" width={44} height={44} />
      </div>
    </div>
  );
}
```

<a id="skeleton-content"></a>

### 从占位到内容

手动切换文章摘要的占位与内容，观察预留空间；不发起请求。

[查看示例文件](../../playground/src/examples/content/SkeletonExample.tsx)

<!-- example-source: playground/src/examples/content/SkeletonExample.tsx -->

```tsx
import { useState } from 'react';
import { Avatar, Button, Heading, Skeleton, Text } from 'yahha-ui';

// These reserved slots belong to this article layout, not to Skeleton's defaults.
const titleHeight = 32;
const summaryLineHeight = 28;
const summaryHeight = 64;

export default function SkeletonExample() {
  const [loading, setLoading] = useState(true);
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 450 }}>
      <section aria-label="文章摘要" aria-busy={loading} style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', minHeight: 44 }}>
          {loading ? (
            <Skeleton
              variant="rect"
              width={44}
              height={44}
              style={{ borderRadius: '40% 45% 42% 38%' }}
            />
          ) : (
            <Avatar name="库米" />
          )}
        </div>
        <div style={{ display: 'grid', minHeight: titleHeight }}>
          {loading ? (
            <Skeleton width="65%" height={titleHeight} />
          ) : (
            <Heading level={3}>沿着河边走一走</Heading>
          )}
        </div>
        <div style={{ display: 'grid', minHeight: summaryHeight }}>
          {loading ? (
            <div style={{ display: 'grid', alignContent: 'start', gap: 8 }}>
              <Skeleton height={summaryLineHeight} />
              <Skeleton width="80%" height={summaryLineHeight} />
            </div>
          ) : (
            <Text>说好沿河散步，小八却先闻到了面包香。</Text>
          )}
        </div>
      </section>
      <div>
        <Button variant="secondary" onClick={() => setLoading(!loading)}>
          {loading ? '显示内容' : '显示加载占位'}
        </Button>
      </div>
      <Text role="status" size="sm" tone="muted">
        {loading ? '文章加载中…' : '文章内容已显示。'}
      </Text>
    </div>
  );
}
```

<a id="design"></a>

## 占位与真实内容共用布局

占位与头像、标题及摘要使用同一布局，按实际内容预留空间；加载结束后允许长内容自然增高，不靠裁切维持占位高度。减少动效时停止动画，强制颜色下保留占位轮廓。

<a id="api"></a>

## API

### SkeletonProps

| 属性                  | 说明                                                                                                                                                                       | 类型                                              | 默认值   |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | -------- |
| `variant`             | 文本行、矩形或圆形。                                                                                                                                                       | `'text' \| 'rect' \| 'circle'`                    | `'text'` |
| `width / height`      | 文本默认 100% × 1em，矩形默认 100% × 100px。未指定尺寸的圆形默认 44 × 44px，在窄容器内等比缩小；指定 width、height 或 style 尺寸时沿用自定义尺寸，style 中的同名属性优先。 | `CSSProperties 尺寸`                              | —        |
| `aria-hidden`         | 固定隐藏于辅助技术，不能通过同名属性覆盖。                                                                                                                                 | `true`                                            | `true`   |
| `className / style`   | 作用于根 span。                                                                                                                                                            | `string / CSSProperties`                          | —        |
| `ref`                 | 指向根 span。                                                                                                                                                              | `Ref<HTMLSpanElement>`                            | —        |
| `其他原生属性 / 事件` | 事件、data-\* 等作用于根 span；不接收 children。                                                                                                                           | `Omit<ComponentPropsWithRef<"span">, "children">` | —        |

<a id="behavior"></a>

## 加载区域与状态说明

Skeleton 固定为 aria-hidden，不接受 children。将 aria-busy 放在正在更新的内容区域，并在加载结束时同步清除；必要的可见等待说明和状态播报放在占位之外。请求失败或确认没有内容后，应换成相应说明与恢复入口，避免一直保留加载占位。

<a id="related"></a>

## 相关组件

- [Spinner 加载指示](spinner.md)：表示正在进行的加载或等待，提供可读的状态文字。
- [Image 图片](image.md)：用于内容图片和封面，支持替代文字、比例容器与失败回退。
