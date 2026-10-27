# Tooltip 文字提示

为已有操作提供简短的视觉文字标签，鼠标悬停或键盘聚焦时显示。不是重要说明的唯一入口，也不能包含链接、按钮和输入框。

```tsx
import { useState } from 'react';
import { IconButton, Tooltip } from 'yahha-ui';

export default function Example() {
  const [saved, setSaved] = useState(false);
  const label = '收藏文章';
  return (
    <div>
      <Tooltip
        content={label}
        trigger={
          <IconButton
            aria-label={label}
            aria-pressed={saved}
            variant="secondary"
            onClick={() => setSaved((value) => !value)}
          >
            <span aria-hidden="true">{saved ? '★' : '☆'}</span>
          </IconButton>
        }
      />
      <p role="status">{saved ? '文章已收藏' : '文章尚未收藏'}</p>
      <p>点击星星切换收藏；操作和结果都不依赖悬停提示。</p>
    </div>
  );
}
```

短提示采用小对白轮廓和指向触发器的墨线箭头，带深墨边、纸边与轻投影。内容保持简短；需要点击和轻交互的补充面板使用 [Popover](popover.md)，需要遮罩并集中完成的模态任务使用 [Dialog](dialog.md)。

提示在视口边缘自动避让，长文字可在可用高度内滚动。箭头不随内容滚动；无法居中指向触发器时隐藏，以避免错误指向。

## API

| 属性              | 类型                            | 默认值   | 说明                                                                 |
| ----------------- | ------------------------------- | -------- | -------------------------------------------------------------------- |
| trigger           | ReactElement                    | 必填     | 可聚焦的按钮，例如 Button 或 IconButton；须有自身可访问名称。        |
| content           | string                          | 必填     | 简短纯文字，与触发器名称一致或紧密对应；类型不接受交互节点。         |
| open              | boolean                         | —        | 受控展开状态；同时响应 onOpenChange。                                |
| defaultOpen       | boolean                         | false    | 非受控初始展开状态；与 open 二选一。                                 |
| onOpenChange      | (open: boolean) => void         | —        | 悬停、聚焦、Escape 等引起的展开或关闭请求。                          |
| disabled          | boolean                         | false    | 禁用提示本身，原按钮是否禁用由 trigger 决定。                        |
| delay             | number                          | 400      | 鼠标悬停等待时间，单位 ms；键盘聚焦立即展示。                        |
| side              | TooltipProps['side']            | 'top'    | top、bottom、left、right、inline-start、inline-end；空间不足时避让。 |
| align             | 'start' \| 'center' \| 'end'    | 'center' | 相对触发器对齐。                                                     |
| sideOffset        | number                          | 8        | 提示与触发器的间距，单位 px。                                        |
| portalContainer   | TooltipProps['portalContainer'] | body     | Base UI Portal 容器；元素、ShadowRoot、对应 ref 或 null。            |
| className / style | string / CSSProperties          | —        | 指向提示 Popup div，不作用于触发器、定位层或 Portal。                |
| ref               | Ref<HTMLDivElement>             | —        | 提示 Popup div，收起卸载后为 null。                                  |

## 可访问性与边界

- 本组件遵循 Base UI 1.9 的视觉标签约定，不自动用提示代替触发器名称，也不自动建立 aria-describedby。图标按钮必须自行提供 aria-label，且与 content 紧密对应。
- 收藏这类使用 aria-pressed 的切换按钮保持名称稳定，用 pressed 表示当前选中状态；相邻可见的 status 说明操作结果，不把“收藏/取消收藏”的名称变化与 pressed 状态混用。
- 触屏没有可靠的悬停入口。重要信息直接放在页面，或使用可点击、带标题并支持交互的 Popover；不能只藏在 Tooltip 内。
- 延迟与禁用示例中的“关闭文字提示”是切换按钮，pressed 为 true 表示提示已关闭。页面始终显示开关状态，触屏直接点击原按钮仍可执行加入稍后阅读的操作。
- 键盘 Tab 聚焦触发器时立即出现；Escape 收起，焦点仍在触发器。鼠标离开触发器和提示后关闭，点击触发器也会收起。
- Tooltip 使用 Base UI Provider 管理悬停延迟；每个封装独立管理，不提供跨实例的分组延迟配置。
- content 只接受 string；不放按钮、链接、表单或必须完成的任务，不承担 Toast 状态播报。
- 原生 disabled 按钮无法正常获得键盘焦点。不要依赖它的 Tooltip 解释禁用原因，应提供可见文字说明。
- trigger 保留调用方自己的事件、原生属性和 ref。组件不透传任意 div 原生属性，样式与 ref 作用于 Popup。
- Portal 同步最近的 ThemeProvider 与 tokens，内置碰撞留白、长文字换行和窄屏最大宽度；不复制页面布局 className。

“文章编辑与管理”（ArticleActions）示例展示 Tooltip 与文章操作的组合。操作名称和结果由触发器及可见文字表达，提示用于补充简短标签。

语义依据：[Base UI 1.9 Tooltip 使用说明](<https://github.com/mui/base-ui/blob/v1.9.0/docs/src/app/(docs)/react/components/tooltip/page.mdx>)。
