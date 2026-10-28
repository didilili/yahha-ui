import { Heading, Surface, Text } from 'yahha-ui';

export default function SurfaceBasic() {
  return (
    <Surface style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
      <Heading level={3}>沿着河边走一会儿</Heading>
      <Text>午后的风很轻，树影慢慢落在水面上。</Text>
    </Surface>
  );
}
