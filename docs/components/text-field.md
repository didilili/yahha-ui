<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# TextField 单行输入

带可见标签的单行输入框，用于站内搜索、个人资料和轻量表单。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { TextField } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

收集昵称、邮箱、搜索关键词等单行文字。标签说明要填什么，placeholder 补充格式示例；需要填写留言、摘要等多行内容时使用 [Textarea](textarea.md)。只能从固定选项中选值时使用 [Select](select.md)。

<a id="examples"></a>

## 代码演示

本页示例只在本地操作，不发送或保存表单数据。

<a id="basic"></a>

### 基础用法

用可见标签命名字段，并提供可编辑的初始值。

[查看示例文件](../../playground/src/examples/forms/TextFieldBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/forms/TextFieldBasic.tsx -->

```tsx
import { TextField } from 'yahha-ui';

export default function TextFieldBasic() {
  return (
    <TextField
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

### 受控输入与装饰图标

输入关键词并查看当前值；本例不筛选文章。

[查看示例文件](../../playground/src/examples/forms/TextFieldControlled.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/forms/TextFieldControlled.tsx -->

```tsx
import { useState } from 'react';
import { Text, TextField } from 'yahha-ui';

export default function TextFieldControlled() {
  const [keyword, setKeyword] = useState('');

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <TextField
        label="搜索文章"
        type="search"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="输入文章标题"
        leading={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
        }
        hint="可输入标题中的一部分。"
      />
      <Text size="sm" tone="muted">
        当前关键词：{keyword || '未填写'}
      </Text>
    </div>
  );
}
```

<a id="validation"></a>

### 提示与本地校验

检查昵称，校验失败时聚焦字段，保留已输入内容。

[查看示例文件](../../playground/src/examples/forms/TextFieldValidation.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/forms/TextFieldValidation.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Button, Text, TextField } from 'yahha-ui';

export default function TextFieldValidation() {
  const [nickname, setNickname] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const valid = nickname.trim().length >= 2 && nickname.trim().length <= 12;
  const error = submitted && !valid ? '请填写 2～12 个字符的昵称。' : undefined;

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
      <TextField
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
        hint="必填，2～12 个字符。"
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

<a id="native"></a>

### 字段状态与原生输入类型

对比只读、禁用与原生输入类型，可检查邮箱格式。

[查看示例文件](../../playground/src/examples/forms/TextFieldNative.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/forms/TextFieldNative.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Button, Text, TextField } from 'yahha-ui';

export default function TextFieldNative() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState('');

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'grid', gap: 16 }}>
        <p style={{ margin: 0 }}>禁用与只读</p>
        <TextField label="暂不可编辑" disabled defaultValue="等待同步" />
        <TextField
          label="公开地址"
          readOnly
          defaultValue="https://example.com"
          hint="可以复制此地址。"
        />
      </div>
      <div style={{ display: 'grid', gap: 16 }}>
        <p style={{ margin: 0 }}>邮箱与密码</p>
        <form
          style={{ display: 'grid', gap: 16 }}
          onInvalidCapture={() => setResult('')}
          onSubmit={(event) => {
            event.preventDefault();
            setResult('检查结果：邮箱格式正确。');
          }}
        >
          <TextField
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
        <TextField
          label="示例密码"
          type="password"
          autoComplete="new-password"
          placeholder="输入密码"
        />
      </div>
      <div style={{ display: 'grid', gap: 16 }}>
        <p style={{ margin: 0 }}>日期与时间</p>
        <TextField label="记录日期" type="date" name="recordDate" defaultValue="2026-10-28" />
        <TextField label="记录时间" type="time" name="recordTime" defaultValue="10:30" />
      </div>
    </div>
  );
}
```

<a id="form"></a>

### 表单提交与重置

读取本地表单或恢复初始值；编辑后清除上次读取结果。

[查看示例文件](../../playground/src/examples/forms/TextFieldForm.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/forms/TextFieldForm.tsx -->

```tsx
import { useState } from 'react';
import { Button, Text, TextField } from 'yahha-ui';

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
      <TextField
        label="文章标题"
        name="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
        hint="必填，请填写文章标题。"
      />
      <TextField label="文章分类" name="category" defaultValue="生活" />
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

<a id="design"></a>

## 状态与表单

- value / onChange 管理受控输入；defaultValue 设置非受控初始值。保持一种模式，避免同时传入两种值。
- 设置 name 后可用 FormData 读取内容，form 可关联外部表单。非受控输入随原生表单重置；受控输入需在 onReset 中恢复 React 状态。
- readOnly 保留聚焦、选择、复制和提交能力；disabled 阻止交互并退出键盘顺序，字段也不参与提交。
- type、autoComplete、required 等沿用原生 input 行为。required 启用浏览器约束，必填要求也应写在可见标签或提示中。
- error 只显示错误，不执行校验。本地校验例使用 noValidate 跳过浏览器提交校验，由示例检查昵称并设置或清除 error；邮箱例保留浏览器必填与格式校验。

<a id="api"></a>

## API

下表列出组件属性和常用原生入口。其余原生 `input` 属性与事件也传给输入框， 不支持原生 `size` 属性。

### TextFieldProps

| 属性                         | 说明                                                                                                                      | 类型                                   | 默认值           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ---------------- |
| `label` **必填**             | 可见标签，自动关联 input。请提供有意义的字段名称。                                                                        | `ReactNode`                            | —                |
| `hint`                       | 辅助说明，通过 aria-describedby 与 input 关联。                                                                           | `ReactNode`                            | —                |
| `error`                      | 错误说明。有内容时设置 aria-invalid，不执行校验。                                                                         | `ReactNode`                            | —                |
| `leading`                    | 18×18px 的装饰图标槽，超出内容会裁切；包装元素 aria-hidden，不放长前缀、交互控件或必要文字。                              | `ReactNode`                            | —                |
| `id`                         | input 的 ID，同时用于标签、提示和错误关联。                                                                               | `string`                               | `自动生成`       |
| `value`                      | 受控值，需配合 onChange。不要与 defaultValue 同时使用。                                                                   | `TextFieldProps["value"]`              | —                |
| `defaultValue`               | 非受控输入的初始值。不要在生命周期内切换受控模式。                                                                        | `TextFieldProps["defaultValue"]`       | —                |
| `onChange`                   | 原生输入事件，通过 event.target.value 读取内容。                                                                          | `ChangeEventHandler<HTMLInputElement>` | —                |
| `disabled`                   | 禁用输入；禁用字段不可聚焦，也不参与表单提交。                                                                            | `boolean`                              | `false（原生）`  |
| `readOnly`                   | 只读但仍可聚焦、复制并参与提交。                                                                                          | `boolean`                              | `false（原生）`  |
| `required`                   | 启用原生必填约束；组件不会据此生成 error。                                                                                | `boolean`                              | `false（原生）`  |
| `type`                       | 原生 input 类型，例如 email、search、password、date、time；日期时间编辑界面由浏览器提供，显示格式随浏览器与地区设置变化。 | `HTMLInputTypeAttribute`               | `text（浏览器）` |
| `name / form`                | 提交字段名，以及通过 ID 关联的表单。                                                                                      | `string`                               | —                |
| `placeholder / autoComplete` | 原生输入提示与自动填充设置。placeholder 不能代替 label。                                                                  | `string`                               | —                |
| `className`                  | 作用于最外层字段 div，用于字段布局。                                                                                      | `string`                               | —                |
| `classNames`                 | 各部位的附加类名，见下表。与默认类名合并。                                                                                | `TextFieldProps["classNames"]`         | —                |
| `style`                      | 作用于 input，而非根容器。根容器布局可使用 className 或外层元素。                                                         | `CSSProperties`                        | —                |
| `ref`                        | 指向真实 input，可调用 focus、select 等原生方法。                                                                         | `Ref<HTMLInputElement>`                | —                |
| `aria-describedby`           | 额外描述元素的 ID，会与 hint 和 error 的描述 ID 合并。                                                                    | `string`                               | —                |
| `aria-invalid`               | 无 error 时沿用传入值；有 error 时固定为 true。true 会显示错误边框，但不会自动生成错误说明。                              | `TextFieldProps["aria-invalid"]`       | —                |

### classNames

| 属性           | 说明                                    | 类型     | 默认值 |
| -------------- | --------------------------------------- | -------- | ------ |
| `label`        | 可见 label。                            | `string` | —      |
| `inputWrapper` | 前缀与输入框的共同容器。                | `string` | —      |
| `leading`      | 装饰性前缀的包装元素。                  | `string` | —      |
| `input`        | 真实 input；与原生 style 作用目标相同。 | `string` | —      |
| `hint`         | 辅助说明容器，仅在有内容时渲染。        | `string` | —      |
| `error`        | 错误说明容器，仅在有内容时渲染。        | `string` | —      |

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

[查看示例文件](../../playground/src/examples/customization/TextFieldCustomization.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/customization/TextFieldCustomization.tsx -->

```tsx
import { TextField } from 'yahha-ui';

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
      <TextField
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

- [Textarea 多行输入](textarea.md)：用于留言、评论、个人简介和需要换行的轻量表单。
- [Select 下拉选择器](select.md)：在有限的文章分类、排序或归档选项中选择一项。
