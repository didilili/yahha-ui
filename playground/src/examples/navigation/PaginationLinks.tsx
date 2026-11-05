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
