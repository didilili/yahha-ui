# Popover 浮层

锚定到按钮的非模态补充面板，用于简短说明、阅读偏好和小表单。它允许轻交互内容；简短且不含交互的文字提示使用 [Tooltip](tooltip.md)，需要遮罩并集中完成任务时使用 [Dialog](dialog.md)。

退场时保留便笺视觉，已关闭内容停止接收按键、点击和表单提交。Escape 后的快速按键不提交已取消的内容；受控父级拒绝关闭时仍能继续操作。点击其他字段关闭时保留新的焦点。

```tsx
import { useRef, useState } from 'react';
import { Button, Popover, Text, TextField } from 'yahha-ui';

export default function Example() {
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
    <div>
      <Popover
        trigger={<Button variant="secondary">重命名收藏夹</Button>}
        title="收藏夹名称"
        description="保存后更新名称；取消或关闭会放下本次修改。"
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
            hint="1–30 个字符。未保存的修改不会带到下次打开。"
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
      <p role="status">当前名称：{savedName}</p>
      <Text size="sm" tone="muted">
        名称仅保留在本页示例中。
      </Text>
    </div>
  );
}
```

补充面板采用深墨便笺轮廓、纸边与轻投影，标题下方用轻纸分隔线区分说明与正文。关闭按钮保留 44×44px 操作区域，其中心对齐标题第一行的行框中心；长标题自然换行，右侧留足关闭按钮空间。它承载可交互的补充内容，视觉与短文字对白 Tooltip 分开。

## API

| 属性              | 类型                            | 默认值           | 说明                                                                        |
| ----------------- | ------------------------------- | ---------------- | --------------------------------------------------------------------------- |
| trigger           | ReactElement                    | 必填             | 原生 button 或透传 button 属性、事件与 ref 的组件。                         |
| title             | ReactNode                       | 必填             | 可见标题，同时为 dialog 提供可访问名称，应包含有意义的文字。                |
| description       | ReactNode                       | —                | 标题下说明，关联为可访问描述；数字 0 保留，空值和布尔值不渲染。             |
| children          | ReactNode                       | —                | 正文，可以包含按钮、链接、输入框或短表单。                                  |
| open              | boolean                         | —                | 受控展开状态；同时响应 onOpenChange。                                       |
| defaultOpen       | boolean                         | false            | 非受控初始展开状态；与 open 二选一。                                        |
| onOpenChange      | (open: boolean) => void         | —                | 展开或关闭请求。                                                            |
| disabled          | boolean                         | false            | 禁用触发器。不会阻止受控 open 或 defaultOpen 展示内容。                     |
| side              | PopoverProps['side']            | 'bottom'         | top、bottom、left、right、inline-start、inline-end；空间不足时避让。        |
| align             | 'start' \| 'center' \| 'end'    | 'start'          | 与触发器对齐。                                                              |
| sideOffset        | number                          | 8                | 与触发器的间距，单位 px。                                                   |
| initialFocus      | PopoverProps['initialFocus']    | Base UI 默认行为 | 布尔值、元素 ref 或交互类型回调；默认首个可聚焦元素，触摸打开时聚焦 Popup。 |
| finalFocus        | PopoverProps['finalFocus']      | Base UI 默认行为 | 布尔值、元素 ref 或交互类型回调；默认返回触发器或此前聚焦元素。             |
| portalContainer   | PopoverProps['portalContainer'] | body             | Base UI Portal 容器；元素、ShadowRoot、对应 ref 或 null。                   |
| closeLabel        | string                          | '关闭浮层'       | 内置关闭按钮的可访问名称。                                                  |
| className / style | string / CSSProperties          | —                | 作用于 Popup div，不作用于触发器、定位层或 Portal。                         |
| ref               | Ref<HTMLDivElement>             | —                | 指向 Popup div，关闭卸载后为 null。                                         |

## 草稿、保存与取消

- 上例明确区分输入草稿与已保存名称。每次打开先从 `savedName` 恢复草稿；取消、Escape、关闭按钮或点击外部都不保存。再次打开仍是上次保存的值。
- `required` 与 `maxLength` 保留原生约束；提交时还会检查去掉首尾空格后的名称。只有空格时显示字段错误并回到输入框，不直接关闭。
- 提交成功后显式关闭，结果在面板外持续显示。示例只修改本页状态，不发送网络请求。
- 这套草稿策略属于调用方；Popover 不会自动决定取消后丢弃还是保留输入。若产品需要保留草稿，应明确提示其规则。

## 键盘、焦点与边界

- 点击、Enter 或 Space 打开；使用 Base UI 的 dialog、标题与描述语义。
- 内置关闭按钮、Escape、点击外部或焦点离开按 Base UI 行为收起。表单提交不会自动关闭，调用方保存后显式更新 open。
- 非模态，不锁定滚动、不困住焦点；Tab 可以离开面板。需要模态流程时使用 Dialog。
- 默认首个可聚焦项包含内置关闭按钮；表单用 initialFocus 指定输入框。没有合适目标时 Base UI 回退到 Popup；触摸打开避免自动唤起键盘。
- 自定义 trigger 必须转发 button 原生属性、事件与 ref；建议直接使用 Button 或 IconButton。触发器的 ref 放在该元素上。
- 不透传任意 div 原生属性；ref、style、className 都只指向 Popup。
- Portal 继承最近的 ThemeProvider 和 tokens，不继承页面布局类。内置 12px 碰撞留白、窄屏宽度限制、长文案换行和溢出滚动。
- 不提供复杂表格、长篇阅读或大表单的容器；这类内容放到页面或 Dialog。业务状态、验证和保存由调用方管理。

“文章编辑与管理”（ArticleActions）的写作便笺展示草稿、保存、取消和逐层关闭。长标题为关闭按钮预留空间；面板受视口宽高限制，长内容可在面板内滚动。
