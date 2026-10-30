import { Badge, Link, Text } from 'yahha-ui';

export default function TextComposition() {
  return (
    <div style={{ display: 'grid', gap: 28, maxWidth: '65ch' }}>
      <section aria-label="行内组合" style={{ display: 'grid', gap: 8 }}>
        <Text size="sm" tone="muted">
          行内组合
        </Text>
        <Text>
          这篇手记标记为 <Badge tone="accent">阅读中</Badge>。可以先读完这一段，再去
          <Link href="#/guides/styling?section=reading">看看完整的阅读组合</Link>。
        </Text>
      </section>
      <section aria-label="长词换行" style={{ display: 'grid', gap: 8, maxWidth: '32ch' }}>
        <Text size="sm" tone="muted">
          窄栏换行
        </Text>
        <Text>
          我把这次散步的记录存成 PersonalJournalWithAVeryLongUnbrokenTitle，
          留给下个周末，和没赶上散步的朋友一起看。
        </Text>
      </section>
    </div>
  );
}
