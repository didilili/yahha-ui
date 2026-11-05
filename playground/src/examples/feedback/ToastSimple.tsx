import { useRef, useState } from 'react';
import { Button, Toast } from 'yahha-ui';

export default function ToastSimple() {
  const [open, setOpen] = useState(true);
  const message = useRef<HTMLDivElement>(null);
  const show = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 480 }}>
      <div ref={message}>
        <Toast
          open={open}
          title="这是一条提示。"
          onClose={() => {
            if (message.current?.contains(document.activeElement)) show.current?.focus();
            setOpen(false);
          }}
        />
      </div>
      <div>
        <Button ref={show} variant="secondary" onClick={() => setOpen(true)}>
          显示提示
        </Button>
      </div>
    </div>
  );
}
