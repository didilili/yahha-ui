import { useEffect, useRef } from 'react';
import {
  Button,
  Checkbox,
  EmptyState,
  Heading,
  Pagination,
  SegmentedControl,
  Select,
  Text,
  TextField,
} from 'yahha-ui';
import { Search } from 'lucide-react';
import { artwork } from '../assets';
import PostPreview from '../components/PostPreview';
import { categoryLabels, posts } from '../data/posts';
import { archiveHref, navigate, navigation, type ArchiveRoute } from '../router';
import './pages.css';

interface ArchivePageProps {
  route: ArchiveRoute;
  savedIds: ReadonlySet<string>;
  onToggleSave: (id: string, button: HTMLButtonElement) => void;
}

const pageSize = 4;
const categories = [
  { value: 'all', label: '全部' },
  { value: 'daily', label: '日常' },
  { value: 'reading', label: '读书' },
  { value: 'walk', label: '散步' },
] as const;

export default function ArchivePage({ route, savedIds, onToggleSave }: ArchivePageProps) {
  const search = useRef<HTMLInputElement>(null);
  const keyword = route.query.trim().toLocaleLowerCase();
  const filtered = posts
    .filter(
      (post) =>
        (route.category === 'all' || post.category === route.category) &&
        (!route.savedOnly || savedIds.has(post.id)) &&
        `${post.title} ${post.excerpt} ${post.tags.join(' ')}`
          .toLocaleLowerCase()
          .includes(keyword),
    )
    .sort((first, second) => {
      const order = first.publishedAt.localeCompare(second.publishedAt);
      return route.sort === 'oldest' ? order : -order;
    });
  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentPage = Math.max(1, Math.min(route.page, totalPages || 1));
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const returnTo = archiveHref({ ...route, page: currentPage });
  const hasFilters = route.query !== '' || route.category !== 'all' || route.savedOnly;
  const emptyCollection = route.savedOnly && !keyword && route.category === 'all';
  const resultsLabel = route.savedOnly
    ? '收藏的手记'
    : route.category === 'all'
      ? '全部手记'
      : categoryLabels[route.category];

  useEffect(() => {
    if (route.page === currentPage) return;
    navigate(archiveHref({ ...route, page: currentPage }), {
      replace: true,
      focus:
        navigation.kind === 'pop' || navigation.restoreReadingPosition ? 'results' : 'preserve',
      scroll: 'preserve',
      preserveNotice: true,
    });
  }, [currentPage, route]);

  function updateFilters(values: Partial<ArchiveRoute>, replace = false) {
    navigate(archiveHref({ ...route, ...values, page: 1 }), {
      replace,
      focus: 'preserve',
      scroll: 'preserve',
    });
  }

  function resetFilters() {
    updateFilters({ query: '', category: 'all', savedOnly: false, sort: 'newest' });
    search.current?.focus();
  }

  return (
    <div className="blog-reading-page blog-archive-page">
      <header className="blog-archive-intro">
        <div className="blog-page-intro-copy">
          <Text size="sm" tone="muted">
            和朋友们，一起翻翻从前
          </Text>
          <Heading level={1} id="page-heading" tabIndex={-1}>
            手记归档
          </Heading>
          <Text tone="muted">留给朋友的热汤、一起读过的书，都好好记在这里。</Text>
        </div>
        <img className="blog-archive-peek" src={artwork.peek} alt="" width={180} height={120} />
      </header>

      <section className="blog-archive-filters" aria-label="筛选手记">
        <div className="blog-archive-search-row">
          <TextField
            ref={search}
            id="archive-search"
            type="search"
            label="搜索手记"
            placeholder="找一件小事、一本书……"
            value={route.query}
            leading={<Search />}
            onChange={(event) => updateFilters({ query: event.currentTarget.value }, true)}
          />
          <Select
            id="archive-sort"
            label="排列顺序"
            value={route.sort}
            options={[
              { value: 'newest', label: '从最近开始' },
              { value: 'oldest', label: '从最早开始' },
            ]}
            onValueChange={(value) => {
              if (value === 'newest' || value === 'oldest') updateFilters({ sort: value });
            }}
          />
        </div>
        <div className="blog-archive-filter-row">
          <div className="blog-archive-category">
            <Text size="sm" id="archive-category-label">
              手记分类
            </Text>
            <SegmentedControl
              label="手记分类"
              aria-describedby="archive-category-label"
              name="archive-category"
              options={categories}
              value={route.category}
              onValueChange={(category) => updateFilters({ category })}
            />
          </div>
          <div className="blog-archive-extra-filters">
            <Checkbox
              id="archive-saved-only"
              label="只看收藏"
              checked={route.savedOnly}
              onChange={(event) => updateFilters({ savedOnly: event.currentTarget.checked })}
            />
            {hasFilters && (
              <Button variant="ghost" onClick={resetFilters}>
                清空筛选
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="blog-archive-results" aria-labelledby="archive-results-heading">
        <div className="blog-archive-results-intro">
          <Heading level={2} id="archive-results-heading" tabIndex={-1}>
            {resultsLabel}
          </Heading>
          <Text size="sm" tone="muted" role="status" aria-atomic="true">
            共 {filtered.length} 篇手记
            {filtered.length > 0 && ` · 第 ${currentPage} / ${totalPages} 页`}
          </Text>
        </div>
        {visible.length > 0 ? (
          <ul className="blog-archive-list" aria-label="本页手记">
            {visible.map((post) => (
              <li className="blog-archive-list-item" key={post.id}>
                <PostPreview
                  post={post}
                  returnTo={returnTo}
                  saved={savedIds.has(post.id)}
                  onToggleSave={onToggleSave}
                />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            className="blog-archive-empty"
            illustration={
              <img
                src={emptyCollection ? artwork.emptyCollection : artwork.searchEmpty}
                alt=""
                width={216}
                height={162}
              />
            }
            title={emptyCollection ? '还没有收藏的手记' : '未找到相关手记'}
            description={
              emptyCollection
                ? '收藏喜欢的手记后，就可以在这里找到。清空筛选，去看看所有手记吧。'
                : '试试其他关键词或分类，或清空筛选查看全部手记。'
            }
            action={
              <Button variant="secondary" onClick={resetFilters}>
                清空筛选
              </Button>
            }
          />
        )}
        {totalPages > 0 && (
          <Pagination
            className="blog-archive-pagination"
            aria-label="手记归档分页"
            currentPage={currentPage}
            totalPages={totalPages}
            getPageHref={(page) => archiveHref({ ...route, page })}
            onPageChange={(page) =>
              navigate(archiveHref({ ...route, page }), { focus: 'results', scroll: 'preserve' })
            }
          />
        )}
      </section>
    </div>
  );
}
