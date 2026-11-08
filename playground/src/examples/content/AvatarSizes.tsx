import { Avatar, Text } from 'yahha-ui';

export default function AvatarSizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'end', flexWrap: 'wrap', gap: 24 }}>
      {(
        [
          { size: 'sm', label: '小号 sm' },
          { size: 'md', label: '中号 md（默认）' },
          { size: 'lg', label: '大号 lg' },
        ] as const
      ).map(({ size, label }) => (
        <div key={size} style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Avatar name="库米" size={size} />
          <Text size="sm" tone="muted">
            {label}
          </Text>
        </div>
      ))}
    </div>
  );
}
