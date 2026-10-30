import { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  Badge,
  Button,
  Divider,
  EmptyState,
  Heading,
  Pagination,
  Tabs,
  Text,
  TextField,
} from 'yahha-ui';

const articles = [
  {
    id: 'river',
    category: 'daily',
    title: '沿着河边，慢慢走',
    summary: '走到桥边，等系好鞋带的朋友一起回家。',
  },
  {
    id: 'book',
    category: 'reading',
    title: '读到喜欢的一句话',
    summary: '把喜欢的那句话抄下来，夹进给朋友的信里。',
  },
  {
    id: 'morning',
    category: 'daily',
    title: '早一点醒来的周末',
    summary: '面包烤得有一点焦，大家还是分着吃完了。',
  },
  {
    id: 'rain',
    category: 'daily',
    title: '窗边听雨的小事',
    summary: '云朵邮局的窗边挤着几位朋友，等雨停，也等一封回信。',
  },
  {
    id: 'margin',
    category: 'reading',
    title: '写在书页边的小小批注',
    summary: '朋友在书边画了只歪歪的小猫，我在旁边添了一条尾巴。',
  },
  {
    id: 'flower',
    category: 'daily',
    title: '路口那一朵小花',
    summary: '小花长在路口，我们绕开一点，让它多晒一会儿太阳。',
  },
  {
    id: 'walk',
    category: 'daily',
    title: '换一条回家的路',
    summary: '绕远一点，陪怕黑的朋友走到家门口。',
  },
  {
    id: 'reread',
    category: 'reading',
    title: '再读一次喜欢的章节',
    summary: '上次没读懂的那一段，今天和朋友轮流念一遍。',
  },
  {
    id: 'tea',
    category: 'daily',
    title: '等一杯茶慢慢凉下来',
    summary: '茶还烫着。先给朋友搬把椅子，再一起吹一吹。',
  },
  {
    id: 'letter',
    category: 'daily',
    title: '给下个月的自己一张明信片',
    summary: '写下今天分到半块饼干的事，寄给下个月的自己。',
  },
  {
    id: 'bookmark',
    category: 'reading',
    title: '今天的书签停在这里',
    summary: '书签歪歪地夹着，等下次和朋友一起把故事读完。',
  },
  {
    id: 'night',
    category: 'daily',
    title: '睡前记下一件开心的小事',
    summary: '今天有人特意等了我。睡前把这件事记下来。',
  },
];

const categories = [
  { value: 'all', label: '全部手记' },
  { value: 'daily', label: '日常记录' },
  { value: 'reading', label: '读书与摘记' },
];
const pageSize = 3;

export default function BlogArchive() {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const search = useRef<HTMLInputElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const pendingPageFocus = useRef(false);
  const keyword = query.trim().toLowerCase();
  const filtered = articles.filter(
    (article) =>
      (category === 'all' || category === article.category) &&
      `${article.title} ${article.summary}`.toLowerCase().includes(keyword),
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentPage = totalPages === 0 ? 1 : Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const categoryLabel = categories.find((item) => item.value === category)!.label;

  useEffect(() => {
    if (!pendingPageFocus.current) return;
    resultHeading.current?.focus();
    pendingPageFocus.current = false;
  }, [page]);

  function reset() {
    pendingPageFocus.current = false;
    setQuery('');
    setCategory('all');
    setPage(1);
    search.current?.focus();
  }

  const panel = (
    <div style={{ display: 'grid', gap: 24 }}>
      <Heading level={3} ref={resultHeading} tabIndex={-1}>
        {categoryLabel} · {filtered.length ? `第 ${currentPage} 页` : '没有结果'}
      </Heading>
      {visible.length ? (
        <ul
          aria-label="本页手记"
          style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 24 }}
        >
          {visible.map((article) => (
            <li key={article.id}>
              <article style={{ display: 'grid', gap: 12 }}>
                <div>
                  <Badge>{article.category === 'daily' ? '日常' : '读书'}</Badge>
                </div>
                <Heading level={4}>{article.title}</Heading>
                <Text tone="muted">{article.summary}</Text>
                <Divider decorative style={{ margin: 0 }} />
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="未找到相关手记"
          description="试试其他关键词，或清空搜索、回到全部手记。"
          action={
            <Button variant="secondary" onClick={reset}>
              显示全部手记
            </Button>
          }
        />
      )}
      <Pagination
        aria-label="手记归档分页"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(next) => {
          pendingPageFocus.current = true;
          setPage(next);
        }}
      />
    </div>
  );

  return (
    <section
      aria-label="个人博客归档示例"
      style={{ display: 'grid', gap: 24, width: '100%', maxWidth: '68ch', margin: 'auto' }}
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <Heading level={2}>手记归档</Heading>
        <Text tone="muted">Yahha 星球的朋友们，把一起过的日子记在这里。</Text>
        <Text size="sm" tone="muted">
          这里有 12 篇本地示例摘要，每页显示 3 篇；不会读取或保存真实文章。
        </Text>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', gap: 12 }}>
        <div style={{ flex: '1 1 240px', minWidth: 0 }}>
          <TextField
            ref={search}
            label="搜索归档"
            type="search"
            value={query}
            placeholder="例如：河边、书签"
            onChange={(event) => {
              pendingPageFocus.current = false;
              setQuery(event.target.value);
              setPage(1);
            }}
          />
        </div>
        <Button
          variant="ghost"
          disabled={!query}
          onClick={() => {
            pendingPageFocus.current = false;
            setQuery('');
            setPage(1);
            search.current?.focus();
          }}
        >
          清空搜索
        </Button>
      </div>
      <Text role="status" aria-atomic="true" size="sm" tone="muted">
        {filtered.length
          ? `找到 ${filtered.length} 篇手记，当前第 ${currentPage} / ${totalPages} 页。`
          : '没有匹配的手记，可以清空搜索后继续浏览。'}
      </Text>
      <Tabs
        label="手记栏目"
        value={category}
        onValueChange={(next) => {
          if (!categories.some((item) => item.value === next)) return;
          pendingPageFocus.current = false;
          setCategory(next!);
          setPage(1);
        }}
        items={categories.map((item) => ({
          ...item,
          content: category === item.value ? panel : null,
        }))}
      />
      <div style={{ display: 'grid', gap: 12 }}>
        <Heading level={3}>归档使用说明</Heading>
        <Accordion
          headingLevel={4}
          items={[
            {
              value: 'paging',
              title: '切换栏目或搜索后，页码会怎样变化？',
              content: (
                <Text>
                  切换栏目和输入关键词都会回到第一页，避免停在已经不存在的页码。切页只更新当前列表，不改变文档地址。
                </Text>
              ),
            },
            {
              value: 'focus',
              title: '翻页之后，怎样继续阅读？',
              content: (
                <Text>
                  页码操作后焦点移到本页标题，方便继续阅读；输入搜索和切换标签时，焦点仍留在正在使用的控件。没有结果时，“显示全部手记”会清空搜索、回到全部栏目并聚焦搜索框。
                </Text>
              ),
            },
            {
              value: 'data',
              title: '这些文章会保存到哪里？',
              content: (
                <Text>
                  这些摘要只是一组随代码提供的演示数据。搜索、栏目和页码只保留在当前页面，刷新后恢复初始状态，不提供网络请求或跨设备同步。
                </Text>
              ),
            },
          ]}
        />
      </div>
    </section>
  );
}
