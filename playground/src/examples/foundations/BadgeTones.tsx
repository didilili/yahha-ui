import { Badge, Text } from 'yahha-ui';

export default function BadgeTones() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'start', gap: 20 }}>
      {(
        [
          { tone: 'neutral', label: '普通（默认）' },
          { tone: 'accent', label: '强调' },
          { tone: 'success', label: '成功' },
        ] as const
      ).map(({ tone, label }) => (
        <div key={tone} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <Text size="sm" tone="muted">
            {label}
          </Text>
          <Badge tone={tone}>已读</Badge>
        </div>
      ))}
    </div>
  );
}
