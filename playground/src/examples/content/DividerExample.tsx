import { Divider, Text } from 'yahha-ui';

export default function DividerExample() {
  return (
    <div>
      <Text>正文结束，下面是本篇手记的阅读信息。</Text>
      <Divider />
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <span>阅读约 3 分钟</span>
        <Divider orientation="vertical" decorative />
        <span>生活手记</span>
      </div>
    </div>
  );
}
