import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Alert, Button, Dialog, Text, TextField } from 'yahha-ui';

export default function DialogForm() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState('');
  const [draft, setDraft] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const focusFrame = useRef<number | null>(null);
  const closeAttempt = useRef(0);
  const formId = useId();

  useEffect(
    () => () => {
      closeAttempt.current += 1;
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    },
    [],
  );

  function cancelPendingFocus() {
    closeAttempt.current += 1;
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = null;
  }

  function changeOpen(nextOpen: boolean) {
    cancelPendingFocus();
    if (nextOpen) {
      setDraft(saved);
      setConfirming(false);
      setError('');
      setOpen(true);
      return;
    }
    if (draft !== saved) {
      setConfirming(true);
      const attempt = closeAttempt.current;
      focusFrame.current = requestAnimationFrame(() => {
        focusFrame.current = null;
        if (attempt !== closeAttempt.current) return;
        const popup = popupRef.current;
        if (popup && !popup.contains(document.activeElement)) continueRef.current?.focus();
      });
      return;
    }
    setError('');
    setOpen(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = String(new FormData(event.currentTarget).get('title') ?? '').trim();
    if (!title) {
      setError('请输入站点标题，不能只填写空格。');
      inputRef.current?.focus();
      return;
    }
    cancelPendingFocus();
    setSaved(title);
    setDraft(title);
    setError('');
    setConfirming(false);
    setOpen(false);
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Dialog
        ref={popupRef}
        open={open}
        onOpenChange={changeOpen}
        trigger={<Button>修改站点标题</Button>}
        title="站点标题"
        description="为这间阅读室取一个喜欢的名字。"
        initialFocus={inputRef}
        footer={
          <>
            <Button variant="secondary" onClick={() => changeOpen(false)}>
              取消
            </Button>
            <Button type="submit" form={formId}>
              保存标题
            </Button>
          </>
        }
      >
        <form id={formId} onSubmit={handleSubmit}>
          <TextField
            ref={inputRef}
            label="站点标题"
            name="title"
            value={draft}
            placeholder="例如：小小阅读室"
            required
            maxLength={30}
            hint="请输入 1–30 个字符。"
            error={error}
            onChange={(event) => {
              const next = event.target.value;
              setDraft(next);
              setError('');
              if (next === saved) {
                cancelPendingFocus();
                setConfirming(false);
              }
            }}
          />
        </form>
        {confirming && (
          <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
            <Alert role="alert" tone="warning" title="还有未保存的修改">
              你可以继续编辑或保存，也可以放弃这次修改并关闭。
            </Alert>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <Button
                ref={continueRef}
                variant="secondary"
                onClick={() => {
                  cancelPendingFocus();
                  setConfirming(false);
                  inputRef.current?.focus();
                }}
              >
                继续编辑
              </Button>
              <Button
                destructive
                onClick={() => {
                  cancelPendingFocus();
                  setDraft(saved);
                  setConfirming(false);
                  setError('');
                  setOpen(false);
                }}
              >
                放弃修改并关闭
              </Button>
            </div>
          </div>
        )}
      </Dialog>
      <Text size="sm" tone="muted" role="status">
        {saved ? `当前标题：${saved}` : '尚未保存标题。'}
      </Text>
    </div>
  );
}
