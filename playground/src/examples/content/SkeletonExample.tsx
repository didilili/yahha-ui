import { useState } from 'react';
import { Avatar, Button, Heading, Skeleton, Text } from 'yahha-ui';

const titleHeight = 'calc(var(--chi-font-size-heading-3, 20px) * var(--chi-leading-heading, 1.45))';
const summaryHeight = 'calc(var(--chi-font-size-body, 16px) * var(--chi-leading-body, 1.8) * 2)';

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
            <div style={{ display: 'grid', gap: 12 }}>
              <Skeleton height="var(--chi-font-size-body, 16px)" />
              <Skeleton width="80%" height="var(--chi-font-size-body, 16px)" />
            </div>
          ) : (
            <Text>把喜欢的小事留给下一次阅读。</Text>
          )}
        </div>
      </section>
      <div>
        <Button variant="secondary" onClick={() => setLoading(!loading)}>
          {loading ? '显示内容' : '显示加载占位'}
        </Button>
      </div>
      <Text role="status" size="sm" tone="muted">
        {loading ? '正在展示文章加载占位。' : '文章内容已显示。'}
      </Text>
      <Text size="sm" tone="muted">
        头像、标题与两行摘要共用布局；长内容仍可自然增高，不靠裁切维持占位。
      </Text>
    </div>
  );
}
