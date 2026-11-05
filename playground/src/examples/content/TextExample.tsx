import { Text } from 'yahha-ui';

export default function TextExample() {
  return (
    <div style={{ display: 'grid', gap: 28, maxWidth: '65ch' }}>
      <section aria-label="字号对照" style={{ display: 'grid', gap: 16 }}>
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
    </div>
  );
}
