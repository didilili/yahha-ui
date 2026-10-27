# Checkbox 复选框

用于多项选择、订阅选项和需要主动确认的轻量表单。

22px 方形框保留 2px 深墨轮廓；选中显示圆端墨勾，半选显示短横，状态同时通过原生 checkbox 语义表达。整条标签扩大点击范围。

墨勾与短横以 150ms 显隐和小幅展开确认切换，取消时平滑收回，不移动方框或文字。禁用及系统减少动效时直接显示最终状态。

## 设计与使用

- 方形框表达可以独立开启或关闭的选项；多个选择彼此不互斥。不要用它代替 RadioGroup 的单选或 Switch 的即时开关。
- 22px 是标记的视觉尺寸，常规标签行至少 44px。标签行保留 4px 水平留白，标记对齐文字第一行；长文字完整换行，提示和错误跟随标签文字起点，不把方框放大成按钮。
- 鼠标悬停只加深可用标记的墨线与已选浅粉，不改变尺寸或位置；错误边框和禁用外观保持优先。触屏不依赖悬停反馈。
- 错误保持具体可见，由 `error` 关联真实 input。`required` 保留浏览器校验，调用方在 `onInvalid` 中显示错误、在修正后清除；组件不会自行决定何时验证。
- 半选不是第三种提交值。全选框由子项计算 `checked` 和 `indeterminate`，实际提交应读取有 `name` 的子项。

## Props 与默认值

- `label`：`ReactNode`，必填。可点击标签。不要在 label 中嵌套链接或按钮。
- `hint / error`：`ReactNode`。通过 aria-describedby 关联；error 设置 aria-invalid，不自动校验。
- `checked / defaultChecked`：`boolean`，默认 `false（原生）`。分别用于受控状态或非受控初始状态。
- `onChange`：`ChangeEventHandler<HTMLInputElement>`。原生事件，从 event.target.checked 读取状态。
- `indeterminate`：`boolean`，默认 `false`。受控半选状态，同时设置原生 indeterminate 与 aria-checked=mixed；不改变 checked 或提交值。
- `name / value / form`：`string / string | number | readonly string[] / string`，默认 `value 为 on（原生）`。原生表单入口。仅勾选且未禁用时提交，通常传字符串 value。
- `disabled / required`：`boolean`，默认 `false（原生）`。原生禁用与必选；支持父 fieldset disabled。
- `className`：`string`。根字段 div 的附加类名。
- `classNames`：`{ label?, input?, text?, hint?, error? }`。各部分附加类名，每个值为 string。
- `ref / style / id / 其他 input 属性`：`ComponentPropsWithRef<"input">`，默认 `id 自动生成`。作用于真实 input。type 固定为 checkbox；不提供 readOnly、children、aria-checked。

## 示例

已在应用入口导入 `yahha-ui/style.css` 并由 `ThemeProvider` 包裹时：

```tsx
import { Checkbox } from 'yahha-ui';

export function CheckboxBasic() {
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 440 }}>
      <Checkbox label="接收每月阅读来信" hint="每月一封，随时可以取消。" defaultChecked />
      <Checkbox label="在个人主页展示收藏，并允许读者查看我分享的阅读清单与文章分类" />
      <Checkbox label="站内消息提醒" disabled defaultChecked hint="此设置暂不可更改。" />
      <Checkbox label="接收每日来信" disabled hint="每日来信暂未开放。" />
    </div>
  );
}
```

## 键盘与交互

Tab 聚焦，Space 切换，点击标签切换；保留原生表单校验。半选状态由调用方计算并更新。

关联的 `hint`、`error` 与调用方传入的 `aria-describedby` 一起保留，不替换外部说明。`ref`、`style`、`id` 和原生事件作用于 input；`className` 作用于字段根节点。

## 状态、样式与能力边界

不提供 CheckboxGroup 或批量状态管理。相关复选框使用原生 `fieldset` / `legend` 分组，多个有相同 `name` 的勾选值通过 `FormData.getAll(name)` 读取；`form` 可关联外部表单。不要在 label 中嵌入按钮或链接。

原生 checkbox 没有有效只读行为，需要锁定时使用 disabled。非受控 checked 随表单重置；受控 checked / indeterminate 由调用方在 `onReset` 中恢复。`indeterminate` 在点击及原生表单重置后仍按传入属性保持，不会替调用方改变子项。

视觉标记为 22px，常规单行标签操作区域为 44px，长标签可增高。半选与勾选使用不同标记；禁用文字保持可读，系统强制颜色使用原生勾选外观。
