import { Divider } from 'yahha-ui';

export default function DividerVertical() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span>手记</span>
      <Divider orientation="vertical" decorative style={{ margin: 0 }} />
      <span>随笔</span>
    </div>
  );
}
