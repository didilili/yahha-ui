import { useEffect, useState } from 'react';
import { Link, Text } from 'yahha-ui';

const readingList = [
  'Yahha UI 阅读清单',
  '',
  '1. 沿着河边，慢慢走',
  '2. 给周末留一页空白',
  '',
  '以上为 Yahha UI 原创示例手记。',
].join('\n');

export default function LinkDownload() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const address = URL.createObjectURL(
      new Blob([readingList], { type: 'text/plain;charset=utf-8' }),
    );
    // Browser-owned URLs are created and released with this instance, rather than during render.
    // oxlint-disable-next-line react/set-state-in-effect
    setUrl(address);
    return () => URL.revokeObjectURL(address);
  }, []);

  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: '65ch', minWidth: 0 }}>
      <Text>阅读清单</Text>
      <Text size="sm" tone="muted">
        TXT · UTF-8
      </Text>
      {url && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'baseline' }}>
          <Link href={url} download="yahha-reading-list.txt">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
              style={{ verticalAlign: 'text-bottom', marginInlineEnd: 4 }}
            >
              <path d="M7 3h7l4 4v14H6V3h1Zm7 0v5h4M9 12h6m-6 4h6" strokeLinejoin="round" />
            </svg>
            下载阅读清单（TXT）
          </Link>
          <Link href={url} external>
            在线阅读（新标签页）
          </Link>
        </div>
      )}
    </div>
  );
}
