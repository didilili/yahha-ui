<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# ThemeProvider 主题配置

配置配色预设与语义颜色，并向浮层 Portal 传递主题。

[安装与接入](../../README.md#安装与接入) · [接入示例](../guides/examples.md)

```tsx
import { ThemeProvider, type ThemeName, type ThemeTokens } from 'yahha-ui';
```

<a id="usage"></a>

## 主题作用范围

为应用或局部区域设置组件配色，并在应用入口导入 yahha-ui/style.css。theme 必填，推荐使用粉色预设（pink），也可选择浅蓝（blue）或浅黄（yellow）；由应用更新 theme 切换预设。三者是同一套组件的强调色变体，布局、字阶与交互相同。

通过公开的 ThemeTokens 覆盖语义颜色。尺寸、圆角与动效的内部 CSS 变量不属于稳定公共 API；组件布局和局部外观使用各组件公开的定制入口。

<a id="examples"></a>

## 代码演示

配色按钮仅供外观、悬停和键盘焦点对照，不绑定业务操作。

<a id="theme-variants"></a>

### 主题预设

对比粉色、浅蓝和浅黄三种预设。

本例自带 `ThemeProvider`，入口只需导入样式并渲染示例。

[查看示例文件](../../playground/src/examples/foundations/ThemeVariants.tsx)

<!-- example-source: playground/src/examples/foundations/ThemeVariants.tsx -->

```tsx
import { Badge, Button, Surface, ThemeProvider, type ThemeName } from 'yahha-ui';

const themes: { value: ThemeName; label: string }[] = [
  { value: 'pink', label: '粉色 · pink' },
  { value: 'blue', label: '浅蓝 · blue' },
  { value: 'yellow', label: '浅黄 · yellow' },
];

export default function ThemeVariants() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
          gap: 16,
        }}
      >
        {themes.map(({ value, label }) => (
          <ThemeProvider key={value} theme={value}>
            <Surface>
              <p style={{ marginTop: 0 }}>{label}</p>
              <div style={{ display: 'grid', justifyItems: 'start', gap: 16 }}>
                <Badge tone="accent">主题标记</Badge>
                <Button>主要按钮外观</Button>
              </div>
            </Surface>
          </ThemeProvider>
        ))}
      </div>
    </div>
  );
}
```

<a id="theme-tokens"></a>

### 定制语义颜色

通过 tokens 覆盖强调色及其悬停颜色。

本例自带 `ThemeProvider`，入口只需导入样式并渲染示例。

[查看示例文件](../../playground/src/examples/foundations/ThemeTokens.tsx)

<!-- example-source: playground/src/examples/foundations/ThemeTokens.tsx -->

```tsx
import { Button, Surface, ThemeProvider, type ThemeTokens } from 'yahha-ui';

const tokens: ThemeTokens = { accent: '#d7eee5', accentHover: '#c2e1d4' };

export default function ThemeTokensExample() {
  return (
    <ThemeProvider theme="pink" tokens={tokens}>
      <Surface>
        <Button>自定义强调色</Button>
      </Surface>
    </ThemeProvider>
  );
}
```

<a id="theme-nested"></a>

### 嵌套主题

对比外层自定义绿色与内层浅黄预设。

本例自带 `ThemeProvider`，入口只需导入样式并渲染示例。

[查看示例文件](../../playground/src/examples/foundations/ThemeNested.tsx)

<!-- example-source: playground/src/examples/foundations/ThemeNested.tsx -->

```tsx
import { Button, Surface, ThemeProvider, type ThemeTokens } from 'yahha-ui';

const outerTokens: ThemeTokens = { accent: '#d7eee5', line: '#6e9788' };

export default function ThemeNested() {
  return (
    <ThemeProvider theme="pink" tokens={outerTokens}>
      <Surface style={{ display: 'grid', gap: 20 }}>
        <div>
          <p style={{ marginTop: 0 }}>外层：粉色预设，自定义绿色。</p>
          <Button>外层按钮外观</Button>
        </div>
        <ThemeProvider theme="yellow">
          <Surface>
            <p style={{ marginTop: 0 }}>内层：浅黄预设。</p>
            <Button>内层按钮外观</Button>
          </Surface>
        </ThemeProvider>
      </Surface>
    </ThemeProvider>
  );
}
```

<a id="theme-portal"></a>

### 弹出内容沿用主题

打开弹窗，查看挂载到 Portal 的内容如何沿用 ThemeProvider 配色。

本例自带 `ThemeProvider`，入口只需导入样式并渲染示例。

[查看示例文件](../../playground/src/examples/foundations/ThemePortal.tsx)

<!-- example-source: playground/src/examples/foundations/ThemePortal.tsx -->

```tsx
import { useState } from 'react';
import { Button, Dialog, Surface, Input, ThemeProvider, type ThemeTokens } from 'yahha-ui';

const tokens: ThemeTokens = {
  ink: '#243b40',
  muted: '#566b70',
  accent: '#d7eee5',
  accentHover: '#c2e1d4',
  accentSoft: '#f1f9f5',
  line: '#6e9788',
  focus: '#326a59',
  surface: '#fbfefa',
  fieldBackground: '#ffffff',
  error: '#9b374c',
};

export default function ThemePortal() {
  const [open, setOpen] = useState(false);

  return (
    <ThemeProvider theme="pink" tokens={tokens}>
      <Surface style={{ display: 'grid', gap: 20, maxWidth: 560 }}>
        <Input label="订阅邮箱" placeholder="you@example.com" hint="每月一封更新。" />
        <Dialog
          open={open}
          onOpenChange={setOpen}
          trigger={<Button>查看主题弹窗</Button>}
          title="同一套主题颜色"
          description="每月一封阅读推荐，分享文章与书单。"
          footer={<Button onClick={() => setOpen(false)}>明白了</Button>}
        >
          <p>本例只预览订阅界面，不会发送邮件。</p>
        </Dialog>
      </Surface>
    </ThemeProvider>
  );
}
```

<a id="api"></a>

## API

### ThemeProviderProps

| 属性                | 说明                                                                                                                 | 类型          | 默认值 |
| ------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------- | ------ |
| `theme` **必填**    | 当前 Provider 的强调色预设，对应公开类型 ThemeName。推荐粉色（pink）；六个可用值及旧名映射见“ThemeName 与旧名兼容”。 | `ThemeName`   | —      |
| `children` **必填** | 主题范围内的内容。                                                                                                   | `ReactNode`   | —      |
| `tokens`            | 覆盖当前主题的部分语义颜色，并传入此范围中的浮层 Portal。                                                            | `ThemeTokens` | —      |
| `className`         | 只作用于 Provider 的根 div，不复制到浮层 Portal。                                                                    | `string`      | —      |

### ThemeTokens

| 属性              | 说明                                                                                                               | 类型     | 默认值                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ | -------- | -------------------------------------------- |
| `ink`             | 正文与主要文字，--yahha-ink。                                                                                      | `string` | `#49313d`                                    |
| `muted`           | 次要文字，--yahha-muted。                                                                                          | `string` | `#7a5c6d`                                    |
| `accent`          | 主题强调色，--yahha-accent。                                                                                       | `string` | `粉色 #ffc3d9 / 浅蓝 #d7eaf5 / 浅黄 #f8e5a7` |
| `accentHover`     | 强调色的悬停状态，--yahha-accent-hover。                                                                           | `string` | `粉色 #ffb3cf / 浅蓝 #c3dfee / 浅黄 #f3da89` |
| `accentSoft`      | 轻量强调背景，--yahha-accent-soft。                                                                                | `string` | `粉色 #fff0f6 / 浅蓝 #f2f8fc / 浅黄 #fffaf0` |
| `line`            | 常规边框，--yahha-line；显式指定时也覆盖按钮轮廓、按压底边与轻纸边。                                               | `string` | `粉色 #c58ba1 / 浅蓝 #b9cedb / 浅黄 #daca9f` |
| `focus`           | 键盘焦点轮廓，--yahha-focus。                                                                                      | `string` | `粉色 #b04e78 / 浅蓝 #386d93 / 浅黄 #896329` |
| `surface`         | 内容面与浮层等共用背景，--yahha-surface。                                                                          | `string` | `#ffffff`                                    |
| `fieldBackground` | 输入框默认背景，--yahha-field-background；错误和禁用状态保留各自背景。                                             | `string` | `#ffffff`                                    |
| `error`           | 输入框错误边框、错误时的焦点轮廓、错误文字、危险按钮与 Toast 错误图标，--yahha-error；错误背景固定，禁用背景优先。 | `string` | `#a33e4f`                                    |

<a id="theme-names"></a>

## ThemeName 与旧名兼容

公开类型 ThemeName 接受三个颜色主名和三个旧名兼容值：

- 粉色：`pink`；旧名 `chiikawa` 映射到 pink。
- 浅蓝：`blue`；旧名 `hachiware` 映射到 blue。
- 浅黄：`yellow`；旧名 `usagi` 映射到 yellow。

新代码使用颜色主名。旧名进入主题上下文与 `data-yahha-theme` DOM 属性前会规范为对应颜色主名，浮层 Portal 也使用规范值。已有 theme 属性值可以逐步替换，兼容映射的配色相同；theme 仍为必填属性。

<a id="boundaries"></a>

## 嵌套主题与 Portal 传播

嵌套 Provider 以自己的预设为起点，不合并外层 tokens。内外层需要相同覆盖时，应再次显式传入。Provider 不透传原生 div 属性、style 或 ref，页面布局可使用外层元素。

tokens 会传到 Dialog、Select、Popover、Tooltip 与 DropdownMenu 的 Portal。仅在 Provider 自定义类上设置的 CSS 变量沿 DOM 继承，挂载到 body 的浮层无法继承这些类上的覆盖；需要跨 Portal 生效的颜色定制应使用 tokens。

颜色入口只覆盖组件已使用的语义颜色，例如 Toast 的状态背景仍保留固定颜色。定制后应检查文字对比度、错误提示与焦点轮廓。当前没有内置深色模式或自动跟随系统主题功能。

<a id="related"></a>

## 相关组件

- [Button 按钮](button.md)：用于触发操作，支持不同强调程度、禁用、加载和切换状态。
- [Surface 内容容器](surface.md)：用于组织文章摘要、作者介绍等内容，提供背景、边框、圆角与内边距。
- [Popover 弹出面板](popover.md)：锚定到触发器的非模态面板，可包含说明、链接或短表单。
