import { Spinner, Text } from 'yahha-ui';

export default function SpinnerVariants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', gap: 24 }}>
      {(['dots', 'biscuit'] as const).map((variant) => (
        <div key={variant} style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Spinner variant={variant} label="示例正在加载" />
          <Text size="sm" tone="muted">
            {variant === 'dots' ? '三墨点（默认）' : '小花饼'}
          </Text>
        </div>
      ))}
    </div>
  );
}
