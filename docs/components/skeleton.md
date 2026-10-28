<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Skeleton 骨架占位

为即将出现的内容预留形状，减少布局跳动。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Skeleton } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于内容结构已知、数据仍在加载的区域，例如文章摘要、头像或封面。按真实内容的形状预留空间，数据就绪后替换为内容。

<a id="examples"></a>

## 代码演示

<a id="skeleton-content"></a>

### 从占位到内容

示例自行预留头像、标题和摘要的布局高度，切换时保留同一空间；等待说明放在占位外。

[查看示例文件](../../playground/src/examples/content/SkeletonExample.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

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
            <Avatar name="小林" />
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
            <Text>把喜欢的小事留给下一次阅读。</Text>
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

中性纸色和呼吸动效表示内容尚未就绪，减少动效时保持静止，强制颜色下仍保留轮廓。占位与头像、标题及摘要使用同一布局，按实际内容预留空间；加载结束后允许长内容自然增高，不靠裁切维持占位高度。

<a id="api"></a>

## API

### SkeletonProps

| 参数                  | 说明                                                                                     | 类型                                   | 默认值   |
| --------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------- | -------- |
| `variant`             | 文本行、矩形或圆形。                                                                     | `'text' \| 'rect' \| 'circle'`         | `'text'` |
| `width / height`      | 文本默认 100% × 1em，矩形默认 100% × 100px，圆形默认 44 × 44px；style 中的同名属性优先。 | `CSSProperties 尺寸`                   | —        |
| `className / style`   | 作用于根 span 元素。                                                                     | `string / CSSProperties`               | —        |
| `ref`                 | 指向真实 span 元素。                                                                     | `ComponentPropsWithRef<'span'>['ref']` | —        |
| `其他原生属性 / 事件` | 支持对应原生元素的事件、aria-\*、data-\* 等属性；组件声明的同名属性优先。                | `ComponentPropsWithRef<'span'>`        | —        |

<a id="behavior"></a>

## 加载区域与状态说明

Skeleton 固定为 aria-hidden，不接受 children。将 aria-busy 放在正在更新的内容区域，并在加载结束时同步清除；必要的可见等待说明和状态播报放在占位之外。请求失败或确认没有内容后，应换成相应说明与恢复入口，避免一直保留加载占位。

<a id="related"></a>

## 相关组件

- [Spinner 加载指示](spinner.md)：表达正在进行的等待，提供可读的状态文字。
- [Image 图片](image.md)：为图片提供明确的替代文字、比例容器与失败回退。
