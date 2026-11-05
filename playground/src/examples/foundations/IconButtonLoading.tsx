import { useEffect, useId, useState } from 'react';
import { IconButton, Text } from 'yahha-ui';

export default function IconButtonLoading() {
  const statusId = useId();
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
          aria-describedby={statusId}
          aria-pressed={saved}
          loading={loading}
          onClick={() => setLoading(true)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M8 3.25h6.2l4.05 4.1v12.7c0 .6-.5.88-1 .57L12 17.4l-5.3 3.22c-.5.31-.95.02-.95-.57V5.6C5.75 4.15 6.5 3.25 8 3.25Z"
              fill={saved ? 'currentColor' : 'none'}
              fillOpacity="0.2"
            />
            <path d="M14.2 3.5v3c0 .6.35.95.95.95h2.8" fill="none" />
          </svg>
        </IconButton>
        <Text id={statusId} size="sm" tone="muted" role="status">
          {loading ? '正在更新收藏…' : saved ? '已收藏' : '尚未收藏'}
        </Text>
      </div>
    </div>
  );
}
