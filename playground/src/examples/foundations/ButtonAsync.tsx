import { useEffect, useId, useState } from 'react';
import { Button, Text } from 'yahha-ui';

export default function ButtonAsync() {
  const statusId = useId();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [attempt, setAttempt] = useState(0);
  const loading = status === 'loading';

  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setStatus(attempt === 1 ? 'error' : 'success'), 700);
    return () => window.clearTimeout(timer);
  }, [loading, attempt]);

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 12 }}>
      <Button
        loading={loading}
        aria-describedby={statusId}
        startIcon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 3h12l3 3v15H4V3h1Z" strokeLinejoin="round" />
            <path d="M8 3v6h8V3M8 21v-8h8v8" strokeLinejoin="round" />
          </svg>
        }
        onClick={() => {
          setAttempt((value) => value + 1);
          setStatus('loading');
        }}
      >
        保存草稿
      </Button>
      <Text id={statusId} size="sm" tone="muted" role="status">
        {loading
          ? '正在保存…'
          : status === 'error'
            ? '模拟保存失败，请重试。'
            : status === 'success'
              ? '草稿已保存'
              : '尚未保存'}
      </Text>
    </div>
  );
}
