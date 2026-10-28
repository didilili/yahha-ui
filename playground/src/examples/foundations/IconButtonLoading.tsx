import { useEffect, useState } from 'react';
import { IconButton, Text } from 'yahha-ui';

export default function IconButtonLoading() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => {
      setLoading(false);
      setSaved((value) => !value);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <IconButton
          aria-label="收藏文章"
          aria-pressed={saved}
          loading={loading}
          onClick={() => setLoading(true)}
        >
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
        </IconButton>
        <Text size="sm" tone="muted" role="status">
          {loading ? '正在更新收藏…' : saved ? '已收藏' : '尚未收藏'}
        </Text>
      </div>
    </div>
  );
}
