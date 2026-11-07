import { Checkbox } from 'yahha-ui';

export default function CheckboxBasic() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <span>默认</span>
        <Checkbox label="接收每月阅读来信" defaultChecked />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <span>可选整行高亮</span>
        <Checkbox label="接收每月阅读来信" defaultChecked highlightSelected />
      </div>
    </div>
  );
}
