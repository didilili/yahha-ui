import { useState } from 'react';
import { Button, Checkbox, Text } from 'yahha-ui';

export default function CheckboxMixed() {
  const [selected, setSelected] = useState(['journal']);
  const items = [
    { value: 'journal', label: '生活手记' },
    { value: 'reading', label: '读书笔记' },
  ];
  return (
    <form
      style={{ display: 'grid', gap: 16, maxWidth: 440 }}
      onReset={(event) => {
        event.preventDefault();
        setSelected(['journal']);
      }}
    >
      <fieldset style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}>
        <legend>分类订阅</legend>
        <Checkbox
          label="订阅所有分类"
          checked={selected.length === items.length}
          indeterminate={selected.length > 0 && selected.length < items.length}
          onChange={(event) =>
            setSelected(event.target.checked ? items.map((item) => item.value) : [])
          }
        />
        <div style={{ paddingInlineStart: 24 }}>
          {items.map((item) => (
            <Checkbox
              key={item.value}
              label={item.label}
              name="topics"
              value={item.value}
              checked={selected.includes(item.value)}
              onChange={(event) => {
                const checked = event.target.checked;
                setSelected((current) =>
                  checked
                    ? [...current, item.value]
                    : current.filter((value) => value !== item.value),
                );
              }}
            />
          ))}
        </div>
      </fieldset>
      <Text size="sm" tone="muted" role="status">
        已选 {selected.length} 项，共 {items.length} 项。
      </Text>
      <div>
        <Button type="reset" variant="secondary">
          恢复初始选择
        </Button>
      </div>
    </form>
  );
}
