import { useState } from 'react';
import { Badge, Button, Tabs, Text } from 'yahha-ui';

const initialNotes = [
  { id: 'rain', title: '雨天的读书笔记', archived: false },
  { id: 'walk', title: '周末散步的小发现', archived: false },
];

export default function TabsLabelCounts() {
  const [notes, setNotes] = useState(initialNotes);
  const [message, setMessage] = useState('');
  const groups = [
    { value: 'pending', label: '待整理', notes: notes.filter((note) => !note.archived) },
    { value: 'archived', label: '已归档', notes: notes.filter((note) => note.archived) },
  ];
  const target = notes[0];

  return (
    <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
      <Tabs
        label="手记栏目"
        items={groups.map((group) => ({
          value: group.value,
          label: (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {group.label} <Badge>{group.notes.length}</Badge>
            </span>
          ),
          content: group.notes.length ? (
            <ul style={{ margin: 0, paddingInlineStart: 24 }}>
              {group.notes.map((note) => (
                <li key={note.id}>{note.title}</li>
              ))}
            </ul>
          ) : (
            <Text tone="muted">暂无手记。</Text>
          ),
        }))}
      />
      <Button
        variant="secondary"
        style={{ justifySelf: 'start' }}
        onClick={() => {
          setNotes((current) =>
            current.map((note) =>
              note.id === target.id ? { ...note, archived: !note.archived } : note,
            ),
          );
          setMessage(`已${target.archived ? '恢复' : '归档'}《${target.title}》。`);
        }}
      >
        {target.archived ? '恢复' : '归档'}《{target.title}》
      </Button>
      <Text size="sm" tone="muted" role="status">
        {message}
      </Text>
    </div>
  );
}
