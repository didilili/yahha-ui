import { useState } from 'react';
import { Button, Heading, RadioGroup, Text } from 'yahha-ui';

type ReadingLayout = 'standard' | 'relaxed';
const options = [
  { value: 'standard', label: '标准', description: '常规行距与段落间距，连贯地读下去。' },
  { value: 'relaxed', label: '宽松', description: '加大行距与段落间距，让每一段更舒展。' },
] as const;
const paragraphs = [
  '傍晚买完菜，我没有立刻回家，而是沿着河边多走了一小段。风吹过树梢，水面上的光也跟着慢下来。',
  '长椅旁开着几朵不知名字的小花。我把它们画在本子的角落，旁边留了一点空白，等下次路过再补上。',
  '回家的时候天还亮着。今天没有什么特别的事，但这条绕远的小路，值得写进周末的手记里。',
];

export default function RadioGroupReadingLayout() {
  const [layout, setLayout] = useState<ReadingLayout>('standard');
  const relaxed = layout === 'relaxed';

  return (
    <div style={{ display: 'grid', gap: 20, minWidth: 0, maxWidth: 640, overflowWrap: 'anywhere' }}>
      <RadioGroup
        label="阅读版式"
        name="reading-layout"
        options={options}
        value={layout}
        onValueChange={setLayout}
      />
      <Text size="sm" tone="muted" role="status">
        当前版式：{relaxed ? '宽松' : '标准'}。
      </Text>
      <article aria-label="阅读版式预览" style={{ display: 'grid', gap: 16, minWidth: 0 }}>
        <Heading level={3}>傍晚绕到河边</Heading>
        <div
          style={{
            display: 'grid',
            gap: relaxed ? 'var(--yahha-space-6, 24px)' : 'var(--yahha-space-3, 12px)',
            minWidth: 0,
          }}
        >
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              style={{
                margin: 0,
                fontSize: 'var(--yahha-font-size-md, 14px)',
                lineHeight: relaxed ? 2.1 : 'var(--yahha-leading-body, 1.8)',
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </article>
      <div>
        <Button variant="secondary" onClick={() => setLayout('standard')}>
          恢复标准版式
        </Button>
      </div>
    </div>
  );
}
