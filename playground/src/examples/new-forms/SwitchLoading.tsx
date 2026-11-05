import { Switch } from 'yahha-ui';

export default function SwitchLoading() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Switch label="邮件通知" loading />
      <Switch label="站内通知" defaultChecked loading />
    </div>
  );
}
