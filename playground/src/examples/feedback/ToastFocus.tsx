import { useRef, useState } from 'react';
import { Button, Heading, Text, Toast } from 'yahha-ui';

export default function ToastFocus() {
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const message = useRef<HTMLDivElement>(null);
  const destination = useRef<HTMLHeadingElement>(null);

  function viewNote() {
    setOpen(false);
    destination.current?.focus();
    destination.current?.scrollIntoView({ block: 'nearest' });
  }

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 480 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button
          ref={trigger}
          onClick={() => {
            setSaved(true);
            setOpen(true);
          }}
        >
          {saved ? '再次显示提示' : '收藏手记'}
        </Button>
        <Button variant="secondary" onClick={viewNote}>
          查看手记
        </Button>
      </div>
      <div ref={message}>
        <Toast
          open={open}
          title="手记已收藏"
          description="《周末散步》已留在收藏中。"
          onClose={() => {
            if (message.current?.contains(document.activeElement)) trigger.current?.focus();
            setOpen(false);
          }}
          action={
            <Button variant="ghost" onClick={viewNote}>
              查看手记
            </Button>
          }
        />
      </div>
      <article style={{ display: 'grid', gap: 8 }}>
        <Heading ref={destination} level={3} tabIndex={-1}>
          周末散步
        </Heading>
        <Text size="sm" tone="muted">
          {saved ? '已收藏。' : '尚未收藏。'}吉伊收起路线图，小八还在数口袋里的面包屑。
        </Text>
      </article>
    </div>
  );
}
