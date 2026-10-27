import { Heading, Text } from 'yahha-ui';

export default function HeadingExample() {
  return (
    <div style={{ display: 'grid', gap: 32, maxWidth: '65ch' }}>
      <section style={{ display: 'grid', gap: 12 }}>
        <Heading level={2}>周末的阅读手记</Heading>
        <Text>level 同时决定标题语义与默认字号，请按文档层级选择。</Text>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Heading level={3}>在书页之间休息一下</Heading>
        <Text>同一主题下的小节用更低一级标题，节前留白大于标题与正文之间的间距。</Text>
        <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
          <Heading level={4}>摘下今天喜欢的一句话</Heading>
          <Text size="sm" tone="muted">
            标题没有默认外边距，阅读节奏由外层布局组织。
          </Text>
        </div>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Heading level={3}>把沿途遇到的小事，整理成可以慢慢读完的一篇长手记</Heading>
        <Text>长标题保留完整文字，在窄屏中自然换行，不用缩小字号或省略号隐藏内容。</Text>
      </section>
    </div>
  );
}
