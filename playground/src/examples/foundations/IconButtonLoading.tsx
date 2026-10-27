import { useEffect, useState } from 'react';
import { IconButton } from 'yahha-ui';

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
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <IconButton
        aria-label="收藏文章"
        aria-pressed={saved}
        loading={loading}
        onClick={() => setLoading(true)}
      >
        <span aria-hidden="true">{saved ? '★' : '☆'}</span>
      </IconButton>
      <span role="status">{loading ? '正在更新收藏…' : saved ? '已收藏' : '尚未收藏'}</span>
    </div>
  );
}
