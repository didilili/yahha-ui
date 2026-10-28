import { Badge, Text } from 'yahha-ui';

export default function BadgeTones() {
  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 20 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'start', gap: 20 }}>
        {(
          [
            { tone: 'neutral', label: '随笔' },
            { tone: 'accent', label: '阅读中' },
            { tone: 'success', label: '已读' },
          ] as const
        ).map(({ tone, label }) => (
          <div key={tone} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
            <Text size="sm" tone="muted">
              {tone === 'neutral' ? '普通' : tone === 'accent' ? '强调' : '成功'}
              {tone === 'neutral' ? '（默认）' : ''}
            </Text>
            <Badge tone={tone}>{label}</Badge>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <Text size="sm" tone="muted">
          行内组合
        </Text>
        <Text>
          这篇 <Badge tone="accent">生活手记</Badge> 记录了一次午后散步。
        </Text>
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 12, maxWidth: 220 }}>
        <Text size="sm" tone="muted">
          长标签换行
        </Text>
        <Badge tone="success">本周已经整理完成、可以慢慢读的散步与阅读记录</Badge>
        <Badge tone="neutral">PersonalJournalWithAVeryLongUnbrokenCategoryName</Badge>
      </div>
    </div>
  );
}
