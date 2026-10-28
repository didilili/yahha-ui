import { useState } from 'react';
import { SegmentedControl, Text } from 'yahha-ui';

type View = 'all' | 'journal' | 'notes';

export default function SegmentedBasic() {
  const [view, setView] = useState<View>('all');

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 16 }}>
      <Text size="sm">文章类型</Text>
      <SegmentedControl
        label="文章类型"
        value={view}
        onValueChange={setView}
        options={[
          { value: 'all', label: '全部' },
          { value: 'journal', label: '日记' },
          { value: 'notes', label: '随手记' },
        ]}
      />
    </div>
  );
}
