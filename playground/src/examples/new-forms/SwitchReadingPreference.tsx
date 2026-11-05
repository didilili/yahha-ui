import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Switch, Text } from 'yahha-ui';

export default function SwitchReadingPreference() {
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [message, setMessage] = useState('通知已关闭。');
  const busyRef = useRef(false);
  const committedRef = useRef(false);
  const hasFailedRef = useRef(false);
  const requestRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      requestRef.current += 1;
      busyRef.current = false;
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    },
    [],
  );

  function savePreference(next: boolean) {
    if (busyRef.current || next === committedRef.current) return;
    busyRef.current = true;
    const request = ++requestRef.current;
    const previous = committedRef.current;
    setEnabled(next);
    setBusy(true);
    setFailed(false);
    setMessage('正在本地模拟保存…');

    timerRef.current = window.setTimeout(() => {
      if (request !== requestRef.current) return;
      timerRef.current = null;
      busyRef.current = false;
      setBusy(false);
      if (!hasFailedRef.current) {
        hasFailedRef.current = true;
        setEnabled(previous);
        setFailed(true);
        setMessage('');
      } else {
        committedRef.current = next;
        setMessage(`通知已${next ? '开启' : '关闭'}；仅当前示例生效。`);
      }
    }, 700);
  }

  return (
    <div style={{ display: 'grid', gap: 16, minWidth: 0, maxWidth: 480 }}>
      <Switch
        label="启用通知"
        checked={enabled}
        loading={busy}
        onChange={(event) => savePreference(event.currentTarget.checked)}
      />
      <Text size="sm" tone="muted" role="status">
        {message}
      </Text>
      {failed && (
        <Alert tone="error" role="alert" title="模拟保存失败">
          已恢复为关闭，再次开启可重试。
        </Alert>
      )}
      <div>
        <Button
          variant="secondary"
          disabled={busy}
          onClick={() => {
            if (busyRef.current) return;
            requestRef.current += 1;
            if (timerRef.current !== null) window.clearTimeout(timerRef.current);
            timerRef.current = null;
            committedRef.current = false;
            hasFailedRef.current = false;
            setEnabled(false);
            setFailed(false);
            setMessage('示例已重置，通知已关闭。');
          }}
        >
          重置示例
        </Button>
      </div>
    </div>
  );
}
