<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Pagination 分页

在文章列表和归档中切换页码，保留首页、末页和当前页附近的页码。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Pagination } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

将文章列表、搜索结果等分成多页阅读时使用。默认按钮式分页更新当前列表；需要复制页码地址或在新标签打开时，使用 getPageHref 提供真实链接。数据切片、请求和网址更新由调用方处理。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 基础用法

通过页码按钮切换列表，每页显示三篇文章。

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
  const totalPages = Math.ceil(articles.length / pageSize);
  const visibleArticles = articles.slice((page - 1) * pageSize, page * pageSize);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <ol start={(page - 1) * pageSize + 1} style={{ margin: 0, paddingLeft: 24, lineHeight: 2 }}>
        {visibleArticles.map((title) => (
          <li key={title}>{title}</li>
        ))}
      </ol>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      <Text size="sm" tone="muted" role="status">
        第 {page} / {totalPages} 页，共 {articles.length} 篇文章。
      </Text>
    </div>
  );
}
```

<a id="archive"></a>

### 多页码与翻页焦点

用三条摘要模拟 80 页，翻页后聚焦本页标题。

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
      <Text size="sm" tone="muted">
        正在查看归档第 {page} 页。
      </Text>
    </div>
  );
}
```

<a id="empty"></a>

### 空列表

空列表隐藏数字页码，翻页按钮不可用。

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

<a id="integration"></a>

## 进阶用法

示例使用本地内容，当前页码保留在网址中。

<a id="links"></a>

### 链接分页与地址同步

用真实链接翻页，支持浏览器返回和新标签页打开。

[查看示例文件](../../playground/src/examples/navigation/PaginationLinks.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/navigation/PaginationLinks.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Heading, Pagination, Text } from 'yahha-ui';

const articles = [
  { id: 'leaf', title: '把一片叶子夹进手记', summary: '河边捡到的叶子，刚好替今天留下一个书签。' },
  { id: 'bread', title: '面包店开门以前', summary: '和朋友站在门口，等第一炉面包的香气飘出来。' },
  { id: 'window', title: '窗边空出来的一把椅子', summary: '把椅子往旁边挪一点，留给晚到的朋友。' },
  { id: 'soup', title: '晚饭多煮了一碗汤', summary: '原本只想煮一人份，最后还是多放了一把面。' },
  {
    id: 'margin',
    title: '在书页边画一朵小花',
    summary: '那句话读了两遍，旁边就多了一朵歪歪的小花。',
  },
  { id: 'rain', title: '等雨停的十分钟', summary: '躲在屋檐下，听朋友讲完昨天没说完的故事。' },
  {
    id: 'postcard',
    title: '明信片上还留着一行空白',
    summary: '最后一行先空着，等见到你时再一起填上。',
  },
  { id: 'tea', title: '茶凉下来之前', summary: '手里的杯子还暖着，窗外的小路已经亮起了灯。' },
  { id: 'moon', title: '走到路口再抬头看看', summary: '朋友说今晚月亮很圆，我们就多站了一会儿。' },
];
const pageSize = 3;
const totalPages = Math.ceil(articles.length / pageSize);
const pageKey = 'yahha-pagination-page';

function readHref() {
  return typeof window === 'undefined' ? 'http://localhost/' : window.location.href;
}

function readPage(href: string) {
  const requested = Number(new URL(href).searchParams.get(pageKey) ?? 1);
  return Math.min(totalPages, Math.max(1, Number.isFinite(requested) ? Math.floor(requested) : 1));
}

export default function PaginationLinks() {
  const [href, setHref] = useState(readHref);
  const heading = useRef<HTMLHeadingElement>(null);
  const pendingPageFocus = useRef(false);
  const page = readPage(href);
  const first = (page - 1) * pageSize;
  const visible = articles.slice(first, first + pageSize);

  useEffect(() => {
    function readLocation() {
      pendingPageFocus.current = false;
      setHref(window.location.href);
    }
    window.addEventListener('popstate', readLocation);
    window.addEventListener('hashchange', readLocation);
    return () => {
      window.removeEventListener('popstate', readLocation);
      window.removeEventListener('hashchange', readLocation);
    };
  }, []);

  useEffect(() => {
    if (!pendingPageFocus.current) return;
    pendingPageFocus.current = false;
    heading.current?.focus();
  }, [href]);

  function getPageHref(nextPage: number) {
    const next = new URL(readHref());
    if (nextPage === 1) next.searchParams.delete(pageKey);
    else next.searchParams.set(pageKey, String(nextPage));
    return next.href;
  }

  return (
    <div style={{ display: 'grid', gap: 20, minWidth: 0, maxWidth: '64ch' }}>
      <Heading level={3} ref={heading} tabIndex={-1}>
        手记第 {page} 页
      </Heading>
      <ol
        aria-label="本页手记"
        start={first + 1}
        style={{ display: 'grid', gap: 20, margin: 0, paddingInlineStart: 24 }}
      >
        {visible.map((article) => (
          <li key={article.id}>
            <article style={{ display: 'grid', gap: 8 }}>
              <Heading level={4}>{article.title}</Heading>
              <Text tone="muted">{article.summary}</Text>
            </article>
          </li>
        ))}
      </ol>
      <Pagination
        aria-label="手记链接分页"
        currentPage={page}
        totalPages={totalPages}
        getPageHref={getPageHref}
        onPageChange={(nextPage) => {
          if (typeof window === 'undefined') return;
          const nextHref = getPageHref(nextPage);
          if (nextHref === window.location.href) return;
          pendingPageFocus.current = true;
          window.history.pushState(window.history.state, '', nextHref);
          setHref(nextHref);
        }}
      />
      <Text role="status" size="sm" tone="muted">
        第 {page} / {totalPages} 页，共 {articles.length} 篇手记。
      </Text>
    </div>
  );
}
```

<a id="design"></a>

## 分页状态与阅读位置

- currentPage 从 1 开始，totalPages 是总页数，不是文章条数；在 onPageChange 中同步当前页和对应内容。点击当前页不会重复回调。
- 显示页码会归一化到可用范围，但不会因此触发 onPageChange。筛选后列表缩减时，调用方需同步修正自身页码；总页数为 0 时隐藏数字并禁用两侧按钮。
- 切页后的 URL、焦点和滚动位置由调用方安排。可把焦点移到新一页的标题，让阅读从更新后的内容开始；实际组合见 [个人博客归档](../README.md#站内指南)。
- getPageHref 只生成有效页码的地址；普通主键点击与 Enter 会阻止默认跳转，仍由 onPageChange 更新内容及网址。修饰键和中键保留浏览器原生导航，不调用回调。 当前页普通激活不回调；不可用的前后入口不带 href，也不进入 Tab 顺序。
- 链接例在网址中保存当前页，刷新或返回可恢复，并保留其他参数和片段。 完整博客复用自身归档路由保留搜索、分类、排序和收藏筛选。

<a id="api"></a>

## API

PaginationProps 支持原生 nav 属性，children 除外。

### PaginationProps

| 属性                      | 说明                                                                                          | 类型                                                    | 默认值     |
| ------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ---------- |
| `currentPage` **必填**    | 从 1 开始的受控页码。显示时取整并限制在可用范围；有页码时，非有限值按 1 处理。                | `number`                                                | —          |
| `totalPages` **必填**     | 总页数。取整并限制在 0 与 Number.MAX\_SAFE\_INTEGER 之间；非有限值按 0 处理。                 | `number`                                                | —          |
| `onPageChange` **必填**   | 普通激活不同的可用页码后调用；点击当前页不回调。链接模式同样必需，由调用方同步网址。          | `(page: number) => void`                                | —          |
| `getPageHref`             | 为有效页码生成真实链接；不传时保持按钮。普通激活走 onPageChange，修饰键或中键按原生链接导航。 | `(page: number) => string`                              | —          |
| `siblingCount`            | 当前页两侧的相邻页数，取整并限制在 0–2；非有限值使用 1。                                      | `number`                                                | `1`        |
| `aria-label`              | nav 的可访问名称；多组分页应区分命名。                                                        | `string`                                                | `文章分页` |
| `classNames`              | 列表、所有页码入口（按钮或链接）、省略号的附加类名。                                          | `{ list?: string; button?: string; ellipsis?: string }` | —          |
| `ref / className / style` | 作用于最外层 nav。                                                                            | `原生 nav 属性`                                         | —          |

<a id="behavior"></a>

## 可访问性与键盘

- nav 默认命名为“文章分页”，同页多组分页应使用不同的 aria-label。每个页码有“第 N 页”名称，当前页带 aria-current=page。
- 原生按钮通过 Tab 聚焦、Enter / Space 激活；第一页禁用上一页，末页禁用下一页，禁用按钮退出键盘顺序。
- 链接通过 Tab 聚焦、Enter 激活，Space 保持浏览器的滚动行为。 Cmd / Ctrl 点击或中键可在新标签打开；是否打开窗口等行为遵循浏览器设置。
- 各个可见页码按钮都在 Tab 顺序中，不使用方向键切换。省略号不可操作，并对辅助技术隐藏。

<a id="styling"></a>

## 窄屏与长页码

有内容时显示首页、末页和当前页附近的页码，按钮数量不会随总页数线性增加。 页码组在窄屏换行，按钮至少 44×44px，多位数字保持完整并自然增宽；自定义宽度时也应避免挤压或截断页码。

<a id="related"></a>

## 相关组件

- [Link 链接](link.md)：保留原生链接行为，统一下划线与键盘焦点。
- [Tabs 标签页](tabs.md)：在同一页面的相关内容面板之间切换，用于栏目说明、作者资料和内容分区。
