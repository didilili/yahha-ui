import { Heading, Text } from 'yahha-ui';

export default function HeadingArticle() {
  return (
    <div style={{ display: 'grid', gap: 32, maxWidth: '65ch' }}>
      <section style={{ display: 'grid', gap: 12 }}>
        <Text size="sm" tone="muted">
          章节 h2
        </Text>
        <Heading level={2}>周末的阅读手记</Heading>
        <Text>周末的午后，我翻开上次读到一半的书。窗外有风，杯里的茶还温热。</Text>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Text size="sm" tone="muted">
          小节 h3
        </Text>
        <Heading level={3}>在书页之间休息一下</Heading>
        <Text>读过一章，就走到窗边看看树影。喜欢的句子，用一张纸签记下来。</Text>
        <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
          <Text size="sm" tone="muted">
            小节内标题 h4
          </Text>
          <Heading level={4}>摘下今天喜欢的一句话</Heading>
          <Text size="sm" tone="muted">
            今天也有值得慢慢记住的小事。
          </Text>
        </div>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Text size="sm" tone="muted">
          长标题 h3
        </Text>
        <Heading level={3}>把沿途遇到的小事，整理成可以慢慢读完的一篇长手记</Heading>
        <Text>从河边捡到的一片叶子，到晚饭前看见的一朵云，都放进这篇手记里。</Text>
      </section>
    </div>
  );
}
