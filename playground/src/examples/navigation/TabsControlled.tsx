import { useEffect, useRef, useState } from 'react';
import { Button, Tabs, TextField } from 'yahha-ui';

export default function TabsControlled() {
  const [value, setValue] = useState<string | null>('write');
  const [focusDraft, setFocusDraft] = useState(false);
  const draft = useRef<HTMLInputElement>(null);
  const currentLabel =
    value === 'write'
      ? '写一张明信片'
      : value === 'about'
        ? '关于这个小站与慢慢更新的日常记录'
        : '未选择';

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
              <TextField
                ref={draft}
                label="明信片草稿"
                placeholder="切换栏目后再回来，草稿仍会保留"
              />
            ),
          },
          {
            value: 'about',
            label: '关于这个小站与慢慢更新的日常记录',
            content: <p style={{ margin: 0 }}>草稿只保留在当前页面，不会发送或保存到服务器。</p>,
          },
          {
            value: 'archive',
            label: '旧站归档（整理中）',
            content: <p>旧文章正在整理。</p>,
            disabled: true,
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
      <p role="status" style={{ margin: 0 }}>
        当前栏目：{currentLabel}
      </p>
    </div>
  );
}
