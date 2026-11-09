import { useState } from 'react';
import { Accordion, Button, Text } from 'yahha-ui';

export default function AccordionStates() {
  const [value, setValue] = useState<string[]>(['preparation', 'meeting']);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Accordion
        multiple
        value={value}
        onValueChange={setValue}
        items={[
          {
            value: 'preparation',
            title: '需要带些什么？',
            content: <p>带一本愿意分享的书，以及记录喜欢段落的小本子。</p>,
          },
          {
            value: 'meeting',
            title: '在哪里集合？',
            content: <p>先到书店门口的小桌签到，再一起去窗边的阅读区。</p>,
          },
        ]}
      />
      <Button variant="secondary" onClick={() => setValue([])}>
        全部收起
      </Button>
      <Text size="sm" tone="muted" role="status">
        已展开 {value.length} 项
      </Text>
    </div>
  );
}
