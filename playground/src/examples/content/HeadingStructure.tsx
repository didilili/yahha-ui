import { Heading, Text } from 'yahha-ui';

export default function HeadingStructure() {
  return (
    <article style={{ display: 'grid', gap: 24, maxWidth: '65ch' }}>
      <section style={{ display: 'grid', gap: 12 }}>
        <Heading level={2}>云朵邮局的第一封来信</Heading>
        <Text>朋友寄来的合照里，乌萨奇的耳朵挡住了半张脸。</Text>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Heading level={3}>给远方的朋友写封回信</Heading>
        <Text>吉伊把耳朵画短了一点，乌萨奇又替自己添上一副墨镜。</Text>
        <Heading level={4}>这回总能看清脸了</Heading>
        <Text>小八读到“下次再拍一张”，乌萨奇已经摆好了姿势。</Text>
      </section>
      <section style={{ display: 'grid', gap: 12 }}>
        <Heading level={3}>
          把云朵邮局里借来的铅笔、画歪的墨镜和贴到手背上的邮票，写进今天的长手记
        </Heading>
        <Text>信封封好以后，才发现邮票还贴在乌萨奇手背上。</Text>
      </section>
    </article>
  );
}
