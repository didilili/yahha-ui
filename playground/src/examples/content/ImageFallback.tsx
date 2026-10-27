import { useId, useState } from 'react';
import { Button, Image, Text } from 'yahha-ui';

const cover =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="300"><rect width="500" height="300" fill="#d7eaf5"/><text x="250" y="160" text-anchor="middle" font-size="30" fill="#462e31">图片已恢复</text></svg>',
  );

export default function ImageFallback() {
  const [recovered, setRecovered] = useState(false);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const statusId = useId();
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 400 }}>
      <figure style={{ margin: 0, display: 'grid', gap: 12 }}>
        <Image
          src={recovered ? cover : 'data:text/plain,unavailable'}
          alt="示例文章封面"
          aspectRatio="5 / 3"
          fallback="封面暂不可用，可以继续阅读正文。"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
        <figcaption>
          <Text size="sm" tone="muted">
            用 aspectRatio 预留 5:3 的区域，加载、失败和恢复使用相同比例。
          </Text>
        </figcaption>
      </figure>
      <div style={{ minHeight: '3.6em' }}>
        <Text id={statusId} role="status" size="sm" tone="muted">
          {status === 'loading'
            ? '正在加载图片…'
            : status === 'loaded'
              ? '图片已恢复，正文位置保持不变。'
              : '图片暂不可用，正文仍可继续阅读。'}
        </Text>
      </div>
      <div>
        <Button
          variant="secondary"
          aria-describedby={statusId}
          onClick={() => {
            setStatus('loading');
            setRecovered(!recovered);
          }}
        >
          {recovered ? '再次模拟失败' : '恢复图片'}
        </Button>
      </div>
    </div>
  );
}
