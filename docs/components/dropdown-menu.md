<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# DropdownMenu 下拉菜单

将文章操作或轻量工具收进一组可通过键盘操作的动作菜单。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { DropdownMenu } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于收纳收藏、编辑、移出列表等一组动作。每项通过 onSelect 执行操作；表单中的分类、排序和单个值选择使用 [Select](select.md)，页面跳转使用链接。

当前提供非模态的单层动作菜单，允许继续操作页面且不锁定滚动。需要填写内容的任务使用 [Popover](popover.md) 或 [Dialog](dialog.md)。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 基本操作

选择菜单项后收起菜单，并在下方显示最新选择；这里只演示 onSelect 回调，不执行收藏或生成摘要。

[查看示例文件](../../playground/src/examples/floating/MenuBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/floating/MenuBasic.tsx -->

```tsx
import { useState } from 'react';
import { Button, DropdownMenu, Text } from 'yahha-ui';

export default function MenuBasic() {
  const [message, setMessage] = useState('操作结果：尚未选择。');
  return (
    <div style={{ display: 'grid', justifyItems: 'center', gap: 16 }}>
      <DropdownMenu
        trigger={<Button variant="secondary">文章操作</Button>}
        items={[
          {
            id: 'save',
            label: '收藏文章',
            onSelect: () => setMessage('操作结果：已选择“收藏文章”。'),
          },
          {
            id: 'share',
            label: '生成分享摘要',
            onSelect: () => setMessage('操作结果：已选择“生成分享摘要”。'),
          },
        ]}
      />
      <Text size="sm" tone="muted" role="status">
        {message}
      </Text>
    </div>
  );
}
```

<a id="open-state"></a>

### 受控展开状态

用 open / onOpenChange 管理展开状态；点击触发器、选择菜单项或按 Escape，观察下方变化。菜单项仅演示关闭，不维护收藏。

[查看示例文件](../../playground/src/examples/floating/MenuOpen.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/floating/MenuOpen.tsx -->

```tsx
import { useState } from 'react';
import { Button, DropdownMenu, Text } from 'yahha-ui';

export default function MenuOpen() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'grid', justifyItems: 'center', gap: 16 }}>
      <DropdownMenu
        trigger={<Button variant="secondary">受控文章操作</Button>}
        open={open}
        onOpenChange={setOpen}
        items={[
          {
            id: 'save',
            label: '收藏到本页',
            onSelect: () => setOpen(false),
          },
        ]}
      />
      <Text size="sm" tone="muted" role="status">
        菜单状态：{open ? '展开' : '收起'}
      </Text>
    </div>
  );
}
```

<a id="controlled"></a>

### 组合：编辑、移出与恢复草稿

选择“继续编辑”修改本页草稿，保存或取消后回到菜单按钮；移出后内容仍保留，可从菜单内外恢复。等待审核的发布项不可操作。

[查看示例文件](../../playground/src/examples/floating/MenuControlled.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/floating/MenuControlled.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Button, DropdownMenu, Heading, Text, TextField } from 'yahha-ui';

export default function MenuControlled() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('草稿尚未发布');
  const [removed, setRemoved] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('周末想写的一页');
  const [draftTitle, setDraftTitle] = useState(title);
  const trigger = useRef<HTMLButtonElement>(null);
  const editor = useRef<HTMLInputElement>(null);
  const [focusTarget, setFocusTarget] = useState<'editor' | 'trigger' | null>(null);

  useEffect(() => {
    if (!focusTarget) return;
    // 先等菜单关闭并完成默认回焦，再继续到新操作的目标。
    const frame = requestAnimationFrame(() => {
      (focusTarget === 'editor' ? editor.current : trigger.current)?.focus();
      setFocusTarget(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [focusTarget]);

  function restore() {
    setRemoved(false);
    setMessage('草稿已恢复，内容没有丢失');
    setFocusTarget('trigger');
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {!removed && (
        <article aria-label="示例草稿">
          {editing ? (
            <form
              style={{ display: 'grid', gap: 12 }}
              onSubmit={(event) => {
                event.preventDefault();
                if (!draftTitle.trim()) {
                  editor.current?.focus();
                  return;
                }
                setTitle(draftTitle.trim());
                setEditing(false);
                setMessage('草稿标题已保存在本页');
                setFocusTarget('trigger');
              }}
            >
              <TextField
                ref={editor}
                label="草稿标题"
                value={draftTitle}
                required
                maxLength={60}
                hint="1–60 个字符。"
                onChange={(event) => setDraftTitle(event.target.value)}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Button type="submit" disabled={!draftTitle.trim()}>
                  保存草稿
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditing(false);
                    setMessage('已取消编辑，草稿标题没有改变');
                    setFocusTarget('trigger');
                  }}
                >
                  取消编辑
                </Button>
              </div>
            </form>
          ) : (
            <>
              <Heading level={3}>{title}</Heading>
              <Text>留一点空白，记录散步、翻书和下一次想写的小事。</Text>
            </>
          )}
        </article>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <DropdownMenu
          trigger={
            <Button ref={trigger} variant="secondary">
              草稿操作
            </Button>
          }
          open={open}
          onOpenChange={setOpen}
          align="end"
          items={
            removed
              ? [{ id: 'restore', label: '恢复草稿', onSelect: restore }]
              : [
                  {
                    id: 'edit',
                    label: '继续编辑',
                    onSelect: () => {
                      if (!editing) setDraftTitle(title);
                      setEditing(true);
                      setFocusTarget('editor');
                      setMessage('正在编辑草稿');
                    },
                  },
                  {
                    id: 'publish',
                    label: '发布（等待审核）',
                    disabled: true,
                    onSelect: () => setMessage('已发布'),
                  },
                  {
                    id: 'remove',
                    label: '移出草稿列表',
                    destructive: true,
                    onSelect: () => {
                      setRemoved(true);
                      setMessage('已从示例列表中移出，可恢复原草稿');
                    },
                  },
                ]
          }
        />
        {removed && <Button onClick={restore}>恢复草稿</Button>}
      </div>
      <Text size="sm" tone="muted" role="status">
        {message}
      </Text>
    </div>
  );
}
```

<a id="design"></a>

## 状态与反馈

每个菜单项使用稳定、唯一的 id 和清楚的文字标签。激活时执行 onSelect 并请求关闭；使用受控 open 时，调用方需要响应 onOpenChange。

业务确认、异步执行和失败处理由调用方负责，destructive 只改变危险动作的文字颜色。结果应留在页面，移出内容等操作可保留恢复入口。组合示例见 [文章编辑与管理](../README.md#站内指南)。

<a id="api"></a>

## API

仅支持下列属性，不透传其余 div 原生属性。

### DropdownMenuProps

| 参数                | 说明                                                                     | 类型                                   | 默认值     |
| ------------------- | ------------------------------------------------------------------------ | -------------------------------------- | ---------- |
| `trigger` **必填**  | 原生 button 或转发原生 button 属性、事件及 ref 的组件，例如 Button。     | `ReactElement`                         | —          |
| `items` **必填**    | 单层动作列表；id 在当前菜单内唯一。                                      | `readonly DropdownMenuItem[]`          | —          |
| `open`              | 受控展开状态；同时响应 onOpenChange。                                    | `boolean`                              | —          |
| `defaultOpen`       | 非受控初始状态，与 open 二选一。                                         | `boolean`                              | `false`    |
| `onOpenChange`      | 打开或关闭请求。受控模式需要更新 open。                                  | `(open: boolean) => void`              | —          |
| `disabled`          | 禁用触发器，阻止用户打开菜单。                                           | `boolean`                              | `false`    |
| `side`              | top、bottom、left、right、inline-start、inline-end；空间不足时自动避让。 | `DropdownMenuProps['side']`            | `"bottom"` |
| `align`             | 相对触发器的对齐方向。                                                   | `"start" \| "center" \| "end"`         | `"start"`  |
| `sideOffset`        | 与触发器的间距，单位 px。                                                | `number`                               | `8`        |
| `portalContainer`   | Portal 挂载容器，支持元素、ShadowRoot、对应 ref 或 null。                | `DropdownMenuProps['portalContainer']` | `body`     |
| `className / style` | 作用于 Popup div，不作用于触发器、定位层或 Portal 外层。                 | `string / CSSProperties`               | —          |
| `ref`               | 指向 Popup div，关闭卸载后为 null。                                      | `Ref<HTMLDivElement>`                  | —          |

### DropdownMenuItem

| 参数                | 说明                                               | 类型         | 默认值  |
| ------------------- | -------------------------------------------------- | ------------ | ------- |
| `id` **必填**       | 当前菜单内稳定、唯一的 key。                       | `string`     | —       |
| `label` **必填**    | 显示文字，并供键盘按字查找使用。                   | `string`     | —       |
| `onSelect` **必填** | 激活时执行。业务状态、异步失败与确认由调用方负责。 | `() => void` | —       |
| `disabled`          | 禁用激活；方向键仍可聚焦该项，保持可发现性。       | `boolean`    | `false` |
| `destructive`       | 使用错误语义文字颜色；不自动弹出确认框。           | `boolean`    | `false` |

<a id="keyboard"></a>

## 可访问性与键盘

- 聚焦触发器后，Enter / Space 或上下方向键打开菜单。上下方向键移动焦点并在首尾循环，Home / End 移到首项或末项，也可输入标签的起始字符查找项目；Enter / Space 执行聚焦的动作。
- Escape 关闭后返回触发器；Tab / Shift+Tab 离开菜单，点击外部也会请求关闭。 禁用项仍可通过方向键聚焦，但不能执行。
- 触发器的可访问名称也是菜单名称，菜单项使用 menuitem 语义。仅有图标的触发器应提供 aria-label；自定义组件须转发 button 属性、事件和 ref。

<a id="styling"></a>

## 定位与 Portal

默认使用白纸便笺与浅蓝内底边。可用菜单项高亮时显示浅粉纸面；悬停时补白色内缘，键盘聚焦时显示独立轮廓。

默认向下展开并与触发器起点对齐，空间不足时自动避让，距视口边缘保留 12px。 长标签可以换行，面板超出可用高度时滚动；自定义宽度时保留窄屏约束。

菜单跟随触发器自身或最近容器的显式 dir，文字方向与 start / inline-start 等逻辑定位保持一致；未指定时继承 Base UI DirectionProvider。仅设置 CSS direction 或 dir="auto" 时，请在触发器上同时设置明确的 dir。

Portal 默认挂载到 body，继承最近 ThemeProvider 的主题与 tokens，不复制页面布局类。 自定义 portalContainer 时，需检查容器的层叠与裁切，确保菜单可见且可操作。

<a id="related"></a>

## 相关组件

- [Select 下拉选择器](select.md)：在有限的文章分类、排序或归档选项中选择一项。
- [Popover 浮层](popover.md)：锚定到按钮的补充面板，适合简短说明和轻量交互。
- [Dialog 弹窗](dialog.md)：需要用户暂时集中注意力时，显示一段独立内容或简短表单。
