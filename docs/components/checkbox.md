<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Checkbox 复选框

用于独立选择、多项选择或确认事项，支持半选状态。

[安装与接入](../../README.md#安装与接入)

```tsx
import { Checkbox } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于可独立勾选的选项、多项偏好和需要主动确认的同意事项。互斥选择使用 [RadioGroup](radio-group.md)；打开或关闭一个即时生效的设置使用 [Switch](switch.md)。汇总一组子项时，可用 indeterminate 表达部分已选。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 基础用法

点击标签或按空格切换勾选状态。

[查看示例文件](../../playground/src/examples/new-forms/CheckboxBasic.tsx)

<!-- example-source: playground/src/examples/new-forms/CheckboxBasic.tsx -->

```tsx
import { Checkbox } from 'yahha-ui';

export default function CheckboxBasic() {
  return <Checkbox label="接收每月阅读来信" defaultChecked />;
}
```

<a id="checkbox-controlled"></a>

### 受控勾选

通过 checked 与 onChange 同步勾选状态和相邻文字。

[查看示例文件](../../playground/src/examples/new-forms/CheckboxControlled.tsx)

<!-- example-source: playground/src/examples/new-forms/CheckboxControlled.tsx -->

```tsx
import { useState } from 'react';
import { Checkbox, Text } from 'yahha-ui';

export default function CheckboxControlled() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Checkbox
        label="订阅每月阅读来信"
        checked={subscribed}
        onChange={(event) => setSubscribed(event.target.checked)}
      />
      <Text size="sm" tone="muted">
        {subscribed ? '已订阅' : '未订阅'}
      </Text>
    </div>
  );
}
```

<a id="checkbox-disabled"></a>

### 禁用状态

对比禁用时未勾选与已勾选的外观。

[查看示例文件](../../playground/src/examples/new-forms/CheckboxDisabled.tsx)

<!-- example-source: playground/src/examples/new-forms/CheckboxDisabled.tsx -->

```tsx
import { Checkbox } from 'yahha-ui';

export default function CheckboxDisabled() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Checkbox label="站内消息提醒" disabled defaultChecked hint="暂不可更改。" />
      <Checkbox label="接收每日来信" disabled hint="此功能暂未开放。" />
    </div>
  );
}
```

<a id="checkbox-long-label"></a>

### 长标签换行

窄栏中保留完整标签。

[查看示例文件](../../playground/src/examples/new-forms/CheckboxLongLabel.tsx)

<!-- example-source: playground/src/examples/new-forms/CheckboxLongLabel.tsx -->

```tsx
import { Checkbox } from 'yahha-ui';

export default function CheckboxLongLabel() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Checkbox label="在个人主页展示收藏，并允许读者查看我分享的阅读清单与文章分类" />
    </div>
  );
}
```

<a id="mixed"></a>

### 全选与半选

逐项勾选或全选分类，查看半选状态和已选数量。

[查看示例文件](../../playground/src/examples/new-forms/CheckboxMixed.tsx)

<!-- example-source: playground/src/examples/new-forms/CheckboxMixed.tsx -->

```tsx
import { useState } from 'react';
import { Button, Checkbox, Text } from 'yahha-ui';

export default function CheckboxMixed() {
  const [selected, setSelected] = useState(['journal']);
  const items = [
    { value: 'journal', label: '生活手记' },
    { value: 'reading', label: '读书笔记' },
  ];
  return (
    <form
      style={{ display: 'grid', gap: 16, maxWidth: 440 }}
      onReset={(event) => {
        event.preventDefault();
        setSelected(['journal']);
      }}
    >
      <fieldset style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}>
        <legend>分类订阅</legend>
        <Checkbox
          label="订阅所有分类"
          checked={selected.length === items.length}
          indeterminate={selected.length > 0 && selected.length < items.length}
          onChange={(event) =>
            setSelected(event.target.checked ? items.map((item) => item.value) : [])
          }
        />
        <div style={{ paddingInlineStart: 24 }}>
          {items.map((item) => (
            <Checkbox
              key={item.value}
              label={item.label}
              name="topics"
              value={item.value}
              checked={selected.includes(item.value)}
              onChange={(event) => {
                const checked = event.target.checked;
                setSelected((current) =>
                  checked
                    ? [...current, item.value]
                    : current.filter((value) => value !== item.value),
                );
              }}
            />
          ))}
        </div>
      </fieldset>
      <Text size="sm" tone="muted" role="status">
        已选 {selected.length} 项，共 {items.length} 项。
      </Text>
      <div>
        <Button type="reset" variant="secondary">
          恢复初始选择
        </Button>
      </div>
    </form>
  );
}
```

<a id="checkbox-highlight"></a>

### 整行高亮

两组共用勾选状态，对比相同内容下的默认与整行高亮外观。

[查看示例文件](../../playground/src/examples/new-forms/CheckboxHighlight.tsx)

<!-- example-source: playground/src/examples/new-forms/CheckboxHighlight.tsx -->

```tsx
import { useState } from 'react';
import { Checkbox } from 'yahha-ui';

export default function CheckboxHighlight() {
  const [checked, setChecked] = useState(true);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <span>默认</span>
        <Checkbox
          label="接收每月阅读来信"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <span>整行高亮</span>
        <Checkbox
          label="接收每月阅读来信"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
          highlightSelected
        />
      </div>
    </div>
  );
}
```

<a id="form"></a>

### 原生表单多值与必选

用 FormData.getAll 读取同名分类，演示单项 required 与原生 reset 恢复默认勾选。

[查看示例文件](../../playground/src/examples/new-forms/CheckboxForm.tsx)

<!-- example-source: playground/src/examples/new-forms/CheckboxForm.tsx -->

```tsx
import { useState } from 'react';
import { Button, Checkbox, Text } from 'yahha-ui';

export default function CheckboxForm() {
  const [result, setResult] = useState('');
  const [agreementError, setAgreementError] = useState(false);
  return (
    <form
      style={{ display: 'grid', gap: 16, maxWidth: 440 }}
      onInput={() => setResult('')}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(new FormData(event.currentTarget).getAll('topics').join('、') || '未选择分类');
      }}
      onReset={() => {
        setResult('');
        setAgreementError(false);
      }}
    >
      <fieldset style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        <legend>订阅分类</legend>
        <Checkbox label="生活手记" name="topics" value="journal" defaultChecked />
        <Checkbox label="读书笔记" name="topics" value="reading" />
      </fieldset>
      <Checkbox
        label="我确认读取以上订阅分类"
        name="agreement"
        value="accepted"
        required
        hint="必选，请先确认已选择的订阅分类。"
        error={agreementError ? '请勾选确认后再读取订阅分类。' : undefined}
        onInvalid={(event) => {
          event.preventDefault();
          setAgreementError(true);
          event.currentTarget.focus();
        }}
        onInput={(event) => {
          if (event.currentTarget.checked) setAgreementError(false);
        }}
      />
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button type="submit">读取订阅</Button>
        <Button type="reset" variant="secondary">
          重置
        </Button>
      </div>
      <Text size="sm" tone="muted" role="status">
        {result && `读取结果：${result}。`}
      </Text>
    </form>
  );
}
```

<a id="design"></a>

## 状态与原生表单

- 默认通过方框内的勾或半选短横表达选择，整条标签可点击。显式设置 `highlightSelected` 后，已选和半选的可用标签行增加轻纸色；禁用项保留勾或短横，但取消活跃纸色。 错误说明带装饰性提醒标记，长文字换行齐文字起点，标记不单独命名或播报。
- checked / onChange 用于受控状态，defaultChecked 设置非受控初始状态。原生变化事件通过 event.target.checked 读取是否勾选。
- 设置 name 与 value 后，只有勾选且未禁用的项参与提交；同名多项使用 FormData.getAll 读取。通用取值规则见 [原生表单与取值](../guides/forms.md#native-form)。
- indeterminate 表达部分选择，由调用方根据子项计算；它与 checked 独立，实际提交仍由 checked 决定，重置时也应同步父子状态。
- required 逐项要求勾选。一组中“至少选一项”的规则需自定义校验。 自行管理原生 form 时，由调用方检查选中值并维护 error。 需要锁定选择时使用 disabled，Checkbox 不提供只读模式。
- 自行管理原生 form 时，受控状态由 onReset 恢复，非受控状态恢复 defaultChecked。见 [原生表单重置](../guides/forms.md#reset)。

<a id="form-integration"></a>

## 与 Form 配合

```tsx
import { Checkbox, Form } from 'yahha-ui';

<Form initialValues={{ newsletter: false }}>
  {(form) => <Checkbox {...form.checked('newsletter')} label="订阅更新" />}
</Form>
```

每项偏好使用独立的布尔字段。多控件接入见 [Form 控件绑定示例](form.md#form-controls)。

<a id="api"></a>

## API

### CheckboxProps

| 属性                                 | 说明                                                                              | 类型                                                      | 默认值                |
| ------------------------------------ | --------------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------- |
| `label` **必填**                     | 可点击标签。不要在 label 中嵌套链接或按钮。                                       | `ReactNode`                                               | —                     |
| `hint / error`                       | 通过 aria-describedby 关联；error 设置 aria-invalid，不自动校验。                 | `ReactNode`                                               | —                     |
| `checked / defaultChecked`           | 分别用于受控状态或非受控初始状态。                                                | `boolean`                                                 | `false（原生）`       |
| `onChange`                           | 原生事件，从 event.target.checked 读取状态。                                      | `ChangeEventHandler<HTMLInputElement>`                    | —                     |
| `indeterminate`                      | 受控半选状态，向辅助技术表达部分选择；不改变 checked 或提交值。                   | `boolean`                                                 | `false`               |
| `highlightSelected`                  | 为可用的已选和半选标签行增加轻纸色；不改变勾选、焦点或表单值。                    | `boolean`                                                 | `false`               |
| `name / value / form`                | 原生表单入口。仅勾选且未禁用时提交，通常传字符串 value。                          | `string / string \| number \| readonly string[] / string` | `value 为 on（原生）` |
| `disabled / required`                | 原生禁用与必选；支持父 fieldset disabled。                                        | `boolean`                                                 | `false（原生）`       |
| `className`                          | 根字段 div 的附加类名。                                                           | `string`                                                  | —                     |
| `classNames`                         | 各部分附加类名，每个值为 string。                                                 | `{ label?, input?, text?, hint?, error? }`                | —                     |
| `ref / style / id / 其他 input 属性` | 作用于真实 input。type 固定为 checkbox；不提供 readOnly、children、aria-checked。 | `ComponentPropsWithRef<"input">`                          | `id 自动生成`         |

<a id="keyboard"></a>

## 可访问性与键盘

- Tab 聚焦，Space 切换，点击整条标签也可切换。label 提供名称，避免在标签内嵌套链接或按钮。
- 相关复选项使用 fieldset / legend 命名整组。校验失败时，用 error 说明原因，并可通过 ref 聚焦需要修正的复选框。

<a id="limits"></a>

## 样式定制

一组复选框的间距可通过外层 flex / grid 的 gap 设置；标签文字和辅助说明可分别用 classNames.text、classNames.hint 定制。长标签应允许换行，避免固定行高裁切文字或缩小可点击范围。

<a id="recipes"></a>

## 相关组合

- [多选筛选与地址同步](../recipes/interactions.md#checkbox-reading-topics)：按任一所选主题筛选文章，支持分享、浏览器返回和无结果恢复；URL 与焦点由调用方管理。
- [批量操作与失败恢复](../recipes/interactions.md#checkbox-reading-list)：选择文章后确认移出稍后阅读，保留失败重试与焦点恢复；文章内容仍保留，流程由调用方管理。

<a id="related"></a>

## 相关组件

- [RadioGroup 单选组](radio-group.md)：用于在一组互斥选项中选择单个值，可为选项提供说明。
- [Switch 开关](switch.md)：打开或关闭即时生效的设置，例如显示文章摘要。
- [Form 表单](form.md)：统一管理字段值、校验、提交与重置，并定位需要修正的字段。
