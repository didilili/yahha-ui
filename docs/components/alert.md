<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Alert 提示条

持续展示阅读说明、完成结果或需要处理的问题。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Alert } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于页面内持续可见的提示、限制或需要恢复操作的失败说明。Alert 跟随文档布局，适合让用户阅读原因后继续处理。

<a id="examples"></a>

## 代码演示

<a id="alert-tones"></a>

### 四种说明类型

对比信息、成功、警告和错误四种静态说明。

[查看示例文件](../../playground/src/examples/content/AlertExample.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/AlertExample.tsx -->

```tsx
import { Alert, Text } from 'yahha-ui';

const notices = [
  { tone: 'info', title: '阅读提示', description: '这篇文章包含一些个人记录，可以慢慢读。' },
  { tone: 'success', title: '草稿已保存', description: '下次打开时可以继续编辑。' },
  { tone: 'warning', title: '还有一项没有填写', description: '补充联系邮箱后再提交。' },
  { tone: 'error', title: '发送失败', description: '内容仍保留在输入框中，请稍后重试。' },
] as const;

export default function AlertExample() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {notices.map(({ tone, title, description }) => (
        <div key={tone} style={{ display: 'grid', gap: 8 }}>
          <Text size="sm" tone="muted">
            {tone === 'info'
              ? '信息'
              : tone === 'success'
                ? '成功'
                : tone === 'warning'
                  ? '警告'
                  : '错误'}
            {tone === 'info' ? '（默认）' : ''}
          </Text>
          <Alert tone={tone} title={title}>
            {description}
          </Alert>
        </div>
      ))}
    </div>
  );
}
```

<a id="alert-action"></a>

### 与操作组合

首次模拟保存失败，重试成功；只更新本例状态，不实际订阅。

[查看示例文件](../../playground/src/examples/content/AlertAction.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/AlertAction.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Checkbox, Text } from 'yahha-ui';

export default function AlertAction() {
  const [phase, setPhase] = useState<'idle' | 'pending' | 'error' | 'success'>('idle');
  const [subscribed, setSubscribed] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const action = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);

  useEffect(() => {
    if (phase !== 'pending') return;
    // 首次模拟失败，重试成功；实际项目应根据请求结果更新状态。
    const timer = window.setTimeout(() => setPhase(attempt === 1 ? 'error' : 'success'), 700);
    return () => window.clearTimeout(timer);
  }, [phase, attempt]);

  useEffect(() => {
    if (phase === 'pending' || !returnFocus.current) return;
    returnFocus.current = false;
    if (document.activeElement === document.body || document.activeElement === action.current) {
      action.current?.focus();
    }
  }, [phase]);

  const pending = phase === 'pending';
  const successful = phase === 'success';
  const retrying = attempt > 1 || phase === 'error';

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Alert
        tone={phase === 'error' ? 'error' : successful ? 'success' : 'info'}
        title={
          phase === 'error'
            ? '订阅偏好保存失败'
            : successful
              ? '订阅偏好已保存'
              : pending
                ? '正在保存订阅偏好'
                : '订阅每周阅读推荐'
        }
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <Text size="sm">
            {phase === 'error'
              ? '选择仍然保留在这里。可以重试，也可以先调整偏好。'
              : successful
                ? subscribed
                  ? '已在本页记录为接收每周阅读推荐。'
                  : '已在本页记录为不接收每周阅读推荐。'
                : '由你决定是否接收每周整理的文章与书单。'}
          </Text>
          <Checkbox
            label="接收每周阅读推荐"
            checked={subscribed}
            disabled={pending || successful}
            onChange={(event) => setSubscribed(event.target.checked)}
          />
          <div>
            <Button
              ref={action}
              variant="secondary"
              loading={pending}
              onClick={() => {
                if (successful) {
                  setPhase('idle');
                  setAttempt(0);
                } else {
                  returnFocus.current = document.activeElement === action.current;
                  setAttempt((value) => value + 1);
                  setPhase('pending');
                }
              }}
            >
              {successful ? '修改偏好' : retrying ? '重试保存' : '保存订阅偏好'}
            </Button>
          </div>
        </div>
      </Alert>
      <Text role="status" size="sm" tone="muted">
        {phase === 'error'
          ? '保存失败，选择已保留。'
          : successful
            ? '订阅偏好已更新。'
            : pending
              ? '正在保存…'
              : '尚未保存。'}
      </Text>
    </div>
  );
}
```

<a id="design"></a>

## 提示内容与恢复操作

保存失败时说明原因，并提供重试或修改入口。保留用户已填写或选择的内容；等待状态和结束后的焦点由调用方管理。

<a id="api"></a>

## API

### AlertProps

| 属性                  | 说明                                                                | 类型                                          | 默认值   |
| --------------------- | ------------------------------------------------------------------- | --------------------------------------------- | -------- |
| `tone`                | 说明类型，决定图标与背景颜色。                                      | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` |
| `title`               | 可选标题，渲染为 p，不是原生 title 属性。                           | `ReactNode`                                   | —        |
| `children`            | 内容，可组合正文、链接或按钮。                                      | `ReactNode`                                   | —        |
| `role`                | 静态说明默认 note；紧急动态结果可显式使用 alert。                   | `AriaRole`                                    | `'note'` |
| `className / style`   | 作用于根 div 元素。                                                 | `string / CSSProperties`                      | —        |
| `ref`                 | 指向真实 div 元素。                                                 | `ComponentPropsWithRef<'div'>['ref']`         | —        |
| `其他原生属性 / 事件` | 支持 div 事件、aria-\*、data-\* 等属性；原生 title 由组件标题替代。 | `Omit<ComponentPropsWithRef<'div'>, 'title'>` | —        |

<a id="behavior"></a>

## 静态说明与动态播报

默认 role="note"，tone 只改变说明类型，不会自动启动播报。紧急动态结果可显式使用 role="alert"；一般状态更新可由外层 status 或 aria-live 说明，同一结果避免多处重复播报。

提示出现时不会主动移动焦点，也没有内置关闭按钮。需要允许关闭时，由页面提供按钮并更新显示状态；关闭包含操作的提示后，应把其中的焦点移到仍然存在的合理位置。

<a id="related"></a>

## 相关组件

- [Toast 提示消息](toast.md)：在页面中反馈保存、完成或失败等操作结果，支持说明与补充操作。
- [EmptyState 空状态](empty-state.md)：当列表或搜索没有内容时，解释原因，并给出合适的下一步。
