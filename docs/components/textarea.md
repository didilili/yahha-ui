<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Textarea 多行输入

用于留言、评论、个人简介等多行纯文本输入。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Textarea } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于收集留言、文章摘要、反馈等多行纯文本。只需昵称、邮箱等单行内容时使用 [TextField](text-field.md)。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 基础用法

输入多行留言。

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
        placeholder="写下想对作者说的话"
        rows={4}
        hint="桌面端可拖动角落的调整手柄。"
      />
    </div>
  );
}
```

<a id="controlled"></a>

### 受控输入与自定义字数提示

字数由示例代码计算；检查必填内容时，失败会回焦并保留输入。

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
      <div style={{ display: 'grid', gap: 8 }}>
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
          hint={
            <span style={{ display: 'flex', flexWrap: 'wrap', columnGap: 12, rowGap: 4 }}>
              <span>必填</span>
              <span
                style={{
                  marginInlineStart: 'auto',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                已输入 {message.length} / 200
              </span>
            </span>
          }
          error={error}
        />
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <Button type="submit">检查留言</Button>
        <Text size="sm" tone="muted" role="status">
          {submitted && message.trim() ? '检查结果：留言符合要求。' : ''}
        </Text>
      </div>
    </form>
  );
}
```

<a id="textarea-auto-size"></a>

### 自动调整高度

内容在二至八行间自动增减高度，超出后在框内滚动。

[查看示例文件](../../playground/src/examples/new-forms/TextareaAutoSize.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/TextareaAutoSize.tsx -->

```tsx
import { Textarea } from 'yahha-ui';

export default function TextareaAutoSize() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Textarea
        label="文章摘要"
        name="summary"
        defaultValue="小八说沿河走一会儿，结果先带大家拐进了面包店。"
        autoSize={{ minRows: 2, maxRows: 8 }}
      />
    </div>
  );
}
```

<a id="textarea-states"></a>

### 只读与禁用

对比只读可复制和禁用不可编辑两种状态。

[查看示例文件](../../playground/src/examples/new-forms/TextareaReadonlyDisabled.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/TextareaReadonlyDisabled.tsx -->

```tsx
import { Textarea } from 'yahha-ui';

export default function TextareaReadonlyDisabled() {
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 480 }}>
      <Textarea
        label="已发布简介"
        value="写散步时的发现，也写没忍住多买的点心。"
        readOnly
        rows={2}
      />
      <fieldset disabled style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        <Textarea label="暂时关闭留言" defaultValue="留言暂时关闭，当前内容不可编辑。" rows={2} />
      </fieldset>
    </div>
  );
}
```

<a id="integration"></a>

## 进阶用法

以下示例只在本地操作，不发送或保存留言。

<a id="native"></a>

### 原生重置

修改非受控草稿后，通过原生表单重置恢复初始内容。

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
      <Button type="reset" variant="secondary">
        重置草稿
      </Button>
    </form>
  );
}
```

<a id="textarea-comment-draft"></a>

### 草稿预览与恢复

校验并预览当前草稿，保留原文换行；可恢复初始内容。

[查看示例文件](../../playground/src/examples/new-forms/TextareaCommentDraft.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/TextareaCommentDraft.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Button, Text, Textarea } from 'yahha-ui';

const draft = '小八的鼻子比路线图还管用。\n下次也想沿着河边找找那家面包店。';

export default function TextareaCommentDraft() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  return (
    <form
      noValidate
      style={{ display: 'grid', gap: 16, minWidth: 0 }}
      onInput={() => {
        setPreview(null);
        setError('');
      }}
      onReset={() => {
        setPreview(null);
        setError('');
      }}
      onSubmit={(event) => {
        event.preventDefault();
        const message = String(new FormData(event.currentTarget).get('comment') ?? '');
        if (!message.trim()) {
          setError('请填写留言后再预览。');
          inputRef.current?.focus();
          return;
        }
        setError('');
        setPreview(message);
      }}
    >
      <Textarea
        ref={inputRef}
        label="给这篇手记留句话"
        name="comment"
        defaultValue={draft}
        autoSize={{ minRows: 2, maxRows: 8 }}
        required
        hint="请填写留言；草稿只在当前示例，预览不会发送。"
        error={error || undefined}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="submit">预览留言</Button>
        <Button type="reset" variant="secondary">
          恢复草稿
        </Button>
      </div>
      <Text role="status" size="sm" tone="muted">
        {preview === null ? '' : '预览已更新，内容未发送。'}
      </Text>
      {preview !== null && (
        <section aria-label="留言预览" style={{ whiteSpace: 'pre-wrap' }}>
          <Text>{preview}</Text>
        </section>
      )}
    </form>
  );
}
```

<a id="api"></a>

## API

### TextareaProps

| 属性                                           | 说明                                                                                                    | 类型                                                | 默认值          |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | --------------- |
| `label` **必填**                               | 可见标签，自动关联 textarea。                                                                           | `ReactNode`                                         | —               |
| `hint / error`                                 | 辅助和错误说明，与 aria-describedby 合并；error 设置 aria-invalid，并在错误文字前显示提醒标记。         | `ReactNode`                                         | —               |
| `rows`                                         | 原生可见行数。                                                                                          | `number`                                            | `4`             |
| `autoSize`                                     | 按内容自动调整高度，可限制行数；true 或空对象以 rows 为最小值，无最大值。                               | `boolean \| { minRows?: number; maxRows?: number }` | `false`         |
| `value / defaultValue`                         | 沿用 React textarea 原生值类型；受控模式搭配 onChange。通常使用 string。                                | `string \| readonly string[] \| number`             | —               |
| `onChange`                                     | 原生变化事件。                                                                                          | `ChangeEventHandler<HTMLTextAreaElement>`           | —               |
| `disabled / readOnly / required`               | 原生禁用、只读和必填约束。                                                                              | `boolean`                                           | `false（原生）` |
| `name / form / maxLength / 其他 textarea 属性` | 直接作用于 textarea，保留原生输入与表单语义。                                                           | `ComponentPropsWithRef<"textarea">`                 | —               |
| `className`                                    | 根字段 div 的附加类名。                                                                                 | `string`                                            | —               |
| `classNames`                                   | 各部分附加类名，每个值为 string。                                                                       | `{ label?, textarea?, hint?, error? }`              | —               |
| `ref / style`                                  | 作用于真实 textarea。默认 resize: vertical；开启 autoSize 时 height、resize、overflowY 由自动高度管理。 | `Ref<HTMLTextAreaElement> / CSSProperties`          | —               |
| `id`                                           | textarea 的 ID，用于标签及提示关联。                                                                    | `string`                                            | `自动生成`      |

<a id="keyboard"></a>

## 可访问性与键盘

- label 自动关联 textarea，点击标签或按 Tab 聚焦；保留原生的文字选择、复制和多行编辑行为。Enter 插入换行。
- placeholder 只提供补充示例，标签应保持可见。自定义校验失败时，用 error 说明如何修正，并可通过 ref 聚焦输入区域；提醒标记辅助识别错误，不单独播报，错误的设置与清除由调用方处理。

<a id="limits"></a>

## 状态与表单

- value / onChange 用于受控内容，defaultValue 用于非受控初始内容。非受控内容随原生表单重置，受控内容需在 onReset 中恢复 React 状态。
- name、form、required 和 maxLength 沿用原生 textarea 属性。需要长度反馈或自定义校验时，由调用方维护说明和 error。
- 受控例使用 noValidate 跳过浏览器提交校验，由示例检查空白内容；error 只呈现错误。输入长度与原生 maxLength 均按 UTF-16 代码单元计数，部分表情会占多个单位。
- readOnly 仍可聚焦、复制并参与提交；disabled 不可编辑或聚焦，也不参与提交。必填要求应同时提供可见说明。
- autoSize 默认关闭。开启后随内容、可用宽度及重置调整高度，达到 maxRows 后内部滚动， 不改变文字、原生事件或 Enter 换行。受控内容仍由调用方恢复，取消原生重置时保留当前内容。
- minRows 未给时采用有效的 rows，未传 rows 则为 4；行数取正有限数，向下取整后至少为 1， 非法 minRows 回退 rows，非法 maxRows 视为无上限，maxRows 小于 minRows 时以 minRows 为界。

<a id="styling"></a>

## 样式定制

默认用 rows 设置初始可见行数并允许垂直拖动，内容超出后滚动。 开启 autoSize 时组件接管 height、resize、overflowY；关闭后交还当前 style。 minHeight / maxHeight 仍是额外的 CSS 约束，与行数上下限冲突时会影响实际可见行数。 字段宽度由 className 或外层容器控制。

<a id="related"></a>

## 相关组件

- [TextField 单行输入](text-field.md)：带可见标签、辅助说明和错误反馈的单行输入框。
- [Button 按钮](button.md)：用于触发操作，支持不同强调程度、禁用、加载和切换状态。
