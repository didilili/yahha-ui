import { useState } from 'react';
import { Avatar, Button, Heading, Skeleton, Text } from 'yahha-ui';

// These reserved slots belong to this article layout, not to Skeleton's defaults.
const titleHeight = 32;
const summaryLineHeight = 28;
const summaryHeight = 64;

export default function SkeletonExample() {
  const [loading, setLoading] = useState(true);
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 450 }}>
      <section aria-label="文章摘要" aria-busy={loading} style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', minHeight: 44 }}>
          {loading ? (
            <Skeleton
              variant="rect"
              width={44}
              height={44}
              style={{ borderRadius: '40% 45% 42% 38%' }}
            />
          ) : (
            <Avatar name="小林" />
          )}
        </div>
        <div style={{ display: 'grid', minHeight: titleHeight }}>
          {loading ? (
            <Skeleton width="65%" height={titleHeight} />
          ) : (
            <Heading level={3}>沿着河边走一走</Heading>
          )}
        </div>
        <div style={{ display: 'grid', minHeight: summaryHeight }}>
          {loading ? (
            <div style={{ display: 'grid', alignContent: 'start', gap: 8 }}>
              <Skeleton height={summaryLineHeight} />
              <Skeleton width="80%" height={summaryLineHeight} />
            </div>
          ) : (
            <Text>朋友走得慢一点，就在桥边等一等。</Text>
          )}
        </div>
      </section>
      <div>
        <Button variant="secondary" onClick={() => setLoading(!loading)}>
          {loading ? '显示内容' : '显示加载占位'}
        </Button>
      </div>
      <Text role="status" size="sm" tone="muted">
        {loading ? '文章加载中…' : '文章内容已显示。'}
      </Text>
    </div>
  );
}
