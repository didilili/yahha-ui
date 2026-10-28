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

### 基本状态

先展示默认关闭，再分组比较初始开启、禁用和长标签。点击标签切换，本例只展示开关状态，不保存设置。

[查看示例文件](../../playground/src/examples/new-forms/SwitchBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/SwitchBasic.tsx -->

```tsx
import { Switch } from 'yahha-ui';

export default function SwitchBasic() {
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 640 }}>
      <div style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0 }}>默认关闭</p>
        <Switch label="显示阅读时长" />
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0 }}>初始开启与禁用状态</p>
        <Switch label="显示文章封面" defaultChecked />
        <Switch label="显示作者署名" disabled defaultChecked hint="已开启；此设置暂不可更改。" />
        <Switch label="推送通知" disabled hint="已关闭；此功能尚未开放。" />
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0 }}>长标签</p>
        <Switch label="在个人主页展示文章封面、分类与阅读时长，让来访的人先看看内容，再决定从哪里读起" />
      </div>
    </div>
  );
}
```

<a id="controlled"></a>

### 控制内容显示

checked / onChange 联动文章摘要与可见状态；标签保持不变，切换结果由相邻文字说明，状态仅保留在当前页面。

[查看示例文件](../../playground/src/examples/new-forms/SwitchControlled.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/SwitchControlled.tsx -->

```tsx
import { useState } from 'react';
import { Heading, Surface, Switch, Text } from 'yahha-ui';

export default function SwitchControlled() {
  const [showExcerpt, setShowExcerpt] = useState(true);
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Switch
        label="显示文章摘要"
        hint="开启后显示下方文章的摘要。"
        checked={showExcerpt}
        onChange={(event) => setShowExcerpt(event.target.checked)}
      />
      <Surface style={{ display: 'grid', gap: 12 }}>
        <Heading level={3}>沿着河边，慢慢走</Heading>
        {showExcerpt && <Text>记录今天散步时遇见的小小发现。</Text>}
      </Surface>
      <Text size="sm" tone="muted" role="status">
        {showExcerpt ? '摘要已显示。' : '摘要已隐藏，文章标题仍然保留。'}
      </Text>
    </div>
  );
}
```

<a id="form"></a>

### 表单值与重置

读取实际 name=value；关闭的 covers 与禁用的 notifications 不参与提交，非受控状态随原生重置恢复。本例只读取本地表单，不保存设置或调用接口。

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

<a id="design"></a>

## 状态与表单

- checked / onChange 管理受控开关，defaultChecked 设置非受控初始状态；从 event.target.checked 读取开关结果，实际设置变化由调用方完成。
- 设置 name 与 value 后，仅开启且未禁用时提交 name=value。非受控状态随原生表单重置，受控状态需在 onReset 中恢复 React 状态。
- disabled 阻止操作并退出键盘顺序与提交，也支持父 fieldset 禁用。需要锁定设置时使用 disabled，Switch 不提供只读模式。

<a id="api"></a>

## API

### SwitchProps

| 参数                                 | 说明                                                                                                                        | 类型                                   | 默认值                |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------- |
| `label` **必填**                     | 可点击标签，应表达稳定的设置名称，避免开关后改名。                                                                          | `ReactNode`                            | —                     |
| `hint`                               | 通过 aria-describedby 关联的说明。                                                                                          | `ReactNode`                            | —                     |
| `checked / defaultChecked`           | 分别用于受控状态与非受控初始状态。                                                                                          | `boolean`                              | `false（原生）`       |
| `onChange`                           | 原生事件，从 event.target.checked 读取开启状态。                                                                            | `ChangeEventHandler<HTMLInputElement>` | —                     |
| `disabled`                           | 禁用交互和提交，支持父 fieldset disabled。                                                                                  | `boolean`                              | `false（原生）`       |
| `name / value / form / required`     | 原生 checkbox 表单能力；只有开启且未禁用时提交。                                                                            | `原生 input 对应属性`                  | `value 为 on（原生）` |
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
