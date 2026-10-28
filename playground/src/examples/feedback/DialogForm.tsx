import { useId, useRef, useState, type FormEvent } from 'react';
import { Button, Dialog, Text, TextField } from 'yahha-ui';

export default function DialogForm() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const formId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get('title') ?? '').trim();
    if (!title) {
      setError('请输入站点标题，不能只填写空格。');
      inputRef.current?.focus();
      return;
    }
    setSaved(title);
    setOpen(false);
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setError('');
          setOpen(nextOpen);
        }}
        trigger={<Button>修改站点标题</Button>}
        title="站点标题"
        description="为这间阅读室取一个喜欢的名字。"
        initialFocus={inputRef}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
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
            defaultValue={saved}
            placeholder="例如：小小阅读室"
            required
            maxLength={30}
            hint="请输入 1–30 个字符。"
            error={error}
            onChange={() => setError('')}
          />
        </form>
      </Dialog>
      <Text size="sm" tone="muted" role="status">
        {saved ? `当前标题：${saved}` : '尚未保存标题。'}
      </Text>
    </div>
  );
}
