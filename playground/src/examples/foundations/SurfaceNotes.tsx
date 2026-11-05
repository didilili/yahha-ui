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
          不是每一天都有大事发生。有人把鞋带系好了，有人把半块饼干分给你，这一页也就有了想留下的事。
        </Text>
      </Surface>
    </div>
  );
}
