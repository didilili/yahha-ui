# Pagination 分页

用于文章列表、归档等内容的受控页码导航。组件发出下一页码，数组切片、数据请求、URL 同步及切页后的焦点或滚动由调用方负责。

普通页码用轻纸边组织，当前页用圆钝墨圈与主题浅色面标记；上一页、下一页保持较轻的文字操作。数字和文字在按钮内居中，当前页、禁用边界和不可操作的省略号分别表达各自含义。

## 列表与阅读位置

文档站的归档示例同步更新页码和当前页的三篇文章摘要，使用三份本地内容加页码编号模拟 80 页。示例只生成当前页，不包含 240 篇独立文章，也不发起请求或改变网址；同时提供首末页、省略号和零页导航的演示。

切页后的结果标题由调用方聚焦，让键盘使用者从新内容开始继续阅读；首次挂载不主动移动焦点。组件本身只报告页码，不知道列表放在哪里，因此不会自动移动列表焦点或滚动页面。真实站点可以按自己的阅读流程选择标题、结果说明或保留页码按钮作为焦点目标。

## API

| 属性                               | 类型                          | 默认值   | 说明                                 |
| ---------------------------------- | ----------------------------- | -------- | ------------------------------------ |
| currentPage                        | number                        | 必填     | 从 1 开始的受控当前页                |
| totalPages                         | number                        | 必填     | 总页数，不是文章总条数               |
| onPageChange                       | (page: number) => void        | 必填     | 点击不同的可用页码时回调             |
| siblingCount                       | number                        | 1        | 当前页两侧相邻页数；取整并限制为 0–2 |
| aria-label                         | string                        | 文章分页 | nav 的可访问名称，多组分页应区分命名 |
| classNames                         | { list?, button?, ellipsis? } | —        | 列表、所有按钮和省略号的附加类名     |
| ref / className / style / 原生属性 | nav 属性                      | —        | 均作用于最外层 nav                   |

总页数取整并限制在 0 与 Number.MAX_SAFE_INTEGER 之间；非有限值视为 0。总页数为 0 时仅显示禁用的上一页、下一页。当前页取整并限制在可用范围，非有限值显示第 1 页；这些显示归一化不会触发回调。调用方仍应在数据缩减后同步修正自身 currentPage。siblingCount 非有限时使用默认值 1。

## 使用示例

```tsx
import { useEffect, useRef, useState } from 'react';
import { Heading, Pagination } from 'yahha-ui';

export function ArticlePages() {
  const [page, setPage] = useState(1);
  const results = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);
  const titles = ['河边散步', '窗边读书', '周末面包店', '整理旧照片'];
  const pageSize = 2;

  useEffect(() => {
    if (!moveFocus.current) return;
    results.current?.focus();
    moveFocus.current = false;
  }, [page]);

  return (
    <div>
      <Heading level={3} ref={results} tabIndex={-1}>
        第 {page} 页文章
      </Heading>
      <ul>
        {titles.slice((page - 1) * pageSize, page * pageSize).map((title) => (
          <li key={title}>{title}</li>
        ))}
      </ul>
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(titles.length / pageSize)}
        onPageChange={(nextPage) => {
          moveFocus.current = true;
          setPage(nextPage);
        }}
      />
    </div>
  );
}
```

## 键盘与样式约定

- nav 包含语义列表和原生 type=button 按钮。Tab 聚焦可用按钮，Enter / Space 激活；边界按钮原生 disabled。
- 当前页 aria-current=page，点击当前页不回调。所有页码有“第 N 页”的可访问名称，装饰省略号对读屏隐藏。
- 总是保留首页、末页和当前页附近的页码，渲染数量不随总页数线性增长。
- 按钮最小 44×44px，数字与文字显式居中；长页码随内容增加宽度，窄屏自然换行，不压缩点击目标。可通过 classNames 修改样式，不依赖内部标签层级。
- 当前页的圈记与焦点圈同时可辨；禁用边界保留文字，省略号不伪装成禁用按钮。强制颜色下当前页保持系统高亮边线，禁用按钮使用 GrayText。
- 不提供链接模式、页面大小选择或页码输入；需要真实站内链接的路由分页不应假装成按钮点击。
