import { useId, useState } from 'react';
import { SegmentedControl, Text } from 'yahha-ui';

type Visibility = 'public' | 'private' | 'unlisted';

export default function SegmentedDisabled() {
  const descriptionId = useId();
  const [visibility, setVisibility] = useState<Visibility>('public');

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
      <Text id={descriptionId} size="sm" tone="muted">
        暂未开放“仅持链接者可见”。
      </Text>
      <SegmentedControl
        label="文章可见性"
        aria-describedby={descriptionId}
        value={visibility}
        onValueChange={setVisibility}
        options={[
          { value: 'public', label: '公开' },
          { value: 'private', label: '仅自己' },
          { value: 'unlisted', label: '仅持链接者', disabled: true },
        ]}
      />
    </div>
  );
}
