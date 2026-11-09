import { useEffect, useRef, useState } from 'react';
import { Button, DropdownMenu, Text } from 'yahha-ui';

export default function MenuTriggerRecovery() {
  const [removed, setRemoved] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const recovery = useRef<HTMLButtonElement>(null);
  const moveFocus = useRef(false);

  useEffect(() => {
    if (!moveFocus.current) return;
    const frame = requestAnimationFrame(() => {
      (removed ? recovery : trigger).current?.focus();
      moveFocus.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [removed]);

  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      {removed ? (
        <Button
          ref={recovery}
          onClick={() => {
            moveFocus.current = true;
            setRemoved(false);
          }}
        >
          恢复手记
        </Button>
      ) : (
        <>
          <Text>《周末散步》：乌萨奇在路线图上，先圈出了三家面包店。</Text>
          <DropdownMenu
            trigger={
              <Button ref={trigger} variant="secondary" aria-label="操作手记：周末散步">
                手记操作
              </Button>
            }
            items={[
              { id: 'publish', label: '发布（等待审核）', disabled: true, onSelect: () => {} },
              {
                id: 'remove',
                label: '移出手记列表',
                destructive: true,
                onSelect: () => {
                  moveFocus.current = true;
                  setRemoved(true);
                },
              },
            ]}
          />
        </>
      )}
      <Text size="sm" tone="muted" role="status">
        {removed ? '手记已移出，可以恢复。' : '手记在列表中，内容仍然保留。'}
      </Text>
    </div>
  );
}
