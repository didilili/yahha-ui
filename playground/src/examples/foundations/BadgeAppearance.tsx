import { Badge, Text } from 'yahha-ui';

export default function BadgeAppearance() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
        gap: 24,
      }}
    >
      {(['default', 'stamp'] as const).map((appearance) => (
        <div
          key={appearance}
          style={{ display: 'grid', justifyItems: 'start', gap: 12, minWidth: 0 }}
        >
          <Text size="sm" tone="muted">
            {appearance === 'default' ? '普通（默认）' : '印章'}
          </Text>
          <Badge appearance={appearance}>随笔</Badge>
          <Badge appearance={appearance} tone="accent">
            阅读中
          </Badge>
          <Badge appearance={appearance} tone="success">
            已读
          </Badge>
        </div>
      ))}
    </div>
  );
}
