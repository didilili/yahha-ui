import { useRef, useState } from 'react';
import { Button, Dialog } from 'yahha-ui';

export default function DialogExternal() {
  const [open, setOpen] = useState(false);
  const returnRef = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 16 }}>
      <Button ref={returnRef} variant="secondary" onClick={() => setOpen(true)}>
        查看阅读提醒
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="阅读提醒"
        description="给长文章留一段从容的阅读时间。"
        finalFocus={returnRef}
        disablePointerDismissal
        footer={<Button onClick={() => setOpen(false)}>返回阅读</Button>}
      >
        <p>长文章可以分几次读完。先找一个舒服的位置，按照自己的节奏慢慢读。</p>
      </Dialog>
    </div>
  );
}
