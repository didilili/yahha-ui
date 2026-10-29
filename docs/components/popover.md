<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Popover 浮层

锚定到按钮的补充面板，适合简短说明和轻量交互。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Popover } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于围绕触发位置展开的说明、阅读偏好和短表单，内容可包含链接、按钮和输入框。Popover 是非模态 dialog，用户仍可操作页面；title 必须包含有意义的文字，触发器使用按钮。

只需短文字提示时使用 [Tooltip](tooltip.md)；需要集中完成独立任务或较长编辑时使用 [Dialog](dialog.md)。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 基本说明

省略 open 时由组件维护展开状态；标题与描述自动关联到浮层，正文可以选择和复制。

[查看示例文件](../../playground/src/examples/floating/PopoverBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/floating/PopoverBasic.tsx -->

```tsx
import { Button, Popover } from 'yahha-ui';

export default function PopoverBasic() {
  return (
    <Popover
      trigger={<Button variant="secondary">关于这份手记</Button>}
      title="手记说明"
      description="一些适合停下来慢慢读的记录。"
    >
      <p>每周整理一篇，记录散步、阅读和日常发现。</p>
    </Popover>
  );
}
```

<a id="form"></a>

### 修改并保存收藏夹名称

打开时读取本页已保存名称，取消或关闭会放弃草稿；空白名称给出字段错误，保存后关闭并更新结果。

[查看示例文件](../../playground/src/examples/floating/PopoverForm.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/floating/PopoverForm.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Button, Popover, Text, TextField } from 'yahha-ui';

export default function PopoverForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('我的收藏');
  const [savedName, setSavedName] = useState(name);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function changeOpen(nextOpen: boolean) {
    if (nextOpen) {
      setName(savedName);
      setError('');
    }
    setOpen(nextOpen);
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Popover
        trigger={<Button variant="secondary">重命名收藏夹</Button>}
        title="收藏夹名称"
        description="为收藏的文章取一个容易找到的名字。"
        open={open}
        onOpenChange={changeOpen}
        initialFocus={inputRef}
      >
        <form
          style={{ display: 'grid', gap: 16 }}
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim()) {
              setError('请输入名称，不能只填写空格。');
              inputRef.current?.focus();
              return;
            }
            setSavedName(name.trim());
            setOpen(false);
          }}
        >
          <TextField
            ref={inputRef}
            label="名称"
            name="collection"
            value={name}
            required
            maxLength={30}
            hint="请输入 1–30 个字符。"
            error={error}
            onInvalid={() => setError('请输入名称，不能只填写空格。')}
            onChange={(event) => {
              setName(event.target.value);
              setError('');
            }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Button type="submit">保存名称</Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              取消
            </Button>
          </div>
        </form>
      </Popover>
      <Text size="sm" tone="muted" role="status">
        当前名称：{savedName}
      </Text>
    </div>
  );
}
```

<a id="design"></a>

## 状态与反馈

省略 open 时由组件维护展开状态，可通过 defaultOpen 设置初始状态；传入 open 后由调用方响应 onOpenChange。disabled 只禁用触发器，受控 open 或 defaultOpen 仍能显示面板。

表单验证、保存和结果反馈由调用方处理，提交不会自动关闭面板。示例在每次打开时从已保存值重建草稿， 保存成功后更新页面并关闭；关闭浮层本身不代表保存或取消业务操作。

<a id="api"></a>

## API

仅支持下列属性，不透传其余 div 原生属性。

### PopoverProps

| 参数                | 说明                                                                                                                                                                              | 类型                              | 默认值                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | -------------------------------- |
| `trigger` **必填**  | 原生 button 或转发 button 属性、事件和 ref 的组件。                                                                                                                               | `ReactElement`                    | —                                |
| `title` **必填**    | 可见标题，同时提供 dialog 的可访问名称，应包含文字。                                                                                                                              | `ReactNode`                       | —                                |
| `description`       | 标题下的补充说明，关联为 dialog 的可访问描述。                                                                                                                                    | `ReactNode`                       | —                                |
| `children`          | 正文，可含表单、按钮和链接。                                                                                                                                                      | `ReactNode`                       | —                                |
| `open`              | 受控展开状态；同时响应 onOpenChange。                                                                                                                                             | `boolean`                         | —                                |
| `defaultOpen`       | 非受控初始状态，与 open 二选一。                                                                                                                                                  | `boolean`                         | `false`                          |
| `onOpenChange`      | 打开或关闭请求。受控模式需要更新 open。                                                                                                                                           | `(open: boolean) => void`         | —                                |
| `disabled`          | 禁用触发器；受控 open 或 defaultOpen 仍能显示浮层。                                                                                                                               | `boolean`                         | `false`                          |
| `initialFocus`      | 可传布尔值、元素 ref 或回调。回调接收打开方式（mouse / touch / pen / keyboard；无法识别时为空字符串），返回元素指定目标、true / null 使用默认行为、false / undefined 不移动焦点。 | `PopoverProps['initialFocus']`    | `首个可聚焦元素；触摸时为 Popup` |
| `finalFocus`        | 可传布尔值、元素 ref 或回调。回调接收关闭方式（mouse / touch / pen / keyboard；无法识别时为空字符串），返回值约定同 initialFocus；false 不返回焦点。                              | `PopoverProps['finalFocus']`      | `触发器或先前聚焦元素`           |
| `closeLabel`        | 内置关闭按钮的可访问名称。                                                                                                                                                        | `string`                          | `"关闭浮层"`                     |
| `side`              | top、bottom、left、right、inline-start、inline-end；空间不足时自动避让。                                                                                                          | `PopoverProps['side']`            | `"bottom"`                       |
| `align`             | 相对触发器的对齐方向。                                                                                                                                                            | `"start" \| "center" \| "end"`    | `"start"`                        |
| `sideOffset`        | 与触发器的间距，单位 px。                                                                                                                                                         | `number`                          | `8`                              |
| `portalContainer`   | Portal 挂载容器，支持元素、ShadowRoot、对应 ref 或 null。                                                                                                                         | `PopoverProps['portalContainer']` | `body`                           |
| `className / style` | 作用于 Popup div，不作用于触发器、定位层或 Portal 外层。                                                                                                                          | `string / CSSProperties`          | —                                |
| `ref`               | 指向 Popup div，关闭卸载后为 null。                                                                                                                                               | `Ref<HTMLDivElement>`             | —                                |

<a id="keyboard"></a>

## 可访问性与键盘

- 点击触发器或用 Enter / Space 打开。关闭按钮、Escape、点击外部以及焦点移出触发器和面板时 请求关闭；受控模式下仍需调用方更新 open。
- 不锁定页面滚动，Tab / Shift+Tab 可以离开面板继续操作页面。Escape 或关闭按钮通常返回触发器； 已通过 Tab 或点击转移到外部的焦点不会被默认回焦抢走。需要固定返回位置时使用 finalFocus。
- 默认聚焦首个可聚焦元素，通常是内置关闭按钮；触摸打开时聚焦浮层本身，避免自动唤起键盘。 短表单可用 initialFocus 指定输入框，设为 false 时保留当前焦点。
- title 作为 dialog 的可访问名称，description 作为补充描述。自定义触发器须转发 button 属性、事件和 ref。

<a id="styling"></a>

## 定位与 Portal

默认使用白纸便笺与浅蓝内底边，标题下用轻纸线分隔。

默认向下展开并与触发器起点对齐，空间不足时自动避让，距视口边缘保留 12px。 长标题和正文可换行，超出可用高度时面板滚动；大表单和长篇正文宜放在页面或 Dialog 中。

浮层跟随触发器自身或最近容器的显式 dir，文字、关闭按钮与 start 等逻辑定位一起调整；未指定时继承 Base UI DirectionProvider。仅设置 CSS direction 或 dir="auto" 时，请在触发器上同时设置明确的 dir。

Portal 默认挂载到 body，继承最近 ThemeProvider 的主题与 tokens，不复制页面布局类。 自定义 portalContainer 时，需检查容器的层叠与裁切，确保面板可见且可操作。

<a id="related"></a>

## 相关组件

- [Tooltip 文字提示](tooltip.md)：悬停或聚焦时，为已有操作补充简短的视觉文字标签。
- [Dialog 弹窗](dialog.md)：需要用户暂时集中注意力时，显示一段独立内容或简短表单。
- [DropdownMenu 下拉菜单](dropdown-menu.md)：将文章操作或轻量工具收进一组可通过键盘操作的动作菜单。
