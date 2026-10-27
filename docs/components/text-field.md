# TextField 单行输入

带可见标签的单行输入框，自动关联提示与错误文字。

边框和错误底色使用 150ms 过渡，焦点轮廓立即可见，输入框与文字不位移。动态禁用时立即显示禁用外观，装饰前图标同时停止过渡；减少动效和强制颜色下直接呈现最终状态。

## Props 与默认值

- `TextFieldProps` 继承原生 input 属性，但不提供原生 `size`。`label` 必填，`hint`、`error`、`leading` 为可选 `ReactNode`，均无默认内容。
- `id` 未传入时自动生成，用于连接 label、input、提示与错误。
- `value` / `onChange` 用于受控输入；也可使用原生 `defaultValue` 开始非受控输入。不要在同一输入生命周期内切换两种模式。
- `disabled`、`required`、`name`、`form`、`type`、`autoComplete` 等直接传给 input。未指定时保留浏览器默认行为。
- 有 `error` 内容时，input 设置 `aria-invalid="true"`；`hint` 与 `error` 的描述 ID 会与传入的 `aria-describedby` 合并。组件不执行校验，也不自动生成错误文字。
- 也可单独传入 `aria-invalid={true}` 显示错误边框；这不会生成错误说明，需要调用方通过 `error` 或 `aria-describedby` 解释原因。
- `hint`、`error` 的数字 `0` 会正常显示并关联；空字符串、布尔值、`null` 和 `undefined` 不生成对应提示。清除错误时保留其他描述关联。
- `disabled` 与 `error` 同时存在时保留错误说明和 `aria-invalid`，输入框使用禁用背景。

`className` 作用于最外层 div；`ref`、`style` 和其他原生 input 属性作用于 input。`classNames` 可分别设置 `label`、`inputWrapper`、`leading`、`input`、`hint`、`error` 的类名。

输入框常规单行实际高度为 44px，使用白底、2px 深墨线与圆钝长框，不带按钮式底边或投影。宽度不超过 480px 或使用粗指针的设备上，输入文字为 16px、行框 24px，并调整上下内边距保持 44px，以减少部分移动浏览器聚焦时的页面缩放。

`readOnly` 使用独立的浅色背景，仍可聚焦、选择文字、复制和参与表单提交；`disabled` 不可编辑或聚焦，也不参与提交。两者均保留清楚的文字颜色。

`leading` 的包装元素带 `aria-hidden="true"`，默认占用 18×18px 的装饰图标区域，超出内容会裁切。不要放入长文字前缀、交互控件或需要朗读的内容。

非受控输入沿用原生表单重置行为；受控输入需在表单 `onReset` 中由调用方重置 `value`。

## 设计与状态

字段使用白底、暖墨长框与轻微不对称的轮廓；标签放在框外，提示和错误放在下方。标签、提示与错误说明相对字段外缘使用相同的 4px 行内缩进，长说明按同一起点换行。它与带按压底边的 Button 有不同层次，不通过添加图标或插画来制造另一套外观。

- **普通与悬停**：文字和边界保持清楚。悬停只调整墨线颜色，不改变尺寸，也不替代键盘焦点。
- **键盘焦点**：输入框外显示单层焦点提示；错误字段保留错误颜色。点击标签也可进入输入框。
- **前图标**：`leading` 保持 18px 图框；普通状态使用辅助墨色，可编辑字段聚焦时跟随焦点色，错误状态优先使用错误墨色。只读和禁用时前图标保持辅助墨色，不显示可编辑的聚焦回应。
- **提示与错误**：提示说明填写方式，错误指出问题和恢复方法，两者可以同时显示并关联输入框。组件不自动播报所有输入变化；提交后需要定位错误时，使用 `ref` 聚焦字段。
- **只读与禁用**：两者使用不同的浅色底。只读仍可聚焦、复制和提交；禁用无法编辑、聚焦或提交。不要仅依靠背景解释原因，按需要提供 `hint`。
- **长内容**：标签、提示、错误按可用宽度换行；单行值沿用原生 input 的横向编辑行为，不把输入框变成多行。长内容的编辑场景使用 Textarea。

`required` 保留原生必填约束，但组件不自动添加星号。请在可见标签或 `hint` 中说明“必填”，并在提交后给出具体错误。`placeholder` 仅提供格式示例，不能代替标签或必要说明。

`type="email"`、`search`、`url`、`tel`、`password` 等保留原生输入语义；键盘、格式约束、自动填充和密码管理器行为由浏览器处理。`password` 不包含显隐切换或强度校验，`search` 不会自行发起请求。`type` 仍是原生属性；文件上传、开关和选项选择应使用对应语义的控件，不能只更换 `type` 后假定已得到完整的专用组件。

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
