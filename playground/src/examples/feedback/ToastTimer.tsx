import { useEffect, useRef, useState } from 'react';
import { Button, Text, Toast } from 'yahha-ui';

export default function ToastTimer() {
  const [archived, setArchived] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const archiveButton = useRef<HTMLButtonElement>(null);
  const restoreButton = useRef<HTMLButtonElement>(null);
  const message = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<'archive' | 'restore' | null>(null);

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
    if (!open || hovered || focused) return;
    const timer = window.setTimeout(() => setOpen(false), 8000);
    return () => window.clearTimeout(timer);
  }, [open, hovered, focused]);

  function archive() {
    if (document.activeElement === archiveButton.current) pendingFocus.current = 'restore';
    setArchived(true);
    setHovered(false);
    setFocused(false);
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
      <Text>{archived ? '《周末散步》已归档。' : '《周末散步》在文章列表中。'}</Text>
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
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
      >
        <Toast
          open={open}
          onClose={() => {
            if (message.current?.contains(document.activeElement)) pendingFocus.current = 'restore';
            setOpen(false);
          }}
          title="文章已归档"
          description="调用方在 8 秒后关闭提示；悬停或聚焦时暂停，离开后重新计时。"
          action={
            <Button size="sm" variant="ghost" onClick={undo}>
              撤销归档
            </Button>
          }
        />
      </div>
    </div>
  );
}
