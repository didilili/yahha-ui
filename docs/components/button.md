<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Button 按钮

用于触发操作，支持不同强调程度、禁用、加载和切换状态。

[安装与接入](../../README.md#安装与接入) · [接入示例](../guides/examples.md)

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

点击按钮更新问候次数。

[查看示例文件](../../playground/src/examples/foundations/ButtonBasic.tsx)

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

用相同文案对比主要、次要和文字按钮。

[查看示例文件](../../playground/src/examples/foundations/ButtonVariants.tsx)

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

<a id="button-appearance"></a>

### 常规与软团外观

保持文案、尺寸和强调程度一致，只比较 appearance。

[查看示例文件](../../playground/src/examples/foundations/ButtonAppearance.tsx)

<!-- example-source: playground/src/examples/foundations/ButtonAppearance.tsx -->

```tsx
import { Button } from 'yahha-ui';

export default function ButtonAppearance() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
      {(['default', 'soft'] as const).map((appearance) => (
        <div key={appearance} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>{appearance === 'default' ? '常规（默认）' : '软团'}</span>
          <Button appearance={appearance}>打个招呼</Button>
        </div>
      ))}
    </div>
  );
}
```

<a id="button-sizes"></a>

### 尺寸

用相同文案对比三档尺寸，默认使用中号。

[查看示例文件](../../playground/src/examples/foundations/ButtonSizes.tsx)

<!-- example-source: playground/src/examples/foundations/ButtonSizes.tsx -->

```tsx
import { Button } from 'yahha-ui';

export default function ButtonSizes() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
      {(
        [
          ['sm', '小号'],
          ['md', '中号（默认）'],
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
  );
}
```

<a id="button-icons"></a>

### 前后图标

在文字前后放置装饰图标，操作名称保持可见。

[查看示例文件](../../playground/src/examples/foundations/ButtonIcons.tsx)

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

<a id="button-layout"></a>

### 全宽与长文案

在同一窄栏中观察全宽布局和长文案换行。

[查看示例文件](../../playground/src/examples/foundations/ButtonLayout.tsx)

<!-- example-source: playground/src/examples/foundations/ButtonLayout.tsx -->

```tsx
import { ArrowRightIcon, Button, PlusIcon } from 'yahha-ui';

export default function ButtonLayout() {
  return (
    <div style={{ display: 'grid', gap: 16, width: 'min(100%, 240px)' }}>
      <Button style={{ width: '100%' }}>保存草稿</Button>
      <Button
        variant="secondary"
        startIcon={<PlusIcon />}
        endIcon={<ArrowRightIcon />}
        style={{ width: '100%' }}
      >
        将这篇周末散步记录加入稍后阅读
      </Button>
    </div>
  );
}
```

<a id="button-destructive"></a>

### 危险操作

用相同动作对比三种强调程度的危险按钮。

[查看示例文件](../../playground/src/examples/foundations/ButtonDestructive.tsx)

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

<a id="button-states"></a>

### 禁用与加载

对比禁用和加载状态；加载图形保留按钮名称。

[查看示例文件](../../playground/src/examples/foundations/ButtonStates.tsx)

<!-- example-source: playground/src/examples/foundations/ButtonStates.tsx -->

```tsx
import { Button } from 'yahha-ui';

export default function ButtonStates() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <span>禁用</span>
        <Button disabled>保存草稿</Button>
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <span>加载</span>
        <Button loading>保存草稿</Button>
      </div>
    </div>
  );
}
```

<a id="button-decorations"></a>

### 加载图形

对比默认三墨点与可选小花饼，两种图形均通过 loading 显示。

[查看示例文件](../../playground/src/examples/foundations/ButtonLoadingVariants.tsx)

<!-- example-source: playground/src/examples/foundations/ButtonLoadingVariants.tsx -->

```tsx
import { Button } from 'yahha-ui';

export default function ButtonLoadingVariants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <span>三墨点（默认）</span>
        <Button loading>保存草稿</Button>
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <span>小花饼</span>
        <Button loading loadingVariant="biscuit">
          保存草稿
        </Button>
      </div>
    </div>
  );
}
```

<a id="button-toggle"></a>

### 切换按钮

点击切换收藏状态，通过 aria-pressed 表达是否选中。

[查看示例文件](../../playground/src/examples/foundations/ButtonToggle.tsx)

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

<a id="button-form"></a>

### 原生表单提交与重置

用 type="submit" 触发表单提交，用 type="reset" 恢复输入并清理本例结果。

[查看示例文件](../../playground/src/examples/foundations/ButtonForm.tsx)

<!-- example-source: playground/src/examples/foundations/ButtonForm.tsx -->

```tsx
import { useState } from 'react';
import { Button, Text, Input } from 'yahha-ui';

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
      <Input label="怎么称呼你" name="nickname" required autoComplete="nickname" />
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

<a id="button-async"></a>

### 异步加载与重试

模拟首次保存失败与重试成功；状态仅保留在当前示例。

[查看示例文件](../../playground/src/examples/foundations/ButtonAsync.tsx)

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

<a id="recipes"></a>

## 相关组合

- [删除确认与恢复](../recipes/interactions.md#button-delete-draft)

<a id="form-integration"></a>

## 与 Form 配合

在 Form 中使用 `type="submit"` 提交或 `type="reset"` 重置。将 `form.isSubmitting` 传给 loading 呈现提交状态，见 [异步提交与字段错误](form.md#form-submission)。

<a id="design"></a>

## 布局与定制

同一操作区域优先保留一个主要动作，例如“保存草稿”，使用 `primary`； “取消修改”等配合动作使用 `secondary`，低强调的辅助动作使用 `ghost`。这里的 `ghost` 表示文字按钮，不等同于透明描边按钮。

不传 `appearance` 时使用常规外观。`appearance="soft"` 增加饱满轮廓、短高光和按压层次，可与三种强调程度组合。`startIcon` 和 `endIcon` 用于补充动作含义，例如用书签表示收藏；操作名称和结果文字始终保留。

加载默认使用三墨点，设置 `loadingVariant="biscuit"` 可选择小花饼，与 `appearance` 独立。两种加载图形与前置图标使用相同的 16 / 18 / 20px 图框，与文字间隔 8px，两侧内边距保持不变。 已有 `startIcon` 时，加载图形替换原图标槽位，按钮宽度保持稳定；纯文字按钮加载时增加图标槽位和间距，宽度自然增长。

删除等破坏性动作可设置 `destructive`，并用动作名称明确风险；它与`variant` 分开控制，不自动打开确认弹窗或执行删除。危险色使用既有错误语义色，[ThemeProvider](theme.md) 的 `tokens.error`也会影响危险按钮。

全宽按钮可设置 `style={{ width: '100%' }}`，长名称会换行并撑高按钮。 具体写法见上方[全宽与长文案](button.md#button-layout)。

多个按钮之间的间距和换行放在外层容器中设置，例如 `style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}`。 主次操作的可运行写法见[提交与重置](button.md#button-form)。 需要统一配色时，使用 [ThemeProvider](theme.md) 的主题配置。

<a id="api"></a>

## API

### ButtonProps

| 属性                  | 说明                                                                                     | 类型                                      | 默认值      |
| --------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------- | ----------- |
| `destructive`         | 用危险色表达删除等破坏性动作，与 variant 分开控制；不自动确认或执行删除。                | `boolean`                                 | `false`     |
| `variant`             | 主要、次要或文字按钮。                                                                   | `'primary' \| 'secondary' \| 'ghost'`     | `'primary'` |
| `appearance`          | 常规外观或软团外观，与 variant 的强调程度分开控制。                                      | `'default' \| 'soft'`                     | `'default'` |
| `size`                | 最小高度依次为 36、44、52px；IconButton 对应为方形点击区域。                             | `'sm' \| 'md' \| 'lg'`                    | `'md'`      |
| `loading`             | 显示加载图标并禁用按钮，设置 aria-busy。请求与完成状态由调用方管理。                     | `boolean`                                 | `false`     |
| `loadingVariant`      | 加载图形，默认三墨点；biscuit 显式选择小花饼，与 appearance 分开控制。                   | `'dots' \| 'biscuit'`                     | `'dots'`    |
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

disabled 或 loading 为真时都会设置原生 disabled，按钮不可聚焦、不可激活。loading 显示所选加载图形、保留文案并设置 aria-busy；请求执行、加载结束和成功或失败提示由调用方处理，结果应在按钮之外清楚呈现。 系统启用减少动效时，按压位移和加载动画停止。

按钮进入原生禁用状态后，键盘焦点可能离开按钮；加载结束不会自动恢复焦点。 应由调用方按任务安排去向，例如失败后聚焦需要修正的字段，或在原操作仍需继续时返回按钮。 如果用户已转到其他位置，不要抢回焦点。结果文字应保留一份可访问的状态播报。

需要编辑内容、失败后保留草稿、重试并在关闭后返回操作入口时，参考 [文章编辑与保存组合](../README.md#站内指南)。`loading` 只控制当前按钮的等待状态，请求清理与防止重复保存仍由业务处理。

<a id="related"></a>

## 相关组件

- [IconButton 图标按钮](icon-button.md)：用于仅以图标呈现的操作，提供方形点击区域，并要求明确的可访问名称。
- [Link 链接](link.md)：用于页面导航和资源跳转，保留原生链接行为、下划线与焦点样式。
