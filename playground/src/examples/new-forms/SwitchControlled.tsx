import { useState } from 'react';
import { Switch, Text } from 'yahha-ui';

export default function SwitchControlled() {
  const [enabled, setEnabled] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Switch
        label="启用通知"
        checked={enabled}
        onChange={(event) => setEnabled(event.currentTarget.checked)}
      />
      <Text size="sm" tone="muted">
        {enabled ? '已开启' : '已关闭'}
      </Text>
    </div>
  );
}
