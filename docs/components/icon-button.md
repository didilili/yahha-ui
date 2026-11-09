<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# IconButton 图标按钮

用于仅以图标呈现的操作，提供方形点击区域，并要求明确的可访问名称。

[安装与接入](../../README.md#安装与接入)

```tsx
import { IconButton } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于关闭、收藏等含义明确的图标操作。`aria-label` 为必填属性，应描述动作，例如“关闭提示”，而不是“叉号”；图标与悬停提示不能替代这个名称。

需要同时展示文字时使用 [Button](button.md)。可用 [Tooltip 组合](tooltip.md#basic) 补充文字提示，帮助用户识别图标。

<a id="examples"></a>

## 代码演示

<a id="icon-button-minimal"></a>

### 基础用法

用 aria-label 为图标操作命名，点击后更新相邻计数。

[查看示例文件](../../playground/src/examples/foundations/IconButtonMinimal.tsx)

<!-- example-source: playground/src/examples/foundations/IconButtonMinimal.tsx -->

```tsx
import { useState } from 'react';
import { IconButton, PlusIcon, Text } from 'yahha-ui';

export default function IconButtonMinimal() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <IconButton aria-label="添加一页手记" onClick={() => setCount((value) => value + 1)}>
        <PlusIcon />
      </IconButton>
      <Text size="sm" tone="muted" role="status">
        已添加 {count} 页
      </Text>
    </div>
  );
}
```

<a id="icon-button-variants"></a>

### 强调程度

对比主要、次要和低强调三种外观。

[查看示例文件](../../playground/src/examples/foundations/IconButtonVariants.tsx)

<!-- example-source: playground/src/examples/foundations/IconButtonVariants.tsx -->

```tsx
import { BookmarkIcon, IconButton } from 'yahha-ui';

export default function IconButtonVariants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
        <div key={variant} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>
            {variant === 'primary' ? '主要' : variant === 'secondary' ? '次要' : '低强调'}
          </span>
          <IconButton variant={variant} aria-label={`${variant} 变体收藏样本`}>
            <BookmarkIcon />
          </IconButton>
        </div>
      ))}
    </div>
  );
}
```

<a id="icon-button-decorations"></a>

### 常规与软团外观

保持图标、尺寸和强调程度一致，只比较 appearance。

[查看示例文件](../../playground/src/examples/foundations/IconButtonAppearance.tsx)

<!-- example-source: playground/src/examples/foundations/IconButtonAppearance.tsx -->

```tsx
import { BookmarkIcon, IconButton } from 'yahha-ui';

export default function IconButtonAppearance() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
      {(['default', 'soft'] as const).map((appearance) => (
        <div key={appearance} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>{appearance === 'default' ? '常规（默认）' : '软团'}</span>
          <IconButton aria-label="收藏文章" appearance={appearance}>
            <BookmarkIcon />
          </IconButton>
        </div>
      ))}
    </div>
  );
}
```

<a id="icon-button-sizes"></a>

### 尺寸

用相同图标对比小号、中号和大号点击区域。

[查看示例文件](../../playground/src/examples/foundations/IconButtonSizes.tsx)

<!-- example-source: playground/src/examples/foundations/IconButtonSizes.tsx -->

```tsx
import { BookmarkIcon, IconButton } from 'yahha-ui';

export default function IconButtonSizes() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
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
          <IconButton size={size} aria-label={`${size} 尺寸收藏样本`}>
            <BookmarkIcon />
          </IconButton>
        </div>
      ))}
    </div>
  );
}
```

<a id="icon-button-states"></a>

### 禁用与加载

对比禁用和两种加载图形；图形替换图标，可访问名称仍保留。

[查看示例文件](../../playground/src/examples/foundations/IconButtonStates.tsx)

<!-- example-source: playground/src/examples/foundations/IconButtonStates.tsx -->

```tsx
import { BookmarkIcon, IconButton } from 'yahha-ui';

export default function IconButtonStates() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <span>禁用</span>
        <IconButton disabled aria-label="禁用收藏样本">
          <BookmarkIcon />
        </IconButton>
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <span>加载 · 三墨点</span>
        <IconButton loading aria-label="加载收藏样本">
          <BookmarkIcon />
        </IconButton>
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <span>加载 · 小花饼</span>
        <IconButton loading loadingVariant="biscuit" aria-label="小花饼加载收藏样本">
          <BookmarkIcon />
        </IconButton>
      </div>
    </div>
  );
}
```

<a id="icon-button-toggle"></a>

### 切换按钮

点击切换收藏状态，按钮名称保持不变。

[查看示例文件](../../playground/src/examples/foundations/IconButtonToggle.tsx)

<!-- example-source: playground/src/examples/foundations/IconButtonToggle.tsx -->

```tsx
import { useState } from 'react';
import { BookmarkIcon, IconButton, Text } from 'yahha-ui';

export default function IconButtonToggle() {
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <IconButton
        variant="secondary"
        aria-label="收藏文章"
        aria-pressed={saved}
        onClick={() => setSaved((value) => !value)}
      >
        <BookmarkIcon filled={saved} />
      </IconButton>
      <Text size="sm" tone="muted" role="status">
        {saved ? '已收藏' : '尚未收藏'}
      </Text>
    </div>
  );
}
```

<a id="icon-button-loading"></a>

### 异步加载与选中

模拟更新收藏，展示等待与选中状态；不发送请求。

[查看示例文件](../../playground/src/examples/foundations/IconButtonLoading.tsx)

<!-- example-source: playground/src/examples/foundations/IconButtonLoading.tsx -->

```tsx
import { useEffect, useId, useState } from 'react';
import { IconButton, Text } from 'yahha-ui';

export default function IconButtonLoading() {
  const statusId = useId();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => {
      setLoading(false);
      setSaved((value) => !value);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconButton
          aria-label="收藏文章"
          aria-describedby={statusId}
          aria-pressed={saved}
          loading={loading}
          onClick={() => setLoading(true)}
        >
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
        </IconButton>
        <Text id={statusId} size="sm" tone="muted" role="status">
          {loading ? '正在更新收藏…' : saved ? '已收藏' : '尚未收藏'}
        </Text>
      </div>
    </div>
  );
}
```

<a id="icon-button-basic"></a>

### 关闭与重新显示

关闭提示后聚焦重新显示入口，再次显示后回到关闭按钮。

[查看示例文件](../../playground/src/examples/foundations/IconButtonBasic.tsx)

<!-- example-source: playground/src/examples/foundations/IconButtonBasic.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Button, CloseIcon, IconButton } from 'yahha-ui';

export default function IconButtonBasic() {
  const [visible, setVisible] = useState(true);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reopenRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);

  useEffect(() => {
    // 只在用户切换后移动焦点，初次展示时不抢走页面焦点。
    if (!restoreFocus.current) return;
    restoreFocus.current = false;
    (visible ? closeRef : reopenRef).current?.focus();
  }, [visible]);

  const changeVisibility = (nextVisible: boolean) => {
    restoreFocus.current = true;
    setVisible(nextVisible);
  };

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 16 }}>
      {visible ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>欢迎来到手记小站。</span>
          <IconButton
            ref={closeRef}
            aria-label="关闭提示"
            variant="ghost"
            onClick={() => changeVisibility(false)}
          >
            <CloseIcon />
          </IconButton>
        </div>
      ) : (
        <Button ref={reopenRef} variant="secondary" onClick={() => changeVisibility(true)}>
          重新显示提示
        </Button>
      )}
    </div>
  );
}
```

<a id="recipes"></a>

## 相关组合

- [收藏列表与焦点恢复](../recipes/interactions.md#icon-button-reading-list)

<a id="api"></a>

## API

### IconButtonProps

| 属性                  | 说明                                                                                     | 类型                                      | 默认值      |
| --------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------- | ----------- |
| `aria-label` **必填** | 必填的可访问名称，描述动作，例如“关闭提示”。                                             | `string`                                  | —           |
| `children`            | 图标内容。建议装饰图标设置 aria-hidden="true"，加载时由居中的加载图形替换。              | `ReactNode`                               | —           |
| `destructive`         | 用危险色表达删除等破坏性动作，与 variant 分开控制；不自动确认或执行删除。                | `boolean`                                 | `false`     |
| `variant`             | 主要、次要或低强调图标按钮。                                                             | `'primary' \| 'secondary' \| 'ghost'`     | `'primary'` |
| `appearance`          | 常规外观或软团外观，与 variant 的强调程度分开控制。                                      | `'default' \| 'soft'`                     | `'default'` |
| `size`                | 最小高度依次为 36、44、52px；IconButton 对应为方形点击区域。                             | `'sm' \| 'md' \| 'lg'`                    | `'md'`      |
| `loading`             | 显示加载图标并禁用按钮，设置 aria-busy。请求与完成状态由调用方管理。                     | `boolean`                                 | `false`     |
| `loadingVariant`      | 加载图形，默认三墨点；biscuit 显式选择小花饼，与 appearance 分开控制。                   | `'dots' \| 'biscuit'`                     | `'dots'`    |
| `type`                | 原生按钮类型。提交表单时显式传入 submit。                                                | `'button' \| 'submit' \| 'reset'`         | `'button'`  |
| `disabled`            | 禁用按钮。loading 为 true 时也会禁用，不可通过 disabled={false} 覆盖。                   | `boolean`                                 | `false`     |
| `onClick`             | 原生点击事件；键盘 Enter / Space 激活同样触发。                                          | `MouseEventHandler<HTMLButtonElement>`    | —           |
| `aria-pressed`        | 用于切换按钮，状态由调用方维护。true 时提供选中视觉。                                    | `boolean \| 'true' \| 'false' \| 'mixed'` | —           |
| `className / style`   | 作用于根 button，可局部定制尺寸与布局。                                                  | `string / CSSProperties`                  | —           |
| `ref`                 | 指向原生 button，可用于聚焦。                                                            | `Ref<HTMLButtonElement>`                  | —           |
| `其余原生属性`        | 支持 name、value、form、title、aria-\*、data-\* 等 button 属性，不支持 href 或 asChild。 | `ComponentPropsWithRef<'button'>`         | —           |

<a id="accessibility"></a>

## 可访问性与键盘

按 Tab 聚焦，Enter / Space 激活。装饰图标设置 aria-hidden="true"；收藏等切换操作通过 aria-pressed 表达状态，aria-label 保持稳定，例如始终使用“收藏文章”。

disabled 或 loading 为真时，按钮退出键盘顺序且不能激活。加载会保留可访问名称并设置 aria-busy；请求结束后，由调用方更新 loading，并提供成功或失败的提示。 系统启用减少动效时，按压位移和加载动画停止。

加载结束不会自动恢复焦点，应由调用方按任务安排。关闭提示并卸载按钮时，需把焦点移到可用入口； “关闭与重新显示”示例在切换后管理回焦，初次展示不移动焦点。

同一清单有多个收藏入口时，名称包含对应文章标题，切换前后保持不变。在收藏视图取消收藏， 且移除的按钮正持有焦点时，由使用方将焦点移到下一项、上一项或空态入口；取消收藏不等于删除文章。

<a id="styling"></a>

## 布局与定制

不传 `appearance` 时使用常规外观。`appearance="soft"` 使用软团轮廓和按压层次，功能图标保持居中。收藏等切换操作使用 `aria-pressed` 与图标填色表达当前值，`aria-label` 保持稳定的动作名称。

按钮组的间距由外层 flex / grid 容器设置；在 flex 行中，可设置 `style={{ marginInlineStart: 'auto' }}` 将按钮推到行尾。 直接传入 SVG 图标时保留 viewBox，组件会按 size 调整图框。加载默认使用三墨点，显式设置 `loadingVariant="biscuit"` 选择小花饼，与 `appearance` 独立；两种图形沿用 18 / 20 / 22px 图框并保持居中，按钮宽高不变。统一配色使用 [ThemeProvider](theme.md)。

阅读列表中的收藏使用 ghost 保持低强调，选中后沿用主题色与实心图标；不改变 44px 默认点击区域。需要标记删除等危险操作时，可使用继承自 Button 的 destructive。

<a id="related"></a>

## 相关组件

- [Button 按钮](button.md)：用于触发操作，支持不同强调程度、禁用、加载和切换状态。
- [Icon 图标](icon.md)：显示自定义 SVG 或直接使用手绘功能图标，统一尺寸、颜色和可访问名称。
- [Tooltip 文字提示](tooltip.md)：悬停或聚焦时显示简短的视觉文字提示，不替代触发器的可访问名称。
