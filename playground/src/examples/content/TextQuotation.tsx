import { Link, Text } from 'yahha-ui';

const source = '#/guides/reading?section=reading-example';

export default function TextQuotation() {
  return (
    <div style={{ display: 'grid', gap: 24, minWidth: 0, maxWidth: '65ch' }}>
      <figure style={{ display: 'grid', gap: 12, margin: 0, minWidth: 0 }}>
        <blockquote
          cite={source}
          style={{
            margin: 0,
            paddingInlineStart: 20,
            borderInlineStart: '1px solid var(--yahha-paper-line, #c9deec)',
          }}
        >
          <Text>
            回家才发现，今天没有走多远。不过<em>等到了朋友</em>，也记下了饼干掉进衣领的事，
            <mark style={{ color: 'inherit', background: 'var(--yahha-accent-soft, #fff0f6)' }}>
              已经够写一页
            </mark>
            。
          </Text>
        </blockquote>
        <figcaption>
          <Text size="sm" tone="muted">
            出自 Yahha UI 原创示例手记《
            <cite>
              <Link href={source}>沿着河边，慢慢走</Link>
            </cite>
            》
          </Text>
        </figcaption>
      </figure>
      <Text size="sm" tone="muted">
        <strong>读后批注：</strong>等朋友的那一会儿，也成了这次散步的一部分。
      </Text>
    </div>
  );
}
