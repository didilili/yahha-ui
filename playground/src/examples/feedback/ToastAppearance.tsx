import { useRef, useState } from 'react';
import { Button, Text, Toast } from 'yahha-ui';

function AppearanceSample({ appearance }: { appearance: 'default' | 'receipt' }) {
  const [open, setOpen] = useState(true);
  const [saved, setSaved] = useState(true);
  const restore = useRef<HTMLButtonElement>(null);
  const message = useRef<HTMLDivElement>(null);

  function dismiss() {
    if (message.current?.contains(document.activeElement)) restore.current?.focus();
    setOpen(false);
  }

  return (
    <div style={{ display: 'grid', gap: 12, alignContent: 'start', minWidth: 0 }}>
      <Text size="sm" tone="muted">
        {appearance === 'default' ? '普通（默认）' : '回执'}
      </Text>
      <div ref={message}>
        <Toast
          appearance={appearance}
          open={open}
          title="手记已收藏"
          description="《周末散步》已经加入收藏夹。"
          onClose={dismiss}
          action={
            <Button
              variant="ghost"
              onClick={() => {
                setSaved(false);
                dismiss();
              }}
            >
              撤销收藏
            </Button>
          }
        />
      </div>
      {!saved && <Text size="sm">已撤销本地示例收藏。</Text>}
      <div>
        <Button
          ref={restore}
          variant="secondary"
          onClick={() => {
            setSaved(true);
            setOpen(true);
          }}
        >
          重新显示提示
        </Button>
      </div>
    </div>
  );
}

export default function ToastAppearance() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: 24,
      }}
    >
      <AppearanceSample appearance="default" />
      <AppearanceSample appearance="receipt" />
    </div>
  );
}
