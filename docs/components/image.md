<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Image 图片

为图片提供明确的替代文字、比例容器与失败回退。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Image } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于文章封面和内容图片。alt 描述图片对当前内容的意义，纯装饰图片使用空字符串；图注可与外层 figure、figcaption 组合。

<a id="examples"></a>

## 代码演示

<a id="image-cover"></a>

### 文章封面

原生 figure 与 figcaption 组织图片和图注，aspectRatio 预留 16:9 区域并随内容宽度缩放；内嵌 SVG 不请求外部资源。

[查看示例文件](../../playground/src/examples/content/ImageExample.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/ImageExample.tsx -->

```tsx
import { Image, Text } from 'yahha-ui';

const cover =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="800" height="450" fill="#f8e5a7"/><circle cx="670" cy="120" r="80" fill="#fffaf0"/><text x="55" y="245" fill="#462e31" font-family="sans-serif" font-size="52">周末手记</text><text x="58" y="305" fill="#79656a" font-family="sans-serif" font-size="23">慢慢读，慢慢记录。</text></svg>',
  );

export default function ImageExample() {
  return (
    <figure style={{ margin: 0, maxWidth: 540, display: 'grid', gap: 12 }}>
      <Image
        src={cover}
        alt="黄色底色的周末手记示例封面"
        width={800}
        height={450}
        aspectRatio="16 / 9"
        decoding="async"
      />
      <figcaption>
        <Text size="sm" tone="muted">
          周末手记的封面。
        </Text>
      </figcaption>
    </figure>
  );
}
```

<a id="image-failure"></a>

### 失败与新地址恢复

用 aspectRatio 在加载、失败与恢复期间保留同一 5:3 区域。点击按钮换入有效图片，相邻文字通过加载事件显示实际结果。

[查看示例文件](../../playground/src/examples/content/ImageFallback.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/ImageFallback.tsx -->

```tsx
import { useId, useState } from 'react';
import { Button, Image, Text } from 'yahha-ui';

const cover =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="300"><rect width="500" height="300" fill="#d7eaf5"/><text x="250" y="160" text-anchor="middle" font-size="30" fill="#462e31">图片已恢复</text></svg>',
  );

export default function ImageFallback() {
  const [recovered, setRecovered] = useState(false);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const statusId = useId();
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 400 }}>
      <figure style={{ margin: 0, display: 'grid', gap: 12 }}>
        <Image
          src={recovered ? cover : 'data:text/plain,unavailable'}
          alt="示例文章封面"
          aspectRatio="5 / 3"
          fallback="封面暂不可用，可以继续阅读正文。"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
        <figcaption>
          <Text size="sm" tone="muted">
            周末手记的封面。
          </Text>
        </figcaption>
      </figure>
      <div style={{ minHeight: '3.6em' }}>
        <Text id={statusId} role="status" size="sm" tone="muted">
          {status === 'loading'
            ? '正在加载图片…'
            : status === 'loaded'
              ? '图片已恢复。'
              : '图片暂不可用，正文仍可继续阅读。'}
        </Text>
      </div>
      <div>
        <Button
          variant="secondary"
          aria-describedby={statusId}
          onClick={() => {
            setStatus('loading');
            setRecovered(!recovered);
          }}
        >
          {recovered ? '再次模拟失败' : '恢复图片'}
        </Button>
      </div>
    </div>
  );
}
```

<a id="design"></a>

## 加载前后保持图片区域

封面可以用 aspectRatio 统一比例并预留空间，图片会按 cover 裁切。需要完整展示的正文图片可以不设比例，保留自然尺寸。原生 width / height 不能为失败回退预留相同比例；加载失败后仍需保持版面时，应显式设置 aspectRatio。

<a id="api"></a>

## API

### ImageProps

| 属性                   | 说明                                                                                 | 类型                                        | 默认值             |
| ---------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------- | ------------------ |
| `alt` **必填**         | 原生替代文字；失败回退也以此作为名称。                                               | `string`                                    | —                  |
| `src / srcSet / sizes` | 图片地址与响应式资源选择。                                                           | `原生 img 属性`                             | —                  |
| `aspectRatio`          | 可选比例，设置在外层容器，在加载、失败和恢复期间保持预留区域。                       | `CSSProperties['aspectRatio']`              | —                  |
| `fallback`             | 失败后的装饰内容；可访问名称仍使用 alt。说明宜简短，固定比例内较长的内容可滚动查看。 | `ReactNode`                                 | `图片暂时无法显示` |
| `loading`              | 原生加载策略；首屏关键图片可设 eager。                                               | `'lazy' \| 'eager'`                         | `'lazy'`           |
| `className`            | 作用于外层比例容器。                                                                 | `string`                                    | —                  |
| `classNames`           | 附加到真实 img 与失败容器。                                                          | `{ image?: string; fallback?: string }`     | —                  |
| `style / ref`          | 作用于真实 img，失败时 img 仍保留但隐藏。                                            | `CSSProperties / Ref<HTMLImageElement>`     | —                  |
| `onLoad / onError`     | 监听图片加载成功或失败，可用于更新相邻状态说明。                                     | `原生 img 事件`                             | —                  |
| `hidden / aria-hidden` | 作用于整个图片呈现，包括失败回退；aria-hidden 不改变可见性。                         | `原生对应属性`                              | —                  |
| `其他原生图片属性`     | 包括 width、height、decoding 等，传给 img。                                          | `Omit<ComponentPropsWithRef<'img'>, 'alt'>` | —                  |

<a id="behavior"></a>

## 替代文字与失败恢复

- 失败后仍以 alt 作为可访问名称，fallback 是装饰内容。alt="" 的图片及失败回退都保持装饰性，即使 aria-hidden={false} 也不会补出图像名称。
- 缺少可用地址或加载失败时显示 fallback；更换 src 或 srcSet 会重新进入加载。清空地址后再设置原地址，也会重新加载。组件不自动重试，重试按钮应放在组件外，由页面更新资源地址。
- 固定比例较小而失败提示过长时，回退区域允许滚动。非装饰图片的溢出回退可通过 Tab 聚焦，再用方向键或 PageDown 查看；短提示及空 alt 的装饰图片不会增加键盘入口。
- 不要把必要说明或交互元素只放进 fallback，因为整个回退内容用于装饰。需要隐藏图片时，hidden 隐藏图片与回退，aria-hidden 仅将两者从辅助技术中隐藏。

<a id="related"></a>

## 相关组件

- [Avatar 头像](avatar.md)：展示作者图片，并在缺图或失败时保留姓名缩写。
- [Skeleton 骨架占位](skeleton.md)：为即将出现的内容预留形状，减少布局跳动。
