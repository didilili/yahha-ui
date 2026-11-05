import { useRef, useState } from 'react';
import { Button, Text, Textarea } from 'yahha-ui';

const draft = '这篇散步手记让我也想出门走走。\n谢谢你分享沿途的小花。';

export default function TextareaCommentDraft() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  return (
    <form
      noValidate
      style={{ display: 'grid', gap: 16, minWidth: 0 }}
      onInput={() => {
        setPreview(null);
        setError('');
      }}
      onReset={() => {
        setPreview(null);
        setError('');
      }}
      onSubmit={(event) => {
        event.preventDefault();
        const message = String(new FormData(event.currentTarget).get('comment') ?? '');
        if (!message.trim()) {
          setError('写下一点想法再预览。');
          inputRef.current?.focus();
          return;
        }
        setError('');
        setPreview(message);
      }}
    >
      <Textarea
        ref={inputRef}
        label="给这篇手记留句话"
        name="comment"
        defaultValue={draft}
        autoSize={{ minRows: 2, maxRows: 8 }}
        required
        hint="请填写留言；草稿只在当前示例，预览不会发送。"
        error={error || undefined}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="submit">预览留言</Button>
        <Button type="reset" variant="secondary">
          恢复草稿
        </Button>
      </div>
      <Text role="status" size="sm" tone="muted">
        {preview === null ? '' : '预览已更新，内容未发送。'}
      </Text>
      {preview !== null && (
        <section aria-label="留言预览" style={{ whiteSpace: 'pre-wrap' }}>
          <Text>{preview}</Text>
        </section>
      )}
    </form>
  );
}
