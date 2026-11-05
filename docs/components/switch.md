<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Switch 开关

切换即时生效的阅读偏好或显示选项，开与关都有清楚含义。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Switch } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

打开或关闭一个即时生效的设置，例如显示文章摘要。需要先勾选、再统一提交的偏好或同意事项使用 [Checkbox](checkbox.md)；在多个互斥值中选择时使用 [RadioGroup](radio-group.md)。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 基础用法

点击或按空格切换。

[查看示例文件](../../playground/src/examples/new-forms/SwitchBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/SwitchBasic.tsx -->

```tsx
import { Switch } from 'yahha-ui';

export default function SwitchBasic() {
  return <Switch label="启用通知" />;
}
```

<a id="switch-disabled"></a>

### 禁用状态

对比关闭与开启时的禁用外观。

[查看示例文件](../../playground/src/examples/new-forms/SwitchDisabled.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/SwitchDisabled.tsx -->

```tsx
import { Switch } from 'yahha-ui';

export default function SwitchDisabled() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Switch label="邮件通知" disabled />
      <Switch label="站内通知" defaultChecked disabled />
    </div>
  );
}
```

<a id="switch-loading"></a>

### 加载状态

加载时保持当前状态，不能重复切换。

[查看示例文件](../../playground/src/examples/new-forms/SwitchLoading.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/SwitchLoading.tsx -->

```tsx
import { Switch } from 'yahha-ui';

export default function SwitchLoading() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Switch label="邮件通知" loading />
      <Switch label="站内通知" defaultChecked loading />
    </div>
  );
}
```

<a id="controlled"></a>

### 受控状态

通过 checked 与 onChange 管理状态。

[查看示例文件](../../playground/src/examples/new-forms/SwitchControlled.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/SwitchControlled.tsx -->

```tsx
import { useState } from 'react';
import { Switch, Text } from 'yahha-ui';

export default function SwitchControlled() {
  const [enabled, setEnabled] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Switch
        label="启用通知"
        checked={enabled}
        onChange={(event) => setEnabled(event.currentTarget.checked)}
      />
      <Text size="sm" tone="muted">
        {enabled ? '已开启' : '已关闭'}
      </Text>
    </div>
  );
}
```

<a id="integration"></a>

## 进阶用法

表单例演示取值与重置；异步例由使用方管理本地模拟保存。

<a id="form"></a>

### 表单集成

读取开关值，或重置到初始状态。

[查看示例文件](../../playground/src/examples/new-forms/SwitchForm.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/SwitchForm.tsx -->

```tsx
import { useState } from 'react';
import { Button, Switch, Text } from 'yahha-ui';

export default function SwitchForm() {
  const [result, setResult] = useState('');
  return (
    <form
      style={{ display: 'grid', gap: 16 }}
      onInput={() => setResult('')}
      onSubmit={(event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        setResult(
          values.has('covers')
            ? `读取结果：covers=${String(values.get('covers'))}。`
            : '读取结果：未包含封面偏好。',
        );
      }}
      onReset={() => setResult('封面偏好已恢复为开启。')}
    >
      <Switch label="文章封面" name="covers" value="visible" defaultChecked />
      <Switch
        label="站内通知"
        name="notifications"
        value="enabled"
        defaultChecked
        disabled
        hint="此设置暂不可更改。"
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="submit">读取偏好</Button>
        <Button type="reset" variant="secondary">
          重置
        </Button>
      </div>
      <Text size="sm" tone="muted" role="status">
        {result}
      </Text>
    </form>
  );
}
```

<a id="switch-reading-preference"></a>

### 异步切换与失败恢复

模拟保存时显示加载状态，首次失败后回滚，可再次切换重试。

[查看示例文件](../../playground/src/examples/new-forms/SwitchReadingPreference.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/SwitchReadingPreference.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Switch, Text } from 'yahha-ui';

export default function SwitchReadingPreference() {
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [message, setMessage] = useState('通知已关闭。');
  const busyRef = useRef(false);
  const committedRef = useRef(false);
  const hasFailedRef = useRef(false);
  const requestRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      requestRef.current += 1;
      busyRef.current = false;
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    },
    [],
  );

  function savePreference(next: boolean) {
    if (busyRef.current || next === committedRef.current) return;
    busyRef.current = true;
    const request = ++requestRef.current;
    const previous = committedRef.current;
    setEnabled(next);
    setBusy(true);
    setFailed(false);
    setMessage('正在本地模拟保存…');

    timerRef.current = window.setTimeout(() => {
      if (request !== requestRef.current) return;
      timerRef.current = null;
      busyRef.current = false;
      setBusy(false);
      if (!hasFailedRef.current) {
        hasFailedRef.current = true;
        setEnabled(previous);
        setFailed(true);
        setMessage('');
      } else {
        committedRef.current = next;
        setMessage(`通知已${next ? '开启' : '关闭'}；仅当前示例生效。`);
      }
    }, 700);
  }

  return (
    <div style={{ display: 'grid', gap: 16, minWidth: 0, maxWidth: 480 }}>
      <Switch
        label="启用通知"
        checked={enabled}
        loading={busy}
        onChange={(event) => savePreference(event.currentTarget.checked)}
      />
      <Text size="sm" tone="muted" role="status">
        {message}
      </Text>
      {failed && (
        <Alert tone="error" role="alert" title="模拟保存失败">
          已恢复为关闭，再次开启可重试。
        </Alert>
      )}
      <div>
        <Button
          variant="secondary"
          disabled={busy}
          onClick={() => {
            if (busyRef.current) return;
            requestRef.current += 1;
            if (timerRef.current !== null) window.clearTimeout(timerRef.current);
            timerRef.current = null;
            committedRef.current = false;
            hasFailedRef.current = false;
            setEnabled(false);
            setFailed(false);
            setMessage('示例已重置，通知已关闭。');
          }}
        >
          重置示例
        </Button>
      </div>
    </div>
  );
}
```

<a id="design"></a>

## 状态与交互

- checked / onChange 管理受控状态，defaultChecked 设置初始状态；从 event.target.checked 读取结果。
- loading 显示圆扣内的三墨点并阻止点击、空格切换，保留当前值、焦点和表单值。 请求、完成与失败处理由使用方控制，组件不自动发起保存。
- disabled 使用原生禁用行为，退出键盘顺序且不参与表单提交，支持父 fieldset 禁用。 loading 不会自动设置原生 disabled；显式禁用仍按原生规则处理。

<a id="api"></a>

## API

### SwitchProps

| 属性                                 | 说明                                                                                                                        | 类型                                   | 默认值                |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------- |
| `label` **必填**                     | 可点击标签，应表达稳定的设置名称，避免开关后改名。                                                                          | `ReactNode`                            | —                     |
| `hint`                               | 通过 aria-describedby 关联的说明。                                                                                          | `ReactNode`                            | —                     |
| `checked / defaultChecked`           | 分别用于受控状态与非受控初始状态。                                                                                          | `boolean`                              | `false（原生）`       |
| `onChange`                           | 原生事件，从 event.target.checked 读取开启状态。                                                                            | `ChangeEventHandler<HTMLInputElement>` | —                     |
| `loading`                            | 显示加载状态并阻止重复切换，保留 checked、焦点和表单值；同时设置 aria-busy 与 aria-disabled。                               | `boolean`                              | `false`               |
| `disabled`                           | 禁用交互和提交，支持父 fieldset disabled。                                                                                  | `boolean`                              | `false（原生）`       |
| `name / value / form / required`     | 原生表单属性；开启且未禁用时提交，loading 不移除表单值，required 要求开启。                                                 | `原生 input 对应属性`                  | `value 为 on（原生）` |
| `className`                          | 根字段 div 的附加类名。                                                                                                     | `string`                               | —                     |
| `classNames`                         | 各部分附加类名，每个值为 string。                                                                                           | `{ label?, input?, text?, hint? }`     | —                     |
| `ref / style / id / 其他 input 属性` | 作用于真实 input；固定 type=checkbox、role=switch，不提供 readOnly、children、aria-checked。可访问状态由原生 checked 提供。 | `ComponentPropsWithRef<"input">`       | `id 自动生成`         |

<a id="keyboard"></a>

## 可访问性与键盘

- Tab 聚焦，Space 切换，点击整条标签也可切换。读屏器通过 switch 角色与原生 checked 状态读取开关结果。
- label 使用稳定的设置名称，例如“显示文章摘要”，切换后保持不变。标签内避免嵌套其他交互控件； 需要额外解释切换结果时，在相邻文字中说明。

<a id="limits"></a>

## 样式定制

多个开关之间的间距在外层容器中设置；调整标签文字或提示分别使用 classNames.text / classNames.hint。长标签允许换行，避免通过缩小轨道或点击区域来压缩布局。

<a id="related"></a>

## 相关组件

- [Checkbox 复选框](checkbox.md)：用于多项选择、订阅选项和需要主动确认的轻量表单。
- [RadioGroup 单选组](radio-group.md)：将互斥选项和说明完整展示，适合订阅频率、可见范围等少量选择。
