import { Heading, Text } from 'yahha-ui';

export default function HeadingExample() {
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: '65ch' }}>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <div key={level} style={{ display: 'grid', gap: 4 }}>
          <Text size="sm" tone="muted">
            {['一级标题', '二级标题', '三级标题', '四级标题', '五级标题', '六级标题'][level - 1]} h
            {level}
            {level === 2 ? '（默认）' : ''}
          </Text>
          <Heading level={level}>星球上的点心时间</Heading>
        </div>
      ))}
    </div>
  );
}
