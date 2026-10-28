<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Textarea 多行输入

用于留言、评论、个人简介和需要换行的轻量表单。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Textarea } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

收集留言、文章摘要、反馈等需要换行的纯文本。只需昵称、邮箱等单行内容时使用 [TextField](text-field.md)。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 基本使用

输入多行留言；桌面端可拖动角落的调整手柄改变输入区域的高度。

[查看示例文件](../../playground/src/examples/new-forms/TextareaBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/TextareaBasic.tsx -->

```tsx
import { Textarea } from 'yahha-ui';

export default function TextareaBasic() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Textarea
        label="给作者留言"
        name="message"
        placeholder="想说的话，可以慢慢写……"
        rows={4}
        hint="支持换行；桌面端可拖动角落的调整手柄。"
      />
    </div>
  );
}
```

<a id="controlled"></a>

### 受控内容与校验

value / onChange 管理内容和字数。点击“检查留言”进行本地必填检查，空白时显示错误并通过 ref 聚焦，通过时显示检查结果；本例不会发送数据。

[查看示例文件](../../playground/src/examples/new-forms/TextareaControlled.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/TextareaControlled.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Button, Text, Textarea } from 'yahha-ui';

export default function TextareaControlled() {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const error = submitted && !message.trim() ? '请填写留言后再检查。' : undefined;
  return (
    <form
      noValidate
      style={{ display: 'grid', gap: 16, maxWidth: 480 }}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        if (!message.trim()) ref.current?.focus();
      }}
    >
      <Textarea
        ref={ref}
        label="留言内容"
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
          setSubmitted(false);
        }}
        required
        maxLength={200}
        hint={`${message.length} / 200 字`}
        error={error}
      />
      <Button type="submit">检查留言</Button>
      <Text size="sm" tone="muted" role="status">
        {submitted && message.trim() ? '检查结果：留言符合要求。' : ''}
      </Text>
    </form>
  );
}
```

<a id="native"></a>

### 原生重置、只读与禁用

修改草稿后重置，恢复初始内容；另展示禁止拖动的只读字段与父 fieldset 禁用。

[查看示例文件](../../playground/src/examples/new-forms/TextareaStates.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/TextareaStates.tsx -->

```tsx
import { Button, Textarea } from 'yahha-ui';

export default function TextareaStates() {
  return (
    <form style={{ display: 'grid', gap: 20, maxWidth: 480 }}>
      <Textarea
        label="草稿"
        name="draft"
        defaultValue="今天在河边遇见了一只小鸟。"
        rows={3}
        hint="修改后点击重置，恢复初始内容。"
      />
      <Textarea
        label="已发布简介"
        value="认真记录生活里的小事情。"
        readOnly
        rows={2}
        style={{ resize: 'none' }}
      />
      <fieldset disabled style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        <Textarea label="暂时关闭留言" defaultValue="稍后再来看看吧。" rows={2} />
      </fieldset>
      <Button type="reset" variant="secondary">
        重置草稿
      </Button>
    </form>
  );
}
```

<a id="api"></a>

## API

### TextareaProps

| 参数                                           | 说明                                                                     | 类型                                       | 默认值          |
| ---------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------ | --------------- |
| `label` **必填**                               | 可见标签，自动关联 textarea。                                            | `ReactNode`                                | —               |
| `hint / error`                                 | 辅助和错误说明，与 aria-describedby 合并；error 设置 aria-invalid。      | `ReactNode`                                | —               |
| `rows`                                         | 原生可见行数。                                                           | `number`                                   | `4`             |
| `value / defaultValue`                         | 沿用 React textarea 原生值类型；受控模式搭配 onChange。通常使用 string。 | `string \| readonly string[] \| number`    | —               |
| `onChange`                                     | 原生变化事件。                                                           | `ChangeEventHandler<HTMLTextAreaElement>`  | —               |
| `disabled / readOnly / required`               | 原生禁用、只读和必填约束。                                               | `boolean`                                  | `false（原生）` |
| `name / form / maxLength / 其他 textarea 属性` | 直接作用于 textarea，保留原生输入与表单语义。                            | `ComponentPropsWithRef<"textarea">`        | —               |
| `className`                                    | 根字段 div 的附加类名。                                                  | `string`                                   | —               |
| `classNames`                                   | 各部分附加类名，每个值为 string。                                        | `{ label?, textarea?, hint?, error? }`     | —               |
| `ref / style`                                  | 作用于真实 textarea。默认 resize: vertical，style 可覆盖。               | `Ref<HTMLTextAreaElement> / CSSProperties` | —               |
| `id`                                           | textarea 的 ID，用于标签及提示关联。                                     | `string`                                   | `自动生成`      |

<a id="keyboard"></a>

## 可访问性与键盘

- label 自动关联 textarea，点击标签或按 Tab 聚焦；保留原生的文字选择、复制和多行编辑行为。Enter 插入换行。
- placeholder 只提供补充示例，标签应保持可见。自定义校验失败时，用 error 说明如何修正，并可通过 ref 聚焦输入区域；错误的设置与清除由调用方处理。

<a id="limits"></a>

## 状态与表单

- value / onChange 用于受控内容，defaultValue 用于非受控初始内容。非受控内容随原生表单重置，受控内容需在 onReset 中恢复 React 状态。
- name、form、required 和 maxLength 沿用原生 textarea 属性。需要字数反馈或自定义校验时，由调用方维护说明和 error。
- readOnly 仍可聚焦、复制并参与提交；disabled 不可编辑或聚焦，也不参与提交。必填要求应同时提供可见说明。

<a id="styling"></a>

## 样式定制

使用 rows 设置初始可见行数，默认四行；内容超出后滚动，不会随输入自动增高。 通过 style 或 classNames.textarea 调整高度、minHeight 与 resize；字段宽度由 className 或外层容器控制。默认允许用户垂直拖动，固定高度前应考虑长内容的编辑需要。

<a id="related"></a>

## 相关组件

- [TextField 单行输入](text-field.md)：带可见标签的单行输入框，用于站内搜索、个人资料和轻量表单。
- [Button 按钮](button.md)：触发提交、收藏或其他操作的原生按钮，提供三种强调程度与完整的交互状态。
