import { useState } from 'react';
import { RadioGroup } from 'yahha-ui';

export default function RadioGroupDescriptions() {
  const [frequency, setFrequency] = useState('weekly');
  return (
    <div style={{ maxWidth: 440 }}>
      <RadioGroup
        label="来信频率"
        value={frequency}
        onValueChange={setFrequency}
        options={[
          { value: 'weekly', label: '每周一封', description: '周末整理一周的文章与发现。' },
          { value: 'monthly', label: '每月精选', description: '只寄送当月值得反复阅读的内容。' },
          { value: 'daily', label: '每天更新', description: '每日来信暂未开放。', disabled: true },
        ]}
      />
    </div>
  );
}
