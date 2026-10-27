# Spinner 加载指示

以三枚墨点表达正在进行的等待，提供可读的状态文字。图形与 Button 加载状态一致，按 1.2 秒的透明度节拍依次变化，不表示真实百分比进度。

本页示例按[入门指南](../../README.md#构建与本地安装)（站内路由 `#/guides/getting-started`）在应用入口导入一次 `yahha-ui/style.css` 并包裹 ThemeProvider。交互示例和更多状态见[文档站](../../README.md#本地开发)（站内路由 `#/components/spinner`）。

## 设计与状态

- 三档尺寸为 16 / 24 / 36px，三墨点按 1.2 秒节拍依次变化；强制颜色下使用系统色保持可见。
- 区块等待应有可见文字。已有 `role="status"` 的外层负责说明时，内部 Spinner 可用 `role="presentation"` 和 `aria-hidden` 避免重复播报；独立使用时保留默认 status 与明确 label。
- `hidden={true}` 时整个组件不显示也不占布局空间；取消隐藏后恢复显示。减少动效时显示静止墨点。

## API

| 参数                | 类型                                 | 默认值   | 说明                                                                        |
| ------------------- | ------------------------------------ | -------- | --------------------------------------------------------------------------- |
| label               | string                               | 加载中   | 在 status 内提供的屏幕阅读器文字。                                          |
| size                | 'sm' \| 'md' \| 'lg'                 | 'md'     | 默认 16 / 24 / 36px。                                                       |
| role                | AriaRole                             | 'status' | 原生角色，通常保留 status。                                                 |
| className / style   | string / CSSProperties               | —        | 作用于根 span 元素。                                                        |
| ref                 | ComponentPropsWithRef<'span'>['ref'] | —        | 指向真实 span 元素。                                                        |
| 其他原生属性 / 事件 | ComponentPropsWithRef<'span'>        | —        | 沿用对应原生元素的事件、`aria-*`、`data-*` 等属性；下表列出的组件属性优先。 |

## 使用约定

- 不接受 children；label 应描述正在等待的内容。图形是装饰，状态文字参与播报。已知内容形状的占位可使用 [Skeleton](skeleton.md)；请求结束后，无内容使用 [EmptyState](empty-state.md)，失败原因与重试使用 [Alert](alert.md)。
- 不获取焦点，减少动态效果时保留三枚静止墨点；组件本身没有计时或请求行为。
- 长时间或区块等待应在旁边提供可见说明。区块可按场景配装饰素材，Spinner 本身不依赖角色图片；[状态场景指南源码](../../playground/src/docs/guides.tsx)（站内路由 `#/guides/states`）使用翻页 SVG 演示区块等待，减少动效时保留静止画面。真实请求结束或失败后，应移除等待场景或切换到对应结果；完整接入提供原样示例与配套 SVG 下载。

## 示例

```tsx
import { useState } from 'react';
import { Button, Spinner, Text } from 'yahha-ui';

export default function SpinnerExample() {
  const [loading, setLoading] = useState(true);
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', gap: 24 }}>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Spinner size="sm" label="小号示例正在加载" />
          <Text size="sm" tone="muted">
            小号 · 16px
          </Text>
        </div>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Spinner label="中号示例正在加载" />
          <Text size="sm" tone="muted">
            常规 · 24px
          </Text>
        </div>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Spinner size="lg" label="大号示例正在加载" />
          <Text size="sm" tone="muted">
            大号 · 36px
          </Text>
        </div>
      </div>
      <div
        role="status"
        aria-label="文章等待状态"
        style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 36 }}
      >
        {loading && <Spinner role="presentation" aria-hidden="true" />}
        <Text>{loading ? '稍等一下，文章还在路上。' : '文章已准备好，可以继续阅读。'}</Text>
      </div>
      <div>
        <Button variant="secondary" onClick={() => setLoading(!loading)}>
          {loading ? '显示完成状态' : '重新显示等待'}
        </Button>
      </div>
      <Text size="sm" tone="muted">
        示例按钮切换等待结果；真实请求和超时处理由使用方管理，墨点不表示百分比进度。
      </Text>
    </div>
  );
}
```
