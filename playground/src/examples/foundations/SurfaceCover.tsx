import { useId } from 'react';
import { Heading, Image, Link, Surface, Text } from 'yahha-ui';

const cover =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="800" height="450" fill="#fff6f7"/><rect x="48" y="48" width="704" height="354" rx="12" fill="#fffefa" stroke="#d7c3c0"/><text x="400" y="215" text-anchor="middle" fill="#462e31" font-family="sans-serif" font-size="42">周末手记</text><text x="400" y="275" text-anchor="middle" fill="#79656a" font-family="sans-serif" font-size="22">给喜欢的事情，留一点位置。</text></svg>',
  );

export default function SurfaceCover() {
  const titleId = useId();

  return (
    <article aria-labelledby={titleId} style={{ maxWidth: 560 }}>
      <style>{`
        .yahha-surface-cover-body { display: grid; gap: 16px; padding: 24px; }
        @media (max-width: 480px) { .yahha-surface-cover-body { padding: 16px; } }
      `}</style>
      <Surface style={{ padding: '0', overflow: 'hidden' }}>
        <Image
          src={cover}
          alt="写着周末手记的纸面封面"
          aspectRatio="16 / 9"
          loading="eager"
          fallback="封面暂不可用，正文仍可阅读。"
        />
        <div className="yahha-surface-cover-body">
          <Heading level={3} id={titleId}>
            <Link href="#/guides/reading?section=reading-example">沿着河边，慢慢走</Link>
          </Heading>
          <Text>朋友的鞋带散了，我们就在河边等一等。</Text>
        </div>
      </Surface>
    </article>
  );
}
