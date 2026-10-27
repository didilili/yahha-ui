# Skeleton 骨架占位

为即将出现的内容预留形状，减少布局跳动。

本页示例按[入门指南](../../README.md#构建与本地安装)（站内路由 `#/guides/getting-started`）在应用入口导入一次 `yahha-ui/style.css` 并包裹 ThemeProvider。交互示例和更多状态见[文档站](../../README.md#本地开发)（站内路由 `#/components/skeleton`）。

文本与矩形占位采用内容纸面的形状，使用缓慢透明度呼吸；减少动效时静止。应按实际内容尺寸组合，并在占位外提供必要的可见等待说明。

## 设计与状态

- 支持文本、矩形和圆形占位，使用中性纸色与缓慢呼吸动效。强制颜色下使用系统色内轮廓保持可见，不改变占位尺寸。
- 占位应对应即将出现的内容。示例让头像、标题与两行摘要在加载前后共用相同布局，以减少内容替换时的跳动。
- 两行摘要区域只是这个已知布局的最小预留；长内容仍然自然增高，不隐藏文字来假装没有位移。组件不会自动推断最终内容尺寸。
- `aria-busy` 放在真实内容区域，必要的可见加载说明放在区域外。骨架自身固定为装饰；`hidden={true}` 隐藏图形并移除占位，取消隐藏后恢复显示。

## API

| 参数                | 类型                                 | 默认值 | 说明                                                                           |
| ------------------- | ------------------------------------ | ------ | ------------------------------------------------------------------------------ |
| variant             | 'text' \| 'rect' \| 'circle'         | 'text' | 文本行、矩形或圆形。                                                           |
| width / height      | CSSProperties 尺寸                   | —      | 文本默认 100% × 1em，矩形默认高度100px，圆形默认44px。style 中的同名属性优先。 |
| className / style   | string / CSSProperties               | —      | 作用于根 span 元素。                                                           |
| ref                 | ComponentPropsWithRef<'span'>['ref'] | —      | 指向真实 span 元素。                                                           |
| 其他原生属性 / 事件 | ComponentPropsWithRef<'span'>        | —      | 沿用对应原生元素的事件、`aria-*`、`data-*` 等属性；下表列出的组件属性优先。    |

## 使用约定

- aria-hidden 固定为 true，不接受 children。必要的加载说明放在占位外。
- 响应减少动态效果设置；组件不会发起请求、自动结束或管理内容尺寸。只需表达正在等待时使用 [Spinner](spinner.md)；请求结束后，无内容使用 [EmptyState](empty-state.md)，失败原因与重试使用 [Alert](alert.md)。

## 示例

```tsx
import { useState } from 'react';
import { Avatar, Button, Heading, Skeleton, Text } from 'yahha-ui';

const titleHeight = 'calc(var(--chi-font-size-heading-3, 20px) * var(--chi-leading-heading, 1.45))';
const summaryHeight = 'calc(var(--chi-font-size-body, 16px) * var(--chi-leading-body, 1.8) * 2)';

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
            <div style={{ display: 'grid', gap: 12 }}>
              <Skeleton height="var(--chi-font-size-body, 16px)" />
              <Skeleton width="80%" height="var(--chi-font-size-body, 16px)" />
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
        {loading ? '正在展示文章加载占位。' : '文章内容已显示。'}
      </Text>
      <Text size="sm" tone="muted">
        头像、标题与两行摘要共用布局；长内容仍可自然增高，不靠裁切维持占位。
      </Text>
    </div>
  );
}
```
