import { useState } from 'react';
import { Pagination, Text } from 'yahha-ui';

export default function PaginationAppearance() {
  const [page, setPage] = useState(2);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: 24,
      }}
    >
      {(['default', 'circled'] as const).map((appearance) => (
        <div
          key={appearance}
          style={{ display: 'grid', alignContent: 'start', gap: 12, minWidth: 0 }}
        >
          <Text size="sm" tone="muted">
            {appearance === 'default' ? '普通（默认）' : '圈选'}
          </Text>
          <Pagination
            appearance={appearance}
            aria-label={appearance === 'default' ? '普通分页' : '圈选分页'}
            currentPage={page}
            totalPages={3}
            onPageChange={setPage}
          />
          <Text size="sm">当前第 {page} 页，共 3 页。</Text>
        </div>
      ))}
    </div>
  );
}
