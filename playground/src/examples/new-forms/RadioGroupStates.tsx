import { useState } from 'react';
import { Button, RadioGroup } from 'yahha-ui';

export default function RadioGroupStates() {
  const [value, setValue] = useState('');
  const options = [
    { value: 'public', label: '公开，允许所有访问个人主页的读者查看完整收藏与阅读记录' },
    { value: 'private', label: '仅自己可见', description: '收藏不会展示在个人主页。' },
  ];
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 340 }}>
      <RadioGroup
        label="收藏可见范围"
        options={options}
        value={value}
        onValueChange={setValue}
        error={value ? undefined : '请选择一种可见范围。'}
      />
      <div>
        <Button variant="secondary" onClick={() => setValue('')}>
          清空选择
        </Button>
      </div>
      <fieldset disabled style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        <RadioGroup label="暂不可修改" options={options} value="private" onValueChange={() => {}} />
      </fieldset>
    </div>
  );
}
