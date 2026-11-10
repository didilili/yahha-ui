<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/guides/forms.tsx。 -->

# 原生表单接入

原生表单取值、校验职责、状态重置与七类控件的接入差异。

[安装与接入](../../README.md#安装与接入) · [接入示例](examples.md)

<a id="approach"></a>

## 选择接入方式

多个字段需要统一绑定、校验、显示错误和重置时，使用 [Form 表单](../components/form.md)。Form 的渲染函数提供 input、checked 和 choice 三种绑定方法，完整流程见 [基础用法与重置](../components/form.md#form-basic)。

本指南介绍使用原生 `form` 与 FormData 的方式，适合应用自行管理字段状态， 或需要读取同名多选值等原生提交数据的场景。控件页的原生表单示例用于说明各控件的 name、value、required 和 reset 行为。

当前 Form 管理顶层 string、boolean 和 null 字段。同名 Checkbox 多值可用原生 FormData.getAll() 读取，或由应用维护选中数组。七类控件与 Form 配合的完整示例见 [七类控件与错误关联](../components/form.md#form-controls)。

<a id="native-form"></a>

## 原生表单与取值

用原生 `form` 组织字段，在 onSubmit 中通过 `new FormData(event.currentTarget)` 读取当前值。字段的 name 是提交键，value 是内容。同名多项用 getAll 读取。没有 name 或被 disabled 禁用的字段不参与提交，未勾选的 Checkbox / Switch 也不会产生条目。

Button 显式设置 `type="submit"` 或 `type="reset"`，默认 type 为 button。组件支持的 form 属性可通过表单 ID 关联外部字段或按钮。本例在本地读取值，昵称由 React 控制，复选框保留原生初始勾选。

<a id="forms-basics"></a>

### 原生取值、手动校验与重置

用 FormData 读取昵称与勾选值，手动处理昵称错误和回焦，再恢复初始值。

[查看示例文件](../../playground/src/examples/forms/FormBasics.tsx)

<!-- example-source: playground/src/examples/forms/FormBasics.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Button, Checkbox, Input, Text } from 'yahha-ui';

export default function FormBasics() {
  const [nickname, setNickname] = useState('库米');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const nicknameRef = useRef<HTMLInputElement>(null);

  return (
    <form
      noValidate
      style={{ display: 'grid', gap: 16, maxWidth: 440 }}
      onInput={() => {
        setError('');
        setResult('');
      }}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const author = String(data.get('nickname') ?? '').trim();
        if (!author) {
          setError('请填写昵称。');
          nicknameRef.current?.focus();
          return;
        }
        setError('');
        setResult(
          `读取结果：昵称为“${author}”；显示署名：${data.has('showAuthor') ? '是' : '否'}。`,
        );
      }}
      onReset={() => {
        setNickname('库米');
        setError('');
        setResult('');
      }}
    >
      <Input
        ref={nicknameRef}
        label="昵称"
        name="nickname"
        value={nickname}
        onChange={(event) => setNickname(event.currentTarget.value)}
        required
        hint="必填，首尾空白不计入昵称。"
        error={error || undefined}
      />
      <Checkbox label="显示署名" name="showAuthor" value="yes" defaultChecked />
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

<a id="validation"></a>

## 校验、错误与焦点

required、type、maxLength 等按各控件支持范围保留浏览器约束。原生提交校验不通过时， onSubmit 不会执行。控件的 error 用于呈现错误和关联无障碍状态。

自定义校验由调用方实现。本例用 noValidate 关闭浏览器提交校验，再检查去除首尾空白后的昵称，失败时设置 error 并用 ref 聚焦 Input，编辑后清除过期错误与结果。Select 的 ref 指向可见触发按钮，单选组的 ref 指向 fieldset，错误回焦需定位组内 radio。详见 [Select 必选与回焦](../components/select.md#form)。

使用 Form 绑定时，由 Form 收集原生约束和自定义 validate 的结果、关联字段错误并定位 首个错误字段，见 [Form 校验时机与错误来源](../components/form.md#validation)。

<a id="reset"></a>

## 受控与非受控重置

Input / Textarea 的 value、Checkbox / Switch 的 checked、Select 的 value 可由 React 管理，配套回调必须更新状态。defaultValue / defaultChecked 只设置非受控初始值，同一字段保持一种模式。RadioGroup / SegmentedControl 只支持受控选择。

原生 reset 恢复非受控初始值。自行管理的受控值、错误、读取结果和派生状态由调用方在 onReset 中恢复。 本例浏览器恢复复选框，React 恢复昵称并清理反馈。取消 reset 默认行为后，非受控字段也不会自动恢复。半选汇总还需同步父子状态，见 [全选与半选](../components/checkbox.md#mixed)。

使用 Form 绑定时，通过 `type="reset"` 按钮或 `form.reset()`恢复首次 initialValues 并清理 Form 状态。应用额外维护的预览和保存结果仍需自行处理，见 [Form 初始值与重置](../components/form.md#reset)。

<a id="controls"></a>

## 七类控件的原生接入差异

下表说明原生 form 的取值和状态规则。左右滑动查看完整表格，键盘聚焦后可用左右方向键。

| 控件                                                         | 值与提交                                                                 | 校验与状态                                                                            |
| ------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| [Input](../components/input.md#form)                         | value / defaultValue；name 提交单行内容。                                | 原生 type / required；ref 指向 input，readOnly 保留提交。                             |
| [Textarea](../components/textarea.md#textarea-comment-draft) | value / defaultValue；提交内容保留换行。                                 | required / maxLength；长度按 UTF-16 代码单元计数，autoSize 随重置调整高度。           |
| [Select](../components/select.md#form)                       | value / defaultValue 为字符串或 null；name 提交所选值。                  | required 保留必选约束；失败回焦可见触发按钮。readOnly 可浏览且保留值。                |
| [Checkbox](../components/checkbox.md#form)                   | checked / defaultChecked 控制勾选；勾选时提交 value，同名多项用 getAll。 | required 要求该项勾选；indeterminate 独立于 checked，不改变提交值。                   |
| [RadioGroup](../components/radio-group.md#form)              | 只支持 value / onValueChange；显式 name 提供稳定的组字段名。             | required 为组内原生必选约束；禁用项不提交，reset 需恢复 React 状态。                  |
| [Switch](../components/switch.md#form)                       | checked / defaultChecked；开启时提交 value，默认 value 为 on。           | required 要求开启；loading 阻止重复切换并保留值与焦点，disabled 不提交。              |
| [SegmentedControl](../components/segmented-control.md#form)  | 只支持 value / onValueChange；name 对应原生单选组。                      | required 要求选择；reset 需恢复 React 状态，错误文字放在组外并关联 aria-describedby。 |

条件字段与完整反馈见 [交互组合：表单与反馈](../recipes/interactions.md#feedback)； 编辑保存、失败重试和关闭恢复见 [文章编辑与管理](../README.md#站内指南)。 这些流程由示例管理，接入时配置应用自己的数据与保存逻辑。
