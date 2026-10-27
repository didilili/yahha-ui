import { useRef, useState } from 'react';
import { Button, Dialog } from 'yahha-ui';

export default function DialogExternal() {
  const [open, setOpen] = useState(false);
  const returnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button ref={returnRef} variant="secondary" onClick={() => setOpen(true)}>
        从外部状态打开
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="继续整理书签？"
        description="此示例禁用点击外部关闭；Escape 和右上角的关闭按钮仍可使用。"
        finalFocus={returnRef}
        disablePointerDismissal
        footer={<Button onClick={() => setOpen(false)}>继续阅读</Button>}
      >
        <p>没有传入 trigger 时，由外部按钮设置 open，并通过 finalFocus 指定关闭后的焦点。</p>
      </Dialog>
    </>
  );
}
