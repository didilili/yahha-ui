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
