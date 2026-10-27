# RadioGroup 单选组

将互斥选项和说明完整展示，适合订阅频率、可见范围等少量选择。

每项采用圆形深墨轮廓，选中时以主题浅色面和实心墨点标记；选中行使用轻纸底色与加粗标签。禁用选中项保留圆点与文字，使用禁用底色。

圆点以 150ms 显隐并小幅展开，圆框底色、边框与选中行纸色同步变化；初始已选直接呈现。焦点轮廓和原生值立即更新，标记与选择行不位移。禁用、减少动效及强制颜色下保持静态。

## 设计与使用

- 圆形标记表达互斥选择，选择状态使用实心墨点；焦点是独立的外围线，选中项获得焦点后两者同时保留。
- 常规选项行至少 44px，圆形图形保持 22px。组标题、选项行和组级提示、错误使用 4px 水平留白；单项描述跟随各自标签。长标签与描述完整换行，标记对齐文字第一行，不截断决定选择所需的信息。
- 鼠标悬停加深可用圆框与已选浅粉；保留错误边框和禁用外观，触屏不依赖悬停状态。
- `legend` 命名整组，每项标签命名各自的 radio。组说明、错误和外部说明同时关联到实际 radio，方向键移动时仍能找到错误原因。
- 选项较少、需要横向紧凑选择时可使用 SegmentedControl；选项较多或空间受限时可使用 Select。RadioGroup 适合需要同时比较标签和补充说明的选择。

## Props 与默认值

- `label`：`ReactNode`，必填。可见的 fieldset legend，为整组命名。
- `options`：`readonly RadioOption<T>[]`，必填。互斥选项，value 必须唯一。
- `value`：`T extends string`，必填。当前受控值；空字符串可表示未选择。
- `onValueChange`：`(value: T) => void`，必填。用户选择后的字符串值；调用方更新 value。
- `hint / error`：`ReactNode`。组说明与错误，关联 fieldset 与每项 radio；error 设置 fieldset 的 aria-invalid。每项 description 追加在 radio 的说明之后。
- `name`：`string`，默认 `自动生成唯一名称`。组内 radio 共用名称，显式设置后可读取 FormData。
- `form`：`string`。同时关联 fieldset 与全部 radio 的外部表单 ID。
- `required / disabled`：`boolean`，默认 `false`。原生必选或整组禁用；也支持父 fieldset disabled。
- `classNames`：`{ legend?, options?, option?, input?, label?, description?, hint?, error? }`。各部分附加类名，每个值为 string。
- `className / style / ref / 其他 fieldset 属性`：`ComponentPropsWithRef<"fieldset">`。作用于 fieldset；ref 为 Ref<HTMLFieldSetElement>。不提供 defaultValue 或 defaultChecked。

### RadioOption<T extends string>

- `value`：`T`，必填。唯一选项值。
- `label`：`ReactNode`，必填。可访问选项名称。
- `description`：`ReactNode`。补充说明，单独通过 aria-describedby 与 radio 关联。
- `disabled`：`boolean`，默认 `false`。禁用单项。

## 示例

已在应用入口导入 `yahha-ui/style.css` 并由 `ThemeProvider` 包裹时：

```tsx
import { useState } from 'react';
import { RadioGroup } from 'yahha-ui';

export function RadioGroupBasic() {
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
        hint="使用方向键在可用选项间移动并选择。"
      />
    </div>
  );
}
```

## 键盘与交互

Tab 进入单选组，方向键在可用项间移动并选择，Space 选择聚焦项；禁用项不参与切换。采用原生 radio 行为。

`required` 使用原生校验；`error` 只显示调用方给出的错误，不自动判断空值。可以先以空字符串表示未选择，在 `onInvalid` 中显示错误，并在 `onValueChange` 修正后清除。组 `aria-describedby` 中的外部说明会保留到每项 radio。

## 状态、样式与能力边界

仅受控模式，不内置表单重置。调用方必须更新 `value`；需要重置时在表单 `onReset` 中恢复受控值，并防止原生 reset 与受控状态分离。示例恢复到空字符串，再次展示必选验证。

同组使用唯一 `name`，不同组不要共用名称；每项 `value` 唯一。显式 `name` 才能用预期的字段名读取 `FormData`；仅选中且未禁用的 radio 提交。`form` 同时关联 fieldset 与全部 radio，可提交到外部表单。只读不是 radio 的有效原生状态，需要锁定时使用 `disabled`。不承担 Tabs 的面板语义。

视觉圆形标记为 22px，常规单行选项操作区域为 44px，说明或长标签允许增高。组标题、选项与错误保持原生表单语义，禁用文字保持可读。
