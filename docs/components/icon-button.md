<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# IconButton 图标按钮

为关闭、收藏等仅用图标表达的操作提供方形点击区域与明确的可访问名称。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { IconButton } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于关闭、收藏等含义明确的图标操作。aria-label 为必填属性，应直接描述动作，例如“关闭提示”；图标与悬停提示不能替代这个名称。

需要同时展示文字时使用 [Button](button.md)。可用 [Tooltip](tooltip.md) 补充提示，帮助用户识别图标。

<a id="examples"></a>

## 代码演示

<a id="icon-button-basic"></a>

### 基础用法

关闭提示后，焦点移到重新显示按钮；重新显示后回到关闭按钮。回焦由示例管理，初次展示不抢焦点；图标通过 children 传入。

[查看示例文件](../../playground/src/examples/foundations/IconButtonBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/IconButtonBasic.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Button, IconButton } from 'yahha-ui';

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
          <span>点击关闭按钮可隐藏这条提示。</span>
          <IconButton
            ref={closeRef}
            aria-label="关闭提示"
            variant="ghost"
            onClick={() => changeVisibility(false)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M6 18 18 6" strokeLinecap="round" />
            </svg>
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

<a id="icon-button-sizes"></a>

### 尺寸、变体与禁用

分组比较尺寸、强调程度和禁用外观，每组只改变一个条件。sm、md、lg 的方形点击区域为 36、44、52px；本例为静态对照。

[查看示例文件](../../playground/src/examples/foundations/IconButtonSizes.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/IconButtonSizes.tsx -->

```tsx
import { IconButton } from 'yahha-ui';

function Star() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path
        d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function IconButtonSizes() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'grid', gap: 12 }}>
        <span>尺寸</span>
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
                <Star />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        <span>强调程度</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
            <div key={variant} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
              <span>
                {variant === 'primary' ? '主要' : variant === 'secondary' ? '次要' : '文字'}
              </span>
              <IconButton variant={variant} aria-label={`${variant} 变体收藏样本`}>
                <Star />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        <span>可用与禁用</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {[false, true].map((disabled) => (
            <div key={String(disabled)} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
              <span>{disabled ? '禁用' : '可用'}</span>
              <IconButton
                disabled={disabled}
                aria-label={disabled ? '禁用收藏样本' : '可用收藏样本'}
              >
                <Star />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

<a id="icon-button-loading"></a>

### 受控加载与选中

点击后模拟加载 1.2 秒，再切换收藏状态；相邻文字显示等待与完成结果。

[查看示例文件](../../playground/src/examples/foundations/IconButtonLoading.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/IconButtonLoading.tsx -->

```tsx
import { useEffect, useState } from 'react';
import { IconButton, Text } from 'yahha-ui';

export default function IconButtonLoading() {
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
          aria-pressed={saved}
          loading={loading}
          onClick={() => setLoading(true)}
        >
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
        </IconButton>
        <Text size="sm" tone="muted" role="status">
          {loading ? '正在更新收藏…' : saved ? '已收藏' : '尚未收藏'}
        </Text>
      </div>
    </div>
  );
}
```

<a id="api"></a>

## API

### IconButtonProps

| 属性                  | 说明                                                                                     | 类型                                      | 默认值      |
| --------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------- | ----------- |
| `aria-label` **必填** | 必填的可访问名称，描述动作，例如“关闭提示”。                                             | `string`                                  | —           |
| `children`            | 图标内容。建议装饰图标设置 aria-hidden="true"，加载时此内容被替换。                      | `ReactNode`                               | —           |
| `variant`             | 主要、次要或文字按钮。                                                                   | `'primary' \| 'secondary' \| 'ghost'`     | `'primary'` |
| `size`                | 最小高度依次为 36、44、52px；IconButton 对应为方形点击区域。                             | `'sm' \| 'md' \| 'lg'`                    | `'md'`      |
| `loading`             | 显示加载图标并禁用按钮，设置 aria-busy。请求与完成状态由调用方管理。                     | `boolean`                                 | `false`     |
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

<a id="styling"></a>

## 布局与定制

按钮组的间距由外层 flex / grid 容器设置；在 flex 行中，可设置 `style={{ marginInlineStart: 'auto' }}` 将按钮推到行尾。 直接传入 SVG 图标时保留 viewBox，组件会按 size 调整图框。统一配色使用 [ThemeProvider](theme.md)。

<a id="related"></a>

## 相关组件

- [Button 按钮](button.md)：用于提交、保存和收藏等操作，提供三种强调程度，支持禁用与加载状态。
- [Tooltip 文字提示](tooltip.md)：悬停或聚焦时，为已有操作补充简短的视觉文字标签。
