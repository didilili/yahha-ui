import { useId, useRef, useState } from 'react';
import { Button, Dialog, EmptyState, Heading, Text } from 'yahha-ui';

export default function ButtonDeleteDraft() {
  const [hasDraft, setHasDraft] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const draftTitleId = useId();
  const actionRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 520 }}>
      {hasDraft ? (
        <section aria-labelledby={draftTitleId} style={{ display: 'grid', gap: 8 }}>
          <Heading level={3} id={draftTitleId}>
            周末散步记录
          </Heading>
          <Text>沿河走了一小段，记下树影和路边新开的花。</Text>
        </section>
      ) : (
        <EmptyState title="草稿已删除" description="这份散步记录仍可通过下方按钮恢复。" />
      )}
      <div>
        <Button
          ref={actionRef}
          variant="secondary"
          destructive={hasDraft}
          onClick={() => {
            if (hasDraft) {
              setOpen(true);
              return;
            }
            setHasDraft(true);
            setMessage('草稿已恢复。');
          }}
        >
          {hasDraft ? '删除草稿' : '恢复草稿'}
        </Button>
      </div>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="删除这份草稿？"
        description="将移除当前演示中的「周末散步记录」，删除后仍可恢复。"
        initialFocus={cancelRef}
        finalFocus={actionRef}
        footer={
          <>
            <Button ref={cancelRef} variant="secondary" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button
              destructive
              onClick={() => {
                setHasDraft(false);
                setOpen(false);
                setMessage('草稿已删除，可通过“恢复草稿”按钮恢复。');
              }}
            >
              确认删除
            </Button>
          </>
        }
      />
      <Text size="sm" tone="muted" role="status">
        {message}
      </Text>
    </div>
  );
}
