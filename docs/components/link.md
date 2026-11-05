<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Link 链接

用于页面导航和资源跳转，保留原生链接行为、下划线与焦点样式。

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

### 基础用法

通过链接打开入门指南。

[查看示例文件](../../playground/src/examples/content/LinkExample.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/LinkExample.tsx -->

```tsx
import { Link, Text } from 'yahha-ui';

export default function LinkExample() {
  return (
    <Text>
      <Link href="#/guides/getting-started">阅读入门指南</Link>，了解组件的使用方式。
    </Text>
  );
}
```

<a id="link-external"></a>

### 外部链接

用 external 在新标签页打开，组件会补充 noopener noreferrer。

[查看示例文件](../../playground/src/examples/content/LinkExternal.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/LinkExternal.tsx -->

```tsx
import { Link } from 'yahha-ui';

export default function LinkExternal() {
  return (
    <Link href="https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/a" external>
      MDN 链接元素（新标签页）
    </Link>
  );
}
```

<a id="link-wrapping"></a>

### 长地址换行

在窄栏中保留完整地址与下划线。

[查看示例文件](../../playground/src/examples/content/LinkWrapping.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/LinkWrapping.tsx -->

```tsx
import { Link } from 'yahha-ui';

const address = 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/a';

export default function LinkWrapping() {
  return (
    <div style={{ maxWidth: '32ch', minWidth: 0 }}>
      <Link href={address} external>
        {address}（新标签页）
      </Link>
    </div>
  );
}
```

<a id="link-download"></a>

### 文件下载

下载 TXT 清单，或在新标签页阅读同一份文本。

[查看示例文件](../../playground/src/examples/content/LinkDownload.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/LinkDownload.tsx -->

```tsx
import { useEffect, useState } from 'react';
import { Link, Text } from 'yahha-ui';

const readingList = [
  'Yahha UI 阅读清单',
  '',
  '1. 沿着河边，慢慢走',
  '2. 读了三遍的那一页',
  '',
  '以上为 Yahha UI 原创示例手记。',
].join('\n');

export default function LinkDownload() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const address = URL.createObjectURL(
      new Blob([readingList], { type: 'text/plain;charset=utf-8' }),
    );
    // Browser-owned URLs are created and released with this instance, rather than during render.
    // oxlint-disable-next-line react/set-state-in-effect
    setUrl(address);
    return () => URL.revokeObjectURL(address);
  }, []);

  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: '65ch', minWidth: 0 }}>
      <Text>阅读清单</Text>
      <Text size="sm" tone="muted">
        TXT · UTF-8
      </Text>
      {url && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'baseline' }}>
          <Link href={url} download="yahha-reading-list.txt">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
              style={{ verticalAlign: 'text-bottom', marginInlineEnd: 4 }}
            >
              <path d="M7 3h7l4 4v14H6V3h1Zm7 0v5h4M9 12h6m-6 4h6" strokeLinejoin="round" />
            </svg>
            下载阅读清单（TXT）
          </Link>
          <Link href={url} external>
            在线阅读（新标签页）
          </Link>
        </div>
      )}
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
| `external`            | 未指定 target 时使用 \_blank；显式 target 优先。                          | `boolean`                           | `false` |
| `target / rel`        | target=\_blank 时保留原 rel 并补充 noopener noreferrer。                  | `原生 anchor 属性`                  | —       |
| `children`            | 清楚描述目标的链接内容。                                                  | `ReactNode`                         | —       |
| `className / style`   | 作用于根 a 元素。                                                         | `string / CSSProperties`            | —       |
| `ref`                 | 指向真实 a 元素。                                                         | `ComponentPropsWithRef<'a'>['ref']` | —       |
| `其他原生属性 / 事件` | 支持对应原生元素的事件、aria-\*、data-\* 等属性；组件声明的同名属性优先。 | `ComponentPropsWithRef<'a'>`        | —       |

<a id="behavior"></a>

## 导航与新窗口

- Tab 聚焦时显示可见轮廓，保留原生链接的 Enter 激活、新窗口和复制地址等操作。组件不接管路由，需要客户端导航时由应用接入。
- external 只设置默认打开方式，不根据 href 判断是否为外部地址；外部网站也可以在当前页打开。
- 在链接文字或相邻说明中交代新窗口行为，让用户在打开前知道会离开当前阅读环境。
- 没有 disabled 模式。不可访问的目标应由页面提供说明或不渲染链接。
- download 沿用原生 anchor 属性，适用于同源、blob 和 data 地址；浏览器决定实际保存方式。示例在卸载时释放 Blob URL，该地址仅用于当前实例，不作为永久资源地址。

<a id="related"></a>

## 相关组件

- [Button 按钮](button.md)：用于触发操作，支持不同强调程度、禁用、加载和切换状态。
- [Text 正文](text.md)：用于正文、摘要和辅助说明，统一字号、行高与语义颜色。
- [Pagination 分页](pagination.md)：用于列表分页，显示首页、末页和当前页附近的页码。
