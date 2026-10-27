import { useId, useState } from 'react';
import { Button, SegmentedControl, Text } from 'yahha-ui';

type Visibility = 'public' | 'private' | 'scheduled';

export default function SegmentedDisabled() {
  const descriptionId = useId();
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [lockedVisibility, setLockedVisibility] = useState<Visibility>('public');
  const [locked, setLocked] = useState(true);

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 24 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <Text size="sm">禁用一项：暂未开放定时发布。</Text>
        <SegmentedControl
          label="文章可见性"
          value={visibility}
          onValueChange={setVisibility}
          options={[
            { value: 'public', label: '公开' },
            { value: 'private', label: '仅自己' },
            { value: 'scheduled', label: '定时发布', disabled: true },
          ]}
        />
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <Text id={descriptionId} size="sm">
          {locked ? '整组已禁用，保留当前选择。' : '整组已恢复，可以更改选择。'}
          此处由外层原生 fieldset 控制。
        </Text>
        <fieldset
          aria-label="文章设置"
          disabled={locked}
          style={{ margin: 0, padding: 0, border: 0, minWidth: 0 }}
        >
          <SegmentedControl
            label="整组文章可见性"
            aria-describedby={descriptionId}
            value={lockedVisibility}
            onValueChange={setLockedVisibility}
            options={[
              { value: 'public', label: '公开' },
              { value: 'private', label: '仅自己' },
            ]}
          />
        </fieldset>
        <Button variant="secondary" onClick={() => setLocked((current) => !current)}>
          {locked ? '解除整组禁用' : '禁用整组'}
        </Button>
      </div>
    </div>
  );
}
