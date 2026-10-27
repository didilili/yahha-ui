# Image 图片

为图片提供明确的替代文字、比例容器与失败回退。

本页示例按[入门指南](../../README.md#构建与本地安装)（站内路由 `#/guides/getting-started`）在应用入口导入一次 `yahha-ui/style.css` 并包裹 ThemeProvider。交互示例和更多状态见[文档站](../../README.md#本地开发)（站内路由 `#/components/image`）。

图片容器采用大纸面圆角。加载时保留预设区域，失败回退显示不占布局空间的轻纸内边，正常图片不带边线；加载状态文字由页面按实际事件提供。图像与业务含义由调用方提供，基础组件不内置角色素材。

## 设计与状态

- 需要在加载、失败和恢复时都保留相同比例，显式传入 `aspectRatio`。它作用于外框；`width` / `height` 仍是原生 img 属性，只靠这两个属性不能保证 img 隐藏后的失败回退保持原高度。
- 比例容器中的图片按 `cover` 填充，适合封面；不希望裁剪完整正文图片时，不设置 `aspectRatio`，保留原生尺寸和自然比例。窄屏下图片最大宽度不超过容器。
- 用原生 `figure` / `figcaption` 组织图片和图注，图注由真实文字呈现。内容图片给出准确 `alt`；仅当图片是装饰、相邻文字已表达全部含义时使用 `alt=""`。
- 可用 8px 间距关联图片与图注，再用更宽留白衔接正文；这些间距由外层布局设置。
- `fallback` 只在失败时显示；加载说明可以在外部使用 `onLoad` / `onError` 与状态文字组合。示例保留恢复操作，组件不自行重试，也不把加载成功写成预定计时结果。

## API

| 参数                 | 类型                                      | 默认值           | 说明                                                           |
| -------------------- | ----------------------------------------- | ---------------- | -------------------------------------------------------------- |
| alt（必填）          | string                                    | —                | 原生替代文字；失败回退也以此作为名称。                         |
| src / srcSet / sizes | 原生 img 属性                             | —                | 图片地址与响应式资源选择。                                     |
| aspectRatio          | CSSProperties['aspectRatio']              | —                | 可选比例，设置在外层容器；需要失败前后稳定占位时显式提供。     |
| fallback             | ReactNode                                 | 图片暂时无法显示 | 失败后的装饰内容；可访问名称仍使用 alt。                       |
| loading              | 'lazy' \| 'eager'                         | 'lazy'           | 原生加载策略；首屏关键图片可设 eager。                         |
| className            | string                                    | —                | 作用于外层比例容器。                                           |
| classNames           | { image?: string; fallback?: string }     | —                | 附加到真实 img 与失败容器。                                    |
| style / ref          | CSSProperties / Ref<HTMLImageElement>     | —                | 作用于真实 img，失败时 img 仍保留但隐藏。                      |
| onLoad / onError     | 原生 img 事件                             | —                | 更新内部加载状态后继续调用传入事件。                           |
| hidden / aria-hidden | 原生对应属性                              | —                | 同时隐藏整个图片呈现，包括失败回退；aria-hidden 不改变可见性。 |
| 其他原生图片属性     | Omit<ComponentPropsWithRef<'img'>, 'alt'> | —                | 包括 width、height、decoding 等，传给 img。                    |

## 使用约定

- 无自动重试、预览灯箱或裁剪编辑功能；修改地址可重新加载。
- fallback 仅放展示内容；交互或重试按钮放在组件外。设置 aspectRatio 时，图片使用 object-fit:cover。
- `hidden` 作用于外层图片容器，`aria-hidden` 同时作用于该容器和原生 img，缺少地址或加载失败时回退也保留隐藏语义。取消隐藏后可重新显示当前图片或回退。其他原生属性、`style` 和 `ref` 仍指向 img。
- `alt=""` 表示装饰图，失败回退也不进入可访问图像列表；即使设置 `aria-hidden={false}`，也不会给空替代文字的回退补出图像名称。

## 示例

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
          周末手记的示例封面。比例容器保持 16:9，图片随内容宽度缩放；内嵌 SVG 不请求外部资源。
        </Text>
      </figcaption>
    </figure>
  );
}
```
