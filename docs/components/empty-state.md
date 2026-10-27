# EmptyState 空状态

当列表还没有内容或筛选没有结果时，说明原因，并提供与当前原因匹配的下一步。组件不判断业务是否为空。

本页示例按[入门指南](../../README.md#构建与本地安装)（站内路由 `#/guides/getting-started`）在应用入口导入一次 `yahha-ui/style.css` 并包裹 ThemeProvider。更多可操作状态见[组件文档](../../README.md#本地开发)（站内路由 `#/components/empty-state`）。

## 设计与状态

- 默认小纸页采用暖墨轮廓与轻粉纸边；不依赖角色插画也能说明状态。提供 `illustration` 后使用调用方的装饰内容，必要信息始终保留在标题和说明中。
- 首次没有文章，给出创建入口；搜索无结果，保留关键词并提供清空条件。加载失败时使用持续可见的 [Alert](alert.md) 说明问题与重试方式。仍在等待时使用 [Spinner](spinner.md) 或按内容形状组合 [Skeleton](skeleton.md)，完成后再判断是否显示空态。
- 原生 h3 标题、说明和操作分别排布，可配合默认小纸页或自定义装饰插画。在 320px 窄屏下，长中文、英文和双按钮自然换行，内容按需增高。
- EmptyState 本身不抢焦点。创建、清空、重置等动作由调用方实现；如果当前按钮随状态切换卸载，调用方应把焦点放在新内容标题或恢复后的输入/操作上。

[加载、空态与 404 指南源码](../../playground/src/docs/guides.tsx)（站内路由 `#/guides/states`）提供首次无内容、暂无收藏和搜索无结果场景；基础示例展示创建、恢复及焦点衔接。404 使用页面组合实现，组件库不提供公共 NotFound 组件。

## Props 与默认值

- `title: ReactNode` 必填，渲染为 h3。
- `description`、`illustration`、`action` 为可选 `ReactNode`，无默认内容。
- `description` 渲染在 p 内，适合文字或行内内容。
- `illustration` 的包装元素带 `aria-hidden="true"`，放装饰插画；不要在该槽放需要操作或朗读的内容。
- `className` 作用于根 div。当前不提供 `ref`、`style` 或其他原生 div 属性透传。

组件没有内部业务状态、自动重试或自动焦点管理。调用方决定何时渲染，并负责 `action` 的行为。未提供 illustration 时显示代码绘制的小纸页。

## 示例

下面与站内预览来自同一份 TSX。创建后聚焦新标题，恢复初始空态后聚焦重新出现的创建按钮。

```tsx
import { useEffect, useId, useRef, useState } from 'react';
import { Button, EmptyState, Heading, Text } from 'yahha-ui';

export default function EmptyBasic() {
  const headingId = useId();
  const [created, setCreated] = useState(false);
  const createRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const pendingFocus = useRef(false);

  useEffect(() => {
    if (!pendingFocus.current) return;
    if (created) headingRef.current?.focus();
    else createRef.current?.focus();
    pendingFocus.current = false;
  }, [created]);

  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 560 }}>
      {created ? (
        <section aria-labelledby={headingId} style={{ display: 'grid', gap: 16 }}>
          <Heading level={3} id={headingId} ref={headingRef} tabIndex={-1}>
            第一篇示例文章已创建
          </Heading>
          <Text>今天也有一件想记住的小事。写下第一段之后，再慢慢补上下一句。</Text>
          <div>
            <Button
              variant="secondary"
              onClick={() => {
                pendingFocus.current = true;
                setCreated(false);
              }}
            >
              恢复初始空态
            </Button>
          </div>
        </section>
      ) : (
        <EmptyState
          title="还没有文章"
          description="从今天想记住的一件小事开始。"
          action={
            <Button
              ref={createRef}
              onClick={() => {
                pendingFocus.current = true;
                setCreated(true);
              }}
            >
              创建示例文章
            </Button>
          }
        />
      )}
      <Text size="sm" tone="muted">
        创建与恢复仅改变当前示例，不会发布文章。
      </Text>
    </div>
  );
}
```

## 键盘与使用约定

- 空态本身不获取焦点，也没有额外快捷键。`action` 使用 Button 或链接等可聚焦元素；不要仅在文字或插画上绑定点击。
- 搜索示例清空关键词后保留焦点在搜索框，输入和筛选不因空态切换而丢失。
- 搜索结果数量由外部 `role="status"` 提供温和反馈；EmptyState 不默认创建实时播报区。
