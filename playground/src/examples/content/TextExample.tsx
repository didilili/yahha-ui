import { Badge, Link, Text } from 'yahha-ui';

export default function TextExample() {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: '65ch' }}>
      <Text size="lg">记录一点小事，慢慢读也很好。</Text>
      <Text>今天沿着河边走了一会儿，把喜欢的风景留在这里。</Text>
      <Text size="sm" tone="muted">
        发布于周末 · 阅读约 3 分钟
      </Text>
      <Text>
        这篇手记标记为 <Badge tone="accent">阅读中</Badge>。可以先读完这一段，再去
        <Link href="#/guides/styling?section=reading">看看完整的阅读组合</Link>。
      </Text>
      <Text>
        中英文可以在同一段里自然换行；例如 PersonalJournalWithAVeryLongUnbrokenTitle，
        也不会因为一个长词撑开窄栏。
      </Text>
    </div>
  );
}
