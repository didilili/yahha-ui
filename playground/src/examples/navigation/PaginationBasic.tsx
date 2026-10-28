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
