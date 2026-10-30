import { Text } from 'yahha-ui';

export default function TextExample() {
  return (
    <div style={{ display: 'grid', gap: 28, maxWidth: '65ch' }}>
      <section aria-label="字号对照" style={{ display: 'grid', gap: 16 }}>
        <Text size="sm" tone="muted">
          字号
        </Text>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <div key={size} style={{ display: 'grid', gap: 4 }}>
            <Text size="sm" tone="muted">
              {size === 'sm' ? '小号' : size === 'md' ? '中号' : '大号'} {size}
              {size === 'md' ? '（默认）' : ''}
            </Text>
            <Text size={size}>饼干掰成两半，一半留给你。</Text>
          </div>
        ))}
      </section>
      <section aria-label="文字色调对照" style={{ display: 'grid', gap: 16 }}>
        <Text size="sm" tone="muted">
          文字色调
        </Text>
        {(['default', 'muted'] as const).map((tone) => (
          <div key={tone} style={{ display: 'grid', gap: 4 }}>
            <Text size="sm" tone="muted">
              {tone === 'default' ? '主要文字' : '次要文字'}
              {tone === 'default' ? '（默认）' : ''}
            </Text>
            <Text tone={tone}>今天沿着河边散步，走到桥边时，停下来等了等还在系鞋带的朋友。</Text>
          </div>
        ))}
      </section>
    </div>
  );
}
