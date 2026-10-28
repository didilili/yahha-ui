import { useState } from 'react';
import { Button, Text } from 'yahha-ui';

export default function ButtonToggle() {
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
      <Button
        variant="secondary"
        aria-pressed={saved}
        startIcon={
          <svg
            viewBox="0 0 24 24"
            fill={saved ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        onClick={() => setSaved((value) => !value)}
      >
        收藏文章
      </Button>
      <Text size="sm" tone="muted" role="status">
        {saved ? '已加入收藏' : '尚未收藏'}
      </Text>
    </div>
  );
}
