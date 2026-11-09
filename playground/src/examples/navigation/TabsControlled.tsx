import { useEffect, useRef, useState } from 'react';
import { Button, Heading, Surface, Tabs, Text, Input } from 'yahha-ui';

export default function TabsControlled() {
  const [value, setValue] = useState<string | null>('write');
  const [preview, setPreview] = useState('');
  const [focusDraft, setFocusDraft] = useState(false);
  const draft = useRef<HTMLInputElement>(null);
  const currentLabel =
    value === 'write' ? '写一张明信片' : value === 'about' ? '预览明信片' : '未选择';

  useEffect(() => {
    if (!focusDraft || value !== 'write') return;
    const frame = requestAnimationFrame(() => {
      draft.current?.focus();
      setFocusDraft(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [focusDraft, value]);

  return (
    <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
      <Tabs
        label="明信片编辑与预览"
        value={value}
        onValueChange={(nextValue) => {
          setFocusDraft(false);
          if (nextValue === 'about') setPreview(draft.current?.value ?? '');
          setValue(nextValue);
        }}
        keepMounted
        items={[
          {
            value: 'write',
            label: '写一张明信片',
            content: (
              <Input ref={draft} label="明信片草稿" placeholder="写下今天想分享的一件小事" />
            ),
          },
          {
            value: 'about',
            label: '预览明信片',
            content: (
              <article aria-label="明信片预览" style={{ minWidth: 0 }}>
                <Surface style={{ display: 'grid', gap: 12, minWidth: 0 }}>
                  <Heading level={3}>写给朋友的明信片</Heading>
                  {preview === '' ? (
                    <Text tone="muted">还没有写下明信片内容。</Text>
                  ) : (
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      <Text>{preview}</Text>
                    </div>
                  )}
                </Surface>
              </article>
            ),
          },
        ]}
      />
      <Button
        variant="secondary"
        style={{ justifySelf: 'start' }}
        onClick={() => {
          setValue('write');
          setFocusDraft(true);
        }}
      >
        回到明信片
      </Button>
      <Text size="sm" tone="muted" role="status">
        当前栏目：{currentLabel}
      </Text>
    </div>
  );
}
