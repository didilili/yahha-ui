import { useState } from 'react';
import { Pagination, Text } from 'yahha-ui';

export default function PaginationMore() {
  const [page, setPage] = useState(24);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Pagination
        aria-label="多页码演示"
        currentPage={page}
        totalPages={80}
        onPageChange={setPage}
      />
      <Text size="sm" tone="muted" role="status">
        第 {page} / 80 页
      </Text>
    </div>
  );
}
