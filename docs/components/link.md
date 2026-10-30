<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Link 链接

保留原生链接行为，统一下划线与键盘焦点。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Link } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于页面跳转、文章阅读和外部资源入口；保存、收藏等操作使用 Button。

<a id="examples"></a>

## 代码演示

<a id="link-native"></a>

### 站内与外部链接

站内入口与正文中的长链接；外链使用明确标注的 example.com 占位地址，接入时替换为实际目标，并保留新窗口提示。

[查看示例文件](../../playground/src/examples/content/LinkExample.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/LinkExample.tsx -->

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
          example.com 占位页面（新标签页打开）
        </Link>
      </Text>
      <Text>
        周末空下来的时候，可以读读
        <Link href="https://example.com" external>
          example.com 占位页面：适合周末慢慢阅读的散步与书单手记（新标签页打开）
        </Link>
        。
      </Text>
      <Text size="sm" tone="muted">
        <Link href="https://example.com/#PersonalJournalWithAVeryLongUnbrokenAddress" external>
          https://example.com/#PersonalJournalWithAVeryLongUnbrokenAddress（新标签页打开）
        </Link>
      </Text>
    </div>
  );
}
```

<a id="design"></a>

## 让目标在正文中可辨认

链接使用墨色下划线，跨行仍可辨认；悬停加强下划线，键盘聚焦时显示清楚的轮廓。链接文字应说明目标内容，避免只写“点击这里”；长地址可以自然换行。

<a id="api"></a>

## API

### LinkProps

| 属性                  | 说明                                                                      | 类型                                | 默认值  |
| --------------------- | ------------------------------------------------------------------------- | ----------------------------------- | ------- |
| `href` **必填**       | 链接目标。                                                                | `string`                            | —       |
| `external`            | 未指定 target 时使用 \_blank。                                            | `boolean`                           | `false` |
| `target / rel`        | target=\_blank 时保留原 rel 并补充 noopener noreferrer。                  | `原生 anchor 属性`                  | —       |
| `children`            | 清楚描述目标的链接内容。                                                  | `ReactNode`                         | —       |
| `className / style`   | 作用于根 a 元素。                                                         | `string / CSSProperties`            | —       |
| `ref`                 | 指向真实 a 元素。                                                         | `ComponentPropsWithRef<'a'>['ref']` | —       |
| `其他原生属性 / 事件` | 支持对应原生元素的事件、aria-\*、data-\* 等属性；组件声明的同名属性优先。 | `ComponentPropsWithRef<'a'>`        | —       |

<a id="behavior"></a>

## 导航与新窗口

- Tab 聚焦时显示可见轮廓，保留原生链接的 Enter 激活、新窗口和复制地址等操作。组件不接管路由，需要客户端导航时由应用接入。
- 在链接文字或相邻说明中交代新窗口行为，让用户在打开前知道会离开当前阅读环境。
- 没有 disabled 模式。不可访问的目标应由页面提供说明或不渲染链接。

<a id="related"></a>

## 相关组件

- [Button 按钮](button.md)：用于提交、保存和收藏等操作，提供三种强调程度，支持禁用与加载状态。
- [Text 正文](text.md)：为段落提供统一的字号、行高和语义文字颜色。
- [Pagination 分页](pagination.md)：在文章列表和归档中切换页码，保留首页、末页和当前页附近的页码。
