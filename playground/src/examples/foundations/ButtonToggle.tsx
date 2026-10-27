import { useState } from 'react';
import { Button } from 'yahha-ui';

export default function ButtonToggle() {
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
      <Button
        variant="secondary"
        aria-pressed={saved}
        startIcon={<span>{saved ? '★' : '☆'}</span>}
        onClick={() => setSaved((value) => !value)}
      >
        收藏文章
      </Button>
      <span role="status">{saved ? '已加入收藏' : '尚未收藏'}</span>
    </div>
  );
}
