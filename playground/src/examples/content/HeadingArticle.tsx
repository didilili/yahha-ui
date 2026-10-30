import { Heading, Text } from 'yahha-ui';

export default function HeadingArticle() {
  return (
    <div style={{ display: 'grid', gap: 32, maxWidth: '65ch' }}>
      <section style={{ display: 'grid', gap: 12 }}>
        <Text size="sm" tone="muted">
          章节 h2
        </Text>
        <Heading level={2}>云朵邮局的第一封来信</Heading>
        <Text>
          Yahha
          星球的云朵邮局，今天收到一封字歪歪的来信。小八念给大家听，吉伊找来彩色铅笔，乌萨奇把邮票排成一行。
        </Text>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Text size="sm" tone="muted">
          小节 h3
        </Text>
        <Heading level={3}>给远方的朋友写封回信</Heading>
        <Text>信纸上画一张草地野餐图，给还没来过的朋友也留一个位置。邮票贴歪了，就再按一按。</Text>
        <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
          <Text size="sm" tone="muted">
            小节内标题 h4
          </Text>
          <Heading level={4}>在信里给朋友留个位置</Heading>
          <Text size="sm" tone="muted">
            “下次一起吃点心吧。”大家画了三块饼干，又添上一块。
          </Text>
        </div>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Text size="sm" tone="muted">
          长标题 h3
        </Text>
        <Heading level={3}>
          把云朵邮局里借来的铅笔、贴歪的邮票和分给朋友的半块饼干，写进今天的长手记
        </Heading>
        <Text>有些字擦了又写，信封也折得不太齐。寄出去之前，大家还是认认真真签上了名字。</Text>
      </section>
    </div>
  );
}
