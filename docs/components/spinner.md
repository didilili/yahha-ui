<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Spinner 加载指示

表达正在进行的等待，提供可读的状态文字。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Spinner } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

适合内容区域的短暂等待。按钮请求使用 Button 的 loading；需要按已知内容结构预留空间时，使用 Skeleton。

<a id="examples"></a>

## 代码演示

<a id="spinner-sizes"></a>

### 尺寸对照

比较小号、中号和大号的外观；墨点不表示真实请求。

[查看示例文件](../../playground/src/examples/content/SpinnerExample.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/SpinnerExample.tsx -->

```tsx
import { Spinner, Text } from 'yahha-ui';

export default function SpinnerExample() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', gap: 24 }}>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Spinner size="sm" label="小号示例正在加载" />
          <Text size="sm" tone="muted">
            小号 sm
          </Text>
        </div>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Spinner label="中号示例正在加载" />
          <Text size="sm" tone="muted">
            中号 md（默认）
          </Text>
        </div>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Spinner size="lg" label="大号示例正在加载" />
          <Text size="sm" tone="muted">
            大号 lg
          </Text>
        </div>
      </div>
    </div>
  );
}
```

<a id="spinner-waiting"></a>

### 区块等待与完成状态

点击按钮切换等待与完成结果；文字提供一份状态说明，墨点不重复播报。真实请求由使用方管理。

[查看示例文件](../../playground/src/examples/content/SpinnerWaiting.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/SpinnerWaiting.tsx -->

```tsx
import { useState } from 'react';
import { Button, Spinner, Text } from 'yahha-ui';

export default function SpinnerWaiting() {
  const [loading, setLoading] = useState(true);
  return (
    <div style={{ display: 'grid', gap: 20 }}>
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
    </div>
  );
}
```

<a id="design"></a>

## 等待标记与可见说明

区块等待应配合可见文字说明正在加载什么。三枚墨点仅表示等待，不表达完成百分比；减少动效时保持静止，等待信息仍由文字传达。

<a id="api"></a>

## API

### SpinnerProps

| 参数                  | 说明                                                                      | 类型                                   | 默认值     |
| --------------------- | ------------------------------------------------------------------------- | -------------------------------------- | ---------- |
| `label`               | 在 status 内提供的屏幕阅读器文字。                                        | `string`                               | `加载中`   |
| `size`                | 默认 16 / 24 / 36px。                                                     | `'sm' \| 'md' \| 'lg'`                 | `'md'`     |
| `role`                | 原生角色，通常保留 status。                                               | `AriaRole`                             | `'status'` |
| `className / style`   | 作用于根 span 元素。                                                      | `string / CSSProperties`               | —          |
| `ref`                 | 指向真实 span 元素。                                                      | `ComponentPropsWithRef<'span'>['ref']` | —          |
| `其他原生属性 / 事件` | 支持对应原生元素的事件、aria-\*、data-\* 等属性；组件声明的同名属性优先。 | `ComponentPropsWithRef<'span'>`        | —          |

<a id="behavior"></a>

## 只播报一份等待状态

默认 role="status"，由 label 提供屏幕阅读器文字，图形本身为装饰。外层已有包含可见状态文字的 status 时，将内部 Spinner 设为 role="presentation"、aria-hidden="true"，避免同一等待重复播报。

请求结束时移除等待标记，并更新为实际完成、失败或空内容说明。等待过久时应提供原因或恢复入口，不让持续转动代替结果；组件不接受 children，可见说明放在旁边。

<a id="related"></a>

## 相关组件

- [Skeleton 骨架占位](skeleton.md)：为即将出现的内容预留形状，减少布局跳动。
- [Button 按钮](button.md)：触发提交、收藏或其他操作的原生按钮，提供三种强调程度与完整的交互状态。
- [EmptyState 空状态](empty-state.md)：当列表或搜索没有内容时，解释原因，并给出合适的下一步。
