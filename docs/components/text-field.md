# TextField

带可见标签的单行输入框，自动关联提示与错误文字。

## Props 与默认值

- `TextFieldProps` 继承原生 input 属性，但不提供原生 `size`。`label` 必填，`hint`、`error`、`leading` 为可选 `ReactNode`，均无默认内容。
- `id` 未传入时自动生成，用于连接 label、input、提示与错误。
- `value` / `onChange` 用于受控输入；也可使用原生 `defaultValue` 开始非受控输入。不要在同一输入生命周期内切换两种模式。
- `disabled`、`required`、`name`、`form`、`type`、`autoComplete` 等直接传给 input。未指定时保留浏览器默认行为。
- 有 `error` 内容时，input 设置 `aria-invalid="true"`；`hint` 与 `error` 的描述 ID 会与传入的 `aria-describedby` 合并。组件不执行校验，也不自动生成错误文字。

`className` 作用于最外层 div；`ref`、`style` 和其他原生 input 属性作用于 input。`classNames` 可分别设置 `label`、`inputWrapper`、`leading`、`input`、`hint`、`error` 的类名。

`leading` 的包装元素带 `aria-hidden="true"`，适合装饰图标，不放入需要操作或朗读的内容。

## 示例

```tsx
import { useRef, useState } from 'react';
import { Button, TextField, ThemeProvider } from 'yahha-ui';
import 'yahha-ui/style.css';

export function TextFieldExample() {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <ThemeProvider theme="hachiware">
      <TextField
        ref={inputRef}
        label="昵称"
        name="nickname"
        autoComplete="nickname"
        value={name}
        onChange={(event) => setName(event.target.value)}
        hint="最多 12 个字符"
        error={name.length > 12 ? '昵称太长了，请缩短一些' : undefined}
        classNames={{ input: 'nickname-input' }}
      />
      <Button variant="ghost" onClick={() => inputRef.current?.focus()}>
        继续填写昵称
      </Button>
    </ThemeProvider>
  );
}
```

## 键盘约定

使用原生 input 的 Tab、文字编辑和表单行为。点击可见标签会聚焦输入框。错误内容通过描述关联读取；若需要提交后主动聚焦错误字段，由调用方使用 `ref` 处理。
