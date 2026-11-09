<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# DropdownMenu 下拉菜单

用于展示单层操作菜单，支持键盘导航与禁用项。

[安装与接入](../../README.md#安装与接入)

```tsx
import { DropdownMenu } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于收纳收藏、编辑、移出列表等一组动作。每项通过 onSelect 执行操作；表单中的分类、排序和单个值选择使用 [Select](select.md)，页面跳转使用链接。

当前提供非模态的单层动作菜单，允许继续操作页面且不锁定滚动。需要填写内容的任务使用 [Popover](popover.md) 或 [Dialog](dialog.md)。

<a id="examples"></a>

## 代码演示

示例只更新本页状态，不连接后台；基础例会显示选中的操作，不实际收藏或生成摘要。

<a id="basic"></a>

### 基础用法

选择菜单项后显示当前操作。

[查看示例文件](../../playground/src/examples/floating/MenuBasic.tsx)

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

打开或关闭菜单，查看展开状态。

[查看示例文件](../../playground/src/examples/floating/MenuOpen.tsx)

<!-- example-source: playground/src/examples/floating/MenuOpen.tsx -->

```tsx
import { useState } from 'react';
import { Button, DropdownMenu, Text } from 'yahha-ui';

export default function MenuOpen() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'grid', justifyItems: 'center', gap: 16 }}>
      <DropdownMenu
        trigger={<Button variant="secondary">文章操作</Button>}
        open={open}
        onOpenChange={setOpen}
        items={[
          {
            id: 'close',
            label: '关闭菜单',
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

### 触发器移除后的焦点恢复

菜单含禁用发布项与危险移出项；移出手记和菜单入口后回焦恢复按钮，恢复后返回菜单入口。

[查看示例文件](../../playground/src/examples/floating/MenuTriggerRecovery.tsx)

<!-- example-source: playground/src/examples/floating/MenuTriggerRecovery.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Button, DropdownMenu, Text } from 'yahha-ui';

export default function MenuTriggerRecovery() {
  const [removed, setRemoved] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const recovery = useRef<HTMLButtonElement>(null);
  const moveFocus = useRef(false);

  useEffect(() => {
    if (!moveFocus.current) return;
    const frame = requestAnimationFrame(() => {
      (removed ? recovery : trigger).current?.focus();
      moveFocus.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [removed]);

  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      {removed ? (
        <Button
          ref={recovery}
          onClick={() => {
            moveFocus.current = true;
            setRemoved(false);
          }}
        >
          恢复手记
        </Button>
      ) : (
        <>
          <Text>《周末散步》：乌萨奇在路线图上，先圈出了三家面包店。</Text>
          <DropdownMenu
            trigger={
              <Button ref={trigger} variant="secondary" aria-label="操作手记：周末散步">
                手记操作
              </Button>
            }
            items={[
              { id: 'publish', label: '发布（等待审核）', disabled: true, onSelect: () => {} },
              {
                id: 'remove',
                label: '移出手记列表',
                destructive: true,
                onSelect: () => {
                  moveFocus.current = true;
                  setRemoved(true);
                },
              },
            ]}
          />
        </>
      )}
      <Text size="sm" tone="muted" role="status">
        {removed ? '手记已移出，可以恢复。' : '手记在列表中，内容仍然保留。'}
      </Text>
    </div>
  );
}
```

<a id="design"></a>

## 状态与反馈

每个菜单项使用稳定、唯一的 id 和清楚的文字标签。激活时执行 onSelect 并请求关闭；使用受控 open 时，调用方需要响应 onOpenChange。

业务确认、异步执行和失败处理由调用方负责，destructive 只改变危险动作的文字颜色。结果应留在页面，移出内容等操作可保留恢复入口。完整的 [草稿编辑、移出与恢复](../recipes/interactions.md#controlled)保留未提交的编辑内容；菜单与弹窗的组合见 [文章编辑与管理](../README.md#站内指南)。

<a id="api"></a>

## API

仅支持下列属性，不透传其余 div 原生属性。

### DropdownMenuProps

| 属性                | 说明                                                                     | 类型                                                                                | 默认值     |
| ------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | ---------- |
| `trigger` **必填**  | 原生 button 或转发原生 button 属性、事件及 ref 的组件，例如 Button。     | `ReactElement`                                                                      | —          |
| `items` **必填**    | 单层动作列表；id 在当前菜单内唯一。                                      | `readonly DropdownMenuItem[]`                                                       | —          |
| `open`              | 受控展开状态；同时响应 onOpenChange。                                    | `boolean`                                                                           | —          |
| `defaultOpen`       | 非受控初始状态，与 open 二选一。                                         | `boolean`                                                                           | `false`    |
| `onOpenChange`      | 打开或关闭请求。受控模式需要更新 open。                                  | `(open: boolean) => void`                                                           | —          |
| `disabled`          | 禁用触发器，阻止用户打开菜单。                                           | `boolean`                                                                           | `false`    |
| `side`              | top、bottom、left、right、inline-start、inline-end；空间不足时自动避让。 | `'top' \| 'bottom' \| 'left' \| 'right' \| 'inline-start' \| 'inline-end'`          | `"bottom"` |
| `align`             | 相对触发器的对齐方向。                                                   | `"start" \| "center" \| "end"`                                                      | `"start"`  |
| `sideOffset`        | 与触发器的间距，单位 px。                                                | `number`                                                                            | `8`        |
| `portalContainer`   | Portal 挂载容器，支持元素、ShadowRoot、对应 ref 或 null。                | `HTMLElement \| ShadowRoot \| RefObject<HTMLElement \| ShadowRoot \| null> \| null` | `body`     |
| `className / style` | 作用于浮层面板 div，不作用于触发器、定位层或 Portal 外层。               | `string / CSSProperties`                                                            | —          |
| `ref`               | 指向浮层面板 div，关闭卸载后为 null。                                    | `Ref<HTMLDivElement>`                                                               | —          |

### DropdownMenuItem

| 属性                | 说明                                               | 类型         | 默认值  |
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

默认向下展开并与触发器起点对齐，空间不足时自动避让，距视口边缘保留 12px。 长标签可以换行，面板超出可用高度时滚动；自定义宽度时保留窄屏约束。

菜单跟随触发器自身或最近容器的显式 dir，文字方向与 start / inline-start 等逻辑定位保持一致；未指定时继承 Base UI DirectionProvider。仅设置 CSS direction 或 dir="auto" 时，请在触发器上同时设置明确的 dir。

Portal 默认挂载到 body，继承最近 ThemeProvider 的主题与 tokens，不复制页面布局类。 自定义 portalContainer 时，需检查容器的层叠与裁切，确保菜单可见且可操作。

<a id="related"></a>

## 相关组件

- [Select 下拉选择器](select.md)：从文章分类、排序方式等固定选项中选一项。
- [Popover 弹出面板](popover.md)：锚定到触发器的非模态面板，可包含说明、链接或短表单。
- [Dialog 弹窗](dialog.md)：用于模态展示确认、简短表单或补充内容，管理弹窗焦点。
