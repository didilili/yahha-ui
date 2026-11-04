<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Checkbox 复选框

用于多项选择、订阅选项和需要主动确认的轻量表单。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Checkbox } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于可独立勾选的事项、允许多选的偏好和需要提交确认的同意项。互斥选择使用 [RadioGroup](radio-group.md)；打开或关闭一个即时生效的设置使用 [Switch](switch.md)。汇总一组子项时，可用 indeterminate 表达部分已选。

<a id="examples"></a>

## 代码演示

本页示例只在本地勾选和读取，不实际订阅或保存设置。

<a id="basic"></a>

### 基本状态

切换勾选状态，并对比禁用与长标签。

[查看示例文件](../../playground/src/examples/new-forms/CheckboxBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/CheckboxBasic.tsx -->

```tsx
import { Checkbox } from 'yahha-ui';

export default function CheckboxBasic() {
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 440 }}>
      <div style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0 }}>默认未勾选</p>
        <Checkbox label="接收每月阅读来信" />
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0 }}>初始勾选与禁用状态</p>
        <Checkbox label="在个人主页展示收藏" defaultChecked />
        <Checkbox label="站内消息提醒" disabled defaultChecked hint="暂不可更改。" />
        <Checkbox label="接收每日来信" disabled hint="此功能暂未开放。" />
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0 }}>长标签</p>
        <Checkbox label="在个人主页展示收藏，并允许读者查看我分享的阅读清单与文章分类" />
      </div>
    </div>
  );
}
```

<a id="mixed"></a>

### 受控选择与半选

全选联动分类，查看半选与数量变化。

[查看示例文件](../../playground/src/examples/new-forms/CheckboxMixed.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

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

<a id="form"></a>

### 表单提交、必选与重置

读取已勾选分类或重置；改选后清除上次读取结果。

[查看示例文件](../../playground/src/examples/new-forms/CheckboxForm.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

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
      onChange={() => setResult('')}
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
        onChange={(event) => {
          if (event.target.checked) setAgreementError(false);
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

## 状态与表单

- checked / onChange 用于受控状态，defaultChecked 设置非受控初始状态。原生变化事件通过 event.target.checked 读取是否勾选。
- 设置 name 与 value 后，只有勾选且未禁用的项参与提交；同名多项使用 FormData.getAll 读取。非受控勾选随表单重置，受控勾选需在 onReset 中恢复。
- indeterminate 表达部分选择，由调用方根据子项计算；它与 checked 独立，实际提交仍由 checked 决定，重置时也应同步父子状态。
- required 逐项要求勾选；一组中“至少选一项”的规则由调用方校验，并维护 error。 需要锁定选择时使用 disabled，Checkbox 不提供只读模式。

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

<a id="related"></a>

## 相关组件

- [RadioGroup 单选组](radio-group.md)：将互斥选项和说明完整展示，适合订阅频率、可见范围等少量选择。
- [Switch 开关](switch.md)：切换即时生效的阅读偏好或显示选项，开与关都有清楚含义。
