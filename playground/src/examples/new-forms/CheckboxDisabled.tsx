import { Checkbox } from 'yahha-ui';

export default function CheckboxDisabled() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Checkbox label="站内消息提醒" disabled defaultChecked hint="暂不可更改。" />
      <Checkbox label="接收每日来信" disabled hint="此功能暂未开放。" />
    </div>
  );
}
