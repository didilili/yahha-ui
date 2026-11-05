import { Text } from 'yahha-ui';

export default function TextTones() {
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: '65ch' }}>
      {(['default', 'muted'] as const).map((tone) => (
        <div key={tone} style={{ display: 'grid', gap: 4 }}>
          <Text size="sm" tone="muted">
            {tone === 'default' ? '主要文字' : '次要文字'}
          </Text>
          <Text tone={tone}>河边散步走了一半，小八先闻到了面包香。</Text>
        </div>
      ))}
    </div>
  );
}
