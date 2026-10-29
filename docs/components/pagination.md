<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Pagination 分页

在文章列表和归档中切换页码，保留首页、末页和当前页附近的页码。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Pagination } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

将文章列表、搜索结果等分成多页阅读时使用。组件提供受控的按钮式分页，适合在当前页面更新列表；数据切片与请求由调用方处理。需要可复制地址、在新标签打开等真实 URL 导航时，应使用链接式分页。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 对文章列表分页

通过 currentPage / onPageChange 更新本地数组的显示范围。totalPages 传总页数，不传文章条数。

[查看示例文件](../../playground/src/examples/navigation/PaginationBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/navigation/PaginationBasic.tsx -->

```tsx
import { useState } from 'react';
import { Pagination, Text } from 'yahha-ui';

const articles = [
  '沿着河岸，慢慢走回家',
  '窗边读完的一本小书',
  '今天的晚饭是番茄面',
  '雨天也想出去散步',
  '给阳台的小花换个花盆',
  '周末的面包店',
  '整理十月的照片',
  '写给远方朋友的信',
  '下次还想去的公园',
];

export default function PaginationBasic() {
  const [page, setPage] = useState(1);
  const pageSize = 3;
  const visibleArticles = articles.slice((page - 1) * pageSize, page * pageSize);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <ol start={(page - 1) * pageSize + 1} style={{ margin: 0, paddingLeft: 24, lineHeight: 2 }}>
        {visibleArticles.map((title) => (
          <li key={title}>{title}</li>
        ))}
      </ol>
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(articles.length / pageSize)}
        onPageChange={setPage}
      />
      <Text size="sm" tone="muted" role="status">
        第 {page} 页，共 {articles.length} 篇文章。
      </Text>
    </div>
  );
}
```

<a id="archive"></a>

### 较多页码与翻页阅读

用三篇本地摘要和编号模拟 80 页归档，只生成当前页，不发起请求或改变网址；翻页后更新列表并聚焦本页标题。

[查看示例文件](../../playground/src/examples/navigation/PaginationArchive.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/navigation/PaginationArchive.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Heading, Pagination, Text } from 'yahha-ui';

const entries = [
  { title: '沿着河边散步', summary: '把小花、晚风和今天走过的路，记进这一页。' },
  { title: '窗边的一点阅读时间', summary: '翻到喜欢的段落时，先停下来读一会儿。' },
  { title: '留给周末的小小计划', summary: '去买面包、整理书架，也给没有安排的时间留一点空白。' },
];

export default function PaginationArchive() {
  const [page, setPage] = useState(24);
  const heading = useRef<HTMLHeadingElement>(null);
  const continueReading = useRef(false);
  const first = (page - 1) * entries.length + 1;

  useEffect(() => {
    if (!continueReading.current) return;
    heading.current?.focus();
    continueReading.current = false;
  }, [page]);

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Heading level={3} ref={heading} tabIndex={-1}>
        归档第 {page} 页
      </Heading>
      <ol
        aria-label="本页归档文章"
        start={first}
        style={{ display: 'grid', gap: 20, margin: 0, paddingInlineStart: 24 }}
      >
        {entries.map((entry, index) => (
          <li key={`${page}-${index}`}>
            <article style={{ display: 'grid', gap: 8 }}>
              <Heading level={4}>
                手记 {first + index} · {entry.title}
              </Heading>
              <Text>{entry.summary}</Text>
            </article>
          </li>
        ))}
      </ol>
      <Pagination
        aria-label="文章归档分页"
        currentPage={page}
        totalPages={80}
        siblingCount={1}
        onPageChange={(nextPage) => {
          continueReading.current = true;
          setPage(nextPage);
        }}
      />
      <Text size="sm" tone="muted" role="status">
        正在查看归档第 {page} 页。
      </Text>
    </div>
  );
}
```

<a id="empty"></a>

### 空列表

没有文章时传入 totalPages={0}，数字页码隐藏，上一页与下一页均不可用。

[查看示例文件](../../playground/src/examples/navigation/PaginationEmpty.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/navigation/PaginationEmpty.tsx -->

```tsx
import { Pagination, Text } from 'yahha-ui';

export default function PaginationEmpty() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Text>这个收藏夹还没有文章。</Text>
      <Pagination aria-label="空列表分页" currentPage={1} totalPages={0} onPageChange={() => {}} />
    </div>
  );
}
```

<a id="design"></a>

## 分页状态与阅读位置

- currentPage 从 1 开始，totalPages 是总页数；在 onPageChange 中同步当前页和对应内容。点击当前页不会重复回调。
- 显示页码会归一化到可用范围，但不会因此触发 onPageChange。筛选后列表缩减时，调用方需同步修正自身页码；总页数为 0 时隐藏数字并禁用两侧按钮。
- 切页后的 URL、焦点和滚动位置由调用方安排。可把焦点移到新一页的标题，让阅读从更新后的内容开始；实际组合见 [个人博客归档](../README.md#站内指南)。

<a id="api"></a>

## API

PaginationProps 支持原生 nav 属性，children 除外。

### PaginationProps

| 参数                      | 说明                                                                          | 类型                                                    | 默认值     |
| ------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------- | ---------- |
| `currentPage` **必填**    | 从 1 开始的受控页码。显示时取整并限制在可用范围。                             | `number`                                                | —          |
| `totalPages` **必填**     | 总页数。取整并限制在 0 与 Number.MAX\_SAFE\_INTEGER 之间；非有限值按 0 处理。 | `number`                                                | —          |
| `onPageChange` **必填**   | 激活不同的可用页码后调用；点击当前页不回调。                                  | `(page: number) => void`                                | —          |
| `siblingCount`            | 当前页两侧的相邻页数，取整并限制在 0–2；非有限值使用 1。                      | `number`                                                | `1`        |
| `aria-label`              | nav 的可访问名称；多组分页应区分命名。                                        | `string`                                                | `文章分页` |
| `classNames`              | 列表、所有按钮、省略号的附加类名。                                            | `{ list?: string; button?: string; ellipsis?: string }` | —          |
| `ref / className / style` | 作用于最外层 nav。                                                            | `原生 nav 属性`                                         | —          |

<a id="behavior"></a>

## 可访问性与键盘

- nav 默认命名为“文章分页”，同页多组分页应使用不同的 aria-label。每个页码有“第 N 页”名称，当前页带 aria-current=page。
- 原生按钮通过 Tab 聚焦、Enter / Space 激活；第一页禁用上一页，末页禁用下一页，禁用按钮退出键盘顺序。
- 各个可见页码按钮都在 Tab 顺序中，不使用方向键切换。省略号不可操作，并对辅助技术隐藏。

<a id="styling"></a>

## 窄屏与长页码

普通页码使用轻纸边和浅蓝内底边，当前页使用粉色墨圈与内缘。有内容时显示首页、末页和当前页附近的页码，按钮数量不会随总页数线性增加。 页码组在窄屏换行，按钮至少 44×44px，多位数字保持完整并自然增宽；自定义宽度时也应避免挤压或截断页码。

<a id="related"></a>

## 相关组件

- [Link 链接](link.md)：保留原生链接行为，统一下划线与键盘焦点。
- [Tabs 标签页](tabs.md)：在同一页面的相关内容面板之间切换，用于栏目说明、作者资料和内容分区。
