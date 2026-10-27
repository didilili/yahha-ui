import { Badge, Text } from 'yahha-ui';

export default function BadgeTones() {
  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 20 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 12 }}>
        <Badge tone="neutral">随笔</Badge>
        <Badge tone="accent">阅读中</Badge>
        <Badge tone="success">已读</Badge>
      </div>
      <Text>
        正文里的分类 <Badge tone="accent">生活手记</Badge> 保持行内语义，状态文字也可以单独阅读。
      </Text>
      <div style={{ display: 'grid', gap: 12, maxWidth: 220 }}>
        <Badge tone="success">本周已经整理完成、可以慢慢读的散步与阅读记录</Badge>
        <Badge tone="neutral">PersonalJournalWithAVeryLongUnbrokenCategoryName</Badge>
      </div>
    </div>
  );
}
