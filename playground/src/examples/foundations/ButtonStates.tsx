import { useEffect, useId, useState } from 'react';
import { Button } from 'yahha-ui';

function AsyncAction({ label, withIcon = false }: { label: string; withIcon?: boolean }) {
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
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
      <Button
        variant={withIcon ? 'secondary' : 'primary'}
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
        {label}
      </Button>
      <span id={statusId} role="status">
        {loading
          ? '正在保存，请稍候…'
          : saved
            ? '草稿已保存。可以再次尝试。'
            : '点击按钮，体验加载状态。'}
      </span>
    </div>
  );
}

export default function ButtonStates() {
  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button disabled>暂不可用</Button>
        <Button variant="secondary" disabled>
          暂不可编辑
        </Button>
        <Button variant="ghost" disabled>
          暂不可撤回
        </Button>
      </div>
      <AsyncAction label="保存草稿" />
      <AsyncAction label="备份草稿" withIcon />
    </div>
  );
}
