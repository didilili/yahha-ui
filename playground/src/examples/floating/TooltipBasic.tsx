import { useState } from 'react';
import { IconButton, Text, Tooltip } from 'yahha-ui';

export default function TooltipBasic() {
  const [saved, setSaved] = useState(false);
  const label = '收藏文章';
  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 16 }}>
      <Tooltip
        content={label}
        trigger={
          <IconButton
            variant="secondary"
            aria-label={label}
            aria-pressed={saved}
            onClick={() => setSaved((value) => !value)}
          >
            <span aria-hidden="true">{saved ? '★' : '☆'}</span>
          </IconButton>
        }
      />
      <Text size="sm" tone="muted" role="status">
        {saved ? '文章已收藏' : '文章尚未收藏'}
      </Text>
    </div>
  );
}
