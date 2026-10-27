# Surface

带边框、背景、圆角与内边距的内容容器，渲染为 div。

## Props 与默认值

`SurfaceProps` 继承原生 div 属性，没有额外 variant 或状态属性。`children` 放入内容；`ref` 指向根 div，`className`、`style` 和其余原生属性也作用于它。组件没有受控状态。

默认背景跟随主题的 `surface` token；布局、标题和业务行为由调用方提供。

## 示例

```tsx
import { Surface, ThemeProvider } from 'yahha-ui';
import 'yahha-ui/style.css';

export function SurfaceExample() {
  return (
    <ThemeProvider theme="usagi">
      <Surface role="region" aria-labelledby="wish-heading" style={{ maxWidth: 480 }}>
        <h2 id="wish-heading">今天的小心愿</h2>
        <p>和朋友一起吃一顿热乎的饭。</p>
      </Surface>
    </ThemeProvider>
  );
}
```

## 键盘约定

Surface 默认不可聚焦，没有快捷键。容器本身不应伪装成按钮；将具体操作放在内部可聚焦的按钮或链接中。
