<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Dialog 弹窗

用于模态展示确认、简短表单或补充内容，管理弹窗焦点。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Dialog } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于需要集中完成的简短编辑、确认或补充说明。Dialog 是模态弹窗，打开后将焦点保留在当前任务内；普通阅读内容优先放在页面。围绕触发位置展开、允许继续操作页面的轻量交互使用 [Popover](popover.md)。

Dialog 使用受控状态，调用方必须保存 open 并响应 onOpenChange。title 提供弹窗名称，应包含能说明当前任务的文字。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 基础用法

通过 trigger 打开弹窗，关闭后焦点返回触发按钮。

[查看示例文件](../../playground/src/examples/feedback/DialogBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/feedback/DialogBasic.tsx -->

```tsx
import { useState } from 'react';
import { Button, Dialog } from 'yahha-ui';

export default function DialogBasic() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger={<Button>查看阅读提示</Button>}
      title="长文阅读建议"
      description="先浏览目录，再选择要读的章节。"
    >
      <p>文章较长时，可以按章节分次阅读。</p>
    </Dialog>
  );
}
```

<a id="external"></a>

### 外部按钮打开与焦点返回

由外部按钮更新 open，并通过 finalFocus 指定关闭后的焦点。

[查看示例文件](../../playground/src/examples/feedback/DialogExternal.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/feedback/DialogExternal.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Button, Dialog } from 'yahha-ui';

export default function DialogExternal() {
  const [open, setOpen] = useState(false);
  const returnRef = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 16 }}>
      <Button ref={returnRef} variant="secondary" onClick={() => setOpen(true)}>
        查看阅读提醒
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="阅读提醒"
        description="给长文章留一段从容的阅读时间。"
        finalFocus={returnRef}
        disablePointerDismissal
        footer={<Button onClick={() => setOpen(false)}>返回阅读</Button>}
      >
        <p>长文章可以分几次读完。先找一个舒服的位置，按照自己的节奏慢慢读。</p>
      </Dialog>
    </div>
  );
}
```

<a id="integration"></a>

## 进阶用法

关闭保护由调用方实现；修改标题后，取消、Escape、关闭按钮和外点共用退出策略。 结果仅保留在当前示例；重新打开时从已保存值开始，保存成功或还原为已保存值后可以直接关闭。

<a id="form"></a>

### 未保存修改的关闭确认

修改标题后请求关闭，观察调用方如何保留草稿并确认是否放弃。

[查看示例文件](../../playground/src/examples/feedback/DialogForm.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/feedback/DialogForm.tsx -->

```tsx
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Alert, Button, Dialog, Text, TextField } from 'yahha-ui';

export default function DialogForm() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState('');
  const [draft, setDraft] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const focusFrame = useRef<number | null>(null);
  const closeAttempt = useRef(0);
  const formId = useId();

  useEffect(
    () => () => {
      closeAttempt.current += 1;
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    },
    [],
  );

  function cancelPendingFocus() {
    closeAttempt.current += 1;
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = null;
  }

  function changeOpen(nextOpen: boolean) {
    cancelPendingFocus();
    if (nextOpen) {
      setDraft(saved);
      setConfirming(false);
      setError('');
      setOpen(true);
      return;
    }
    if (draft !== saved) {
      setConfirming(true);
      const attempt = closeAttempt.current;
      focusFrame.current = requestAnimationFrame(() => {
        focusFrame.current = null;
        if (attempt !== closeAttempt.current) return;
        const popup = popupRef.current;
        if (popup && !popup.contains(document.activeElement)) continueRef.current?.focus();
      });
      return;
    }
    setError('');
    setOpen(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = String(new FormData(event.currentTarget).get('title') ?? '').trim();
    if (!title) {
      setError('请输入站点标题，不能只填写空格。');
      inputRef.current?.focus();
      return;
    }
    cancelPendingFocus();
    setSaved(title);
    setDraft(title);
    setError('');
    setConfirming(false);
    setOpen(false);
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Dialog
        ref={popupRef}
        open={open}
        onOpenChange={changeOpen}
        trigger={<Button>修改站点标题</Button>}
        title="站点标题"
        description="为这间阅读室取一个喜欢的名字。"
        initialFocus={inputRef}
        footer={
          <>
            <Button
              ref={continueRef}
              variant="secondary"
              onClick={() => {
                if (confirming) {
                  cancelPendingFocus();
                  setConfirming(false);
                  inputRef.current?.focus();
                } else changeOpen(false);
              }}
            >
              {confirming ? '继续编辑' : '取消'}
            </Button>
            <Button type="submit" form={formId}>
              保存标题
            </Button>
            {confirming && (
              <Button
                variant="ghost"
                destructive
                onClick={() => {
                  cancelPendingFocus();
                  setDraft(saved);
                  setConfirming(false);
                  setError('');
                  setOpen(false);
                }}
              >
                放弃修改并关闭
              </Button>
            )}
          </>
        }
      >
        <form id={formId} onSubmit={handleSubmit}>
          <TextField
            ref={inputRef}
            label="站点标题"
            name="title"
            value={draft}
            placeholder="例如：小小阅读室"
            required
            maxLength={30}
            hint="请输入 1–30 个字符。"
            error={error}
            onChange={(event) => {
              const next = event.target.value;
              setDraft(next);
              setError('');
              if (next === saved) {
                cancelPendingFocus();
                setConfirming(false);
              }
            }}
          />
        </form>
        {confirming && (
          <div style={{ marginTop: 16 }}>
            <Alert role="alert" tone="warning" title="还有未保存的修改">
              你可以继续编辑或保存，也可以放弃这次修改并关闭。
            </Alert>
          </div>
        )}
      </Dialog>
      <Text size="sm" tone="muted" role="status">
        {saved ? `当前标题：${saved}` : '尚未保存标题。'}
      </Text>
    </div>
  );
}
```

<a id="design"></a>

## 状态与反馈

触发器与关闭操作发出 onOpenChange 请求，调用方更新 open 后才改变打开状态。 footer 中的按钮需自行关闭弹窗或提交表单，提交不会自动关闭。

编辑时由调用方区分草稿与已保存值，并决定取消、保存成功和失败时如何处理输入。组合示例见 [文章编辑与管理](../README.md#站内指南)，菜单打开编辑弹窗后通过 finalFocus 返回保留的菜单按钮。

<a id="api"></a>

## API

### DialogProps

| 属性                      | 说明                                                                                                                                                                              | 类型                             | 默认值                                   |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------------- |
| `open` **必填**           | 是否打开弹窗。组件不提供 defaultOpen 或内部非受控状态。                                                                                                                           | `boolean`                        | —                                        |
| `onOpenChange` **必填**   | 打开或关闭请求发生时调用；调用方更新 open 才会改变可见状态。                                                                                                                      | `(open: boolean) => void`        | —                                        |
| `title` **必填**          | 弹窗标题，同时提供弹窗的可访问名称，应包含有意义的文字。                                                                                                                          | `ReactNode`                      | —                                        |
| `trigger`                 | 可选触发元素。自定义组件需要把 button 原生属性、事件和 ref 传给实际元素；使用 Button 即可。                                                                                       | `ReactElement`                   | —                                        |
| `description`             | 标题下方的补充说明，会关联到弹窗的可访问描述。                                                                                                                                    | `ReactNode`                      | —                                        |
| `children`                | 弹窗正文，适合简短内容或表单。                                                                                                                                                    | `ReactNode`                      | —                                        |
| `footer`                  | 底部操作区。自定义按钮需自行更新状态或提交表单。                                                                                                                                  | `ReactNode`                      | —                                        |
| `illustration`            | 装饰插画；整个插槽隐藏于辅助技术，不要在其中放必要信息或操作。                                                                                                                    | `ReactNode`                      | —                                        |
| `initialFocus`            | 可传布尔值、元素 ref 或回调。回调接收打开方式（mouse / touch / pen / keyboard；无法识别时为空字符串），返回元素指定目标、true / null 使用默认行为、false / undefined 不移动焦点。 | `DialogProps['initialFocus']`    | `首个可聚焦元素；触摸打开时聚焦弹窗本身` |
| `finalFocus`              | 可传布尔值、元素 ref 或回调。回调接收关闭方式（mouse / touch / pen / keyboard；无法识别时为空字符串），返回值约定同 initialFocus；false 不返回焦点。                              | `DialogProps['finalFocus']`      | `触发器或先前聚焦元素`                   |
| `portalContainer`         | Portal 挂载位置，支持元素、ShadowRoot、对应 ref 或 null。自定义容器的层叠、裁切环境由调用方负责。                                                                                 | `DialogProps['portalContainer']` | `body`                                   |
| `disablePointerDismissal` | 阻止点击弹窗外部关闭；Escape、关闭按钮与受控状态仍有效。                                                                                                                          | `boolean`                        | `false`                                  |
| `closeLabel`              | 关闭按钮的可访问名称。                                                                                                                                                            | `string`                         | `"关闭弹窗"`                             |
| `className / style`       | 作用于弹窗面板 div；不透传其余 div 原生属性。                                                                                                                                     | `string / CSSProperties`         | —                                        |
| `ref`                     | 指向弹窗面板 div。未打开时该元素通常未挂载。                                                                                                                                      | `Ref<HTMLDivElement>`            | —                                        |

<a id="keyboard-and-theme"></a>

## 可访问性与键盘

- 触发按钮可用 Enter / Space 打开。打开后 Tab / Shift+Tab 在弹窗内循环，页面其他内容暂不可操作，页面滚动被锁定。Escape、关闭按钮或点击外部请求关闭； disablePointerDismissal 只阻止外部点击关闭。
- 默认聚焦首个可聚焦元素，通常是内置关闭按钮；触摸打开时聚焦弹窗本身，避免自动唤起键盘。 短表单可用 initialFocus 指定输入框；设为 false 时需自行安排进入弹窗的焦点。
- 关闭后默认返回触发器或先前聚焦元素。省略 trigger、从外部状态打开时，建议通过 finalFocus 指定仍然存在的返回位置。
- title 作为可访问名称，description 作为补充描述。illustration 插槽对辅助技术隐藏，只放装饰内容。

<a id="styling"></a>

## 内容布局与 Portal

底部操作区空间不足时，按钮会换行；窄屏改为纵向排列。

插画区为关闭按钮和焦点轮廓保留两侧留白。图片或 SVG 保持居中、完整显示，宽幅插画会按比例缩小；插画区高度仍为 124px。

长标题自动换行，内容超出可用高度时整个弹窗滚动，footer 不固定在底部。复杂表单或长篇正文更适合独立页面，避免把必要操作埋在长滚动区中。

有触发器时，弹窗跟随触发器自身或祖先明确的 dir，未指定时继承方向上下文； 没有显式方向配置时，保留 Portal 目标及页面的 CSS direction 继承。触发器仅使用局部 CSS direction 或 dir="auto" 时，请同时提供明确的 dir。style.direction 可显式覆盖弹窗方向。省略触发器、由外部程序打开时，继续继承 Portal 目标及页面的原生方向。

Portal 默认挂载到 body，继承最近 ThemeProvider 的主题与 tokens，不复制页面布局类。 自定义 portalContainer 时，需检查容器的层叠与裁切，确保遮罩和弹窗都能正确覆盖页面。

<a id="related"></a>

## 相关组件

- [Popover 弹出面板](popover.md)：锚定到触发器的非模态面板，可包含说明、链接或短表单。
- [Alert 提示条](alert.md)：用于页面内持续显示的信息、结果、警告或错误提示。
- [Toast 提示消息](toast.md)：用于反馈操作结果，支持说明与操作插槽，由调用方管理显示状态。
