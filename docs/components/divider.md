# Divider 分隔线

用细线区分内容，支持水平、垂直和纯装饰模式。

本页示例按[入门指南](../../README.md#构建与本地安装)（站内路由 `#/guides/getting-started`）在应用入口导入一次 `yahha-ui/style.css` 并包裹 ThemeProvider。交互示例和更多状态见[文档站](../../README.md#本地开发)（站内路由 `#/components/divider`）。

默认使用 1px 轻纸线；水平分隔组织章节，垂直分隔组织元信息。可通过 `tokens.line` 覆盖线条颜色。

## API

| 参数                | 类型                               | 默认值       | 说明                                                                        |
| ------------------- | ---------------------------------- | ------------ | --------------------------------------------------------------------------- |
| orientation         | 'horizontal' \| 'vertical'         | 'horizontal' | 方向，垂直默认高度 1.5em。                                                  |
| decorative          | boolean                            | false        | true 时 role=presentation、aria-hidden=true。                               |
| className / style   | string / CSSProperties             | —            | 作用于根 hr 元素。                                                          |
| ref                 | ComponentPropsWithRef<'hr'>['ref'] | —            | 指向真实 hr 元素。                                                          |
| 其他原生属性 / 事件 | ComponentPropsWithRef<'hr'>        | —            | 沿用对应原生元素的事件、`aria-*`、`data-*` 等属性；下表列出的组件属性优先。 |

## 使用约定

- 不接收 children，不获取焦点，没有键盘操作。
- 水平默认宽度 100%，上下间距 20px；垂直布局可通过 style 调整高度与间距。
- 完整阅读示例在后记与收藏反馈之间使用装饰分隔，保留阅读顺序；其他工具栏边线由各自布局负责。

## 示例

```tsx
import { Divider, Text } from 'yahha-ui';

export default function DividerExample() {
  return (
    <div>
      <Text>正文结束，下面是相关阅读。</Text>
      <Divider />
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <span>阅读约 3 分钟</span>
        <Divider orientation="vertical" decorative />
        <span>生活手记</span>
      </div>
    </div>
  );
}
```
