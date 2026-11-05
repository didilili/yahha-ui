import { Skeleton, Text } from 'yahha-ui';

export default function SkeletonShapes() {
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 320, minWidth: 0 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <Text size="sm" tone="muted">
          文本
        </Text>
        <Skeleton variant="text" width="80%" />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <Text size="sm" tone="muted">
          矩形
        </Text>
        <Skeleton variant="rect" width={160} height={64} />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <Text size="sm" tone="muted">
          圆形
        </Text>
        <Skeleton variant="circle" width={44} height={44} />
      </div>
    </div>
  );
}
