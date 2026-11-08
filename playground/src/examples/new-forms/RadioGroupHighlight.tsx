import { useState } from 'react';
import { RadioGroup } from 'yahha-ui';

export default function RadioGroupHighlight() {
  const [frequency, setFrequency] = useState('weekly');
  const options = [
    { value: 'weekly', label: '每周一封' },
    { value: 'monthly', label: '每月精选' },
  ];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <span>默认</span>
        <RadioGroup
          label="来信频率"
          value={frequency}
          onValueChange={setFrequency}
          options={options}
        />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <span>整行高亮</span>
        <RadioGroup
          label="来信频率"
          value={frequency}
          onValueChange={setFrequency}
          options={options}
          highlightSelected
        />
      </div>
    </div>
  );
}
