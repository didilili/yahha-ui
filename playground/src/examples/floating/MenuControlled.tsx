import { useEffect, useRef, useState } from 'react';
import { Button, DropdownMenu, Heading, Text, TextField } from 'yahha-ui';

export default function MenuControlled() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('草稿尚未发布');
  const [removed, setRemoved] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('周末想写的一页');
  const [draftTitle, setDraftTitle] = useState(title);
  const trigger = useRef<HTMLButtonElement>(null);
  const editor = useRef<HTMLInputElement>(null);
  const recovery = useRef<HTMLButtonElement>(null);
  const [focusTarget, setFocusTarget] = useState<'editor' | 'trigger' | 'recovery' | null>(null);

  useEffect(() => {
    if (!focusTarget) return;
    const frame = requestAnimationFrame(() => {
      const target =
        focusTarget === 'editor'
          ? editor.current
          : focusTarget === 'recovery'
            ? recovery.current
            : trigger.current;
      target?.focus();
      setFocusTarget(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [focusTarget]);

  function restore() {
    setOpen(false);
    setRemoved(false);
    setMessage('草稿已恢复，内容没有丢失');
    setFocusTarget('trigger');
  }

  return (
    <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
      {!removed && (
        <article aria-label="示例草稿" style={{ display: 'grid', gap: 16, minWidth: 0 }}>
          {editing ? (
            <form
              style={{ display: 'grid', gap: 12 }}
              onSubmit={(event) => {
                event.preventDefault();
                if (!draftTitle.trim()) {
                  editor.current?.focus();
                  return;
                }
                setTitle(draftTitle.trim());
                setEditing(false);
                setMessage('草稿标题已保存在本页');
                setFocusTarget('trigger');
              }}
            >
              <TextField
                ref={editor}
                label="草稿标题"
                value={draftTitle}
                required
                maxLength={60}
                hint="1–60 个字符。"
                onChange={(event) => setDraftTitle(event.target.value)}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Button type="submit" disabled={!draftTitle.trim()}>
                  保存草稿
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditing(false);
                    setMessage('已取消编辑，草稿标题没有改变');
                    setFocusTarget('trigger');
                  }}
                >
                  取消编辑
                </Button>
              </div>
            </form>
          ) : (
            <>
              <Heading level={3}>{title}</Heading>
              <Text>散步时拐进面包店，回家才发现路线图一笔也没记。</Text>
            </>
          )}
          <div style={{ justifySelf: 'start' }}>
            <DropdownMenu
              trigger={
                <Button ref={trigger} variant="secondary" aria-label={`操作草稿：${title}`}>
                  草稿操作
                </Button>
              }
              open={open}
              onOpenChange={setOpen}
              align="end"
              items={[
                {
                  id: 'edit',
                  label: '继续编辑',
                  onSelect: () => {
                    if (!editing) setDraftTitle(title);
                    setEditing(true);
                    setFocusTarget('editor');
                    setMessage('正在编辑草稿');
                  },
                },
                {
                  id: 'publish',
                  label: '发布（等待审核）',
                  disabled: true,
                  onSelect: () => setMessage('已发布'),
                },
                {
                  id: 'remove',
                  label: '移出草稿列表',
                  destructive: true,
                  onSelect: () => {
                    setOpen(false);
                    setRemoved(true);
                    setMessage('已从示例列表中移出，可恢复原草稿');
                    setFocusTarget('recovery');
                  },
                },
              ]}
            />
          </div>
        </article>
      )}
      {removed && (
        <Button ref={recovery} onClick={restore} style={{ justifySelf: 'start' }}>
          恢复草稿
        </Button>
      )}
      <Text size="sm" tone="muted" role="status">
        {message}
      </Text>
    </div>
  );
}
