<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Alert 提示条

用于页面内持续显示的信息、结果、警告或错误提示。

[安装与接入](../../README.md#安装与接入) · [接入示例](../guides/examples.md)

```tsx
import { Alert } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于页面内持续可见的信息、使用限制或失败说明，提示随文档布局显示。

<a id="examples"></a>

## 代码演示

<a id="alert-tones"></a>

### 四种说明类型

对比信息、成功、警告和错误四种静态说明。

[查看示例文件](../../playground/src/examples/content/AlertExample.tsx)

<!-- example-source: playground/src/examples/content/AlertExample.tsx -->

```tsx
import { Alert, Text } from 'yahha-ui';

const notices = [
  { tone: 'info', title: '阅读提示', description: '这篇文章包含个人生活记录。' },
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

<a id="alert-recovery"></a>

### 带恢复操作的错误提示

点击恢复按钮切换为成功提示；此处只演示本地状态，不发起请求。

[查看示例文件](../../playground/src/examples/content/AlertRecovery.tsx)

<!-- example-source: playground/src/examples/content/AlertRecovery.tsx -->

```tsx
import { useState } from 'react';
import { Alert, Button } from 'yahha-ui';

export default function AlertRecovery() {
  const [recovered, setRecovered] = useState(false);

  return (
    <Alert
      tone={recovered ? 'success' : 'error'}
      title={recovered ? '手记已重新载入' : '手记暂时无法载入'}
      role="status"
    >
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <p style={{ margin: 0 }}>
          {recovered
            ? '《周末散步》回来了。小八在页角画的面包，一个也没少。'
            : '《周末散步》的内容仍然保留，可以重新载入。'}
        </p>
        <Button variant="secondary" onClick={() => setRecovered(!recovered)}>
          {recovered ? '再次显示错误' : '重新载入手记'}
        </Button>
      </div>
    </Alert>
  );
}
```

<a id="alert-reading-notice"></a>

### 隐藏与恢复提示

收起提示后，可从保留的外部入口再次展开。

[查看示例文件](../../playground/src/examples/content/AlertReadingNotice.tsx)

<!-- example-source: playground/src/examples/content/AlertReadingNotice.tsx -->

```tsx
import { useId, useRef, useState } from 'react';
import { Alert, Button, Heading, Text } from 'yahha-ui';

export default function AlertReadingNotice() {
  const [visible, setVisible] = useState(true);
  const id = useId();
  const headingId = `${id}-heading`;
  const toggleId = `${id}-toggle`;
  const noticeId = `${id}-notice`;
  const toggle = useRef<HTMLButtonElement>(null);
  const notice = useRef<HTMLDivElement>(null);

  function changeVisibility(next: boolean) {
    const focusInside = notice.current?.contains(document.activeElement) ?? false;
    setVisible(next);
    if (!next && focusInside) toggle.current?.focus();
  }

  return (
    <article
      aria-labelledby={headingId}
      style={{ display: 'grid', gap: 16, maxWidth: 540, minWidth: 0 }}
    >
      <header style={{ display: 'grid', gap: 8 }}>
        <Heading level={3} id={headingId}>
          那天沿着河岸，慢慢走回家
        </Heading>
        <Text size="sm" tone="muted">
          <time dateTime="2022-04-16">2022年4月16日</time>
        </Text>
      </header>
      <Button
        ref={toggle}
        id={toggleId}
        variant="secondary"
        aria-expanded={visible}
        aria-controls={noticeId}
        style={{ justifySelf: 'start' }}
        onClick={() => changeVisibility(!visible)}
      >
        阅读提醒
      </Button>
      <Alert
        ref={notice}
        id={noticeId}
        tone="warning"
        title="读旧手记前，先看一眼"
        aria-labelledby={toggleId}
        hidden={!visible}
      >
        <div style={{ display: 'grid', gap: 12, minWidth: 0 }}>
          <p style={{ margin: 0 }}>
            这篇手记记录的是2022年的一次散步，沿途店铺信息可能变化，出发前请再确认。
          </p>
          <div>
            <Button variant="ghost" onClick={() => changeVisibility(false)}>
              隐藏阅读提醒
            </Button>
          </div>
        </div>
      </Alert>
      <Text>那天下午，我们沿着河岸走了一段。朋友在桥边停下来，给鞋带重新打了一个结。</Text>
      <Text>回家时天还亮着。口袋里除了路线图，还多出一张面包店的小票。</Text>
    </article>
  );
}
```

<a id="design"></a>

## 提示内容与恢复操作

保存失败时说明原因，并提供重试或修改入口。保留用户已填写或选择的内容；等待状态和结束后的焦点由调用方管理。完整流程见 [订阅偏好保存失败与重试](../recipes/interactions.md#alert-action)。

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

提示出现时不会主动移动焦点，也没有内置关闭按钮。阅读提醒例由页面维护显示状态；仅隐藏包含当前焦点的提示时，回到持续存在的“阅读提醒”按钮。恢复时保留触发按钮焦点。

<a id="related"></a>

## 相关组件

- [Toast 提示消息](toast.md)：用于反馈操作结果，支持说明与操作插槽，由调用方管理显示状态。
- [EmptyState 空状态](empty-state.md)：用于列表为空、搜索无结果等情况，提供说明与操作插槽。
