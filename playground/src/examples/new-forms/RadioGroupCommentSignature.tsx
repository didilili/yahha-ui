import { useRef, useState } from 'react';
import { Button, RadioGroup, Text, TextField } from 'yahha-ui';

type Signature = 'nickname' | 'anonymous';
const comment = '读到河边那一段，也想把周末留给一场慢慢的散步。谢谢你分享。';

export default function RadioGroupCommentSignature() {
  const [signature, setSignature] = useState<Signature>('nickname');
  const [nickname, setNickname] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const nicknameRef = useRef<HTMLInputElement>(null);
  const anonymous = signature === 'anonymous';

  return (
    <form
      noValidate
      style={{ display: 'grid', gap: 16, minWidth: 0, maxWidth: 520 }}
      onInput={() => {
        setPreview(null);
        setError('');
      }}
      onReset={(event) => {
        event.preventDefault();
        setSignature('nickname');
        setNickname('');
        setPreview(null);
        setError('');
      }}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const method = data.get('signature');
        if (method !== 'nickname' && method !== 'anonymous') return;
        const author =
          method === 'anonymous' ? '匿名读者' : String(data.get('nickname') ?? '').trim();
        if (!author) {
          setError('请填写昵称，或选择匿名预览。');
          nicknameRef.current?.focus();
          return;
        }
        setError('');
        setPreview(author);
      }}
    >
      <div style={{ display: 'grid', gap: 8 }}>
        <Text size="sm" tone="muted">
          想留下的话
        </Text>
        <Text>{comment}</Text>
      </div>
      <RadioGroup<Signature>
        label="留言署名"
        name="signature"
        value={signature}
        onValueChange={(value) => {
          setSignature(value);
          setPreview(null);
          setError('');
        }}
        options={[
          { value: 'nickname', label: '使用昵称' },
          { value: 'anonymous', label: '匿名' },
        ]}
      />
      <TextField
        ref={nicknameRef}
        label="昵称"
        name="nickname"
        autoComplete="nickname"
        value={nickname}
        onChange={(event) => setNickname(event.currentTarget.value)}
        required={!anonymous}
        disabled={anonymous}
        hint={anonymous ? '匿名预览不会使用昵称，草稿仍保留。' : '必填，用这个昵称署名预览。'}
        error={error || undefined}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="submit">预览留言</Button>
        <Button type="reset" variant="secondary">
          重置示例
        </Button>
      </div>
      <Text role="status" size="sm" tone="muted">
        {preview === null ? '' : '预览已更新，内容未发布。'}
      </Text>
      {preview !== null && (
        <section aria-label="留言预览" style={{ display: 'grid', gap: 8 }}>
          <Text>
            <strong>署名：{preview}</strong>
          </Text>
          <Text>{comment}</Text>
        </section>
      )}
    </form>
  );
}
