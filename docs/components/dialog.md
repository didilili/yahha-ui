# Dialog

基于 Base UI 的受控模态弹窗，包含标题、关闭按钮、可选说明与内容插槽。简短且不含交互的文字提示使用 [Tooltip](tooltip.md)；锚定到触发器的非模态轻交互使用 [Popover](popover.md)。

关闭期间显示信笺退场效果，内容立即停止接收交互；取消后快速按 Enter / Space 不会提交已取消的草稿。调用方需更新 `open` 才会关闭；保持 `open=true` 时弹窗仍可操作。

弹窗采用饱满的信笺轮廓、2px 深墨线、4px 纸边与较宽的轻投影，结合遮罩集中当前任务。它与便笺式锚定浮层区分；减少动效时取消淡入与缩放过渡。

标题与页脚使用轻纸分隔线。关闭按钮的操作区域为 44×44px：无 `illustration` 时对齐标题第一行，有插画时位于弹窗上角。标题使用桌面 24px、手机 20px 字号，长标题自然换行，并为关闭按钮留足空间。

## 编辑与恢复

文档中的标题表单在保存时去除首尾空格；只有空格时保留弹窗并聚焦错误字段。取消、Escape 或关闭按钮不提交草稿，再次打开显示已保存值。这些规则由表单示例管理，Dialog 本身不保存业务数据，也不会自动发起请求。

在“状态与场景 → 文章编辑与管理”中，可以体验菜单打开编辑弹窗、弹窗内选择分类与查看写作便笺。Escape 先关闭当前最上层浮层，回到对应触发器，再关闭编辑弹窗。菜单项打开的弹窗没有常驻 Dialog trigger，因此示例通过 `finalFocus` 指向保留的菜单按钮。

有异步保存时，失败保留输入，提供可见的重试说明；取消或卸载时清理等待，避免已经关闭的草稿晚到后覆盖正文。示例的 700 毫秒计时器仅模拟请求，不表示真实服务器保存。长内容依照弹窗可用高度滚动，不压缩关闭按钮和操作目标。

“文章编辑与管理”（ArticleActions）示例展示长标题、窄屏和嵌套浮层，以及保存、取消、失败恢复和焦点返回；带插画示例展示插画与关闭按钮的布局。

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
