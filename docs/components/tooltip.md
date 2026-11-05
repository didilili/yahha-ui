<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Tooltip 文字提示

悬停或聚焦时，为已有操作补充简短的视觉文字标签。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Tooltip } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于给图标操作补充简短的视觉文字。trigger 必须自带可访问名称，用户应能直接理解并执行操作；悬停提示只作补充。content 仅接受纯文字。

重要说明直接显示在页面中，需要链接、按钮或表单的内容使用 [Popover](popover.md)。操作结果用可见状态文字或 Toast 表达。

<a id="examples"></a>

## 代码演示

收藏状态仅保留在当前示例；稍后阅读示例只回显按钮操作，不维护阅读列表。

<a id="basic"></a>

### 悬停与聚焦提示

悬停或聚焦查看提示，点击切换收藏。

[查看示例文件](../../playground/src/examples/floating/TooltipBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/floating/TooltipBasic.tsx -->

```tsx
import { useState } from 'react';
import { IconButton, Text, Tooltip } from 'yahha-ui';

export default function TooltipBasic() {
  const [saved, setSaved] = useState(false);
  const label = '收藏文章';
  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 16 }}>
      <Tooltip
        content={label}
        trigger={
          <IconButton
            variant="secondary"
            aria-label={label}
            aria-pressed={saved}
            onClick={() => setSaved((value) => !value)}
          >
            <span aria-hidden="true">{saved ? '★' : '☆'}</span>
          </IconButton>
        }
      />
      <Text size="sm" tone="muted" role="status">
        {saved ? '文章已收藏' : '文章尚未收藏'}
      </Text>
    </div>
  );
}
```

<a id="options"></a>

### 延迟、方向与禁用提示

首次悬停 0.8 秒后在下方显示提示；关闭提示后仍可点击按钮。

[查看示例文件](../../playground/src/examples/floating/TooltipOptions.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/floating/TooltipOptions.tsx -->

```tsx
import { useState } from 'react';
import { Button, Text, Tooltip } from 'yahha-ui';

export default function TooltipOptions() {
  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState('尚未触发操作。');
  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 16 }}>
      <div>
        <Tooltip
          disabled={disabled}
          delay={800}
          side="bottom"
          content="加入稍后阅读"
          trigger={
            <Button variant="secondary" onClick={() => setMessage('已触发“加入稍后阅读”操作。')}>
              加入稍后阅读
            </Button>
          }
        />
      </div>
      <Button
        variant="ghost"
        aria-pressed={disabled}
        onClick={() => setDisabled((value) => !value)}
      >
        关闭文字提示
      </Button>
      <Text size="sm" tone="muted" role="status">
        {message}
      </Text>
      <Text size="sm" tone="muted">
        当前文字提示：{disabled ? '已关闭' : '已开启'}。
      </Text>
    </div>
  );
}
```

<a id="design"></a>

## 显示与关闭

默认首次悬停 400ms 后显示，键盘聚焦时立即显示。鼠标可以移入提示阅读文字，离开触发器与提示后收起。disabled 只关闭提示，不改变原按钮的可用状态。

每个 Tooltip 独立计算悬停延迟。从一个触发器移动到另一个时，仍按后者的 delay 等待， 当前没有跨实例共用的延迟分组。同一提示刚关闭后短时间再次悬停可能立即显示。

<a id="api"></a>

## API

仅支持下列属性，不透传其余 div 原生属性。

### TooltipProps

| 属性                | 说明                                                                              | 类型                              | 默认值     |
| ------------------- | --------------------------------------------------------------------------------- | --------------------------------- | ---------- |
| `trigger` **必填**  | 可聚焦按钮。必须有自身可访问名称，通常使用 Button 或带 aria-label 的 IconButton。 | `ReactElement`                    | —          |
| `content` **必填**  | 简短纯文字，与 trigger 名称一致或紧密对应。不能包含链接、按钮和表单。             | `string`                          | —          |
| `open`              | 受控展开状态；同时响应 onOpenChange。                                             | `boolean`                         | —          |
| `defaultOpen`       | 非受控初始状态，与 open 二选一。                                                  | `boolean`                         | `false`    |
| `onOpenChange`      | 打开或关闭请求。受控模式需要更新 open。                                           | `(open: boolean) => void`         | —          |
| `disabled`          | 禁用提示，不改变 trigger 元素本身的 disabled。                                    | `boolean`                         | `false`    |
| `delay`             | 首次鼠标悬停等待时间，单位 ms；键盘聚焦立即展示，短时间再次悬停可能立即显示。     | `number`                          | `400`      |
| `side`              | top、bottom、left、right、inline-start、inline-end；空间不足时自动避让。          | `TooltipProps['side']`            | `"top"`    |
| `align`             | 相对触发器的对齐方向。                                                            | `"start" \| "center" \| "end"`    | `"center"` |
| `sideOffset`        | 提示外框与触发器的间距，单位 px；默认给尖角和按钮焦点圈留出空间。                 | `number`                          | `12`       |
| `portalContainer`   | Portal 挂载容器，支持元素、ShadowRoot、对应 ref 或 null。                         | `TooltipProps['portalContainer']` | `body`     |
| `className / style` | 作用于浮层面板 div，不作用于触发器、定位层或 Portal 外层。                        | `string / CSSProperties`          | —          |
| `ref`               | 指向浮层面板 div，关闭卸载后为 null。                                             | `Ref<HTMLDivElement>`             | —          |

<a id="keyboard"></a>

## 可访问性与键盘

- Tab 聚焦触发器时立即显示；Escape 或点击触发器收起，焦点保留在触发器。
- 提示不自动通过 aria-describedby 关联到触发器，也不替代触发器自身的可访问名称。 图标按钮仍须提供 aria-label，切换状态通过 aria-pressed 表达并保持名称稳定。
- 触屏没有可靠的悬停入口。原生 disabled 按钮也无法聚焦，禁用原因和重要说明应直接显示在页面中。

<a id="styling"></a>

## 定位与 Portal

默认显示在触发器上方，外框与触发器间距 12px，空间不足时自动避让，距视口边缘保留 12px；箭头避开气泡圆角，无法准确指向时隐藏。 文字可换行，但提示应保持简短；需要滚动阅读的说明更适合放在页面或 Popover 中。

提示跟随触发器自身或最近容器的显式 dir，使文字、逻辑定位和箭头朝向保持一致；未指定时继承 Base UI DirectionProvider。仅设置 CSS direction 或 dir="auto" 时，请在触发器上同时设置明确的 dir。

Portal 默认挂载到 body，继承最近 ThemeProvider 的主题与 tokens，不复制页面布局类。 自定义 portalContainer 时，需检查容器的层叠与裁切，避免提示被遮住。

<a id="related"></a>

## 相关组件

- [Popover 弹出面板](popover.md)：锚定到按钮的补充面板，适合简短说明和轻量交互。
- [IconButton 图标按钮](icon-button.md)：为关闭、收藏等仅用图标表达的操作提供方形点击区域与明确的可访问名称。
