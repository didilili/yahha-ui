import { useEffect, useId, useState } from 'react';
import { Button, Text } from 'yahha-ui';

function AsyncAction({ withIcon = false }: { withIcon?: boolean }) {
  const statusId = useId();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [attempt, setAttempt] = useState(0);
  const loading = status === 'loading';

  useEffect(() => {
    if (!loading) return;
    // 模拟保存：带图标的例子首次失败，重试成功；实际项目按请求结果更新状态。
    const timer = window.setTimeout(() => {
      setStatus(withIcon && attempt === 1 ? 'error' : 'success');
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [loading, withIcon, attempt]);

  return (
    <div
      role="group"
      aria-label={withIcon ? '带前图标的异步加载' : '无前图标的异步加载'}
      style={{ display: 'grid', justifyItems: 'start', gap: 8 }}
    >
      <span>{withIcon ? '带前置图标 · 首次失败后重试' : '不带图标 · 保存成功'}</span>
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
            setAttempt((value) => value + 1);
            setStatus('loading');
          }}
        >
          保存草稿
        </Button>
        <Text id={statusId} size="sm" tone="muted" role="status">
          {status === 'loading'
            ? '正在保存…'
            : status === 'success'
              ? '草稿已保存'
              : status === 'error'
                ? '模拟保存失败，请再次点击“保存草稿”重试。'
                : '尚未保存'}
        </Text>
      </div>
    </div>
  );
}

export default function ButtonStates() {
  const disabledReasonId = useId();

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
          <div key={variant} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
            <span>
              {variant === 'primary' ? '主要' : variant === 'secondary' ? '次要' : '文字'} · 禁用
            </span>
            <Button variant={variant} disabled aria-describedby={disabledReasonId}>
              保存草稿
            </Button>
          </div>
        ))}
      </div>
      <Text id={disabledReasonId} size="sm" tone="muted">
        请先选择一篇手记，再保存草稿。上方为静态禁用对照。
      </Text>
      <AsyncAction />
      <AsyncAction withIcon />
    </div>
  );
}
