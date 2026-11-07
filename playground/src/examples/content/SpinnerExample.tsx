import { Spinner, Text } from 'yahha-ui';

export default function SpinnerExample() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      {(['dots', 'biscuit'] as const).map((variant) => (
        <div key={variant} style={{ display: 'grid', gap: 12 }}>
          <Text size="sm" tone="muted">
            {variant === 'dots' ? '三墨点（默认）' : '小花饼'}
          </Text>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', gap: 24 }}>
            {(
              [
                { size: 'sm', label: '小号 sm' },
                { size: 'md', label: '中号 md（默认）' },
                { size: 'lg', label: '大号 lg' },
              ] as const
            ).map(({ size, label }) => (
              <div key={size} style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
                <Spinner variant={variant} size={size} label={`${label}示例正在加载`} />
                <Text size="sm" tone="muted">
                  {label}
                </Text>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
