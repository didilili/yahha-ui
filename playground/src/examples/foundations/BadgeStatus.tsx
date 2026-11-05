import { useRef, useState } from 'react';
import { Badge, Button, Heading, Surface, Text, TextField } from 'yahha-ui';

type Phase = 'unchecked' | 'editing' | 'missing' | 'checked';
const labels = {
  unchecked: '未检查',
  editing: '待检查',
  missing: '需补充',
  checked: '已检查',
};

export default function BadgeStatus() {
  const [phase, setPhase] = useState<Phase>('unchecked');
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tone = phase === 'checked' ? 'success' : phase === 'editing' ? 'accent' : 'neutral';

  return (
    <Surface style={{ display: 'grid', gap: 24, minWidth: 0, maxWidth: 560 }}>
      <header style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <Badge>生活手记</Badge>
        <Heading level={3}>沿着河边，慢慢走</Heading>
      </header>
      <form
        noValidate
        style={{ display: 'grid', gap: 16, minWidth: 0 }}
        onInput={() => {
          setPhase('editing');
          setPreview(null);
        }}
        onReset={() => {
          setPhase('unchecked');
          setPreview(null);
        }}
        onSubmit={(event) => {
          event.preventDefault();
          const summary = String(new FormData(event.currentTarget).get('summary') ?? '');
          if (!summary.trim()) {
            setPhase('missing');
            setPreview(null);
            inputRef.current?.focus();
            return;
          }
          setPhase('checked');
          setPreview(summary);
        }}
      >
        <TextField
          ref={inputRef}
          label="手记摘要"
          name="summary"
          defaultValue=""
          required
          hint="必填，写下一两句手记的内容。"
          error={phase === 'missing' ? '请先填写摘要。' : undefined}
        />
        <div>
          <Badge tone={tone}>{labels[phase]}</Badge>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Button type="submit">检查摘要</Button>
          <Button type="reset" variant="secondary">
            恢复示例
          </Button>
        </div>
        <Text role="status" size="sm" tone="muted">
          {phase === 'checked' ? '摘要检查通过，预览已更新；内容未保存或发布。' : ''}
        </Text>
        {preview !== null && (
          <section aria-label="摘要预览" style={{ whiteSpace: 'pre-wrap' }}>
            <Text>{preview}</Text>
          </section>
        )}
      </form>
    </Surface>
  );
}
