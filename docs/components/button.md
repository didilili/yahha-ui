<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Button 按钮

用于触发操作，支持不同强调程度、禁用、加载和切换状态。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Button } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

主要操作使用 primary，次要操作使用 secondary，低强调辅助操作使用 ghost（文字）。页面跳转使用 [Link](link.md)，纯图标使用 [IconButton](icon-button.md)。

<a id="examples"></a>

## 代码演示

<a id="button-basic"></a>

### 基础用法

点击按钮更新相邻文字中的问候次数。

[查看示例文件](../../playground/src/examples/foundations/ButtonBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/ButtonBasic.tsx -->

```tsx
import { useState } from 'react';
import { Button, Text } from 'yahha-ui';

export default function ButtonBasic() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
      <Button onClick={() => setCount((value) => value + 1)}>打个招呼</Button>
      <Text size="sm" tone="muted" role="status">
        已收到 {count} 次问候
      </Text>
    </div>
  );
}
```

<a id="button-variants"></a>

### 强调程度

三种强调程度的静态外观对照。

[查看示例文件](../../playground/src/examples/foundations/ButtonVariants.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/ButtonVariants.tsx -->

```tsx
import { Button } from 'yahha-ui';

export default function ButtonVariants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
        <div key={variant} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>{variant === 'primary' ? '主要' : variant === 'secondary' ? '次要' : '文字'}</span>
          <Button variant={variant}>保存草稿</Button>
        </div>
      ))}
    </div>
  );
}
```

<a id="button-destructive"></a>

### 危险操作

三种强调程度的危险按钮静态对照。

[查看示例文件](../../playground/src/examples/foundations/ButtonDestructive.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/ButtonDestructive.tsx -->

```tsx
import { Button } from 'yahha-ui';

export default function ButtonDestructive() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
        <div key={variant} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>{variant === 'primary' ? '主要' : variant === 'secondary' ? '次要' : '文字'}</span>
          <Button variant={variant} destructive>
            删除草稿
          </Button>
        </div>
      ))}
    </div>
  );
}
```

<a id="button-sizes"></a>

### 尺寸、全宽与长文案

三档尺寸、全宽与窄栏长文案的静态对照，长文案可自然换行。

[查看示例文件](../../playground/src/examples/foundations/ButtonSizes.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/ButtonSizes.tsx -->

```tsx
import { Button } from 'yahha-ui';

export default function ButtonSizes() {
  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
        {(
          [
            ['sm', '小号'],
            ['md', '中号'],
            ['lg', '大号'],
          ] as const
        ).map(([size, label]) => (
          <div key={size} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
            <span>
              {label} {size}
            </span>
            <Button size={size}>保存草稿</Button>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 12, width: 'min(100%, 240px)' }}>
        <span>全宽与长文案换行 · 240px 窄栏</span>
        <Button
          variant="secondary"
          startIcon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          }
          endIcon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          style={{ width: '100%' }}
        >
          将这篇周末散步记录加入稍后阅读
        </Button>
      </div>
    </div>
  );
}
```

<a id="button-icons"></a>

### 前后图标

前置与后置装饰图标的静态对照。

[查看示例文件](../../playground/src/examples/foundations/ButtonIcons.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/ButtonIcons.tsx -->

```tsx
import { Button } from 'yahha-ui';

export default function ButtonIcons() {
  const icon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>前置图标</span>
          <Button startIcon={icon}>添加收藏</Button>
        </div>
        <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>后置图标</span>
          <Button endIcon={icon}>添加收藏</Button>
        </div>
      </div>
    </div>
  );
}
```

<a id="button-states"></a>

### 禁用与加载

对比禁用与加载状态，加载时保留按钮名称。

[查看示例文件](../../playground/src/examples/foundations/ButtonStates.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/ButtonStates.tsx -->

```tsx
import { Button } from 'yahha-ui';

export default function ButtonStates() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
      <Button disabled>保存草稿</Button>
      <Button loading>保存草稿</Button>
    </div>
  );
}
```

<a id="button-toggle"></a>

### 切换按钮

点击按钮切换收藏状态，通过 aria-pressed 表达是否选中。

[查看示例文件](../../playground/src/examples/foundations/ButtonToggle.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/ButtonToggle.tsx -->

```tsx
import { useState } from 'react';
import { Button, Text } from 'yahha-ui';

export default function ButtonToggle() {
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
      <Button
        variant="secondary"
        aria-pressed={saved}
        startIcon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M8 3.25h6.2l4.05 4.1v12.7c0 .6-.5.88-1 .57L12 17.4l-5.3 3.22c-.5.31-.95.02-.95-.57V5.6C5.75 4.15 6.5 3.25 8 3.25Z"
              fill={saved ? 'currentColor' : 'none'}
              fillOpacity="0.2"
            />
            <path d="M14.2 3.5v3c0 .6.35.95.95.95h2.8" fill="none" />
          </svg>
        }
        onClick={() => setSaved((value) => !value)}
      >
        收藏文章
      </Button>
      <Text size="sm" tone="muted" role="status">
        {saved ? '已加入收藏' : '尚未收藏'}
      </Text>
    </div>
  );
}
```

<a id="integration"></a>

## 进阶用法

<a id="button-async"></a>

### 异步加载与重试

模拟首次保存失败与重试成功；状态仅保留在当前示例。

[查看示例文件](../../playground/src/examples/foundations/ButtonAsync.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/ButtonAsync.tsx -->

```tsx
import { useEffect, useId, useState } from 'react';
import { Button, Text } from 'yahha-ui';

export default function ButtonAsync() {
  const statusId = useId();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [attempt, setAttempt] = useState(0);
  const loading = status === 'loading';

  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setStatus(attempt === 1 ? 'error' : 'success'), 700);
    return () => window.clearTimeout(timer);
  }, [loading, attempt]);

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 12 }}>
      <Button
        loading={loading}
        aria-describedby={statusId}
        startIcon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 3h12l3 3v15H4V3h1Z" strokeLinejoin="round" />
            <path d="M8 3v6h8V3M8 21v-8h8v8" strokeLinejoin="round" />
          </svg>
        }
        onClick={() => {
          setAttempt((value) => value + 1);
          setStatus('loading');
        }}
      >
        保存草稿
      </Button>
      <Text id={statusId} size="sm" tone="muted" role="status">
        {loading
          ? '正在保存…'
          : status === 'error'
            ? '模拟保存失败，请重试。'
            : status === 'success'
              ? '草稿已保存'
              : '尚未保存'}
      </Text>
    </div>
  );
}
```

<a id="button-delete-draft"></a>

### 删除确认与恢复

确认后删除本地草稿，取消时保留，删除后可恢复。

[查看示例文件](../../playground/src/examples/foundations/ButtonDeleteDraft.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/ButtonDeleteDraft.tsx -->

```tsx
import { useId, useRef, useState } from 'react';
import { Button, Dialog, EmptyState, Heading, Text } from 'yahha-ui';

export default function ButtonDeleteDraft() {
  const [hasDraft, setHasDraft] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const draftTitleId = useId();
  const actionRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 520 }}>
      {hasDraft ? (
        <section aria-labelledby={draftTitleId} style={{ display: 'grid', gap: 8 }}>
          <Heading level={3} id={draftTitleId}>
            周末散步记录
          </Heading>
          <Text>沿河走了一小段，记下树影和路边新开的花。</Text>
        </section>
      ) : (
        <EmptyState title="草稿已删除" description="这份散步记录仍可通过下方按钮恢复。" />
      )}
      <div>
        <Button
          ref={actionRef}
          variant="secondary"
          destructive={hasDraft}
          onClick={() => {
            if (hasDraft) {
              setOpen(true);
              return;
            }
            setHasDraft(true);
            setMessage('草稿已恢复。');
          }}
        >
          {hasDraft ? '删除草稿' : '恢复草稿'}
        </Button>
      </div>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="删除这份草稿？"
        description="将移除当前演示中的「周末散步记录」，删除后仍可恢复。"
        initialFocus={cancelRef}
        finalFocus={actionRef}
        footer={
          <>
            <Button ref={cancelRef} variant="secondary" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button
              destructive
              onClick={() => {
                setHasDraft(false);
                setOpen(false);
                setMessage('草稿已删除，可通过“恢复草稿”按钮恢复。');
              }}
            >
              确认删除
            </Button>
          </>
        }
      />
      <Text size="sm" tone="muted" role="status">
        {message}
      </Text>
    </div>
  );
}
```

<a id="button-form"></a>

### 提交与重置

填写称呼后提交，或重置输入与结果；不发送请求。

[查看示例文件](../../playground/src/examples/foundations/ButtonForm.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/ButtonForm.tsx -->

```tsx
import { useState } from 'react';
import { Button, Text, TextField } from 'yahha-ui';

export default function ButtonForm() {
  const [message, setMessage] = useState('尚未提交');

  return (
    <form
      style={{ display: 'grid', justifyItems: 'start', gap: 16, maxWidth: 400 }}
      onInput={() => setMessage('尚未提交')}
      onReset={() => setMessage('尚未提交')}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setMessage(`你好，${String(data.get('nickname'))}！`);
      }}
    >
      <TextField label="怎么称呼你" name="nickname" required autoComplete="nickname" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="submit">提交表单</Button>
        <Button type="reset" variant="secondary">
          重置
        </Button>
      </div>
      <Text size="sm" tone="muted" role="status">
        {message}
      </Text>
    </form>
  );
}
```

<a id="design"></a>

## 布局与定制

`ghost` 在本库表示文字按钮，不是透明描边按钮。 删除等破坏性动作可设置 `destructive`，并用动作名称明确风险；它与`variant` 分开控制，不自动打开确认弹窗或执行删除。危险色使用既有错误语义色，[ThemeProvider](theme.md) 的 `tokens.error`也会影响危险按钮。

全宽按钮可设置 `style={{ width: '100%' }}`，长名称会换行并撑高按钮。 具体写法见上方[尺寸、全宽与长文案](button.md#button-sizes)。

多个按钮之间的间距和换行放在外层容器中设置，例如 `style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}`。 主次操作的可运行写法见[提交与重置](button.md#button-form)。 需要统一配色时，使用 [ThemeProvider](theme.md) 的主题配置。

<a id="api"></a>

## API

### ButtonProps

| 属性                  | 说明                                                                                     | 类型                                      | 默认值      |
| --------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------- | ----------- |
| `destructive`         | 用危险色表达删除等破坏性动作，与 variant 分开控制；不自动确认或执行删除。                | `boolean`                                 | `false`     |
| `variant`             | 主要、次要或文字按钮。                                                                   | `'primary' \| 'secondary' \| 'ghost'`     | `'primary'` |
| `size`                | 最小高度依次为 36、44、52px；IconButton 对应为方形点击区域。                             | `'sm' \| 'md' \| 'lg'`                    | `'md'`      |
| `loading`             | 显示加载图标并禁用按钮，设置 aria-busy。请求与完成状态由调用方管理。                     | `boolean`                                 | `false`     |
| `startIcon / endIcon` | 装饰内容。加载时 spinner 替换 startIcon，endIcon 与 children 仍保留。                    | `ReactNode`                               | —           |
| `children`            | 按钮内容。普通 Button 应包含可读的操作名称。                                             | `ReactNode`                               | —           |
| `type`                | 原生按钮类型。提交表单时显式传入 submit。                                                | `'button' \| 'submit' \| 'reset'`         | `'button'`  |
| `disabled`            | 禁用按钮。loading 为 true 时也会禁用，不可通过 disabled={false} 覆盖。                   | `boolean`                                 | `false`     |
| `onClick`             | 原生点击事件；键盘 Enter / Space 激活同样触发。                                          | `MouseEventHandler<HTMLButtonElement>`    | —           |
| `aria-pressed`        | 用于切换按钮，状态由调用方维护。true 时提供选中视觉。                                    | `boolean \| 'true' \| 'false' \| 'mixed'` | —           |
| `className / style`   | 作用于根 button，可局部定制尺寸与布局。                                                  | `string / CSSProperties`                  | —           |
| `ref`                 | 指向原生 button，可用于聚焦。                                                            | `Ref<HTMLButtonElement>`                  | —           |
| `其余原生属性`        | 支持 name、value、form、title、aria-\*、data-\* 等 button 属性，不支持 href 或 asChild。 | `ComponentPropsWithRef<'button'>`         | —           |

<a id="accessibility"></a>

## 可访问性与键盘

按 Tab 聚焦，Enter / Space 激活。切换操作用 aria-pressed 表达状态，并保持操作名称稳定， 例如用“收藏文章”同时表示收藏和取消收藏。

disabled 或 loading 为真时都会设置原生 disabled，按钮不可聚焦、不可激活。loading 保留文案并设置 aria-busy；请求执行、加载结束和成功或失败提示由调用方处理，结果应在按钮之外清楚呈现。 系统启用减少动效时，按压位移和加载动画停止。

按钮进入原生禁用状态后，键盘焦点可能离开按钮；加载结束不会自动恢复焦点。 应由调用方按任务安排去向，例如失败后聚焦需要修正的字段，或在原操作仍需继续时返回按钮。 如果用户已转到其他位置，不要抢回焦点。结果文字应保留一份可访问的状态播报。

需要编辑内容、失败后保留草稿、重试并在关闭后返回操作入口时，参考 [文章编辑与保存组合](../README.md#站内指南)。`loading` 只控制当前按钮的等待状态，请求清理与防止重复保存仍由业务处理。

<a id="related"></a>

## 相关组件

- [IconButton 图标按钮](icon-button.md)：用于仅以图标呈现的操作，提供方形点击区域，并要求明确的可访问名称。
- [Link 链接](link.md)：用于页面导航和资源跳转，保留原生链接行为、下划线与焦点样式。
