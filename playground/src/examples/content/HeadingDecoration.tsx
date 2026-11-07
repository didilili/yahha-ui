import { Heading, Text } from 'yahha-ui';

export default function HeadingDecoration() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
        gap: 24,
      }}
    >
      {(['none', 'underline'] as const).map((decoration) => (
        <section
          key={decoration}
          style={{ display: 'grid', alignContent: 'start', gap: 16, minWidth: 0 }}
        >
          <Text size="sm" tone="muted">
            {decoration === 'none' ? '普通（默认）' : '短墨线'}
          </Text>
          <Heading level={2} decoration={decoration}>
            星球上的点心时间
          </Heading>
          <Heading level={3} decoration={decoration}>
            星球上的点心时间
          </Heading>
          <Text>标题层级决定语义与字号；短墨线只为开启装饰的标题预留底部空间。</Text>
        </section>
      ))}
    </div>
  );
}
