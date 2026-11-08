import { useRef, useState } from 'react';
import { Button, Link, Toast } from 'yahha-ui';

export default function ToastAction() {
  const [open, setOpen] = useState(true);
  const message = useRef<HTMLDivElement>(null);
  const show = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 480 }}>
      <div ref={message}>
        <Toast
          open={open}
          title="手记已收藏"
          description="《周末散步》已经加入收藏夹。"
          action={<Link href="#/guides/reading">继续阅读</Link>}
          onClose={() => {
            if (message.current?.contains(document.activeElement)) show.current?.focus();
            setOpen(false);
          }}
        />
      </div>
      <div>
        <Button ref={show} variant="secondary" onClick={() => setOpen(true)}>
          重新显示提示
        </Button>
      </div>
    </div>
  );
}
