import { Badge, Link, Text } from 'yahha-ui';

export default function TextComposition() {
  return (
    <div style={{ display: 'grid', gap: 28, maxWidth: '65ch' }}>
      <section aria-label="行内组合" style={{ display: 'grid', gap: 8 }}>
        <Text>
          <strong>这篇手记</strong>标记为 <Badge tone="accent">阅读中</Badge>
          。可以先读完这一段，再去
          <Link href="#/guides/reading?section=reading-example">看看完整的阅读组合</Link>。
        </Text>
      </section>
    </div>
  );
}
