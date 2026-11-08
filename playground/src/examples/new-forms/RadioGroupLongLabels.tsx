import { useState } from 'react';
import { RadioGroup } from 'yahha-ui';

export default function RadioGroupLongLabels() {
  const [visibility, setVisibility] = useState('public');

  return (
    <div style={{ maxWidth: 340 }}>
      <RadioGroup
        label="收藏可见范围"
        value={visibility}
        onValueChange={setVisibility}
        options={[
          { value: 'public', label: '公开，允许所有访问个人主页的读者查看完整收藏与阅读记录' },
          { value: 'private', label: '仅自己可见', description: '收藏不会展示在个人主页。' },
        ]}
      />
    </div>
  );
}
