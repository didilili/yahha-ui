import { useId, useRef, useState } from 'react';
import { Avatar, Button, Dialog, Text } from 'yahha-ui';

export default function AvatarAuthor() {
  const [open, setOpen] = useState(false);
  const authorNameId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 480 }}>
      <div
        role="group"
        aria-labelledby={authorNameId}
        style={{ display: 'grid', gap: 12, minWidth: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
          <Avatar name="把散步写成手记的作者库米" fallback="米" aria-hidden="true" />
          <div style={{ minWidth: 0 }}>
            <Text id={authorNameId}>把散步写成手记的作者库米</Text>
            <Text size="sm" tone="muted">
              手记作者
            </Text>
          </div>
        </div>
        <div>
          <Button
            ref={triggerRef}
            variant="ghost"
            aria-haspopup="dialog"
            onClick={() => setOpen(true)}
          >
            查看作者介绍
          </Button>
        </div>
      </div>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="关于库米"
        description="散步、阅读与日常手记。"
        initialFocus={closeRef}
        finalFocus={triggerRef}
        footer={
          <Button ref={closeRef} variant="secondary" onClick={() => setOpen(false)}>
            关闭介绍
          </Button>
        }
      >
        <Text>
          你好，我是库米。我喜欢沿河散步，也喜欢把读到的句子抄进手记。回家以后，再给一路遇见的小事留一页。
        </Text>
      </Dialog>
    </div>
  );
}
