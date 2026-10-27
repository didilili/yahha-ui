# Link 链接

保留原生链接行为，统一下划线与键盘焦点。

本页示例按[入门指南](../../README.md#构建与本地安装)（站内路由 `#/guides/getting-started`）在应用入口导入一次 `yahha-ui/style.css` 并包裹 ThemeProvider。交互示例和更多状态见[文档站](../../README.md#本地开发)（站内路由 `#/components/link`）。

正文链接采用 1.5px 墨色下划线、随字号调整的偏移与跨行文字避让；悬停时下划线加粗并使用焦点色。保持行内阅读节奏，键盘聚焦使用单层 2px 轮廓。

## API

| 参数                | 类型                              | 默认值 | 说明                                                                        |
| ------------------- | --------------------------------- | ------ | --------------------------------------------------------------------------- |
| href（必填）        | string                            | —      | 链接目标。                                                                  |
| external            | boolean                           | false  | 未指定 target 时使用 _blank。                                               |
| target / rel        | 原生 anchor 属性                  | —      | target=_blank 时保留原 rel 并补充 noopener noreferrer。                     |
| children            | ReactNode                         | —      | 清楚描述目标的链接内容。                                                    |
| className / style   | string / CSSProperties            | —      | 作用于根 a 元素。                                                           |
| ref                 | ComponentPropsWithRef<'a'>['ref'] | —      | 指向真实 a 元素。                                                           |
| 其他原生属性 / 事件 | ComponentPropsWithRef<'a'>        | —      | 沿用对应原生元素的事件、`aria-*`、`data-*` 等属性；下表列出的组件属性优先。 |

## 使用约定

- Enter 激活链接。支持浏览器新窗口、复制链接与打开方式，组件不替换路由器。
- 没有 disabled 模式。不可访问的目标应由页面提供说明或不渲染链接。
- 链接可以嵌入 Text 的连续段落。长文字或地址自然换行，下划线与键盘焦点均保留；不增加额外按钮背景或统一成块级操作。
- 外部链接的文字应说明目标；新窗口行为可在可见文案中告知。内页 hash 路由仍由应用负责，组件不自行改变焦点或滚动位置。
- 正文中的多行中文、长地址和行尾标点遵循行内排版，下划线与焦点轮廓保持可见。页内跳转的滚动与后续焦点由调用方管理。

## 示例

```tsx
import { Link, Text } from 'yahha-ui';

export default function LinkExample() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Text>
        <Link href="#/guides/getting-started">阅读入门指南</Link>，继续了解组件的使用方式。
      </Text>
      <Text>
        <Link href="https://example.com" external>
          示例作者主页（新窗口）
        </Link>
      </Text>
      <Text>
        参考链接也可以放在连续的正文中，例如
        <Link href="https://example.com" external>
          一段较长的链接文字，用来观察正文中的自然换行（新窗口）
        </Link>
        。Tab 聚焦时保持可见轮廓，Enter 沿用浏览器导航。
      </Text>
      <Text size="sm" tone="muted">
        <Link href="https://example.com/#PersonalJournalWithAVeryLongUnbrokenAddress" external>
          https://example.com/#PersonalJournalWithAVeryLongUnbrokenAddress
        </Link>
      </Text>
    </div>
  );
}
```
