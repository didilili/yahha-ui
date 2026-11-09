<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# RadioGroup 单选组

用于在一组互斥选项中选择单个值，可为选项提供说明。

[安装与接入](../../README.md#安装与接入)

```tsx
import { RadioGroup } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

从少量互斥选项中选择一项，适合需要同时展示标签和补充说明的表单。简短的紧凑筛选使用 [SegmentedControl](segmented-control.md)；需要收起选项时使用 [Select](select.md)；切换独立内容面板使用 [Tabs](tabs.md)。

RadioGroup 只支持受控选择，需传入 value 与 onValueChange。自行管理原生 form 时由调用方恢复重置后的 value，使用 Form 绑定时由 Form 统一管理。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 基础用法

通过 value 与 onValueChange 在两个互斥选项间切换。

[查看示例文件](../../playground/src/examples/new-forms/RadioGroupBasic.tsx)

<!-- example-source: playground/src/examples/new-forms/RadioGroupBasic.tsx -->

```tsx
import { useState } from 'react';
import { RadioGroup } from 'yahha-ui';

export default function RadioGroupBasic() {
  const [frequency, setFrequency] = useState('weekly');
  const options = [
    { value: 'weekly', label: '每周一封' },
    { value: 'monthly', label: '每月精选' },
  ];
  return (
    <RadioGroup label="来信频率" value={frequency} onValueChange={setFrequency} options={options} />
  );
}
```

<a id="radio-descriptions"></a>

### 选项说明与单项禁用

为选项提供补充说明，并说明单项禁用原因。

[查看示例文件](../../playground/src/examples/new-forms/RadioGroupDescriptions.tsx)

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

### 错误、清空与禁用

清空后恢复错误，对比直接禁用与父 fieldset 禁用。

[查看示例文件](../../playground/src/examples/new-forms/RadioGroupStatus.tsx)

<!-- example-source: playground/src/examples/new-forms/RadioGroupStatus.tsx -->

```tsx
import { useState } from 'react';
import { Button, RadioGroup } from 'yahha-ui';

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
      <div>
        <Button type="button" variant="secondary" onClick={() => setFrequency('')}>
          清空选择
        </Button>
      </div>
      <RadioGroup
        label="来信频率（已禁用）"
        options={options}
        value="weekly"
        onValueChange={() => {}}
        disabled
        hint="此设置暂不可更改。"
      />
      <fieldset
        aria-label="父级禁用状态样本"
        disabled
        style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
      >
        <RadioGroup
          label="收藏可见范围（父级已禁用）"
          hint="此设置暂不可更改。"
          options={[
            { value: 'public', label: '公开' },
            { value: 'private', label: '仅自己可见', description: '收藏不会展示在个人主页。' },
          ]}
          value="private"
          onValueChange={() => {}}
        />
      </fieldset>
    </div>
  );
}
```

<a id="radio-long-labels"></a>

### 长标签换行

在窄栏中切换选项，查看长标签与说明的换行。

[查看示例文件](../../playground/src/examples/new-forms/RadioGroupLongLabels.tsx)

<!-- example-source: playground/src/examples/new-forms/RadioGroupLongLabels.tsx -->

```tsx
import { useState } from 'react';
import { RadioGroup } from 'yahha-ui';

export default function RadioGroupLongLabels() {
  const [visibility, setVisibility] = useState('public');

  return (
    <div style={{ maxWidth: 340 }}>
      <RadioGroup
        label="收藏可见范围"
        value={visibility}
        onValueChange={setVisibility}
        options={[
          { value: 'public', label: '公开，允许所有访问个人主页的读者查看完整收藏与阅读记录' },
          { value: 'private', label: '仅自己可见', description: '收藏不会展示在个人主页。' },
        ]}
      />
    </div>
  );
}
```

<a id="radio-highlight"></a>

### 整行高亮

两组共用选择值，对比相同内容和状态下的默认与整行高亮外观。

[查看示例文件](../../playground/src/examples/new-forms/RadioGroupHighlight.tsx)

<!-- example-source: playground/src/examples/new-forms/RadioGroupHighlight.tsx -->

```tsx
import { useState } from 'react';
import { RadioGroup } from 'yahha-ui';

export default function RadioGroupHighlight() {
  const [frequency, setFrequency] = useState('weekly');
  const options = [
    { value: 'weekly', label: '每周一封' },
    { value: 'monthly', label: '每月精选' },
  ];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <span>默认</span>
        <RadioGroup
          label="来信频率"
          value={frequency}
          onValueChange={setFrequency}
          options={options}
        />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <span>整行高亮</span>
        <RadioGroup
          label="来信频率"
          value={frequency}
          onValueChange={setFrequency}
          options={options}
          highlightSelected
        />
      </div>
    </div>
  );
}
```

<a id="form"></a>

### 原生表单取值与重置

演示 required 必选、FormData 取值，以及在原生 onReset 中显式恢复受控选择。

[查看示例文件](../../playground/src/examples/new-forms/RadioGroupForm.tsx)

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

切换标准和宽松选项，比较相同内容的行距与段距；仅当前示例生效。

[查看示例文件](../../playground/src/examples/new-forms/RadioGroupReadingLayout.tsx)

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

<a id="design"></a>

## 状态与原生表单

- 选项标题保持固定字重，避免窄栏中的长标题因选中加粗而重新换行；默认通过圆点和白环表达选中。 显式设置 `highlightSelected` 为可用选中行增加轻纸色与内底缘，不改变行高或表单值。
- 使用 value / onValueChange 管理受控选择，空字符串可表示待选择；在回调中更新 value，选项值须保持唯一。用空字符串表示未选择时，不再将其作为有效选项值。
- 显式 name 提供稳定的提交字段名，独立组使用不同 name；form 同时关联 fieldset 和组内 radio。自行管理原生 form 时，需在 onReset 中恢复受控 value，见 [原生表单重置](../guides/forms.md#reset)。
- required 将必选约束传给原生 radio，hint 和 error 用于组级说明与错误。 自行管理原生 form 时，校验与错误关联见 [原生表单接入](../guides/forms.md#validation)。错误说明带装饰性提醒标记， 长文字换行齐文字起点；标记不单独命名或播报。
- disabled 禁用整组，options 中的 disabled 禁用单项，也支持父 fieldset 禁用。禁用项不参与切换或提交；锁定选择应使用禁用状态。
- 阅读版式例只调整下方正文的行距与段落间距，不改变控件尺寸；键盘切换时焦点随原生单选项移动， 不跳到正文或状态提示。
- 跨字段的条件必填、禁用值与草稿恢复见 [交互组合：条件字段与表单值](../recipes/interactions.md#radio-comment-signature)。

<a id="form-integration"></a>

## 与 Form 配合

```tsx
import { Form, RadioGroup } from 'yahha-ui';

<Form initialValues={{ frequency: 'weekly' }}>
  {(form) => (
    <RadioGroup
      {...form.choice('frequency')}
      label="来信频率"
      options={[
        { value: 'weekly', label: '每周' },
        { value: 'monthly', label: '每月' },
      ]}
    />
  )}
</Form>
```

空字符串表示待选择，配合 required 实现必选。多控件接入见 [Form 控件绑定示例](form.md#form-controls)。

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
| `highlightSelected`                            | 为可用选中行增加轻纸色与内底缘；圆点、焦点和表单行为始终保留。                                                                                                  | `boolean`                                                                     | `false`            |
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
- [Form 表单](form.md)：统一管理字段值、校验、提交与重置，并定位需要修正的字段。
