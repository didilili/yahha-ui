<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# RadioGroup 单选组

将互斥选项和说明完整展示，适合订阅频率、可见范围等少量选择。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { RadioGroup } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

从少量互斥选项中选择一项，尤其适合需要同时阅读标签和补充说明的表单。简短的紧凑筛选使用 [SegmentedControl](segmented-control.md)；需要收起选项时使用 [Select](select.md)；切换独立内容面板使用 [Tabs](tabs.md)。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 标签与选项说明

用 label 命名单选组，description 说明各个选项的含义。使用方向键在可用选项间移动并选择。

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
          { value: 'weekly', label: '每周一封', description: '周末整理一周的文章与发现。' },
          { value: 'monthly', label: '每月精选', description: '只寄送当月值得反复阅读的内容。' },
          { value: 'daily', label: '每天更新', description: '此选项暂未开放。', disabled: true },
        ]}
      />
    </div>
  );
}
```

<a id="form"></a>

### 受控表单与重置

从未选择开始体验 required 校验，选择后清除错误并读取提交值；onReset 显式恢复未选择，保持 React 与表单状态一致。

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

<a id="states"></a>

### 长标签、错误与禁用

选择收藏可见范围以清除错误；点击“清空选择”重新显示错误。下方展示整组禁用时的“仅自己可见”状态。

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

<a id="design"></a>

## 状态与表单

- 使用 value / onValueChange 管理受控选择，空字符串可表示待选择；在回调中更新 value，选项值须保持唯一。
- 显式设置 name 后，FormData 可读取已选值；form 同时关联 fieldset 和组内 radio。重置时需在 onReset 中恢复 React 状态。
- required 将必选约束传给原生 radio；hint 和 error 用于组级说明与错误，选择后的错误清除由调用方处理。
- disabled 禁用整组，options 中的 disabled 禁用单项，也支持父 fieldset 禁用。禁用项不参与切换或提交；锁定选择应使用禁用状态。

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

- [Select 下拉选择器](select.md)：在有限的文章分类、排序或归档选项中选择一项。
- [Checkbox 复选框](checkbox.md)：用于多项选择、订阅选项和需要主动确认的轻量表单。
- [SegmentedControl 分段选择](segmented-control.md)：在少量互斥选项间切换，使用原生 radio 保留表单与键盘行为。
