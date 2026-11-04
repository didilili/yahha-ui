<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Button 按钮

用于提交、保存和收藏等操作，提供三种强调程度，支持禁用与加载状态。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Button } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于触发动作，例如提交表单、保存草稿和切换收藏。页面或地址跳转使用 [Link](link.md)；只有图标的操作使用 [IconButton](icon-button.md)。

<a id="examples"></a>

## 代码演示

<a id="button-basic"></a>

### 基础用法

点击按钮，更新相邻文字中的问候次数。

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

### 禁用与异步加载

模拟保存：无图标示例保存成功，带图标示例首次失败，可再次点击重试；不发送请求。

[查看示例文件](../../playground/src/examples/foundations/ButtonStates.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/ButtonStates.tsx -->

```tsx
import { useEffect, useId, useState } from 'react';
import { Button, Text } from 'yahha-ui';

function AsyncAction({ withIcon = false }: { withIcon?: boolean }) {
  const statusId = useId();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [attempt, setAttempt] = useState(0);
  const loading = status === 'loading';

  useEffect(() => {
    if (!loading) return;
    // 模拟保存：带图标的例子首次失败，重试成功；实际项目按请求结果更新状态。
    const timer = window.setTimeout(() => {
      setStatus(withIcon && attempt === 1 ? 'error' : 'success');
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [loading, withIcon, attempt]);

  return (
    <div
      role="group"
      aria-label={withIcon ? '带前图标的异步加载' : '无前图标的异步加载'}
      style={{ display: 'grid', justifyItems: 'start', gap: 8 }}
    >
      <span>{withIcon ? '带前置图标 · 首次失败后重试' : '不带图标 · 保存成功'}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
        <Button
          loading={loading}
          aria-describedby={statusId}
          startIcon={
            withIcon ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 3h12l3 3v15H4V3h1Z" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M8 3v6h8V3M8 21v-8h8v8" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            ) : undefined
          }
          onClick={() => {
            setAttempt((value) => value + 1);
            setStatus('loading');
          }}
        >
          保存草稿
        </Button>
        <Text id={statusId} size="sm" tone="muted" role="status">
          {status === 'loading'
            ? '正在保存…'
            : status === 'success'
              ? '草稿已保存'
              : status === 'error'
                ? '模拟保存失败，请再次点击“保存草稿”重试。'
                : '尚未保存'}
        </Text>
      </div>
    </div>
  );
}

export default function ButtonStates() {
  const disabledReasonId = useId();

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
          <div key={variant} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
            <span>
              {variant === 'primary' ? '主要' : variant === 'secondary' ? '次要' : '文字'} · 禁用
            </span>
            <Button variant={variant} disabled aria-describedby={disabledReasonId}>
              保存草稿
            </Button>
          </div>
        ))}
      </div>
      <Text id={disabledReasonId} size="sm" tone="muted">
        请先选择一篇手记，再保存草稿。上方为静态禁用对照。
      </Text>
      <AsyncAction />
      <AsyncAction withIcon />
    </div>
  );
}
```

<a id="button-toggle"></a>

### 切换状态

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
            fill={saved ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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

同一操作区域优先保留一个主要动作，例如“保存草稿”；“取消修改”等配合动作使用次要按钮， 低强调的辅助动作使用文字按钮。这里的 `ghost` 表示文字按钮， 不等同于其他组件库的透明描边按钮。

全宽按钮可设置 `style={{ width: '100%' }}`，长名称会换行并撑高按钮。 具体写法见上方[尺寸、全宽与长文案](button.md#button-sizes)。

多个按钮之间的间距和换行放在外层容器中设置，例如 `style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}`。 主次操作的可运行写法见[提交与重置](button.md#button-form)。 需要统一配色时，使用 [ThemeProvider](theme.md) 的主题配置。

<a id="api"></a>

## API

### ButtonProps

| 属性                  | 说明                                                                                     | 类型                                      | 默认值      |
| --------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------- | ----------- |
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

- [IconButton 图标按钮](icon-button.md)：为关闭、收藏等仅用图标表达的操作提供方形点击区域与明确的可访问名称。
- [Link 链接](link.md)：保留原生链接行为，统一下划线与键盘焦点。
