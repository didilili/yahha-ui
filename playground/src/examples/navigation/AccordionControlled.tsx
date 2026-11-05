import { useRef, useState } from 'react';
import { Accordion, Button, EmptyState, Text, TextField } from 'yahha-ui';

const items = [
  {
    value: 'preparation',
    title: '参加周末读书会前，需要带些什么？',
    content: (
      <div style={{ display: 'grid', gap: 12 }}>
        <Text>带一本愿意分享的书，以及记录喜欢段落的小本子。</Text>
        <Text>不需要准备完整讲稿，挑一段想读给大家听的文字就好。</Text>
      </div>
    ),
  },
  {
    value: 'meeting',
    title: '到达后在哪里集合？',
    content: (
      <p style={{ margin: 0 }}>先到书店门口的小桌签到，再一起去窗边的阅读区。请提前十分钟到达。</p>
    ),
  },
  {
    value: 'rain',
    title: '雨天安排（确认中）',
    content: <p>确认后会补充当天的集合安排。</p>,
    disabled: true,
  },
];

function filterItems(query: string) {
  const normalized = query.trim().toLowerCase();
  return items.filter((item) => item.title.toLowerCase().includes(normalized));
}

export default function AccordionControlled() {
  const [value, setValue] = useState<string[]>([]);
  const [editing, setEditing] = useState('');
  const [query, setQuery] = useState('');
  const composing = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const visibleItems = filterItems(query);
  const availableKeys = visibleItems.filter((item) => !item.disabled).map((item) => item.value);

  function applyQuery(nextQuery: string) {
    const nextKeys = filterItems(nextQuery)
      .filter((item) => !item.disabled)
      .map((item) => item.value);
    setQuery(nextQuery);
    setValue((current) => current.filter((key) => nextKeys.includes(key)));
  }

  return (
    <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
      <TextField
        ref={inputRef}
        label="搜索说明标题"
        type="text"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        value={editing}
        onCompositionStart={() => {
          composing.current = true;
        }}
        onCompositionEnd={(event) => {
          composing.current = false;
          setEditing(event.currentTarget.value);
          applyQuery(event.currentTarget.value);
        }}
        onChange={(event) => {
          const next = event.currentTarget.value;
          setEditing(next);
          if (!composing.current && !(event.nativeEvent as InputEvent).isComposing) {
            applyQuery(next);
          }
        }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button
          variant="secondary"
          disabled={availableKeys.length === 0}
          onClick={() => setValue(availableKeys)}
        >
          展开可用说明
        </Button>
        <Button variant="ghost" onClick={() => setValue([])}>
          全部收起
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            composing.current = false;
            setEditing('');
            applyQuery('');
            inputRef.current?.focus();
          }}
        >
          清空搜索
        </Button>
      </div>
      {visibleItems.length > 0 ? (
        <Accordion
          multiple
          value={value}
          onValueChange={(next) => setValue(next.filter((key) => availableKeys.includes(key)))}
          items={visibleItems}
        />
      ) : (
        <EmptyState title="没有匹配的说明" description="换个关键词，或清空搜索查看全部说明。" />
      )}
      <Text size="sm" tone="muted" role="status">
        找到 {visibleItems.length} 条说明 · 已展开 {value.length} 项。
      </Text>
    </div>
  );
}
