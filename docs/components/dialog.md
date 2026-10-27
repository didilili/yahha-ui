# Dialog

基于 Base UI 的受控模态弹窗，包含标题、关闭按钮、可选说明与内容插槽。

## Props 与默认值

- `open`、`onOpenChange`、`title` 必填。调用方保存 `open` 并响应 `onOpenChange`，不提供内部非受控模式。
- `trigger` 为可选 `ReactElement`；传入时会作为触发器。自定义触发组件需将 button 原生属性和 `ref` 传至实际元素。
- `description`、`children`、`footer`、`illustration` 为可选 `ReactNode`。`illustration` 的包装元素带 `aria-hidden="true"`，仅放装饰内容。
- `closeLabel` 默认 `"关闭弹窗"`，用作右上角关闭按钮的可访问名称。
- `disablePointerDismissal` 默认 `false`；为 `true` 时，点击弹窗外部不会关闭，Escape 和关闭按钮仍可关闭。
- `className`、`style`、`ref` 作用于弹窗 Popup div，不作用于遮罩、触发器或 Portal 容器。
- `portalContainer` 默认使用 Base UI 的 body 容器；可传 `HTMLElement`、`ShadowRoot`、对应的 ref 或 `null`。改变挂载位置时，调用方负责容器的层叠与裁切环境。

`initialFocus`、`finalFocus` 沿用 Base UI Popup 的类型，可传布尔值、元素 ref，或根据交互类型返回目标元素的函数。省略时，打开后聚焦首个可聚焦元素，触摸打开时聚焦 Popup；关闭后返回触发器或先前聚焦元素。传 `false` 会关闭相应的自动焦点移动；使用前需自行保证键盘用户能找到弹窗。

无 `trigger` 时可通过外部状态打开，建议明确设置 `finalFocus`。主题名称与 `tokens` 会传入 Portal；`ThemeProvider` 根元素上的自定义 `className` 不会自动传过去，详见[主题](theme.md)。

## 示例

```tsx
import { useRef, useState } from 'react';
import { Button, Dialog, TextField, ThemeProvider } from 'yahha-ui';
import 'yahha-ui/style.css';

export function DialogExample() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <ThemeProvider theme="usagi">
      <Dialog
        open={open}
        onOpenChange={setOpen}
        trigger={<Button>许个心愿</Button>}
        title="写下新的心愿"
        description="这里的内容只在当前页面演示。"
        initialFocus={inputRef}
        footer={<Button onClick={() => setOpen(false)}>完成</Button>}
      >
        <TextField ref={inputRef} label="心愿" defaultValue="一起去吃拉面" />
      </Dialog>
    </ThemeProvider>
  );
}
```

## 键盘约定

打开后，Tab / Shift+Tab 的焦点保留在模态弹窗内；Escape 请求关闭。调用方必须更新 `open` 才会真正关闭。标题与说明会关联到 dialog，不要省略有意义的 `title`。
