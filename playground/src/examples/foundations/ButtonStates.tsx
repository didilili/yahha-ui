import { useEffect, useId, useState } from 'react';
import { Button, Text } from 'yahha-ui';

function AsyncAction({ withIcon = false }: { withIcon?: boolean }) {
  const statusId = useId();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading) return;
    // 演示异步完成；实际项目在请求结束后更新状态。
    const timer = window.setTimeout(() => {
      setLoading(false);
      setSaved(true);
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <div
      role="group"
      aria-label={withIcon ? '带前图标的异步加载' : '无前图标的异步加载'}
      style={{ display: 'grid', justifyItems: 'start', gap: 8 }}
    >
      <span>{withIcon ? '带前置图标' : '不带图标'}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
        <Button
          loading={loading}
          aria-describedby={statusId}
          startIcon={
            withIcon ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 3h12l3 3v15H4V3h1Z" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M8 3v6h8V3M8 21v-8h8v8" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            ) : undefined
          }
          onClick={() => {
            setSaved(false);
            setLoading(true);
          }}
        >
          保存草稿
        </Button>
        <Text id={statusId} size="sm" tone="muted" role="status">
          {loading ? '正在保存…' : saved ? '草稿已保存' : '尚未保存'}
        </Text>
      </div>
    </div>
  );
}

export default function ButtonStates() {
  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
          <div key={variant} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
            <span>
              {variant === 'primary' ? '主要' : variant === 'secondary' ? '次要' : '文字'} · 禁用
            </span>
            <Button variant={variant} disabled>
              保存草稿
            </Button>
          </div>
        ))}
      </div>
      <AsyncAction />
      <AsyncAction withIcon />
    </div>
  );
}
