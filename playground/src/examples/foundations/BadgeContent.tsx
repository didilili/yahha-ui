import { Badge, Text } from 'yahha-ui';

export default function BadgeContent() {
  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 24 }}>
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
          长文本换行
        </Text>
        <Badge tone="success">本周已经整理完成、可以慢慢读的散步与阅读记录</Badge>
        <Badge tone="neutral">PersonalJournalWithAVeryLongUnbrokenCategoryName</Badge>
      </div>
    </div>
  );
}
