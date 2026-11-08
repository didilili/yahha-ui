import { useState } from 'react';
import { Checkbox, Text } from 'yahha-ui';

export default function CheckboxControlled() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Checkbox
        label="订阅每月阅读来信"
        checked={subscribed}
        onChange={(event) => setSubscribed(event.target.checked)}
      />
      <Text size="sm" tone="muted">
        {subscribed ? '已订阅' : '未订阅'}
      </Text>
    </div>
  );
}
