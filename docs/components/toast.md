# Toast

提示一条操作结果。组件显示在调用方放置的位置，不包含消息管理器或 Portal。

短结果使用白纸回执、深墨轮廓与轻纸边投影；成功、信息、错误通过独立的状态印签区分。操作区用轻纸色细虚线分开，显示位置和时长仍由调用方管理。

本页示例在应用入口导入一次 `yahha-ui/style.css` 并配置 ThemeProvider；参见[入门指南](../../README.md#构建与本地安装)（站内路由 `#/guides/getting-started`）和[完整示例](../../README.md#本地开发)（站内路由 `#/components/toast`）。

## 设计与状态

- 30px 状态印签与 44×44px 关闭按钮对齐标题第一行。长标题、说明和动作在窄屏中自然换行，关闭按钮保持完整操作区域。
- 操作区使用轻纸色细虚线分隔，与外部暖墨轮廓保持不同层次。
- 提示关闭时，组件不会猜测应回到哪个触发器。若调用方卸载了当前聚焦的关闭或撤销操作，应在渲染完成后回到仍可用的触发器、恢复操作或结果标题。
- 只有焦点原本在消失或即将不可用的操作上时才恢复；用户已在页面其他地方操作，或计时器自动关闭时，不主动移动焦点。
- 计时与撤销示例设置 8 秒自动关闭，悬停或聚焦时暂停，离开后重新计时。归档结果保留在页面，提示消失后仍能通过“恢复文章”撤销；计时、撤销和焦点恢复由调用方实现。

## Props 与默认值

- `open`、`onClose`、`title` 必填。`open={false}` 时不渲染内容；点击关闭按钮调用 `onClose`，调用方应将 `open` 设为 `false`。
- `tone`：`"success" | "info" | "error"`，默认 `"success"`。
- `description`、`action` 为可选 `ReactNode`，无默认内容。标题和说明渲染在 p 内，适合文字或行内内容。
- `className` 作用于根 div；当前不提供 `ref`、`style` 或其他原生 div 属性透传。

根元素为 `role="status"`，并设置 `aria-atomic="true"`。组件不会根据 `tone="error"` 改为 alert，也不主动抢焦点。关闭按钮名称固定为“关闭提示”。

显示时长、自动关闭计时器、队列、去重和屏幕定位均由调用方管理；组件没有对应默认值。需要自动关闭时，还应考虑鼠标悬停、键盘聚焦和阅读时长。

## 示例

```tsx
import { useEffect, useRef, useState } from 'react';
import { Button, Toast } from 'yahha-ui';

export default function ToastBasic() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const message = useRef<HTMLDivElement>(null);
  const returnFocus = useRef(false);

  useEffect(() => {
    if (open || !returnFocus.current) return;
    returnFocus.current = false;
    if (document.activeElement === document.body) trigger.current?.focus();
  }, [open]);

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div>
        <Button ref={trigger} onClick={() => setOpen(true)}>
          显示保存结果
        </Button>
      </div>
      <div ref={message}>
        <Toast
          open={open}
          onClose={() => {
            returnFocus.current = message.current?.contains(document.activeElement) ?? false;
            setOpen(false);
          }}
          title="保存成功"
          description="这条提示会保留到你主动关闭。关闭后可以再次显示。"
        />
      </div>
    </div>
  );
}
```

## 键盘约定

关闭按钮与 `action` 中的交互元素按页面顺序参与 Tab；Enter / Space 使用各元素原生行为。Toast 不监听 Escape，也没有焦点圈定行为。
