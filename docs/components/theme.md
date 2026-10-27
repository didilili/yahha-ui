# ThemeProvider 主题配置

为后代组件提供配色，并将主题传给 Dialog、Select、Popover、Tooltip 与 DropdownMenu 的 Portal。

推荐以 `chiikawa` 作为默认配色：奶白纸面、暖墨文字、`#644744` 深墨轮廓与少量轻粉强调。漫画手账的按钮、字段、纸签、栏目和浮层各有结构；`hachiware` 浅蓝与 `usagi` 浅黄是共享这套结构的可选颜色预设。设计语言和阅读组合见[设计语言](../design-language.md)。

## Props 与默认值

- `theme: ThemeName` 与 `children` 必填。`ThemeName` 为 `"chiikawa" | "hachiware" | "usagi"`。
- `tokens?: ThemeTokens` 覆盖当前主题的语义颜色；每项为可选字符串，未指定的项保留角色主题默认值。
- `className` 只作用于 Provider 的根 div，不会传到浮层 Portal。Provider 不提供原生 div 属性、`style` 或 `ref` 透传。

Provider 没有内部切换状态；如需切换主题，由调用方更新 `theme`。不使用 Provider 时，内部主题 Context 的名称默认为 `chiikawa`；仍建议显式设置 Provider，统一主题作用范围。

嵌套 Provider 的每一层均以其角色主题默认值为起点，不合并外层 `tokens`。需要复用覆盖值时，应显式传入内层 Provider。

## 颜色入口

`ThemeTokens` 与 CSS 自定义属性对应如下：

- `ink` → `--chi-ink`：正文与主要文字。
- `muted` → `--chi-muted`：次要文字。
- `accent` → `--chi-accent`，`accentHover` → `--chi-accent-hover`，`accentSoft` → `--chi-accent-soft`：主题强调色及其状态。
- `line` → `--chi-line`：常规边线；显式传入 `tokens.line` 时，也同步覆盖组件的深墨轮廓、轻纸边与按压底边。`focus` → `--chi-focus`：单层 2px 键盘焦点轮廓。
- `surface` → `--chi-surface`：Surface 与 Dialog 背景，默认 `#fffefa`。
- `fieldBackground` → `--chi-field-background`：输入框默认背景，默认 `#fffefd`；错误与禁用状态保留各自背景。
- `error` → `--chi-error`：输入框错误边框、错误时的焦点轮廓、错误文字与 Toast 错误图标颜色，默认 `#a33e4f`；输入框错误背景保持固定，禁用背景优先。

这些入口覆盖组件已经使用的语义颜色，并不替换每一个固定颜色，例如 Alert 的提示背景与 Toast 的信息状态印签背景。覆盖颜色时应一起检查文字对比度和焦点可见性。

`ThemeTokens` 只提供语义颜色覆盖，不包含尺寸、圆角、间距或动效尺度。需要局部调整时，使用组件公开的 `className` / `style`；内部 CSS 变量不属于稳定的公共定制 API。跨 Portal 的颜色覆盖使用 `tokens`。

通过 `tokens` 指定的值会显式传入浮层 Portal。若只在 Provider 的自定义类上定义 CSS 变量，它们仅沿 DOM 继承，挂载到 body 的浮层不会自动继承；跨 Portal 的覆盖应使用 `tokens`。

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
          trigger={<Button variant="secondary">查看阅读提示</Button>}
          title="阅读小提示"
        >
          <p>喜欢的文章可以先收藏，之后再慢慢读。这个弹窗也会使用上面的主题颜色。</p>
        </Dialog>
      </Surface>
    </ThemeProvider>
  );
}
```

## 键盘约定

Provider 本身不参与键盘交互。切换主题后，仍需保持组件的焦点轮廓清楚可见。
