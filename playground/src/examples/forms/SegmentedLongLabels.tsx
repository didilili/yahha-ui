import { useId, useState } from 'react';
import { SegmentedControl, Text } from 'yahha-ui';

type Topic = 'life' | 'learning' | 'travel';

export default function SegmentedLongLabels() {
  const descriptionId = useId();
  const [topic, setTopic] = useState<Topic>('life');
  const labels = {
    life: '日常生活里的小小发现',
    learning: '慢慢积累的学习笔记',
    travel: '出门走走与旅行记录',
  };

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 350 }}>
      <Text id={descriptionId} size="sm" tone="muted">
        浏览文章专题。容器最多 350px，长标签自然换行；每项仍可点击整片区域。
      </Text>
      <SegmentedControl
        label="浏览文章专题"
        aria-describedby={descriptionId}
        value={topic}
        onValueChange={setTopic}
        options={[
          { value: 'life', label: labels.life },
          { value: 'learning', label: labels.learning },
          { value: 'travel', label: labels.travel },
        ]}
      />
      <Text role="status" size="sm">
        正在浏览：{labels[topic]}
      </Text>
    </div>
  );
}
