import { useEffect, useRef, useState } from 'react';
import { Button, Progress, Text, Toast } from 'yahha-ui';

const undoDuration = 8000;

export default function ToastTimer() {
  const [archived, setArchived] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(() => document.hidden);
  const [elapsed, setElapsed] = useState(0);
  const remaining = useRef(undoDuration);
  const archiveButton = useRef<HTMLButtonElement>(null);
  const restoreButton = useRef<HTMLButtonElement>(null);
  const message = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<'archive' | 'restore' | null>(null);

  useEffect(() => {
    const updateVisibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    const destination = pendingFocus.current;
    if (!destination) return;
    pendingFocus.current = null;
    const active = document.activeElement;
    const unavailableAction =
      (active === archiveButton.current && archiveButton.current?.disabled) ||
      (active === restoreButton.current && restoreButton.current?.disabled);
    if (active === document.body || unavailableAction) {
      (destination === 'archive' ? archiveButton : restoreButton).current?.focus();
    }
  }, [archived, open]);

  useEffect(() => {
    if (!open || hovered || focused || hidden) return;
    const started = performance.now();
    const previousRemaining = remaining.current;
    const updateElapsed = () => {
      setElapsed(undoDuration - Math.max(0, previousRemaining - (performance.now() - started)));
    };
    const timer = window.setTimeout(() => setOpen(false), previousRemaining);
    const display = window.setInterval(updateElapsed, 100);
    return () => {
      remaining.current = Math.max(0, previousRemaining - (performance.now() - started));
      setElapsed(undoDuration - remaining.current);
      window.clearTimeout(timer);
      window.clearInterval(display);
    };
  }, [open, hovered, focused, hidden]);

  function archive() {
    if (document.activeElement === archiveButton.current) pendingFocus.current = 'restore';
    setArchived(true);
    setHovered(false);
    setFocused(false);
    remaining.current = undoDuration;
    setElapsed(0);
    setOpen(true);
  }

  function undo() {
    if (
      message.current?.contains(document.activeElement) ||
      document.activeElement === restoreButton.current
    ) {
      pendingFocus.current = 'archive';
    }
    setArchived(false);
    setOpen(false);
  }

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Text size="sm" tone="muted">
        {archived ? '《周末散步》已归档。' : '《周末散步》在文章列表中。'}
      </Text>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button ref={archiveButton} onClick={archive} disabled={archived}>
          归档文章
        </Button>
        <Button ref={restoreButton} variant="secondary" onClick={undo} disabled={!archived}>
          恢复文章
        </Button>
      </div>
      <div
        ref={message}
        style={{ display: 'grid', gap: 12, maxWidth: 400 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
      >
        <Toast
          appearance="receipt"
          open={open}
          onClose={() => {
            if (message.current?.contains(document.activeElement)) pendingFocus.current = 'restore';
            setOpen(false);
          }}
          title="文章已归档"
          description="《周末散步》已移入归档，可以随时恢复。"
          action={
            <Button size="sm" variant="ghost" onClick={undo}>
              撤销归档
            </Button>
          }
        />
        {open && (
          <Progress
            label="提示显示时间"
            value={elapsed}
            max={undoDuration}
            valueText={`剩余 ${Math.ceil((undoDuration - elapsed) / 1000)} 秒${hovered || focused || hidden ? '（已暂停）' : ''}`}
          />
        )}
      </div>
    </div>
  );
}
