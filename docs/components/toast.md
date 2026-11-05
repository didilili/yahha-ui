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

Toast 是受控展示组件，显示在调用方放置的位置。调用方管理消息内容、open、关闭时机与多条消息的排列。

<a id="examples"></a>

## 代码演示

<a id="toast-simple"></a>

### 基础用法

显示并关闭提示，关闭后可重新显示。

[查看示例文件](../../playground/src/examples/feedback/ToastSimple.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

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

对比三种反馈样本，并关闭或恢复提示。

[查看示例文件](../../playground/src/examples/feedback/ToastTones.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

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

<a id="integration"></a>

## 进阶用法

示例只操作本地清单或文章状态。重要操作保留常驻入口，提示关闭后仍可继续访问或恢复。

<a id="basic"></a>

### 带操作的提示

点击提示内的操作查看清单，关闭后仍可从常驻入口访问。

[查看示例文件](../../playground/src/examples/feedback/ToastBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/feedback/ToastBasic.tsx -->

```tsx
import { useEffect, useId, useRef, useState } from 'react';
import { Button, Heading, Text, Toast } from 'yahha-ui';

const article = {
  title: '窗边那半本书，留给周末的一页',
  summary: '把读到一半的段落留给周末，先将手记收进稍后阅读清单。',
};

export default function ToastBasic() {
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const message = useRef<HTMLDivElement>(null);
  const listHeading = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef(false);
  const listId = useId();

  useEffect(() => {
    if (open || !returnFocus.current) return;
    returnFocus.current = false;
    if (document.activeElement === document.body) trigger.current?.focus();
  }, [open]);

  function viewList() {
    returnFocus.current = false;
    setOpen(false);
    listHeading.current?.focus();
    listHeading.current?.scrollIntoView({ block: 'nearest' });
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: 20,
        maxWidth: 640,
        minWidth: 0,
        overflowWrap: 'anywhere',
      }}
    >
      <article aria-label="示例手记" style={{ display: 'grid', gap: 12, minWidth: 0 }}>
        <Heading level={3}>{article.title}</Heading>
        <Text>{article.summary}</Text>
        <Text size="sm" tone="muted">
          {saved ? '已在稍后阅读清单中。' : '尚未加入稍后阅读。'}
        </Text>
      </article>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button
          ref={trigger}
          onClick={() => {
            returnFocus.current = false;
            setSaved((current) => !current);
            setOpen(true);
          }}
        >
          {saved ? '移出稍后阅读' : '加入稍后阅读'}
        </Button>
        <Button variant="secondary" onClick={viewList}>
          查看阅读清单
        </Button>
      </div>
      <div ref={message}>
        <Toast
          open={open}
          onClose={() => {
            returnFocus.current = message.current?.contains(document.activeElement) ?? false;
            setOpen(false);
          }}
          tone={saved ? 'success' : 'info'}
          title={saved ? '已加入稍后阅读' : '已移出稍后阅读'}
          description={article.title}
          action={
            <Button variant="ghost" onClick={viewList}>
              查看阅读清单
            </Button>
          }
        />
      </div>
      <section aria-labelledby={listId} style={{ display: 'grid', gap: 12, minWidth: 0 }}>
        <Heading id={listId} ref={listHeading} level={3} tabIndex={-1}>
          稍后阅读清单
        </Heading>
        <Text size="sm" tone="muted">
          共 {saved ? 1 : 0} 篇手记。
        </Text>
        {saved ? (
          <ul style={{ margin: 0, paddingInlineStart: 24, minWidth: 0 }}>
            <li>{article.title}</li>
          </ul>
        ) : (
          <Text>还没有稍后阅读的手记。</Text>
        )}
      </section>
    </div>
  );
}
```

<a id="timer-and-action"></a>

### 计时关闭与撤销

示例控制 8 秒关闭，可撤销归档；提示关闭后仍可恢复文章。

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

自动关闭由调用方实现，组件本身没有计时器。请留足阅读时间；计时与撤销示例等待 8 秒后关闭，悬停或聚焦时暂停，离开后重新计满 8 秒。撤销等重要操作还应在页面中保留持续入口，示例中的“恢复文章”在提示关闭后仍然可用。

带操作的提示例保留清单入口；查看操作聚焦常驻清单标题，关闭提示不会丢失已加入的内容。

<a id="api"></a>

## API

### ToastProps

| 属性               | 说明                                                             | 类型                             | 默认值      |
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

- [Alert 提示条](alert.md)：持续展示阅读说明、完成结果或需要处理的问题。
- [Dialog 弹窗](dialog.md)：需要用户暂时集中注意力时，显示一段独立内容或简短表单。
