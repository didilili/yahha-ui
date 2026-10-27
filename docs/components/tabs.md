# Tabs 标签页

在同一页面的相关内容面板之间切换。[SegmentedControl 分段选择](segmented-control.md) 用于选择互斥值；Tabs 同时管理标签、内容面板及其可访问关联，基于 Base UI Tabs。

标签列表保持开放，没有外托盘或选中按钮边框；当前标签用下方短墨线标记内容栏目。44px 是最小操作高度，不是外加托盘的高度。值选择所需的浅色纸托盘由 SegmentedControl 提供，两者保留各自语义。

## API

| 属性                               | 类型                            | 默认值     | 说明                                              |
| ---------------------------------- | ------------------------------- | ---------- | ------------------------------------------------- |
| label                              | string                          | 必填       | tablist 的可访问名称                              |
| items                              | TabItem[]                       | 必填       | 唯一 value、label、content 以及可选 disabled      |
| value                              | string \| null                  | —          | 受控值；null 不选择任何面板                       |
| defaultValue                       | string \| null                  | 首个可用项 | 非受控初始值，不与 value 同用                     |
| onValueChange                      | (value: string \| null) => void | —          | 选择变化及非受控自动回退；无可用项时可能收到 null |
| activateOnFocus                    | boolean                         | false      | 方向键聚焦标签时是否直接选中                      |
| keepMounted                        | boolean                         | false      | 保留隐藏面板的 DOM 和表单状态                     |
| classNames                         | { list?, tab?, panel? }         | —          | 对应部位的附加类名                                |
| ref / className / style / 原生属性 | div 属性                        | —          | 均作用于最外层 div；label 作用于 tablist          |

TabItem 的 value 必须是组内唯一的稳定字符串。label 和 content 是 ReactNode；标签中不放链接、按钮等交互元素。受控模式由调用方确保 value 指向可用项，更新 items 时同步调整状态。

## 受控返回与草稿

文档中的“联系与阅读说明”使用 `keepMounted` 保留明信片草稿。切换栏目时，隐藏面板退出可见区域与键盘顺序；再次回来仍能继续填写，但刷新或离开页面不会持久保存输入。

“回到明信片”不仅更新受控值，也在面板显示后通过 TextField 的公开 `ref` 继续到输入框；即使已经选中该栏目，仍可从这个动作继续填写。普通方向键只移动标签焦点，默认使用 Enter / Space 激活，示例不会把每次手动切换都改成自动聚焦输入。栏目结果使用读者看到的中文名称，不将 `write`、`about` 等内部值作为状态文字。

## 使用示例

```tsx
import { Tabs } from 'yahha-ui';

export function ReadingTabs() {
  return (
    <Tabs
      label="阅读栏目"
      items={[
        { value: 'notes', label: '随笔', content: <p>河边的散步记录。</p> },
        { value: 'photos', label: '相册', content: <p>窗边的小花。</p> },
        { value: 'archive', label: '归档整理中', content: null, disabled: true },
      ]}
    />
  );
}
```

## 键盘与样式约定

- Tab 进入标签列表，左右方向键及 Home / End 移动焦点；默认按 Enter / Space 激活。activateOnFocus 开启后随聚焦切换。
- `dir="rtl"` 同时调整布局和左右方向键；RTL 中左箭头移到后一项、右箭头移到前一项，Home / End 仍到首项 / 末项。方向优先使用根节点或最近原生容器的 `dir="ltr"` / `dir="rtl"`，未声明时沿用上游 Base UI DirectionProvider；仅用 CSS 设置 direction 或 `dir="auto"` 时，请同步配置 DirectionProvider。
- 禁用标签带 aria-disabled，可被方向键聚焦以发现其存在，但不可激活。默认选择首个可用项。
- 标签与面板的 role、ID、aria-controls、aria-labelledby 由 Base UI 管理。非受控选中项被移除或禁用时由 Base UI 回退。
- 默认卸载未选中面板，keepMounted 保留其 DOM 和状态；隐藏面板不参与键盘顺序。
- 标签最小高度 44px，长标题与标签列表自然换行。classNames 不替换默认类名。布局方向固定为水平，不支持路由导航或异步内容加载。
- 选中墨线与键盘焦点分别显示；受控禁用项仍为选中值时，墨线跟随禁用文字颜色，强制颜色模式使用 GrayText，不把禁用项重新强调为可操作栏目。
