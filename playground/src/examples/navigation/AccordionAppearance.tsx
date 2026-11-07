import { Accordion, Text } from 'yahha-ui';

const items = [
  {
    value: 'rss',
    title: '如何订阅这个小站？',
    content: '把本站的 RSS 地址添加到阅读器，有新文章时就能看到更新。',
  },
  { value: 'comments', title: '我可以给文章留言吗？', content: '可以在文章下方分享想法。' },
];

export default function AccordionAppearance() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
        gap: 24,
      }}
    >
      {(['default', 'soft'] as const).map((appearance) => (
        <div
          key={appearance}
          style={{ display: 'grid', alignContent: 'start', gap: 12, minWidth: 0 }}
        >
          <Text size="sm" tone="muted">
            {appearance === 'default' ? '普通（默认）' : '柔和纸面'}
          </Text>
          <Accordion appearance={appearance} defaultValue={['rss']} items={items} />
        </div>
      ))}
    </div>
  );
}
