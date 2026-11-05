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
            回家才发现，口袋里的散步路线画得很认真，<em>面包店却根本不在上面</em>。下次得补上，
            <mark style={{ color: 'inherit', background: 'var(--yahha-accent-soft, #fff0f6)' }}>
              不然小八又要负责带路
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
        <strong>读后批注：</strong>原来最管用的路线图，是小八的鼻子。
      </Text>
    </div>
  );
}
