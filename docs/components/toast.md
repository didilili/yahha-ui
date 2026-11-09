<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Toast 提示消息

用于反馈操作结果，支持说明与操作插槽，由调用方管理显示状态。

[安装与接入](../../README.md#安装与接入)

```tsx
import { Toast } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于保存成功、文章已归档等不需要中断当前操作的短结果提示。需要持续阅读的说明或错误可使用 [Alert](alert.md) 或直接留在页面中。

Toast 是受控展示组件，显示在调用方放置的位置。调用方管理消息内容、open、关闭时机与多条消息的排列。

<a id="examples"></a>

## 代码演示

<a id="toast-simple"></a>

### 基础用法

显示并关闭提示，关闭后可重新显示。

[查看示例文件](../../playground/src/examples/feedback/ToastSimple.tsx)

<!-- example-source: playground/src/examples/feedback/ToastSimple.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Button, Toast } from 'yahha-ui';

export default function ToastSimple() {
  const [open, setOpen] = useState(true);
  const message = useRef<HTMLDivElement>(null);
  const show = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 480 }}>
      <div ref={message}>
        <Toast
          open={open}
          title="这是一条提示。"
          onClose={() => {
            if (message.current?.contains(document.activeElement)) show.current?.focus();
            setOpen(false);
          }}
        />
      </div>
      <div>
        <Button ref={show} variant="secondary" onClick={() => setOpen(true)}>
          显示提示
        </Button>
      </div>
    </div>
  );
}
```

<a id="tones"></a>

### 三种反馈类型

对比三种反馈类型，支持关闭与恢复提示。

[查看示例文件](../../playground/src/examples/feedback/ToastTones.tsx)

<!-- example-source: playground/src/examples/feedback/ToastTones.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Button, Heading, Text, Toast } from 'yahha-ui';

const messages = [
  { tone: 'success', title: '文章已保存', description: '改动已经记录在草稿中。' },
  { tone: 'info', title: '还有一件小事', description: '发布前可以补充文章摘要。' },
  { tone: 'error', title: '保存失败', description: '请检查网络连接后重试。' },
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

<a id="toast-action"></a>

### 带操作的提示

通过 action 提供后续链接，关闭提示后可重新显示。

[查看示例文件](../../playground/src/examples/feedback/ToastAction.tsx)

<!-- example-source: playground/src/examples/feedback/ToastAction.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Button, Link, Toast } from 'yahha-ui';

export default function ToastAction() {
  const [open, setOpen] = useState(true);
  const message = useRef<HTMLDivElement>(null);
  const show = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 480 }}>
      <div ref={message}>
        <Toast
          open={open}
          title="手记已收藏"
          description="《周末散步》已经加入收藏夹。"
          action={<Link href="#/guides/reading">继续阅读</Link>}
          onClose={() => {
            if (message.current?.contains(document.activeElement)) show.current?.focus();
            setOpen(false);
          }}
        />
      </div>
      <div>
        <Button ref={show} variant="secondary" onClick={() => setOpen(true)}>
          重新显示提示
        </Button>
      </div>
    </div>
  );
}
```

<a id="appearance"></a>

### 普通与回执外观

使用相同内容和链接，对比回执增加的印签与浅色操作纸面。

[查看示例文件](../../playground/src/examples/feedback/ToastAppearance.tsx)

<!-- example-source: playground/src/examples/feedback/ToastAppearance.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Button, Link, Text, Toast } from 'yahha-ui';

function AppearanceSample({ appearance }: { appearance: 'default' | 'receipt' }) {
  const [open, setOpen] = useState(true);
  const restore = useRef<HTMLButtonElement>(null);
  const message = useRef<HTMLDivElement>(null);

  function dismiss() {
    if (message.current?.contains(document.activeElement)) restore.current?.focus();
    setOpen(false);
  }

  return (
    <div style={{ display: 'grid', gap: 12, alignContent: 'start', minWidth: 0 }}>
      <Text size="sm" tone="muted">
        {appearance === 'default' ? '普通（默认）' : '回执'}
      </Text>
      <div ref={message}>
        <Toast
          appearance={appearance}
          open={open}
          title="手记已收藏"
          description="《周末散步》已经加入收藏夹。"
          onClose={dismiss}
          action={<Link href="#/guides/reading">继续阅读</Link>}
        />
      </div>
      <div>
        <Button ref={restore} variant="secondary" onClick={() => setOpen(true)}>
          重新显示提示
        </Button>
      </div>
    </div>
  );
}

export default function ToastAppearance() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: 24,
      }}
    >
      <AppearanceSample appearance="default" />
      <AppearanceSample appearance="receipt" />
    </div>
  );
}
```

<a id="basic"></a>

### 关闭提示后的焦点恢复

关闭提示时按需返回触发按钮，查看操作聚焦手记标题；常驻入口在提示关闭后仍可用。

[查看示例文件](../../playground/src/examples/feedback/ToastFocus.tsx)

<!-- example-source: playground/src/examples/feedback/ToastFocus.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Button, Heading, Text, Toast } from 'yahha-ui';

export default function ToastFocus() {
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const message = useRef<HTMLDivElement>(null);
  const destination = useRef<HTMLHeadingElement>(null);

  function viewNote() {
    setOpen(false);
    destination.current?.focus();
    destination.current?.scrollIntoView({ block: 'nearest' });
  }

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 480 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button
          ref={trigger}
          onClick={() => {
            setSaved(true);
            setOpen(true);
          }}
        >
          {saved ? '再次显示提示' : '收藏手记'}
        </Button>
        <Button variant="secondary" onClick={viewNote}>
          查看手记
        </Button>
      </div>
      <div ref={message}>
        <Toast
          open={open}
          title="手记已收藏"
          description="《周末散步》已留在收藏中。"
          onClose={() => {
            if (message.current?.contains(document.activeElement)) trigger.current?.focus();
            setOpen(false);
          }}
          action={
            <Button variant="ghost" onClick={viewNote}>
              查看手记
            </Button>
          }
        />
      </div>
      <article style={{ display: 'grid', gap: 8 }}>
        <Heading ref={destination} level={3} tabIndex={-1}>
          周末散步
        </Heading>
        <Text size="sm" tone="muted">
          {saved ? '已收藏。' : '尚未收藏。'}吉伊收起路线图，小八还在数口袋里的面包屑。
        </Text>
      </article>
    </div>
  );
}
```

<a id="design"></a>

## 自动关闭与恢复入口

自动关闭由调用方实现，组件本身没有计时器。请留足阅读时间，并为撤销等重要操作保留持续入口。完整的 [归档撤销与提示计时](../recipes/interactions.md#timer-and-action)展示 8 秒窗口、悬停与聚焦暂停、后台暂停，以及关闭提示后的恢复操作。

收藏内容不会随提示关闭而丢失。完整的 [清单操作与提示回焦](../recipes/interactions.md#basic)保留文章增删、清单结果和常驻查看入口。

<a id="api"></a>

## API

### ToastProps

| 属性               | 说明                                                                         | 类型                             | 默认值      |
| ------------------ | ---------------------------------------------------------------------------- | -------------------------------- | ----------- |
| `open` **必填**    | 是否显示，false 时返回 null。没有 defaultOpen。                              | `boolean`                        | —           |
| `onClose` **必填** | 点击内置关闭按钮时调用，调用方应将 open 更新为 false。                       | `() => void`                     | —           |
| `title` **必填**   | 提示标题，渲染在 p 内，适合文字或行内内容。                                  | `ReactNode`                      | —           |
| `description`      | 可选说明，渲染在 p 内；无默认内容。                                          | `ReactNode`                      | —           |
| `tone`             | 反馈视觉类型，决定颜色与状态图标，不改变播报优先级。                         | `'success' \| 'info' \| 'error'` | `'success'` |
| `appearance`       | 默认保留状态图标与操作；receipt 额外加入印签边框和带虚线分隔的浅色操作纸面。 | `'default' \| 'receipt'`         | `'default'` |
| `action`           | 补充操作插槽；行为、关闭与后续状态由调用方实现。                             | `ReactNode`                      | —           |
| `className`        | 作用于根 status div。当前不透传 ref、style 或其他原生 div 属性。             | `string`                         | —           |

<a id="behavior"></a>

## 播报与关闭后的焦点

- 根元素使用 role="status" 与 aria-atomic="true"，礼貌播报整条提示；同一结果不再另设 live region 重复播报。需要紧急播报的错误，可使用显式设置 role="alert" 的 Alert。
- 显示时不主动移动焦点。内置关闭按钮的名称为“关闭提示”，它与 action 内的交互元素按页面顺序参与 Tab；组件不监听 Escape。
- 从提示内部关闭或完成操作后，调用方应把焦点放到仍然存在的合理位置；自动关闭时不要移动页面其他位置的焦点。

<a id="styling"></a>

## 放置提示

默认在文档流中显示。需要固定在屏幕角落时，由外层容器设置定位、窄屏边距与多条消息的排列，并避免遮挡当前操作；Toast 不创建 Portal 或全局消息队列。

默认使用普通外观，需要回执纸章时显式设置 appearance="receipt"。 两种外观均保留状态图标、文字、操作和关闭入口，并继承外层容器的阅读方向。

<a id="related"></a>

## 相关组件

- [Alert 提示条](alert.md)：用于页面内持续显示的信息、结果、警告或错误提示。
- [Dialog 弹窗](dialog.md)：用于模态展示确认、简短表单或补充内容，管理弹窗焦点。
