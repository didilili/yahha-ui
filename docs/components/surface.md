# Surface

带边框、背景、圆角与内边距的内容容器，渲染为 div。

## Props 与默认值

`SurfaceProps` 继承原生 div 属性，没有额外 variant 或状态属性。`children` 放入内容；`ref` 指向根 div，`className`、`style` 和其余原生属性也作用于它。组件没有受控状态。

默认背景跟随主题的 `surface` token，以轻纸边、圆钝纸面轮廓与 24px 内边距组织内容，不带阴影或悬停动作。内容边线比按钮、字段的操作轮廓更轻；显式 `tokens.line` 可覆盖边线颜色。适合阅读提示、作者介绍等平整内容面；正文也可直接开放排布。布局、标题和业务行为由调用方提供。

标题与段落可以直接组合 Heading 和 Text。容器不会给子元素插入默认间距；使用 `display: grid` 与 `gap` 分组，避免为了卡片外观将每个正文段落都嵌套进 Surface。需要区域名称时由调用方提供 `role="region"` 与 `aria-labelledby`。

## 示例

```tsx
import { Heading, Surface, Text, ThemeProvider } from 'yahha-ui';
import 'yahha-ui/style.css';

export function SurfaceExample() {
  return (
    <ThemeProvider theme="chiikawa">
      <Surface
        role="region"
        aria-labelledby="reading-heading"
        style={{ display: 'grid', gap: 16, maxWidth: 480 }}
      >
        <Heading level={2} id="reading-heading">
          慢慢读，也没关系
        </Heading>
        <Text>这篇随笔大约需要 5 分钟。喜欢的话，可以先收藏起来。</Text>
      </Surface>
    </ThemeProvider>
  );
}
```

## 键盘约定

Surface 默认不可聚焦，没有快捷键。容器本身不应伪装成按钮；将具体操作放在内部可聚焦的按钮或链接中。
