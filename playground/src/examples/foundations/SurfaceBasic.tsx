import { Heading, Surface, Text } from 'yahha-ui';

export default function SurfaceBasic() {
  return (
    <Surface style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
      <Heading level={3}>给这段内容留一个位置</Heading>
      <Text>用于放置正文、阅读提示或其他内容的基础容器。</Text>
      <Text size="sm" tone="muted">
        白纸内容面保持平整；标题和段落间距由外层布局安排。
      </Text>
    </Surface>
  );
}
