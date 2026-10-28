import { Pagination, Text } from 'yahha-ui';

export default function PaginationEmpty() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Text>这个收藏夹还没有文章。</Text>
      <Pagination aria-label="空列表分页" currentPage={1} totalPages={0} onPageChange={() => {}} />
    </div>
  );
}
