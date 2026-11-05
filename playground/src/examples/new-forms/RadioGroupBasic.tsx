import { useState } from 'react';
import { RadioGroup } from 'yahha-ui';

export default function RadioGroupBasic() {
  const [frequency, setFrequency] = useState('weekly');
  return (
    <div style={{ maxWidth: 440 }}>
      <RadioGroup
        label="来信频率"
        value={frequency}
        onValueChange={setFrequency}
        options={[
          { value: 'weekly', label: '每周一封' },
          { value: 'monthly', label: '每月精选' },
        ]}
      />
    </div>
  );
}
