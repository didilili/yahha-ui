import { EmptyState, Text } from 'yahha-ui';

export default function EmptyAppearance() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
        gap: 24,
      }}
    >
      <div>
        <Text size="sm" tone="muted">
          普通（默认）
        </Text>
        <EmptyState title="还没有手记" description="写下今天想记住的一件小事。" />
      </div>
      <div>
        <Text size="sm" tone="muted">
          小纸页
        </Text>
        <EmptyState motif="paper" title="还没有手记" description="写下今天想记住的一件小事。" />
      </div>
    </div>
  );
}
