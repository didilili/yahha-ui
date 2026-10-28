import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Checkbox, Text } from 'yahha-ui';

export default function AlertAction() {
  const [phase, setPhase] = useState<'idle' | 'pending' | 'error' | 'success'>('idle');
  const [subscribed, setSubscribed] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const action = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);

  useEffect(() => {
    if (phase !== 'pending') return;
    // 首次模拟失败，重试成功；实际项目应根据请求结果更新状态。
    const timer = window.setTimeout(() => setPhase(attempt === 1 ? 'error' : 'success'), 700);
    return () => window.clearTimeout(timer);
  }, [phase, attempt]);

  useEffect(() => {
    if (phase === 'pending' || !returnFocus.current) return;
    returnFocus.current = false;
    if (document.activeElement === document.body || document.activeElement === action.current) {
      action.current?.focus();
    }
  }, [phase]);

  const pending = phase === 'pending';
  const successful = phase === 'success';
  const retrying = attempt > 1 || phase === 'error';

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Alert
        tone={phase === 'error' ? 'error' : successful ? 'success' : 'info'}
        title={
          phase === 'error'
            ? '这次没有保存成功'
            : successful
              ? '订阅偏好已保存'
              : pending
                ? '正在保存订阅偏好'
                : '订阅每周阅读推荐'
        }
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <Text size="sm">
            {phase === 'error'
              ? '选择仍然保留在这里。可以重试，也可以先调整偏好。'
              : successful
                ? subscribed
                  ? '已在本页记录为接收每周阅读推荐。'
                  : '已在本页记录为不接收每周阅读推荐。'
                : '由你决定是否接收每周整理的文章与书单。'}
          </Text>
          <Checkbox
            label="接收每周阅读推荐"
            checked={subscribed}
            disabled={pending || successful}
            onChange={(event) => setSubscribed(event.target.checked)}
          />
          <div>
            <Button
              ref={action}
              variant="secondary"
              loading={pending}
              onClick={() => {
                if (successful) {
                  setPhase('idle');
                  setAttempt(0);
                } else {
                  returnFocus.current = document.activeElement === action.current;
                  setAttempt((value) => value + 1);
                  setPhase('pending');
                }
              }}
            >
              {successful ? '修改偏好' : retrying ? '重试保存' : '保存订阅偏好'}
            </Button>
          </div>
        </div>
      </Alert>
      <Text role="status" size="sm" tone="muted">
        {phase === 'error'
          ? '保存失败，选择已保留。'
          : successful
            ? '订阅偏好已更新。'
            : pending
              ? '正在保存…'
              : '尚未保存。'}
      </Text>
    </div>
  );
}
