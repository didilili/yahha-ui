import { Heading, Surface, Text } from 'yahha-ui';

export default function SurfaceBasic() {
  return (
    <Surface style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
      <Heading level={3}>给路过的小星星写封信</Heading>
      <Text>
        在 Yahha
        星球的云朵邮局，信纸可以借，铅笔也可以借。写好后，别忘了告诉小星星：下次来，给你留块饼干。
      </Text>
    </Surface>
  );
}
