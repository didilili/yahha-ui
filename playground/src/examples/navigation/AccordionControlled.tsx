import { useState } from 'react';
import { Accordion, Button, Text } from 'yahha-ui';

export default function AccordionControlled() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button variant="secondary" onClick={() => setValue(['preparation', 'meeting'])}>
          展开可用说明
        </Button>
        <Button variant="ghost" onClick={() => setValue([])}>
          全部收起
        </Button>
      </div>
      <Accordion
        multiple
        value={value}
        onValueChange={setValue}
        items={[
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
              <p style={{ margin: 0 }}>
                先到书店门口的小桌签到，再一起去窗边的阅读区。请提前十分钟到达。
              </p>
            ),
          },
          {
            value: 'rain',
            title: '雨天安排（确认中）',
            content: <p>确认后会补充当天的集合安排。</p>,
            disabled: true,
          },
        ]}
      />
      <Text size="sm" tone="muted" role="status">
        已展开 {value.length} 项说明。
      </Text>
    </div>
  );
}
