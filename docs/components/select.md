# Select 下拉选择器

在有限的文章分类、排序或归档选项中选择一项。

触发器是白底、2px 深墨线的字段长框；18px 展开箭头以圆端墨线表达，展开后转向。选项面板使用便笺轮廓与轻纸边投影，选中纸章勾与键盘高亮分别保留，不把面板当作另一颗按钮。

箭头使用 150ms 旋转，菜单以 180ms 淡入，不位移或缩放；关闭立即完成，并取消尚未结束的入场过渡。选中与高亮即时更新；关闭时由 Base UI 管理不可交互状态和焦点恢复。长列表在菜单内滚动，面板在视口边缘自动避让；减少动效和强制颜色下取消过渡。

Escape 取消后，紧接着按 Enter 或 Space 不会提交此前高亮的选项；重新打开后仍可正常选择。点向其他字段时保留新的焦点，不把焦点强行拉回触发器。

## 设计与选型

- 与 TextField 共用 44px 的常规字段基准、白底和不对称墨线长框；它表示一个可填写的值。主按钮的浅粉色面与按压底边留给提交动作。
- 标签、提示与错误说明相对字段外缘使用相同的 4px 行内缩进。可编辑字段展开时使用浅纸色面和焦点色边线说明打开状态；错误边线与错误箭头颜色优先，展开反馈不会覆盖错误。只读和禁用保留各自底色与辅助墨色箭头。
- 菜单以完整便笺浮在字段旁，列表与纸边分开计算可用高度；短视口中保留纸边，选项在菜单内滚动。长标签完整换行，触发器和选项自然增高，不挤压到相邻行。
- 勾选列始终预留 18px 位置，让选中与未选中文字对齐。选中使用浅粉纸面与 18px 小纸章勾，键盘位置另有内部焦点轮廓；禁用纸章随禁用文字降低强调，仍保留选中含义。只读与禁用保留可读文字。
- 少量且需要直接比较的互斥选项，可以使用 RadioGroup；同一栏目的轻量切换可以使用 SegmentedControl。Select 适合把有限选项收进字段；它不提供输入搜索或多选。

## Props 与默认值

- `label`：`ReactNode`，必填。可见标签，自动关联触发按钮。
- `options`：`readonly SelectOption[]`，必填。选项列表。value 必须唯一且为非空字符串。
- `value`：`string | null`。受控当前值，null 表示未选择。
- `defaultValue`：`string | null`，默认 `null`。非受控初始值；原生表单重置时恢复该初始值。
- `onValueChange`：`(value: string | null) => void`。用户选择变化时调用，参数为值而非 DOM 事件。
- `placeholder`：`ReactNode`，默认 `请选择`。没有选中值时显示的补充文字，不能替代 label。
- `hint / error`：`ReactNode`。通过 aria-describedby 关联；有 error 时设置 aria-invalid。
- `name / form`：`string`。提交字段名及外部表单 ID；传给内部表单输入。form 也作用于触发按钮。
- `disabled / required / readOnly`：`boolean`，默认 `false`。禁用、必选、只读。只读允许浏览选项但阻止修改。
- `autoComplete`：`string`。内部表单输入的浏览器自动填充提示。
- `portalContainer`：`HTMLElement | ShadowRoot | RefObject<HTMLElement | ShadowRoot | null> | null`，默认 `document.body`。弹出层目标。主题及颜色覆盖通过 PortalTheme 传播。
- `className`：`string`。根字段 div 的附加类名。
- `classNames`：`{ label?, trigger?, value?, popup?, option?, hint?, error? }`。各部分附加类名；每个值为 string。popup / option 位于 Portal。
- `ref / style / id / 其他按钮属性`：`ComponentPropsWithRef<"button">`，默认 `id 自动生成`。作用于真实触发 button；固定 type=button。不提供 children、type、原生 value/defaultValue/onChange。

### SelectOption

- `value`：`string`，必填。唯一非空字符串，作为提交值。
- `label`：`ReactNode`，必填。选项内容；避免嵌套交互元素。
- `disabled`：`boolean`，默认 `false`。禁用该选项。
- `textValue`：`string`，默认 `读取选项文字`。带图标或复杂内容时提供明确的键盘前缀匹配文字。

## 示例

已在应用入口导入 `yahha-ui/style.css` 并由 `ThemeProvider` 包裹时：

```tsx
import { Select } from 'yahha-ui';

export function SelectBasic() {
  return (
    <div style={{ maxWidth: 340 }}>
      <Select
        label="文章分类"
        placeholder="选择一个分类"
        options={[
          { value: 'journal', label: '生活手记' },
          { value: 'reading', label: '读书笔记' },
          { value: 'photos', label: '散步相册' },
        ]}
        hint="用于文章列表筛选；本例仅演示选择。"
      />
    </div>
  );
}
```

## 键盘与交互

使用 Tab 聚焦，Enter、Space 或方向键打开；方向键移动、Home / End 跳到边界，输入选项文字进行前缀匹配，Enter / Space 选择，Escape 关闭并返回触发按钮。禁用项可由方向键聚焦以发现其存在，但不能被选中。

选中只读选项不会改变值，字段仍可聚焦并参与表单提交。菜单开启不改变当前值；只有确认可用选项时才调用 `onValueChange`。选项的 `label` 可含装饰性内容，装饰应使用 `aria-hidden`，并通过 `textValue` 提供前缀匹配文字。

## 状态与表单

示例中的 `error` 是调用方提供的校验结果：选择有效值后，调用方更新状态并移除错误。组件本身不判断业务规则；只有设置 `required` 才附加原生必选约束，错误文案本身不会阻止提交。

`name` 对应提交的选项 `value`，不会提交展示文字。非受控字段重置恢复 `defaultValue`；受控字段需在表单 `onReset` 中更新 `value`。没有默认值时可用 `null` 表示未选择，不使用空字符串选项充当占位符。

外部表单可在字段挂载后出现，或以相同 ID 替换；非受控字段重置始终以当前关联的表单为准。表单取消默认重置时保留当前选择。

页面的“表单、重置与长选项”示例提供八个归档分类，可以用 End 到达末项、确认后读取表单，再重置检查初始值。错误、只读和禁用示例中的必选字段可以实际选择，观察错误说明与 `aria-invalid` 一起移除。

## 状态、样式与能力边界

仅提供单字符串选择，不包含输入搜索、多选、异步加载或选项分组。需要可输入筛选时应使用专门的 Combobox。受控表单重置须由调用方更新 value。

短单行触发器在桌面和手机均为 44px；手机或粗指针输入字阶为 16px / 24px，长选项自然增高。菜单项至少 44px。禁用项保持可读；键盘焦点与选中勾分开表达，系统强制颜色下仍保留焦点轮廓。
