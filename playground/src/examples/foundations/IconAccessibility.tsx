import { useId } from 'react';
import { BookmarkIcon, InfoIcon, SuccessIcon, Text } from 'yahha-ui';

export default function IconAccessibility() {
  const labelId = useId();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'start', gap: 32 }}>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 12 }}>
        <Text size="sm" tone="muted">
          装饰图标
        </Text>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <BookmarkIcon filled />
          已收藏
        </span>
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 12 }}>
        <Text size="sm" tone="muted">
          aria-label
        </Text>
        <InfoIcon tone="info" aria-label="阅读提示" />
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 12 }}>
        <Text size="sm" tone="muted">
          aria-labelledby
        </Text>
        <span id={labelId} hidden>
          已同步
        </span>
        <SuccessIcon tone="success" aria-labelledby={labelId} />
      </div>
    </div>
  );
}
