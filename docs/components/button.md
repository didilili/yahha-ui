# Button / IconButton

`Button` 渲染原生 `<button>`；`IconButton` 使用同一个按钮实现，适合仅有图标的操作。

## Props 与默认值

- `ButtonProps` 继承原生 button 属性，含 `ref`、`disabled`、`onClick`、`name`、`form` 等；`type` 默认为 `"button"`，表单提交需显式写 `type="submit"`。
- `variant`：`"primary" | "secondary" | "ghost"`，默认 `"primary"`。
- `size`：`"sm" | "md" | "lg"`，默认 `"md"`。
- `loading` 默认 `false`；为 `true` 时禁用按钮、设置 `aria-busy`，并用加载图标替换 `startIcon`。按钮文字和 `endIcon` 仍会保留。
- `startIcon`、`endIcon` 接收 `ReactNode`，包装元素对辅助技术隐藏；操作含义由按钮文字说明。
- `IconButtonProps` 不含 `startIcon` / `endIcon`，必须传入 `aria-label`，图标放在 `children` 中。

`ref` 指向原生 button；`className` 与 `style` 也作用于该 button。组件没有内部业务状态，`loading` 和 `disabled` 由调用方控制。

## 示例

```tsx
import { useState } from 'react';
import { Button, IconButton, ThemeProvider } from 'chiikawa-ui';
import 'chiikawa-ui/style.css';

export function ButtonExample() {
  const [saved, setSaved] = useState(false);

  return (
    <ThemeProvider theme="chiikawa">
      <Button onClick={() => setSaved(true)} disabled={saved}>
        {saved ? '已保存' : '保存心愿'}
      </Button>
      <IconButton aria-label="清除保存状态" variant="ghost" onClick={() => setSaved(false)}>
        <span aria-hidden="true">×</span>
      </IconButton>
    </ThemeProvider>
  );
}
```

## 键盘约定

保留原生按钮的 Tab 聚焦和 Enter / Space 激活行为。禁用与加载按钮不能聚焦或点击。图标按钮的 `aria-label` 应描述动作，例如“关闭提示”。
