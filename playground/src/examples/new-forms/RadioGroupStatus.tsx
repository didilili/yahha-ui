import { useState } from 'react';
import { RadioGroup } from 'yahha-ui';

const options = [
  { value: 'weekly', label: '每周一封' },
  { value: 'monthly', label: '每月精选' },
];

export default function RadioGroupStatus() {
  const [frequency, setFrequency] = useState('');
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 440 }}>
      <RadioGroup
        label="来信频率"
        options={options}
        value={frequency}
        onValueChange={setFrequency}
        error={frequency ? undefined : '请选择一种来信频率。'}
      />
      <RadioGroup
        label="来信频率（已禁用）"
        options={options}
        value="weekly"
        onValueChange={() => {}}
        disabled
        hint="此设置暂不可更改。"
      />
    </div>
  );
}
