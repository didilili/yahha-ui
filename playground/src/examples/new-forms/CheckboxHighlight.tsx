import { useState } from 'react';
import { Checkbox } from 'yahha-ui';

export default function CheckboxHighlight() {
  const [checked, setChecked] = useState(true);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <span>默认</span>
        <Checkbox
          label="接收每月阅读来信"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <span>整行高亮</span>
        <Checkbox
          label="接收每月阅读来信"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
          highlightSelected
        />
      </div>
    </div>
  );
}
