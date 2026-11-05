import { Text } from 'yahha-ui';

export default function TextTones() {
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: '65ch' }}>
      {(['default', 'muted'] as const).map((tone) => (
        <div key={tone} style={{ display: 'grid', gap: 4 }}>
          <Text size="sm" tone="muted">
            {tone === 'default' ? '主要文字' : '次要文字'}
          </Text>
          <Text tone={tone}>今天沿着河边散步，走到桥边时，停下来等了等还在系鞋带的朋友。</Text>
        </div>
      ))}
    </div>
  );
}
