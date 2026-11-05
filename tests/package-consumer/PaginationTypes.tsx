import { createRef } from 'react';
import { Pagination, type PaginationProps } from 'yahha-ui';

export interface ArchivePaginationProps extends PaginationProps {
  archiveId: string;
}

const archive: ArchivePaginationProps = {
  archiveId: 'reading',
  currentPage: 1,
  totalPages: 3,
  onPageChange() {},
};

export const legacyPagination = (
  <Pagination
    {...archive}
    ref={createRef<HTMLElement>()}
    aria-label="阅读归档分页"
    data-archive="reading"
    style={{ marginTop: 12 }}
    onKeyDown={(event) => {
      event.currentTarget.dataset.lastKey = event.key;
    }}
  />
);

export const linkedPagination = (
  <Pagination
    {...archive}
    getPageHref={(page) => `#/archive?page=${page}`}
    classNames={{ button: 'archive-control', list: 'archive-pages', ellipsis: 'archive-gap' }}
  />
);

// @ts-expect-error The callback remains required, including in link mode.
export const missingCallback: PaginationProps = {
  currentPage: 1,
  totalPages: 3,
  getPageHref: (page) => `#/archive?page=${page}`,
};

// @ts-expect-error Page URL getters return strings, not page numbers.
export const invalidHref: PaginationProps['getPageHref'] = (page) => page;

// @ts-expect-error Page URL getters receive a number.
export const invalidArgument: PaginationProps['getPageHref'] = (page: string) => page;
