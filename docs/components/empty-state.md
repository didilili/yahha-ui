# EmptyState

显示空内容的标题、说明和后续操作。组件不判断列表是否为空。

## Props 与默认值

- `title: ReactNode` 必填，渲染为 h3。
- `description`、`illustration`、`action` 为可选 `ReactNode`，无默认内容。
- `description` 渲染在 p 内，适合文字或行内内容。
- `illustration` 的包装元素带 `aria-hidden="true"`，放装饰插画；必要信息写在标题或说明中。
- `className` 作用于根 div。当前不提供 `ref`、`style` 或其他原生 div 属性透传。

组件没有受控状态。调用方决定何时渲染，并负责 `action` 的行为。

## 示例

```tsx
import { useState } from 'react';
import { Button, EmptyState, ThemeProvider } from 'yahha-ui';
import 'yahha-ui/style.css';

export function EmptyStateExample() {
  const [created, setCreated] = useState(false);

  return (
    <ThemeProvider theme="chiikawa">
      {created ? (
        <p>第一条心愿已经创建。</p>
      ) : (
        <EmptyState
          title="还没有心愿"
          description="从一件想做的小事开始。"
          action={<Button onClick={() => setCreated(true)}>写下第一条</Button>}
        />
      )}
    </ThemeProvider>
  );
}
```

## 键盘约定

空态本身不获取焦点，也没有额外快捷键。`action` 使用 Button 或链接等可聚焦元素；不要仅在文字或插画上绑定点击。
