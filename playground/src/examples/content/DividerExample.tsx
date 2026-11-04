import { Divider, Text } from 'yahha-ui';

export default function DividerExample() {
  return (
    <div>
      <Text>夕阳落到桥边时，大家把剩下的半块饼干分着吃，等朋友系好鞋带再一起回家。</Text>
      <Divider />
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <span>阅读约 3 分钟</span>
        <Divider orientation="vertical" decorative />
        <span>生活手记</span>
      </div>
    </div>
  );
}
