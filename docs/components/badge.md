# Badge

行内状态标记，渲染为 span。

## Props 与默认值

- `BadgeProps` 继承原生 span 属性，支持 `children`、`style`、ARIA 属性与 `ref`。
- `tone`：`"neutral" | "accent" | "success"`，默认 `"neutral"`。
- `ref` 指向 span；`className` 与 `style` 同样作用于该 span。

组件没有内部状态。内容与 `tone` 由调用方决定，颜色之外也应保留能表达状态的文字。

默认采用带轻纸边的短小纸签轮廓，适合文章分类与阅读状态。`neutral` 为平整中性纸签，`accent` 使用主题实填色与深墨细边；`success` 使用独立绿色与装饰小勾表示完成或成功。状态含义仍由可读文字说明，Badge 保持非交互语义。显式 `tokens.line` 同时覆盖轻纸边与深墨轮廓。

纸签可以放在行内正文或元信息行中。长中文和无空格英文保留完整内容，受父容器宽度约束而换行；成功态的小勾与首行文字基线对齐，不会落到多行内容的中间。默认字号为 12px，不能用它代替正文或主要触屏操作。

## 示例

```tsx
import { Badge, ThemeProvider } from 'yahha-ui';
import 'yahha-ui/style.css';

export function BadgeExample() {
  return (
    <ThemeProvider theme="chiikawa">
      <Badge>随笔</Badge>
      <Badge tone="accent">阅读中</Badge>
      <Badge tone="success">已读</Badge>
    </ThemeProvider>
  );
}
```

## 键盘约定

Badge 默认不可聚焦，没有按钮语义或键盘操作。需要操作时使用 Button；需要播报状态更新时，由调用方根据场景提供适当的 ARIA 属性。
