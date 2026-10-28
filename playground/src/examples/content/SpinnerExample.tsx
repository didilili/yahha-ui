import { Spinner, Text } from 'yahha-ui';

export default function SpinnerExample() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', gap: 24 }}>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Spinner size="sm" label="小号示例正在加载" />
          <Text size="sm" tone="muted">
            小号 sm
          </Text>
        </div>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Spinner label="中号示例正在加载" />
          <Text size="sm" tone="muted">
            中号 md（默认）
          </Text>
        </div>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Spinner size="lg" label="大号示例正在加载" />
          <Text size="sm" tone="muted">
            大号 lg
          </Text>
        </div>
      </div>
    </div>
  );
}
