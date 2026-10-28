import { useEffect, useRef, useState } from 'react';
import { Button, Tabs, Text, TextField } from 'yahha-ui';

export default function TabsControlled() {
  const [value, setValue] = useState<string | null>('write');
  const [focusDraft, setFocusDraft] = useState(false);
  const draft = useRef<HTMLInputElement>(null);
  const currentLabel =
    value === 'write' ? '写一张明信片' : value === 'about' ? '明信片说明' : '未选择';

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
        label="联系与阅读说明"
        value={value}
        onValueChange={(nextValue) => {
          setFocusDraft(false);
          setValue(nextValue);
        }}
        keepMounted
        items={[
          {
            value: 'write',
            label: '写一张明信片',
            content: (
              <TextField ref={draft} label="明信片草稿" placeholder="写下今天想分享的一件小事" />
            ),
          },
          {
            value: 'about',
            label: '明信片说明',
            content: (
              <p style={{ margin: 0 }}>写下最近读到的一句话，或者分享今天路上遇到的小事。</p>
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
