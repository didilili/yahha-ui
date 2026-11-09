import { useState } from 'react';
import { Button, RadioGroup } from 'yahha-ui';

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
      <div>
        <Button type="button" variant="secondary" onClick={() => setFrequency('')}>
          清空选择
        </Button>
      </div>
      <RadioGroup
        label="来信频率（已禁用）"
        options={options}
        value="weekly"
        onValueChange={() => {}}
        disabled
        hint="此设置暂不可更改。"
      />
      <fieldset
        aria-label="父级禁用状态样本"
        disabled
        style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
      >
        <RadioGroup
          label="收藏可见范围（父级已禁用）"
          hint="此设置暂不可更改。"
          options={[
            { value: 'public', label: '公开' },
            { value: 'private', label: '仅自己可见', description: '收藏不会展示在个人主页。' },
          ]}
          value="private"
          onValueChange={() => {}}
        />
      </fieldset>
    </div>
  );
}
