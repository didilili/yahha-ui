import { useState } from 'react';
import { Progress, SegmentedControl, Text } from 'yahha-ui';

export default function ProgressAppearance() {
  const [value, setValue] = useState('60');
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <SegmentedControl
        label="示例进度"
        value={value}
        onValueChange={setValue}
        options={['0', '25', '60', '100'].map((amount) => ({
          value: amount,
          label: `${amount}%`,
        }))}
      />
      <div>
        <Text size="sm" tone="muted">
          常规
        </Text>
        <Progress label="阅读进度" value={Number(value)} />
      </div>
      <div>
        <Text size="sm" tone="muted">
          纸签
        </Text>
        <Progress label="阅读进度" value={Number(value)} appearance="bookmark" />
      </div>
    </div>
  );
}
