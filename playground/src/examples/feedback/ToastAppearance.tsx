import { useRef, useState } from 'react';
import { Button, Link, Text, Toast } from 'yahha-ui';

function AppearanceSample({ appearance }: { appearance: 'default' | 'receipt' }) {
  const [open, setOpen] = useState(true);
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
          action={<Link href="#/guides/reading">继续阅读</Link>}
        />
      </div>
      <div>
        <Button ref={restore} variant="secondary" onClick={() => setOpen(true)}>
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
