<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Toast 提示消息

在页面中反馈保存、完成或失败等操作结果，支持说明与补充操作。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Toast } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于保存成功、内容已归档等不需要中断当前操作的短结果提示。需要持续阅读的说明或错误可使用 [Alert](alert.md) 或直接留在页面中。

Toast 是受控展示组件，显示在调用方放置的位置。调用方管理消息内容、open、关闭时机与多条消息的排列；下方示例将提示放在文档流中。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 受控显示与关闭

点击按钮显示示例保存结果，手动关闭后可再次显示；从提示内关闭后回到触发按钮。

[查看示例文件](../../playground/src/examples/feedback/ToastBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/feedback/ToastBasic.tsx -->

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
          description="标题和正文已保存在草稿中。"
        />
      </div>
    </div>
  );
}
```

<a id="tones"></a>

### 三种反馈类型

比较成功、信息和错误三种外观。结果文案为样本，关闭与恢复由示例管理。

[查看示例文件](../../playground/src/examples/feedback/ToastTones.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/feedback/ToastTones.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Button, Heading, Text, Toast } from 'yahha-ui';

const messages = [
  { tone: 'success', title: '文章已保存', description: '改动已经记录在草稿中。' },
  { tone: 'info', title: '还有一件小事', description: '发布前可以补充文章摘要。' },
  { tone: 'error', title: '保存未完成', description: '请检查网络连接后重试。' },
] as const;

export default function ToastTones() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const messagesRoot = useRef<HTMLDivElement>(null);
  const restoreButton = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const pendingFocus = useRef<'restore' | 'heading' | null>(null);

  useEffect(() => {
    const destination = pendingFocus.current;
    if (!destination) return;
    pendingFocus.current = null;
    if (
      document.activeElement === document.body ||
      (document.activeElement === restoreButton.current && restoreButton.current?.disabled)
    ) {
      if (destination === 'restore') restoreButton.current?.focus();
      else heading.current?.focus();
    }
  }, [dismissed]);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Heading level={3} ref={heading} tabIndex={-1}>
        三种结果说明
      </Heading>
      <div ref={messagesRoot} style={{ display: 'grid', gap: 16 }}>
        {messages.map((message) => (
          <div key={message.tone} style={{ display: 'grid', gap: 8 }}>
            <Text size="sm" tone="muted">
              {message.tone === 'success' ? '成功' : message.tone === 'info' ? '信息' : '错误'}
              {message.tone === 'success' ? '（默认）' : ''}
              {dismissed.includes(message.tone) ? ' · 已关闭' : ''}
            </Text>
            <Toast
              {...message}
              open={!dismissed.includes(message.tone)}
              onClose={() => {
                if (messagesRoot.current?.contains(document.activeElement))
                  pendingFocus.current = 'restore';
                setDismissed((current) => [...current, message.tone]);
              }}
            />
          </div>
        ))}
      </div>
      <div>
        <Button
          ref={restoreButton}
          variant="secondary"
          disabled={dismissed.length === 0}
          onClick={() => {
            if (document.activeElement === restoreButton.current) pendingFocus.current = 'heading';
            setDismissed([]);
          }}
        >
          恢复已关闭的提示
        </Button>
      </div>
    </div>
  );
}
```

<a id="timer-and-action"></a>

### 调用方计时与撤销操作

归档文章后显示 8 秒提示；悬停或聚焦时暂停，离开后重新计时。提示关闭后仍可通过“恢复文章”找回内容。

[查看示例文件](../../playground/src/examples/feedback/ToastTimer.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/feedback/ToastTimer.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Button, Text, Toast } from 'yahha-ui';

export default function ToastTimer() {
  const [archived, setArchived] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const archiveButton = useRef<HTMLButtonElement>(null);
  const restoreButton = useRef<HTMLButtonElement>(null);
  const message = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<'archive' | 'restore' | null>(null);

  useEffect(() => {
    const destination = pendingFocus.current;
    if (!destination) return;
    pendingFocus.current = null;
    const active = document.activeElement;
    const unavailableAction =
      (active === archiveButton.current && archiveButton.current?.disabled) ||
      (active === restoreButton.current && restoreButton.current?.disabled);
    if (active === document.body || unavailableAction) {
      (destination === 'archive' ? archiveButton : restoreButton).current?.focus();
    }
  }, [archived, open]);

  useEffect(() => {
    if (!open || hovered || focused) return;
    const timer = window.setTimeout(() => setOpen(false), 8000);
    return () => window.clearTimeout(timer);
  }, [open, hovered, focused]);

  function archive() {
    if (document.activeElement === archiveButton.current) pendingFocus.current = 'restore';
    setArchived(true);
    setHovered(false);
    setFocused(false);
    setOpen(true);
  }

  function undo() {
    if (
      message.current?.contains(document.activeElement) ||
      document.activeElement === restoreButton.current
    ) {
      pendingFocus.current = 'archive';
    }
    setArchived(false);
    setOpen(false);
  }

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Text size="sm" tone="muted">
        {archived ? '《周末散步》已归档。' : '《周末散步》在文章列表中。'}
      </Text>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button ref={archiveButton} onClick={archive} disabled={archived}>
          归档文章
        </Button>
        <Button ref={restoreButton} variant="secondary" onClick={undo} disabled={!archived}>
          恢复文章
        </Button>
      </div>
      <div
        ref={message}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
      >
        <Toast
          open={open}
          onClose={() => {
            if (message.current?.contains(document.activeElement)) pendingFocus.current = 'restore';
            setOpen(false);
          }}
          title="文章已归档"
          description="《周末散步》已移入归档，可以随时恢复。"
          action={
            <Button size="sm" variant="ghost" onClick={undo}>
              撤销归档
            </Button>
          }
        />
      </div>
    </div>
  );
}
```

<a id="design"></a>

## 自动关闭与恢复入口

自动关闭由调用方实现。设置足够的阅读时间，并在悬停或聚焦时暂停，避免用户操作过程中提示消失；组件本身没有计时器。撤销等重要操作还应在页面中保留持续入口，示例中的“恢复文章”在提示关闭后仍然可用。

<a id="api"></a>

## API

### ToastProps

| 参数               | 说明                                                             | 类型                             | 默认值      |
| ------------------ | ---------------------------------------------------------------- | -------------------------------- | ----------- |
| `open` **必填**    | 是否显示，false 时返回 null。没有 defaultOpen。                  | `boolean`                        | —           |
| `onClose` **必填** | 点击内置关闭按钮时调用，调用方应将 open 更新为 false。           | `() => void`                     | —           |
| `title` **必填**   | 提示标题，渲染在 p 内，适合文字或行内内容。                      | `ReactNode`                      | —           |
| `description`      | 可选说明，渲染在 p 内；无默认内容。                              | `ReactNode`                      | —           |
| `tone`             | 反馈视觉类型，决定颜色与状态图标，不改变播报优先级。             | `'success' \| 'info' \| 'error'` | `'success'` |
| `action`           | 补充操作插槽；行为、关闭与后续状态由调用方实现。                 | `ReactNode`                      | —           |
| `className`        | 作用于根 status div。当前不透传 ref、style 或其他原生 div 属性。 | `string`                         | —           |

<a id="behavior"></a>

## 播报与关闭后的焦点

- 根元素使用 role="status" 与 aria-atomic="true"，礼貌播报整条提示；同一结果不再另设 live region 重复播报。需要紧急播报的错误，可使用显式设置 role="alert" 的 Alert。
- 显示时不主动移动焦点。内置关闭按钮的名称为“关闭提示”，它与 action 内的交互元素按页面顺序参与 Tab；组件不监听 Escape。
- 从提示内部关闭或完成操作后，调用方应把焦点放到仍然存在的合理位置；自动关闭时不要移动页面其他位置的焦点。

<a id="styling"></a>

## 放置提示

默认在文档流中显示。需要固定在屏幕角落时，由外层容器设置定位、窄屏边距与多条消息的排列，并避免遮挡当前操作；Toast 不创建 Portal 或全局消息队列。

<a id="related"></a>

## 相关组件

- [Alert 静态提示](alert.md)：持续展示阅读说明、完成结果或需要处理的问题。
- [Dialog 弹窗](dialog.md)：需要用户暂时集中注意力时，显示一段独立内容或简短表单。
