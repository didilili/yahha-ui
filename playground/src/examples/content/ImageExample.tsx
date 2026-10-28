import { Image, Text } from 'yahha-ui';

const cover =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="800" height="450" fill="#f8e5a7"/><circle cx="670" cy="120" r="80" fill="#fffaf0"/><text x="55" y="245" fill="#462e31" font-family="sans-serif" font-size="52">周末手记</text><text x="58" y="305" fill="#79656a" font-family="sans-serif" font-size="23">慢慢读，慢慢记录。</text></svg>',
  );

export default function ImageExample() {
  return (
    <figure style={{ margin: 0, maxWidth: 540, display: 'grid', gap: 12 }}>
      <Image
        src={cover}
        alt="黄色底色的周末手记示例封面"
        width={800}
        height={450}
        aspectRatio="16 / 9"
        decoding="async"
      />
      <figcaption>
        <Text size="sm" tone="muted">
          周末手记的封面。
        </Text>
      </figcaption>
    </figure>
  );
}
