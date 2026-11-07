import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Heading, Tabs, Text } from 'yahha-ui';

const initialNotes = [
  { id: 'rain', title: '雨天的读书笔记' },
  { id: 'walk', title: '周末散步的小发现' },
  { id: 'window', title: '窗边的植物记录' },
];

export default function TabsCounts() {
  const [archivedIds, setArchivedIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const pendingHeading = useRef<HTMLHeadingElement>(null);
  const pendingFocus = useRef<{ id?: string } | null>(null);
  const pendingNotes = initialNotes.filter((note) => !archivedIds.includes(note.id));
  const archivedNotes = initialNotes.filter((note) => archivedIds.includes(note.id));

  useEffect(() => {
    const destination = pendingFocus.current;
    if (!destination) return;
    pendingFocus.current = null;
    if (document.activeElement === document.body) {
      (destination.id ? buttons.current.get(destination.id) : pendingHeading.current)?.focus();
    }
  }, [archivedIds]);

  function archive(id: string, button: HTMLButtonElement) {
    const index = pendingNotes.findIndex((note) => note.id === id);
    const remaining = pendingNotes.filter((note) => note.id !== id);
    if (document.activeElement === button) {
      pendingFocus.current = { id: (remaining[index] ?? remaining[index - 1])?.id };
    }
    setArchivedIds((current) => [...current, id]);
    setMessage(`已归档《${initialNotes.find((note) => note.id === id)?.title}》。`);
  }

  return (
    <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
      <Tabs
        label="手记整理"
        items={[
          {
            value: 'pending',
            label: (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                待整理 <Badge>{pendingNotes.length}</Badge>
              </span>
            ),
            content: (
              <div style={{ display: 'grid', gap: 12, minWidth: 0 }}>
                {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
                <Heading level={3} ref={pendingHeading} tabIndex={-1}>
                  待整理手记
                </Heading>
                {pendingNotes.length === 0 ? (
                  <Text tone="muted">当前清单已整理完。</Text>
                ) : (
                  <ul
                    style={{ display: 'grid', gap: 12, padding: 0, margin: 0, listStyle: 'none' }}
                  >
                    {pendingNotes.map((note) => (
                      <li
                        key={note.id}
                        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}
                      >
                        <Text style={{ flex: '1 1 140px', margin: 0 }}>{note.title}</Text>
                        <Button
                          ref={(node) => {
                            if (node) buttons.current.set(note.id, node);
                            else buttons.current.delete(note.id);
                          }}
                          variant="secondary"
                          aria-label={`归档《${note.title}》`}
                          onClick={(event) => archive(note.id, event.currentTarget)}
                        >
                          归档
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ),
          },
          {
            value: 'archived',
            label: (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                已归档 <Badge tone="success">{archivedNotes.length}</Badge>
              </span>
            ),
            content: (
              <div style={{ display: 'grid', gap: 12, minWidth: 0 }}>
                <Heading level={3}>已归档手记</Heading>
                {archivedNotes.length === 0 ? (
                  <Text tone="muted">还没有归档的手记。</Text>
                ) : (
                  <ul style={{ margin: 0, paddingInlineStart: 24 }}>
                    {archivedNotes.map((note) => (
                      <li key={note.id}>{note.title}</li>
                    ))}
                  </ul>
                )}
              </div>
            ),
          },
        ]}
      />
      <Button
        variant="ghost"
        style={{ justifySelf: 'start' }}
        onClick={() => {
          setArchivedIds([]);
          setMessage('已恢复示例清单。');
        }}
      >
        恢复示例清单
      </Button>
      {message && (
        <Text size="sm" tone="muted" role="status">
          {message}
        </Text>
      )}
    </div>
  );
}
