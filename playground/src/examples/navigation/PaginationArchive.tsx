import { useEffect, useRef, useState } from 'react';
import { Heading, Pagination, Text } from 'yahha-ui';

const entries = [
  { title: '沿着河边散步', summary: '拐弯去买面包，回家才想起本来是去散步。' },
  { title: '窗边的一点阅读时间', summary: '窗外的鸟忙着搭窝，我把同一段读了三遍。' },
  { title: '周末的购物单', summary: '原本只打算买牛奶，回来时却多了一袋刚出炉的红豆包。' },
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
