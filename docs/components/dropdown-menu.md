# DropdownMenu 下拉菜单

点击触发器后展示一组操作，适合文章操作和轻量工具菜单。它执行动作，不保存表单选择值；分类、排序等值选择使用 Select。

菜单关闭时保留便笺退场效果，但旧菜单项停止接收交互。Escape 后快速按 Enter / Space 不会执行已取消的动作；若按键落到已恢复焦点的触发器，可以正常重新打开。受控父级拒绝关闭时，打开的菜单仍可操作。

```tsx
import { useState } from 'react';
import { Button, DropdownMenu } from 'yahha-ui';

export default function Example() {
  const [message, setMessage] = useState('尚未操作');
  return (
    <div>
      <DropdownMenu
        trigger={<Button variant="secondary">文章操作</Button>}
        items={[
          { id: 'save', label: '收藏文章', onSelect: () => setMessage('已收藏') },
          { id: 'share', label: '生成分享摘要', onSelect: () => setMessage('摘要已生成') },
        ]}
      />
      <p role="status">{message}</p>
    </div>
  );
}
```

动作菜单采用深墨便笺轮廓、纸边与轻投影。单行菜单项最小 44px，多行文字自然增高；短墨记对齐文字第一行，不随整项高度居中。当前高亮动作有浅色底和短墨记，键盘焦点另有单层内部轮廓；禁用项与危险动作分别保留禁用和错误语义，强制颜色下禁用文字使用系统 GrayText。

## API

| 属性              | 类型                                 | 默认值   | 说明                                                                                       |
| ----------------- | ------------------------------------ | -------- | ------------------------------------------------------------------------------------------ |
| trigger           | ReactElement                         | 必填     | 原生 button 或透传 button 属性、事件和 ref 的组件，例如 Button。触发器自己提供可访问名称。 |
| items             | readonly DropdownMenuItem[]          | 必填     | 操作项；id 在当前菜单内唯一。                                                              |
| open              | boolean                              | —        | 受控展开状态；同时响应 onOpenChange。                                                      |
| defaultOpen       | boolean                              | false    | 非受控初始展开状态；与 open 二选一。                                                       |
| onOpenChange      | (open: boolean) => void              | —        | 打开、选择、点击外部或 Escape 等造成的状态请求。                                           |
| disabled          | boolean                              | false    | 禁止通过触发器打开菜单。                                                                   |
| side              | DropdownMenuProps['side']            | 'bottom' | top、bottom、left、right、inline-start、inline-end；碰撞时会调整。                         |
| align             | 'start' \| 'center' \| 'end'         | 'start'  | 相对触发器对齐。                                                                           |
| sideOffset        | number                               | 8        | 与触发器的间距，单位 px。                                                                  |
| portalContainer   | DropdownMenuProps['portalContainer'] | body     | Base UI Portal 容器；元素、ShadowRoot、对应 ref 或 null。                                  |
| className / style | string / CSSProperties               | —        | 作用于菜单 Popup div，不作用于触发器、Positioner 或 Portal 外层。                          |
| ref               | Ref<HTMLDivElement>                  | —        | 指向菜单 Popup，关闭卸载后为 null。                                                        |

### DropdownMenuItem

| 属性        | 类型       | 默认值 | 说明                                                        |
| ----------- | ---------- | ------ | ----------------------------------------------------------- |
| id          | string     | 必填   | 当前菜单内稳定且唯一的 key。                                |
| label       | string     | 必填   | 可见文字，同时用于键盘按字查找。                            |
| onSelect    | () => void | 必填   | 激活时执行，菜单随后请求关闭。                              |
| disabled    | boolean    | false  | 禁止激活；按 Base UI 行为仍可用方向键聚焦，以便发现禁用项。 |
| destructive | boolean    | false  | 使用错误语义文字颜色；不会自动增加确认弹窗。                |

## 编辑、移出与恢复

文档站的受控示例把动作连接到同一份本页草稿：

- “继续编辑”打开真实的短表单；保存更新标题，取消保留原标题。进入编辑后聚焦字段，保存或取消后回到稳定的菜单触发器。
- “移出草稿列表”实际移除示例中的文章展示，保留内容与尚未保存的编辑以便恢复。菜单触发器持续存在，关闭菜单后仍有有效的返回位置。
- 移出后提供持续可见的“恢复草稿”按钮，菜单中也可以恢复；恢复后继续使用原内容，并将焦点送回菜单触发器。
- “发布（等待审核）”仍为不可执行的禁用项。移出与恢复均只影响本页，没有访问真实文章或网络服务。

`destructive` 仅表达动作性质，不代表组件自动删除数据；真实永久删除应由调用方安排确认、失败恢复与结果说明。

## 键盘与使用边界

- Enter、Space 或方向键可打开菜单；上下方向键、Home、End 以及按字查找由 Base UI 管理。
- 菜单项使用 menuitem 语义；禁用项会保留可发现性但不可执行。激活后关闭，Escape 关闭后返回触发器。
- 菜单是非模态的，不锁定页面滚动；点击外部或焦点离开时按 Base UI 行为收起。
- trigger 应为 button；自定义组件必须转发原生属性、事件和 ref。禁用触发器请使用组件的 disabled，而不是仅给自定义元素着色。
- 当前提供单层动作列表，不提供选中值、多选、嵌套子菜单或导航链接。真正跳转页面时使用可见链接。
- 不透传任意 div 原生属性；className、style、ref 的目标明确是 Popup。
- Portal 读取最近的 ThemeProvider、三套主题和颜色 tokens，不复制页面布局 className。内部处理视口避让、长文案换行与列表滚动；自定义尺寸仍应保留手机边界。
- 选中项的业务变更、异步失败和危险操作确认由调用方负责，组件不会访问剪贴板、网络或真实数据。

“文章编辑与管理”（ArticleActions）示例展示从菜单打开编辑弹窗及返回菜单触发器。多行菜单项按内容增高，墨记对齐首行；高亮、键盘焦点、禁用和危险动作各有独立提示。
