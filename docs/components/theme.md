<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# ThemeProvider 主题配置

设置默认配色、可选颜色预设与语义颜色，并在浮层 Portal 中保持一致。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { ThemeProvider, type ThemeName, type ThemeTokens } from 'yahha-ui';
```

<a id="usage"></a>

## 主题作用范围

为应用或局部区域设置组件配色，并在应用入口导入 yahha-ui/style.css。theme 必填，推荐使用吉伊粉色预设（chiikawa），也可选择小八浅蓝预设（hachiware）或乌萨奇浅黄预设（usagi）；由应用更新 theme 切换预设。预设名称对应角色配色，三者共用组件尺寸、排版与交互规则。

通过公开的 ThemeTokens 覆盖语义颜色。尺寸、圆角与动效的内部 CSS 变量不属于稳定公共 API；组件布局和局部外观使用各组件公开的定制入口。

<a id="examples"></a>

## 代码演示

<a id="theme-variants"></a>

### 默认配色与可选预设

比较吉伊粉色预设（chiikawa）、小八浅蓝预设（hachiware）与乌萨奇浅黄预设（usagi）的组件外观；按钮可观察悬停和键盘焦点，不绑定业务操作。

[查看示例文件](../../playground/src/examples/foundations/ThemeVariants.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/ThemeVariants.tsx -->

```tsx
import { Badge, Button, Surface, ThemeProvider, type ThemeName } from 'yahha-ui';

const themes: { value: ThemeName; label: string }[] = [
  { value: 'chiikawa', label: '吉伊 · chiikawa' },
  { value: 'hachiware', label: '小八 · hachiware' },
  { value: 'usagi', label: '乌萨奇 · usagi' },
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

### 定制颜色与 Portal 传播

完整列出 10 个可选颜色入口。打开弹窗，可确认颜色随主题上下文进入 body 中的 Portal，无需复制页面布局样式。

[查看示例文件](../../playground/src/examples/foundations/ThemeTokens.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/ThemeTokens.tsx -->

```tsx
import { useState } from 'react';
import { Button, Dialog, Surface, TextField, ThemeProvider, type ThemeTokens } from 'yahha-ui';

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

export default function ThemeTokensExample() {
  const [open, setOpen] = useState(false);

  return (
    <ThemeProvider theme="chiikawa" tokens={tokens}>
      <Surface style={{ display: 'grid', gap: 20, maxWidth: 560 }}>
        <TextField label="订阅邮箱" placeholder="you@example.com" hint="每月一封更新。" />
        <Dialog
          open={open}
          onOpenChange={setOpen}
          trigger={<Button>查看主题弹窗</Button>}
          title="同一套主题颜色"
          description="每月一封阅读推荐，分享文章与书单。"
          footer={<Button onClick={() => setOpen(false)}>明白了</Button>}
        >
          <p>给自己留一点安静的阅读时间。</p>
        </Dialog>
      </Surface>
    </ThemeProvider>
  );
}
```

<a id="theme-nested"></a>

### 嵌套主题

内层以自己的主题默认值为起点，不合并外层 tokens。按钮仅供配色对照，可观察悬停和键盘焦点；需要相同覆盖时，应再次显式传入。

[查看示例文件](../../playground/src/examples/foundations/ThemeNested.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/ThemeNested.tsx -->

```tsx
import { Button, Surface, ThemeProvider, type ThemeTokens } from 'yahha-ui';

const outerTokens: ThemeTokens = { accent: '#d7eee5', line: '#6e9788' };

export default function ThemeNested() {
  return (
    <ThemeProvider theme="chiikawa" tokens={outerTokens}>
      <Surface style={{ display: 'grid', gap: 20 }}>
        <div>
          <p style={{ marginTop: 0 }}>外层：吉伊主题，自定义绿色。</p>
          <Button>外层按钮外观</Button>
        </div>
        <ThemeProvider theme="usagi">
          <Surface>
            <p style={{ marginTop: 0 }}>内层：乌萨奇主题。</p>
            <Button>内层按钮外观</Button>
          </Surface>
        </ThemeProvider>
      </Surface>
    </ThemeProvider>
  );
}
```

<a id="api"></a>

## API

### ThemeProviderProps

| 属性                | 说明                                                                                     | 类型                                   | 默认值 |
| ------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------- | ------ |
| `theme` **必填**    | 当前 Provider 的配色预设名称，对应公开类型 ThemeName。推荐使用吉伊粉色预设（chiikawa）。 | `'chiikawa' \| 'hachiware' \| 'usagi'` | —      |
| `children` **必填** | 主题范围内的内容。                                                                       | `ReactNode`                            | —      |
| `tokens`            | 覆盖当前主题的部分语义颜色，并传入此范围中的浮层 Portal。                                | `ThemeTokens`                          | —      |
| `className`         | 只作用于 Provider 的根 div，不复制到浮层 Portal。                                        | `string`                               | —      |

### ThemeTokens

| 属性              | 说明                                                                                                     | 类型     | 默认值                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------- |
| `ink`             | 正文与主要文字，--yahha-ink。                                                                            | `string` | `#49313d`                                      |
| `muted`           | 次要文字，--yahha-muted。                                                                                | `string` | `#7a5c6d`                                      |
| `accent`          | 主题强调色，--yahha-accent。                                                                             | `string` | `吉伊 #ffc3d9 / 小八 #d7eaf5 / 乌萨奇 #f8e5a7` |
| `accentHover`     | 强调色的悬停状态，--yahha-accent-hover。                                                                 | `string` | `吉伊 #ffb3cf / 小八 #c3dfee / 乌萨奇 #f3da89` |
| `accentSoft`      | 轻量强调背景，--yahha-accent-soft。                                                                      | `string` | `吉伊 #fff0f6 / 小八 #f2f8fc / 乌萨奇 #fffaf0` |
| `line`            | 常规边框，--yahha-line；显式指定时也覆盖按钮轮廓、按压底边与轻纸边。                                     | `string` | `吉伊 #c58ba1 / 小八 #b9cedb / 乌萨奇 #daca9f` |
| `focus`           | 键盘焦点轮廓，--yahha-focus。                                                                            | `string` | `吉伊 #b04e78 / 小八 #386d93 / 乌萨奇 #896329` |
| `surface`         | 内容面与浮层等共用背景，--yahha-surface。                                                                | `string` | `#ffffff`                                      |
| `fieldBackground` | 输入框默认背景，--yahha-field-background；错误和禁用状态保留各自背景。                                   | `string` | `#ffffff`                                      |
| `error`           | 输入框错误边框、错误时的焦点轮廓、错误文字与 Toast 错误图标，--yahha-error；错误背景固定，禁用背景优先。 | `string` | `#a33e4f`                                      |

<a id="boundaries"></a>

## 嵌套主题与 Portal 传播

嵌套 Provider 以自己的预设为起点，不合并外层 tokens。内外层需要相同覆盖时，应再次显式传入。Provider 不透传原生 div 属性、style 或 ref，页面布局可使用外层元素。

tokens 会传到 Dialog、Select、Popover、Tooltip 与 DropdownMenu 的 Portal。仅在 Provider 自定义类上设置的 CSS 变量沿 DOM 继承，挂载到 body 的浮层无法继承这些类上的覆盖；需要跨 Portal 生效的颜色定制应使用 tokens。

颜色入口只覆盖组件已使用的语义颜色，例如 Toast 的状态背景仍保留固定颜色。定制后应检查文字对比度、错误提示与焦点轮廓。当前没有内置深色模式或自动跟随系统主题功能。

<a id="related"></a>

## 相关组件

- [Button 按钮](button.md)：用于提交、保存和收藏等操作，提供三种强调程度，支持禁用与加载状态。
- [Surface 内容容器](surface.md)：提供背景、边框、圆角与内边距的平面容器，用于组织轻量内容。
- [Popover 弹出面板](popover.md)：锚定到按钮的补充面板，适合简短说明和轻量交互。
