# Switch 开关

切换即时生效的阅读偏好或显示选项，开与关都有清楚含义。

开关使用深墨轨道与带轮廓的圆钮，开启时圆钮位置与主题底色一起变化。它像一枚沿着墨线滑动的小圆扣，保持克制的形状，不把角色插画塞进每个操作。轨道负责表达开关位置，标签表达稳定的设置名称，说明文字解释影响。

鼠标悬停整条可用标签时，轨道边线加深、开启底色略加强；不让禁用项产生可操作反馈。触屏保留直接点击，减少动效时取消圆钮过渡，状态含义仍由位置、文字与原生语义表达。

圆钮沿 20px 行程滑动，轨道颜色同步以 150ms 过渡；连续切换从当前位置回转。保留逻辑方向定位，同时兼容 `dir="rtl"` 与 CSS `direction: rtl`。禁用和减少动效时取消过渡，轨道与点击范围保持稳定。

## Props 与默认值

- `label`：`ReactNode`，必填。可点击标签，应表达稳定的设置名称，避免开关后改名。
- `hint`：`ReactNode`。通过 aria-describedby 关联的说明。
- `checked / defaultChecked`：`boolean`，默认 `false（原生）`。分别用于受控状态与非受控初始状态。
- `onChange`：`ChangeEventHandler<HTMLInputElement>`。原生事件，从 event.target.checked 读取开启状态。
- `disabled`：`boolean`，默认 `false（原生）`。禁用交互和提交，支持父 fieldset disabled。
- `name / value / form / required`：`原生 input 对应属性`，默认 `value 为 on（原生）`。原生 checkbox 表单能力；只有开启且未禁用时提交。
- `className`：`string`。根字段 div 的附加类名。
- `classNames`：`{ label?, input?, text?, hint? }`。各部分附加类名，每个值为 string。
- `ref / style / id / 其他 input 属性`：`ComponentPropsWithRef<"input">`，默认 `id 自动生成`。作用于真实 input；固定 type=checkbox、role=switch，不提供 readOnly、children、aria-checked。开关的可访问状态由原生 checked 提供。

## 示例

已在应用入口导入 `yahha-ui/style.css` 并由 `ThemeProvider` 包裹时：

```tsx
import { Switch } from 'yahha-ui';

export function SwitchBasic() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Switch label="显示文章封面" defaultChecked hint="初始开启，可以点击文字或按空格切换。" />
      <Switch label="显示阅读时长" hint="初始关闭，标签始终表示同一个设置。" />
      <Switch label="显示作者署名" disabled defaultChecked hint="已开启；此设置暂不可更改。" />
      <Switch label="推送通知" disabled hint="已关闭；此功能尚未开放。" />
    </div>
  );
}
```

## 键盘与交互

Tab 聚焦，Space 切换，点击整条标签切换。说明文字在标签之外，不会意外切换状态。标签中不要放链接或按钮；相关操作单独放置。读屏器使用 switch 角色与原生 checked 状态读取开关状态，名称始终保持一致。禁用项跳过键盘 Tab 顺序，继承 `fieldset disabled`。

RTL 使用逻辑方向定位圆钮，开启时移向行末；不通过“左边一定是关闭”描述状态。强制颜色模式保留原生 checkbox 标记与焦点，不依赖主题底色区分开关。

## 受控、表单与重置

受控用法通过 `checked / onChange` 更新调用方状态；更改摘要、封面等内容应立即反映在附近预览中。需要展示“已开启 / 已关闭”时，放在独立状态说明中，避免修改设置本身的标签。`SwitchControlled` 示例用同一标签切换文章摘要，并显示结果。

`name / value` 遵守原生 checkbox 规则：只有开启且未禁用的开关参与 `FormData`。关闭时字段缺席，不会自动提交 `false`；需要布尔值时使用 `formData.has(name)`。开启但禁用的项也不提交。非受控表单的 `reset` 恢复 `defaultChecked`；受控状态应由调用方的 `onReset` 恢复。

保留原生 `required` 能力，但它要求开关必须开启。可自由关闭的阅读偏好通常不应设置 `required`。

## 状态、样式与能力边界

不自动持久化、不调用接口、不自带加载状态，也不接受 `readOnly`。需要填写完再统一提交的多项选择时优先使用 Checkbox。原生 checkbox 不支持有效只读，锁定设置使用 disabled，并在 hint 中解释原因。原生表单示例用于说明底层提交规则，不代表偏好开关都需要“保存”按钮。

轨道为 50×30px、圆钮为 22px；常规单行整条标签操作区域为 44px，长文字允许增高。标签行使用 4px 水平留白，提示说明跟随文字起点；轨道与长标签第一行保持对齐。开关位置表达状态，不把轨道图形放大成 44px；禁用文字保持可读。

文档页提供三个交互示例，展示开 / 关 / 两种禁用状态与长标签、受控文章摘要、原生表单值与重置。
