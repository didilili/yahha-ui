import { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, EmptyState, Heading, Link, Text } from 'yahha-ui';

const queryKey = 'checkbox-topic';
const topics = [
  { id: 'reading', label: '阅读' },
  { id: 'walking', label: '散步' },
  { id: 'stargazing', label: '观星' },
] as const;
type TopicId = (typeof topics)[number]['id'];

const notes: { id: string; title: string; summary: string; topics: TopicId[] }[] = [
  {
    id: 'half-a-book',
    title: '把周末留给半本书',
    summary: '读到喜欢的段落就停一停，把一句话抄进随身的小本子。',
    topics: ['reading'],
  },
  {
    id: 'riverside',
    title: '绕到河边再回家',
    summary: '比平时多走一条小路，记下水面上的晚霞和新开的花。',
    topics: ['walking'],
  },
  {
    id: 'park-book',
    title: '带一本书去公园',
    summary: '树荫下读几页，再沿着小径走走，不急着把这一天排满。',
    topics: ['reading', 'walking'],
  },
];

function readTopics(href: string): TopicId[] {
  const values = new URL(href).searchParams.getAll(queryKey);
  return topics.filter((topic) => values.includes(topic.id)).map((topic) => topic.id);
}

export default function CheckboxReadingTopics() {
  const [href, setHref] = useState(() => window.location.href);
  const firstCheckboxRef = useRef<HTMLInputElement>(null);
  const selected = readTopics(href);
  const selectedLabels = topics.filter((topic) => selected.includes(topic.id));
  const visibleNotes = notes.filter(
    (note) => selected.length === 0 || note.topics.some((topic) => selected.includes(topic)),
  );

  useEffect(() => {
    const readHref = () => setHref(window.location.href);
    readHref();
    window.addEventListener('popstate', readHref);
    window.addEventListener('hashchange', readHref);
    return () => {
      window.removeEventListener('popstate', readHref);
      window.removeEventListener('hashchange', readHref);
    };
  }, []);

  function updateTopics(next: TopicId[]) {
    const url = new URL(window.location.href);
    const current = readTopics(url.href);
    const ordered = topics.filter((topic) => next.includes(topic.id)).map((topic) => topic.id);
    const sameSelection =
      current.length === ordered.length &&
      current.every((topic, index) => topic === ordered[index]);
    const values = url.searchParams.getAll(queryKey);
    const sameQuery =
      values.length === ordered.length && values.every((topic, index) => topic === ordered[index]);
    if (sameSelection && sameQuery) {
      setHref(url.href);
      return;
    }
    url.searchParams.delete(queryKey);
    ordered.forEach((topic) => url.searchParams.append(queryKey, topic));
    if (sameSelection) window.history.replaceState(window.history.state, '', url.href);
    else window.history.pushState(window.history.state, '', url.href);
    setHref(url.href);
  }

  return (
    <section
      aria-label="阅读兴趣与分享链接"
      style={{ display: 'grid', gap: 20, minWidth: 0, maxWidth: 640, overflowWrap: 'anywhere' }}
    >
      <fieldset style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}>
        <legend style={{ marginBottom: 12 }}>阅读兴趣</legend>
        {topics.map((topic, index) => (
          <Checkbox
            key={topic.id}
            ref={index === 0 ? firstCheckboxRef : undefined}
            label={topic.label}
            hint={topic.id === 'stargazing' ? '还没有相关手记。' : undefined}
            name={queryKey}
            value={topic.id}
            checked={selected.includes(topic.id)}
            onChange={(event) => {
              const current = readTopics(window.location.href);
              updateTopics(
                event.currentTarget.checked
                  ? [...current, topic.id]
                  : current.filter((id) => id !== topic.id),
              );
            }}
          />
        ))}
      </fieldset>
      <Text size="sm" tone="muted" role="status">
        {selected.length === 0
          ? `全部手记，共 ${visibleNotes.length} 篇。`
          : `兴趣：${selectedLabels.map((topic) => topic.label).join('、')}，共 ${visibleNotes.length} 篇手记。`}
      </Text>
      {visibleNotes.length > 0 ? (
        <ul style={{ display: 'grid', gap: 24, margin: 0, paddingInlineStart: 24, minWidth: 0 }}>
          {visibleNotes.map((note) => (
            <li key={note.id} style={{ display: 'grid', gap: 8, minWidth: 0 }}>
              <Heading level={3}>{note.title}</Heading>
              <Text size="sm">{note.summary}</Text>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="还没有相关手记" description="换一个兴趣，或清空筛选查看全部手记。" />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <Button
          variant="secondary"
          onClick={() => {
            updateTopics([]);
            firstCheckboxRef.current?.focus();
          }}
        >
          清空兴趣
        </Button>
        <Link href={href}>分享当前兴趣</Link>
      </div>
    </section>
  );
}
