import { useState } from 'react';
import { RadioGroup } from 'yahha-ui';

export default function RadioGroupBasic() {
  const [frequency, setFrequency] = useState('weekly');
  const options = [
    { value: 'weekly', label: '每周一封' },
    { value: 'monthly', label: '每月精选' },
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <RadioGroup
        label="来信频率"
        value={frequency}
        onValueChange={setFrequency}
        options={options}
      />
      <RadioGroup
        label="来信频率（整行高亮）"
        value={frequency}
        onValueChange={setFrequency}
        options={options}
        highlightSelected
      />
    </div>
  );
}
