import { useState } from 'react';
import { Badge, Button } from 'yahha-ui';

export default function BadgeStatus() {
  const [read, setRead] = useState(false);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
      <span role="status">
        <Badge tone={read ? 'success' : 'neutral'}>{read ? '已读' : '未读'}</Badge>
      </span>
      <Button variant="secondary" aria-pressed={read} onClick={() => setRead((value) => !value)}>
        标记为已读
      </Button>
    </div>
  );
}
