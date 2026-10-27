# ThemeProvider

为后代组件提供角色主题，并将主题传给 Dialog 的 Portal。

## Props 与默认值

- `theme: ThemeName` 与 `children` 必填。`ThemeName` 为 `"chiikawa" | "hachiware" | "usagi"`。
- `tokens?: ThemeTokens` 覆盖当前主题的语义颜色；每项为可选字符串，未指定的项保留角色主题默认值。
- `className` 只作用于 Provider 的根 div，不会传到 Dialog 的 Portal。Provider 不提供原生 div 属性、`style` 或 `ref` 透传。

Provider 没有内部切换状态；如需切换主题，由调用方更新 `theme`。不使用 Provider 时，内部主题 Context 的名称默认为 `chiikawa`；仍建议显式设置 Provider，统一主题作用范围。

嵌套 Provider 的每一层均以其角色主题默认值为起点，不合并外层 `tokens`。需要复用覆盖值时，应显式传入内层 Provider。

## 颜色入口

`ThemeTokens` 与 CSS 自定义属性对应如下：

- `ink` → `--chi-ink`：正文与主要文字。
- `muted` → `--chi-muted`：次要文字。
- `accent` → `--chi-accent`，`accentHover` → `--chi-accent-hover`，`accentSoft` → `--chi-accent-soft`：主题强调色及其状态。
- `line` → `--chi-line`：常规边框；`focus` → `--chi-focus`：键盘焦点轮廓。
- `surface` → `--chi-surface`：Surface 与 Dialog 背景，默认 `#fffefa`。
- `fieldBackground` → `--chi-field-background`：输入框默认背景，默认 `#fffefd`；错误与禁用状态保留各自背景。
- `error` → `--chi-error`：输入错误文字与 Toast 错误图标颜色，默认 `#a33e4f`；不覆盖输入框错误边框。

这些入口覆盖组件已经使用的语义颜色，并不替换每一个固定颜色，例如 Toast 的各状态背景。覆盖颜色时应一起检查文字对比度和焦点可见性。

通过 `tokens` 指定的值会显式传入 Dialog Portal。若只在 Provider 的自定义类上定义 CSS 变量，它们仅沿 DOM 继承，挂载到 body 的弹窗不会自动继承；跨 Portal 的覆盖应使用 `tokens`。

## 示例

```tsx
import { useState } from 'react';
import { Button, Dialog, Surface, ThemeProvider, type ThemeTokens } from 'yahha-ui';
import 'yahha-ui/style.css';

const tokens: ThemeTokens = {
  accent: '#d7eaf5',
  focus: '#285c80',
  surface: '#fafdff',
};

export function ThemeExample() {
  const [open, setOpen] = useState(false);

  return (
    <ThemeProvider theme="hachiware" tokens={tokens}>
      <Surface>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          trigger={<Button variant="secondary">查看说明</Button>}
          title="同一套主题"
        >
          <p>这个弹窗也会使用上面的 surface 和 focus 颜色。</p>
        </Dialog>
      </Surface>
    </ThemeProvider>
  );
}
```

## 键盘约定

Provider 本身不参与键盘交互。切换主题后，仍需保持组件的焦点轮廓清楚可见。
