import { useId } from 'react';
import { Heading, Surface, Text } from 'yahha-ui';

export default function SurfaceNotes() {
  const id = useId();
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 560 }}>
      <Surface
        variant="note"
        role="note"
        aria-labelledby={`${id}-afterword`}
        style={{ display: 'grid', gap: 12 }}
      >
        <Heading level={3} id={`${id}-afterword`}>
          写在手记后面
        </Heading>
        <Text>
          写手记时总有人凑过来看。小八检查点心有没有写漏，吉伊添了一幅画，乌萨奇的字挤到了纸边。
        </Text>
      </Surface>
    </div>
  );
}
