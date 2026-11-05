import { Switch } from 'yahha-ui';

export default function SwitchDisabled() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Switch label="邮件通知" disabled />
      <Switch label="站内通知" defaultChecked disabled />
    </div>
  );
}
