# Badge

行内状态标记，渲染为 span。

## Props 与默认值

- `BadgeProps` 继承原生 span 属性，支持 `children`、`style`、ARIA 属性与 `ref`。
- `tone`：`"neutral" | "accent" | "success"`，默认 `"neutral"`。
- `ref` 指向 span；`className` 与 `style` 同样作用于该 span。

组件没有内部状态。内容与 `tone` 由调用方决定，颜色之外也应保留能表达状态的文字。

## 示例

```tsx
import { Badge, ThemeProvider } from 'yahha-ui';
import 'yahha-ui/style.css';

export function BadgeExample() {
  return (
    <ThemeProvider theme="chiikawa">
      <Badge>未开始</Badge>
      <Badge tone="accent">进行中</Badge>
      <Badge tone="success">已完成</Badge>
    </ThemeProvider>
  );
}
```

## 键盘约定

Badge 默认不可聚焦，没有按钮语义或键盘操作。需要操作时使用 Button；需要播报状态更新时，由调用方根据场景提供适当的 ARIA 属性。
