<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# RadioGroup 单选组

用于在一组互斥选项中选择单个值，可为选项提供说明。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { RadioGroup } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

从少量互斥选项中选择一项，适合需要同时展示标签和补充说明的表单。简短的紧凑筛选使用 [SegmentedControl](segmented-control.md)；需要收起选项时使用 [Select](select.md)；切换独立内容面板使用 [Tabs](tabs.md)。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 基础用法

在两个短选项间切换，使用受控值管理选择。

[查看示例文件](../../playground/src/examples/new-forms/RadioGroupBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/RadioGroupBasic.tsx -->

```tsx
import { useState } from 'react';
import { RadioGroup } from 'yahha-ui';

export default function RadioGroupBasic() {
  const [frequency, setFrequency] = useState('weekly');
  return (
    <div style={{ maxWidth: 440 }}>
      <RadioGroup
        label="来信频率"
        value={frequency}
        onValueChange={setFrequency}
        options={[
          { value: 'weekly', label: '每周一封' },
          { value: 'monthly', label: '每月精选' },
        ]}
      />
    </div>
  );
}
```

<a id="radio-descriptions"></a>

### 选项说明

为选项提供补充说明，并说明单项禁用原因。

[查看示例文件](../../playground/src/examples/new-forms/RadioGroupDescriptions.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/RadioGroupDescriptions.tsx -->

```tsx
import { useState } from 'react';
import { RadioGroup } from 'yahha-ui';

export default function RadioGroupDescriptions() {
  const [frequency, setFrequency] = useState('weekly');
  return (
    <div style={{ maxWidth: 440 }}>
      <RadioGroup
        label="来信频率"
        value={frequency}
        onValueChange={setFrequency}
        options={[
          { value: 'weekly', label: '每周一封', description: '周末整理一周的文章与发现。' },
          { value: 'monthly', label: '每月精选', description: '只寄送当月值得反复阅读的内容。' },
          { value: 'daily', label: '每天更新', description: '每日来信暂未开放。', disabled: true },
        ]}
      />
    </div>
  );
}
```

<a id="radio-status"></a>

### 错误与禁用

选择后清除错误，并对比整组禁用状态。

[查看示例文件](../../playground/src/examples/new-forms/RadioGroupStatus.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/RadioGroupStatus.tsx -->

```tsx
import { useState } from 'react';
import { RadioGroup } from 'yahha-ui';

const options = [
  { value: 'weekly', label: '每周一封' },
  { value: 'monthly', label: '每月精选' },
];

export default function RadioGroupStatus() {
  const [frequency, setFrequency] = useState('');
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 440 }}>
      <RadioGroup
        label="来信频率"
        options={options}
        value={frequency}
        onValueChange={setFrequency}
        error={frequency ? undefined : '请选择一种来信频率。'}
      />
      <RadioGroup
        label="来信频率（已禁用）"
        options={options}
        value="weekly"
        onValueChange={() => {}}
        disabled
        hint="此设置暂不可更改。"
      />
    </div>
  );
}
```

<a id="integration"></a>

## 进阶用法

选择只影响当前示例；阅读设置与留言均不会保存或发布。

<a id="states"></a>

### 长标签与状态组合

对比长标签换行、错误与父 fieldset 禁用。

[查看示例文件](../../playground/src/examples/new-forms/RadioGroupStates.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/RadioGroupStates.tsx -->

```tsx
import { useState } from 'react';
import { Button, RadioGroup } from 'yahha-ui';

export default function RadioGroupStates() {
  const [value, setValue] = useState('');
  const options = [
    { value: 'public', label: '公开，允许所有访问个人主页的读者查看完整收藏与阅读记录' },
    { value: 'private', label: '仅自己可见', description: '收藏不会展示在个人主页。' },
  ];
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 340 }}>
      <RadioGroup
        label="收藏可见范围"
        options={options}
        value={value}
        onValueChange={setValue}
        error={value ? undefined : '请选择一种可见范围。'}
      />
      <div>
        <Button variant="secondary" onClick={() => setValue('')}>
          清空选择
        </Button>
      </div>
      <fieldset
        aria-label="禁用状态样本"
        disabled
        style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
      >
        <RadioGroup
          label="收藏可见范围（已禁用）"
          hint="此设置暂不可更改。"
          options={options}
          value="private"
          onValueChange={() => {}}
        />
      </fieldset>
    </div>
  );
}
```

<a id="form"></a>

### 受控表单与重置

读取必选项或重置；改选后清除上次读取结果。

[查看示例文件](../../playground/src/examples/new-forms/RadioGroupForm.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/RadioGroupForm.tsx -->

```tsx
import { useState } from 'react';
import { Button, RadioGroup, Text } from 'yahha-ui';

export default function RadioGroupForm() {
  const [frequency, setFrequency] = useState('');
  const [result, setResult] = useState('');
  const [hasError, setHasError] = useState(false);
  return (
    <form
      style={{ display: 'grid', gap: 16, maxWidth: 440 }}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(String(new FormData(event.currentTarget).get('frequency')));
      }}
      onReset={(event) => {
        event.preventDefault();
        setFrequency('');
        setResult('');
        setHasError(false);
      }}
    >
      <RadioGroup
        label="订阅频率"
        name="frequency"
        required
        value={frequency}
        onValueChange={(value) => {
          setFrequency(value);
          setHasError(false);
          setResult('');
        }}
        onInvalid={() => setHasError(true)}
        hint="必选，请选择一种来信频率。"
        error={hasError ? '请选择一种订阅频率，再读取表单。' : undefined}
        options={[
          { value: 'weekly', label: '每周' },
          { value: 'monthly', label: '每月' },
        ]}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="submit">读取表单</Button>
        <Button type="reset" variant="secondary">
          重置
        </Button>
      </div>
      <Text size="sm" tone="muted" role="status">
        {result && `读取结果：frequency=${result}。`}
      </Text>
    </form>
  );
}
```

<a id="radio-reading-layout"></a>

### 选项联动预览

切换标准和宽松选项，比较相同内容的行距与段距。

[查看示例文件](../../playground/src/examples/new-forms/RadioGroupReadingLayout.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/RadioGroupReadingLayout.tsx -->

```tsx
import { useState } from 'react';
import { Button, Heading, RadioGroup, Text } from 'yahha-ui';

type ReadingLayout = 'standard' | 'relaxed';
const options = [
  { value: 'standard', label: '标准', description: '常规行距与段落间距，连贯地读下去。' },
  { value: 'relaxed', label: '宽松', description: '加大行距与段落间距，让每一段更舒展。' },
] as const;
const paragraphs = [
  '傍晚买完菜，我沿着河边多走了一段。风一吹，纸袋里的葱叶就扫到鼻尖，只好一路把它往外拨。',
  '长椅旁边开着几朵小花。我想画下来，翻遍口袋才发现没带笔，倒是找出了早上买面包的小票。',
  '回家以后凭记忆补画，花瓣多画了一片。小八说没关系，看起来像一颗煎得很好的荷包蛋。',
];

export default function RadioGroupReadingLayout() {
  const [layout, setLayout] = useState<ReadingLayout>('standard');
  const relaxed = layout === 'relaxed';

  return (
    <div style={{ display: 'grid', gap: 20, minWidth: 0, maxWidth: 640, overflowWrap: 'anywhere' }}>
      <RadioGroup
        label="阅读版式"
        name="reading-layout"
        options={options}
        value={layout}
        onValueChange={setLayout}
      />
      <Text size="sm" tone="muted" role="status">
        当前版式：{relaxed ? '宽松' : '标准'}。
      </Text>
      <article aria-label="阅读版式预览" style={{ display: 'grid', gap: 16, minWidth: 0 }}>
        <Heading level={3}>傍晚绕到河边</Heading>
        <div
          style={{
            display: 'grid',
            gap: relaxed ? 'var(--yahha-space-6, 24px)' : 'var(--yahha-space-3, 12px)',
            minWidth: 0,
          }}
        >
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              style={{
                margin: 0,
                fontSize: 'var(--yahha-font-size-md, 14px)',
                lineHeight: relaxed ? 2.1 : 'var(--yahha-leading-body, 1.8)',
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </article>
      <div>
        <Button variant="secondary" onClick={() => setLayout('standard')}>
          恢复标准版式
        </Button>
      </div>
    </div>
  );
}
```

<a id="radio-comment-signature"></a>

### 条件字段与表单值

切换选项控制昵称字段，再按实际表单值预览署名。

[查看示例文件](../../playground/src/examples/new-forms/RadioGroupCommentSignature.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/RadioGroupCommentSignature.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Button, RadioGroup, Text, TextField } from 'yahha-ui';

type Signature = 'nickname' | 'anonymous';
const comment = '读到小八在面包店门口站住，我也饿了。那张路线图记得把店名补上。';

export default function RadioGroupCommentSignature() {
  const [signature, setSignature] = useState<Signature>('nickname');
  const [nickname, setNickname] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const nicknameRef = useRef<HTMLInputElement>(null);
  const anonymous = signature === 'anonymous';

  return (
    <form
      noValidate
      style={{ display: 'grid', gap: 16, minWidth: 0, maxWidth: 520 }}
      onInput={() => {
        setPreview(null);
        setError('');
      }}
      onReset={(event) => {
        event.preventDefault();
        setSignature('nickname');
        setNickname('');
        setPreview(null);
        setError('');
      }}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const method = data.get('signature');
        if (method !== 'nickname' && method !== 'anonymous') return;
        const author =
          method === 'anonymous' ? '匿名读者' : String(data.get('nickname') ?? '').trim();
        if (!author) {
          setError('请填写昵称，或选择匿名预览。');
          nicknameRef.current?.focus();
          return;
        }
        setError('');
        setPreview(author);
      }}
    >
      <div style={{ display: 'grid', gap: 8 }}>
        <Text size="sm" tone="muted">
          想留下的话
        </Text>
        <Text>{comment}</Text>
      </div>
      <RadioGroup<Signature>
        label="留言署名"
        name="signature"
        value={signature}
        onValueChange={(value) => {
          setSignature(value);
          setPreview(null);
          setError('');
        }}
        options={[
          { value: 'nickname', label: '使用昵称' },
          { value: 'anonymous', label: '匿名' },
        ]}
      />
      <TextField
        ref={nicknameRef}
        label="昵称"
        name="nickname"
        autoComplete="nickname"
        value={nickname}
        onChange={(event) => setNickname(event.currentTarget.value)}
        required={!anonymous}
        disabled={anonymous}
        hint={anonymous ? '匿名预览不会使用昵称，草稿仍保留。' : '必填，用这个昵称署名预览。'}
        error={error || undefined}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="submit">预览留言</Button>
        <Button type="reset" variant="secondary">
          重置示例
        </Button>
      </div>
      <Text role="status" size="sm" tone="muted">
        {preview === null ? '' : '预览已更新，内容未发布。'}
      </Text>
      {preview !== null && (
        <section aria-label="留言预览" style={{ display: 'grid', gap: 8 }}>
          <Text>
            <strong>署名：{preview}</strong>
          </Text>
          <Text>{comment}</Text>
        </section>
      )}
    </form>
  );
}
```

<a id="design"></a>

## 状态与表单

- 使用 value / onValueChange 管理受控选择，空字符串可表示待选择；在回调中更新 value，选项值须保持唯一。用空字符串表示未选择时，不再将其作为有效选项值。
- 显式设置 name 后，FormData 可读取已选值；同一表单内的独立组使用不同 name。form 同时关联 fieldset 和组内 radio。重置时需在 onReset 中恢复 React 状态。
- required 将必选约束传给原生 radio；hint 和 error 用于组级说明与错误，选择后的错误清除由调用方处理。
- disabled 禁用整组，options 中的 disabled 禁用单项，也支持父 fieldset 禁用。禁用项不参与切换或提交；锁定选择应使用禁用状态。
- 阅读版式例只调整下方正文的行距与段落间距，不改变控件尺寸；键盘切换时焦点随原生单选项移动， 不跳到正文或状态提示。
- 署名例在匿名时禁用昵称字段并取消必填，保留草稿供切回；预览读取当时的 FormData， 禁用的昵称不参与提交。条件字段与预览放在单选标签之外。

<a id="api"></a>

## API

### RadioGroupProps<T extends string>

| 属性                                           | 说明                                                                                                                                                            | 类型                                                                          | 默认值             |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------ |
| `label` **必填**                               | 可见的 fieldset legend，为整组命名。                                                                                                                            | `ReactNode`                                                                   | —                  |
| `options` **必填**                             | 互斥选项，value 必须唯一。                                                                                                                                      | `readonly RadioOption<T>[]`                                                   | —                  |
| `value` **必填**                               | 当前受控值；空字符串可表示未选择。                                                                                                                              | `T`                                                                           | —                  |
| `onValueChange` **必填**                       | 用户选择后的字符串值；调用方更新 value。                                                                                                                        | `(value: T) => void`                                                          | —                  |
| `hint / error`                                 | 组说明与错误，与每项 description 一同关联单选项；error 将分组标记为无效。                                                                                       | `ReactNode`                                                                   | —                  |
| `name`                                         | 组内 radio 共用名称，显式设置后可读取 FormData。                                                                                                                | `string`                                                                      | `自动生成唯一名称` |
| `form`                                         | 同时关联 fieldset 与全部 radio 的外部表单 ID。                                                                                                                  | `string`                                                                      | —                  |
| `required / disabled`                          | 原生必选或整组禁用；也支持父 fieldset disabled。                                                                                                                | `boolean`                                                                     | `false`            |
| `classNames`                                   | 各部分附加类名，每个值为 string。                                                                                                                               | `{ legend?, options?, option?, input?, label?, description?, hint?, error? }` | —                  |
| `className / style / ref / 其他 fieldset 属性` | 作用于 fieldset；ref 为 Ref<HTMLFieldSetElement>。不提供 children、defaultValue 或 defaultChecked。选项由 options 提供，组级说明使用 hint；其他内容放在组件外。 | `ComponentPropsWithRef<"fieldset">`                                           | —                  |

### RadioOption<T extends string>

| 属性             | 说明                                                | 类型        | 默认值  |
| ---------------- | --------------------------------------------------- | ----------- | ------- |
| `value` **必填** | 唯一选项值。                                        | `T`         | —       |
| `label` **必填** | 可访问选项名称。                                    | `ReactNode` | —       |
| `description`    | 补充说明，单独通过 aria-describedby 与 radio 关联。 | `ReactNode` | —       |
| `disabled`       | 禁用单项。                                          | `boolean`   | `false` |

<a id="keyboard"></a>

## 可访问性与键盘

- Tab 进入原生单选组，方向键在可用项间移动并选择，Space 选择聚焦项；禁用项跳过。各浏览器的组内 Tab 入口细节可能不同。
- 选项标签内避免嵌套链接或按钮。校验后如需将焦点移到选项，应定位组内 radio 并调用 focus；组件的 ref 指向整组 fieldset。

<a id="limits"></a>

## 样式定制

调整整组宽度可使用 className 或 style；选项间距和排列由 classNames.options 设置。 选项名称与补充说明分别使用 classNames.label、classNames.description，避免用固定高度裁切长说明。

<a id="related"></a>

## 相关组件

- [Select 下拉选择器](select.md)：从文章分类、排序方式等固定选项中选一项。
- [Checkbox 复选框](checkbox.md)：用于独立选择、多项选择或确认事项，支持半选状态。
- [SegmentedControl 分段选择](segmented-control.md)：紧凑的受控单选组，适用于分类、排序等简短选项，保留原生 radio 的表单与键盘行为。
