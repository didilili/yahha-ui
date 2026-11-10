<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Input 输入框

带可见标签、辅助说明和错误反馈的单行输入框。

[安装与接入](../../README.md#安装与接入) · [接入示例](../guides/examples.md)

```tsx
import { Input } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

Input 将可见标签、单行 input、辅助说明和错误提示组合为完整字段，适合收集昵称、邮箱、搜索关键词等单行文字。 TextField 是同一组件的公开兼容别名，新接入使用 Input。

标签说明要填什么，placeholder 补充格式示例；需要填写留言、摘要等多行内容时使用 [Textarea](textarea.md)。只能从固定选项中选值时使用 [Select](select.md)。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 基础用法

用可见标签命名字段，并提供可编辑的初始值。

[查看示例文件](../../playground/src/examples/forms/TextFieldBasic.tsx)

<!-- example-source: playground/src/examples/forms/TextFieldBasic.tsx -->

```tsx
import { Input } from 'yahha-ui';

export default function TextFieldBasic() {
  return (
    <Input
      label="博客名称"
      name="blogName"
      defaultValue="我的小小记录"
      placeholder="给你的博客起一个名字"
      autoComplete="off"
    />
  );
}
```

<a id="controlled"></a>

### 受控输入

通过 value 与 onChange 管理输入内容。

[查看示例文件](../../playground/src/examples/forms/TextFieldControlled.tsx)

<!-- example-source: playground/src/examples/forms/TextFieldControlled.tsx -->

```tsx
import { useState } from 'react';
import { Text, Input } from 'yahha-ui';

export default function TextFieldControlled() {
  const [keyword, setKeyword] = useState('');

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Input
        label="关键词"
        type="search"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="输入关键词"
      />
      <Text size="sm" tone="muted">
        当前关键词：{keyword || '未填写'}
      </Text>
    </div>
  );
}
```

<a id="text-field-slots"></a>

### 前置图标与尾部清空

前置图标仅作装饰，示例通过尾部按钮清空内容并回焦。

[查看示例文件](../../playground/src/examples/forms/TextFieldSlots.tsx)

<!-- example-source: playground/src/examples/forms/TextFieldSlots.tsx -->

```tsx
import { useRef, useState } from 'react';
import { IconButton, Input } from 'yahha-ui';

export default function TextFieldSlots() {
  const [keyword, setKeyword] = useState('散步');
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Input
      ref={inputRef}
      label="关键词"
      value={keyword}
      onChange={(event) => setKeyword(event.currentTarget.value)}
      leading={
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </svg>
      }
      trailing={
        <IconButton
          type="button"
          variant="ghost"
          aria-label="清空关键词"
          disabled={!keyword}
          onClick={() => {
            setKeyword('');
            inputRef.current?.focus();
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
            focusable="false"
          >
            <path d="m6 6 12 12M6 18 18 6" strokeLinecap="round" />
          </svg>
        </IconButton>
      }
    />
  );
}
```

<a id="text-field-states"></a>

### 只读与禁用

对比只读可复制和禁用不可编辑两种状态。

[查看示例文件](../../playground/src/examples/forms/TextFieldStates.tsx)

<!-- example-source: playground/src/examples/forms/TextFieldStates.tsx -->

```tsx
import { Input } from 'yahha-ui';

export default function TextFieldStates() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Input label="暂不可编辑" disabled defaultValue="等待同步" />
      <Input label="公开地址" readOnly defaultValue="https://example.com" hint="可以复制此地址。" />
    </div>
  );
}
```

<a id="native"></a>

### 原生输入类型

对照密码、日期和时间输入，再检查邮箱的原生格式约束。

[查看示例文件](../../playground/src/examples/forms/TextFieldNative.tsx)

<!-- example-source: playground/src/examples/forms/TextFieldNative.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Button, Text, Input } from 'yahha-ui';

export default function TextFieldNative() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState('');

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'grid', gap: 16 }}>
        <Text size="sm" tone="muted">
          输入类型
        </Text>
        <Input
          label="示例密码"
          type="password"
          autoComplete="new-password"
          placeholder="输入密码"
        />
        <Input label="记录日期" type="date" name="recordDate" defaultValue="2026-10-28" />
        <Input label="记录时间" type="time" name="recordTime" defaultValue="10:30" />
      </div>
      <div style={{ display: 'grid', gap: 16 }}>
        <Text size="sm" tone="muted">
          邮箱格式检查
        </Text>
        <form
          style={{ display: 'grid', gap: 16 }}
          onInvalidCapture={() => setResult('')}
          onSubmit={(event) => {
            event.preventDefault();
            setResult('检查结果：邮箱格式正确。');
          }}
        >
          <Input
            ref={inputRef}
            label="联系邮箱"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="hello@example.com"
            required
            onChange={() => setResult('')}
            hint="必填，请填写完整的邮箱地址。"
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Button type="submit">检查邮箱格式</Button>
            <Button variant="secondary" onClick={() => inputRef.current?.focus()}>
              聚焦邮箱输入框
            </Button>
          </div>
          <Text size="sm" tone="muted" role="status">
            {result}
          </Text>
        </form>
      </div>
    </div>
  );
}
```

<a id="validation"></a>

### 原生表单的手动校验

手动检查昵称并设置 error，失败时用 ref 回焦。去除首尾空白后，长度按 UTF-16 代码单元计算。

[查看示例文件](../../playground/src/examples/forms/TextFieldValidation.tsx)

<!-- example-source: playground/src/examples/forms/TextFieldValidation.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Button, Text, Input } from 'yahha-ui';

export default function TextFieldValidation() {
  const [nickname, setNickname] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const valid = nickname.trim().length >= 2 && nickname.trim().length <= 12;
  const error = submitted && !valid ? '昵称长度须为 2～12，部分表情会占多个长度单位。' : undefined;

  return (
    <form
      noValidate
      style={{ display: 'grid', gap: 16 }}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        setResult('');
        if (!valid) {
          inputRef.current?.focus();
          return;
        }
        setResult(`检查结果：昵称“${nickname.trim()}”符合要求。`);
      }}
    >
      <Input
        ref={inputRef}
        label="你的昵称"
        name="nickname"
        autoComplete="nickname"
        required
        value={nickname}
        onChange={(event) => {
          setNickname(event.target.value);
          setResult('');
        }}
        hint="必填，去除首尾空格后长度为 2～12；部分表情会占多个长度单位。"
        error={error}
      />
      <div>
        <Button type="submit">检查昵称</Button>
      </div>
      <Text size="sm" tone="muted" role="status">
        {result}
      </Text>
    </form>
  );
}
```

<a id="form"></a>

### 原生表单取值与重置

用 FormData 读取两个字段，对比受控 value 与非受控 defaultValue 在原生 reset 时的恢复方式。

[查看示例文件](../../playground/src/examples/forms/TextFieldForm.tsx)

<!-- example-source: playground/src/examples/forms/TextFieldForm.tsx -->

```tsx
import { useState } from 'react';
import { Button, Text, Input } from 'yahha-ui';

export default function TextFieldForm() {
  const [title, setTitle] = useState('周末的散步记录');
  const [result, setResult] = useState('');

  return (
    <form
      style={{ display: 'grid', gap: 16 }}
      onInput={() => setResult('')}
      onInvalidCapture={() => setResult('')}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setResult(`读取结果：标题为“${data.get('title')}”；分类为“${data.get('category')}”。`);
      }}
      onReset={() => {
        setTitle('周末的散步记录');
        setResult('');
      }}
    >
      <Input
        label="文章标题"
        name="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
        hint="必填，请填写文章标题。"
      />
      <Input label="文章分类" name="category" defaultValue="生活" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="submit">读取表单</Button>
        <Button type="reset" variant="secondary">
          恢复初始值
        </Button>
      </div>
      <Text size="sm" tone="muted" role="status">
        {result}
      </Text>
    </form>
  );
}
```

<a id="text-field-search"></a>

### 中文输入与实时搜索

由调用方处理组合输入事件，结束后筛选本地手记；清空后回到输入框。

[查看示例文件](../../playground/src/examples/forms/TextFieldSearch.tsx)

<!-- example-source: playground/src/examples/forms/TextFieldSearch.tsx -->

```tsx
import { useRef, useState } from 'react';
import { IconButton, Text, Input } from 'yahha-ui';

const articles = ['周末的散步记录', '给小花换一个花盆', 'Weekend reading notes'];

export default function TextFieldSearch() {
  const [value, setValue] = useState('');
  const [query, setQuery] = useState('');
  const composing = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const matches = articles.filter((title) =>
    title.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
      <Input
        ref={inputRef}
        label="搜索本地手记"
        type="text"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        placeholder="试试“散步”或 Weekend"
        value={value}
        onCompositionStart={() => {
          composing.current = true;
        }}
        onCompositionEnd={(event) => {
          composing.current = false;
          setValue(event.currentTarget.value);
          setQuery(event.currentTarget.value);
        }}
        onChange={(event) => {
          const nextValue = event.currentTarget.value;
          setValue(nextValue);
          if (!composing.current && !(event.nativeEvent as InputEvent).isComposing) {
            setQuery(nextValue);
          }
        }}
        leading={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 5 5" strokeLinecap="round" />
          </svg>
        }
        trailing={
          <IconButton
            type="button"
            variant="ghost"
            aria-label="清空手记搜索"
            disabled={!value}
            onClick={() => {
              composing.current = false;
              setValue('');
              setQuery('');
              inputRef.current?.focus();
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M6 18 18 6" strokeLinecap="round" />
            </svg>
          </IconButton>
        }
      />
      <Text role="status" size="sm" tone="muted">
        {query ? `“${query}”：` : ''}找到 {matches.length} 篇手记。
      </Text>
      {matches.length ? (
        <ul aria-label="匹配的手记" style={{ margin: 0, paddingInlineStart: 24 }}>
          {matches.map((title) => (
            <li key={title}>{title}</li>
          ))}
        </ul>
      ) : (
        <Text>没有匹配的手记，可以换个关键词或清空搜索。</Text>
      )}
    </div>
  );
}
```

<a id="text-field-copy"></a>

### 只读输入与尾部复制

复制示例地址；浏览器拒绝时可选中文字，使用系统复制。

[查看示例文件](../../playground/src/examples/forms/TextFieldCopy.tsx)

<!-- example-source: playground/src/examples/forms/TextFieldCopy.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { IconButton, Text, Input } from 'yahha-ui';

const address = 'https://example.com/notes/feed.xml';

export default function TextFieldCopy() {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const request = useRef(0);
  const [message, setMessage] = useState('');
  useEffect(
    () => () => {
      request.current += 1;
    },
    [],
  );

  async function copyAddress() {
    const currentRequest = ++request.current;
    setMessage('');
    try {
      await navigator.clipboard.writeText(address);
      if (currentRequest === request.current) setMessage('示例地址已复制。');
    } catch {
      if (currentRequest !== request.current) return;
      if (document.activeElement === buttonRef.current) {
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      setMessage('未能复制，请选中地址后使用系统复制。');
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
      <Input
        ref={inputRef}
        label="示例订阅地址"
        value={address}
        readOnly
        hint="这是示例地址；也可直接选中文字，使用系统复制。"
        trailing={
          <IconButton
            ref={buttonRef}
            type="button"
            variant="ghost"
            aria-label="复制示例订阅地址"
            onClick={copyAddress}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="8" y="8" width="12" height="13" rx="2" />
              <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
            </svg>
          </IconButton>
        }
      />
      <Text role="status" size="sm" tone="muted">
        {message}
      </Text>
    </div>
  );
}
```

<a id="design"></a>

## 状态与原生表单

- value / onChange 用于受控输入，defaultValue 用于非受控初始值。自行管理原生 form 时，受控值需在 onReset 中恢复，见 [原生表单的受控与非受控重置](../guides/forms.md#reset)。
- name 提供 FormData 字段名，form 可通过 ID 关联外部表单。
- readOnly 保留聚焦、选择、复制和提交能力；disabled 阻止交互并退出键盘顺序，字段也不参与提交。
- type、autoComplete、required 等沿用原生 input 行为。required 启用浏览器约束，必填要求也应写在可见标签或提示中。
- error 以文字和装饰性提醒标记呈现错误，不执行校验。标记不另行命名或播报。 本页昵称例由调用方校验并维护 error，邮箱例使用浏览器约束。两种原生接入方式见 [原生表单的校验与焦点](../guides/forms.md#validation)。
- 昵称例使用 `nickname.trim().length` 检查 2～12 的长度。trim 去除首尾空白，length 按 UTF-16 代码单元计数，一个 😀 的长度为 2，可能与看到的字符数量不同。
- trailing 是可交互的尾部内容槽，与仅作装饰的 leading 分开。适合一个默认 44px 的 IconButton；组件只负责布局，操作名称、type="button"、disabled 和行为由使用方设置。 disabled 只禁用输入框，不递归修改槽内容；只读地址仍可提供复制操作。
- 显式设置 `dir="ltr"` / `dir="rtl"` 或 `style.direction` 时，前后缀布局与输入框保持同向；标签和辅助文字仍跟随外层方向。
- 原生 composition 事件直接传给输入框。搜索例立即更新编辑值，组合期间保留上一次筛选， 结束或取消后按输入框当前完整值更新结果；没有表单提交或远程请求。 该例使用 text + inputMode="search"，由一个命名按钮清空，避免与原生 search 取消按钮重复。

<a id="form-integration"></a>

## 与 Form 配合

```tsx
import { Form, Input } from 'yahha-ui';

<Form initialValues={{ nickname: '' }}>
  {(form) => <Input {...form.input('nickname')} label="昵称" required />}
</Form>
```

统一校验、提交与重置见 [Form 表单](form.md)。

<a id="api"></a>

## API

下表列出组件属性和常用原生入口。其余原生 `input` 属性与事件也传给输入框， 不支持原生 `size` 属性。

### InputProps

| 属性                                                                                       | 说明                                                                                                                      | 类型                                                      | 默认值           |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ---------------- |
| `label` **必填** <a id="api-InputProps--label"></a>                                        | 可见标签，自动关联 input。请提供有意义的字段名称。                                                                        | `ReactNode`                                               | —                |
| `hint` <a id="api-InputProps--hint"></a>                                                   | 辅助说明，通过 aria-describedby 与 input 关联。                                                                           | `ReactNode`                                               | —                |
| `error` <a id="api-InputProps--error"></a>                                                 | 错误说明。有内容时设置 aria-invalid，不执行校验。                                                                         | `ReactNode`                                               | —                |
| `leading` <a id="api-InputProps--leading"></a>                                             | 18×18px 的装饰图标槽，超出内容会裁切；包装元素 aria-hidden，不放长前缀、交互控件或必要文字。                              | `ReactNode`                                               | —                |
| `trailing` <a id="api-InputProps--trailing"></a>                                           | 尾部内容槽，可放命名操作；组件只布局，按钮的 type、disabled 与行为由使用方设置。                                          | `ReactNode`                                               | —                |
| `id` <a id="api-InputProps--id"></a>                                                       | input 的 ID，同时用于标签、提示和错误关联。                                                                               | `string`                                                  | `自动生成`       |
| `value` <a id="api-InputProps--value"></a>                                                 | 沿用 React input 原生值类型，单行文字通常使用 string。受控值需配合 onChange，不与 defaultValue 同时使用。                 | `string \| readonly string[] \| number`                   | —                |
| `defaultValue` <a id="api-InputProps--defaultValue"></a>                                   | 非受控输入的初始值，单行文字通常使用 string。不要在生命周期内切换受控模式。                                               | `string \| readonly string[] \| number`                   | —                |
| `onChange` <a id="api-InputProps--onChange"></a>                                           | 原生输入事件，通过 event.target.value 读取内容。                                                                          | `ChangeEventHandler<HTMLInputElement>`                    | —                |
| `disabled` <a id="api-InputProps--disabled"></a>                                           | 禁用输入；禁用字段不可聚焦，也不参与表单提交。                                                                            | `boolean`                                                 | `false（原生）`  |
| `readOnly` <a id="api-InputProps--readOnly"></a>                                           | 只读但仍可聚焦、复制并参与提交。                                                                                          | `boolean`                                                 | `false（原生）`  |
| `required` <a id="api-InputProps--required"></a>                                           | 启用原生必填约束；组件不会据此生成 error。                                                                                | `boolean`                                                 | `false（原生）`  |
| `type` <a id="api-InputProps--type"></a>                                                   | 原生 input 类型，例如 email、search、password、date、time；日期时间编辑界面由浏览器提供，显示格式随浏览器与地区设置变化。 | `HTMLInputTypeAttribute`                                  | `text（浏览器）` |
| `name / form` <a id="api-InputProps--name%20%2F%20form"></a>                               | 提交字段名，以及通过 ID 关联的表单。                                                                                      | `string`                                                  | —                |
| `placeholder / autoComplete` <a id="api-InputProps--placeholder%20%2F%20autoComplete"></a> | 原生输入提示与自动填充设置。placeholder 不能代替 label。                                                                  | `string`                                                  | —                |
| `className` <a id="api-InputProps--className"></a>                                         | 作用于最外层字段 div，用于字段布局。                                                                                      | `string`                                                  | —                |
| `classNames` <a id="api-InputProps--classNames"></a>                                       | 各部位的附加类名，见下表。与默认类名合并。                                                                                | `InputProps["classNames"]`                                | —                |
| `style` <a id="api-InputProps--style"></a>                                                 | 作用于 input，而非根容器。根容器布局可使用 className 或外层元素。                                                         | `CSSProperties`                                           | —                |
| `ref` <a id="api-InputProps--ref"></a>                                                     | 指向真实 input，可调用 focus、select 等原生方法。                                                                         | `Ref<HTMLInputElement>`                                   | —                |
| `aria-describedby` <a id="api-InputProps--aria%2Ddescribedby"></a>                         | 额外描述元素的 ID，会与 hint 和 error 的描述 ID 合并。                                                                    | `string`                                                  | —                |
| `aria-invalid` <a id="api-InputProps--aria%2Dinvalid"></a>                                 | 无 error 时沿用传入值；有 error 时固定为 true。true 会显示错误边框，但不会自动生成错误说明。                              | `boolean \| "false" \| "true" \| "grammar" \| "spelling"` | —                |

### classNames

| 属性           | 说明                                                           | 类型     | 默认值 |
| -------------- | -------------------------------------------------------------- | -------- | ------ |
| `label`        | 可见 label。                                                   | `string` | —      |
| `inputWrapper` | 前缀、输入框与尾部内容的共同容器；有 trailing 时承载字段轮廓。 | `string` | —      |
| `leading`      | 装饰性前缀的包装元素。                                         | `string` | —      |
| `trailing`     | 尾部内容的包装元素，不隐藏交互语义。                           | `string` | —      |
| `input`        | 真实 input；与原生 style 作用目标相同。                        | `string` | —      |
| `hint`         | 辅助说明容器，仅在有内容时渲染。                               | `string` | —      |
| `error`        | 错误说明容器，仅在有内容时渲染。                               | `string` | —      |

<a id="keyboard"></a>

## 可访问性与键盘

- 点击标签或按 Tab 聚焦；文字编辑、选择和 Enter 提交沿用浏览器原生行为。placeholder 只提供格式示例，不能代替可见标签。
- 校验失败后保留已输入的内容，用 error 说明如何修正，并可通过 ref 聚焦错误字段。只设置 aria-invalid 不会生成错误说明。

<a id="styling"></a>

## 样式定制

字段宽度、外边距等布局通过 className 或外层容器设置。调整输入框本身的外观时使用 classNames.input 或 style；需要单独设置提示或错误文字时使用 classNames.hint / classNames.error，无需依赖内部嵌套选择器。

定制例的 CSS 随源码一起复制，浅粉提示背景是局部固定颜色；整体配色使用 ThemeProvider。

<a id="text-field-customization"></a>

### 提示区域的局部定制

用 classNames.hint 调整提示背景与留白。

[查看示例文件](../../playground/src/examples/customization/TextFieldCustomization.tsx)

<!-- example-source: playground/src/examples/customization/TextFieldCustomization.tsx -->

```tsx
import { Input } from 'yahha-ui';

export default function TextFieldCustomization() {
  return (
    <>
      <style>{`
        .yahha-example-nickname-field {
          width: 100%;
          max-width: 360px;
        }
        .yahha-example-nickname-hint {
          padding: 8px 12px;
          border-radius: 8px;
          background: #fff0f6;
          color: #49313d;
        }
      `}</style>
      <Input
        label="手记署名"
        defaultValue="库米"
        maxLength={12}
        hint="用朋友们认识的名字，最多 12 个字符。"
        className="yahha-example-nickname-field"
        classNames={{ hint: 'yahha-example-nickname-hint' }}
      />
    </>
  );
}
```

<a id="related"></a>

## 相关组件

- [Textarea 多行输入](textarea.md)：用于留言、评论、个人简介等多行纯文本输入。
- [Select 下拉选择器](select.md)：从文章分类、排序方式等固定选项中选一项。
- [Form 表单](form.md)：统一管理字段值、校验、提交与重置，并定位需要修正的字段。
