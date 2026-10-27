# Toast

提示一条操作结果。组件显示在调用方放置的位置，不包含消息管理器或 Portal。

## Props 与默认值

- `open`、`onClose`、`title` 必填。`open={false}` 时不渲染内容；点击关闭按钮调用 `onClose`，调用方应将 `open` 设为 `false`。
- `tone`：`"success" | "info" | "error"`，默认 `"success"`。
- `description`、`action` 为可选 `ReactNode`，无默认内容。标题和说明渲染在 p 内，适合文字或行内内容。
- `className` 作用于根 div；当前不提供 `ref`、`style` 或其他原生 div 属性透传。

根元素为 `role="status"`，并设置 `aria-atomic="true"`。组件不会根据 `tone="error"` 改为 alert，也不主动抢焦点。关闭按钮名称固定为“关闭提示”。

显示时长、自动关闭计时器、队列、去重和屏幕定位均由调用方管理；组件没有对应默认值。需要自动关闭时，还应考虑鼠标悬停、键盘聚焦和阅读时长。

## 示例

```tsx
import { useState } from 'react';
import { Button, ThemeProvider, Toast } from 'yahha-ui';
import 'yahha-ui/style.css';

export function ToastExample() {
  const [open, setOpen] = useState(false);

  return (
    <ThemeProvider theme="hachiware">
      <Button onClick={() => setOpen(true)}>保存心愿</Button>
      <Toast
        open={open}
        onClose={() => setOpen(false)}
        title="保存好了"
        description="可以继续记录下一件小事。"
        action={
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
            知道了
          </Button>
        }
      />
    </ThemeProvider>
  );
}
```

## 键盘约定

关闭按钮与 `action` 中的交互元素按页面顺序参与 Tab；Enter / Space 使用各元素原生行为。Toast 不监听 Escape，也没有焦点圈定行为。
