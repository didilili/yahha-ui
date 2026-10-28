import { Link, Text } from 'yahha-ui';

export default function LinkExample() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Text>
        <Link href="#/guides/getting-started">阅读入门指南</Link>，继续了解组件的使用方式。
      </Text>
      <Text>
        <Link href="https://example.com" external>
          example.com 占位页面（新窗口）
        </Link>
      </Text>
      <Text>
        周末空下来的时候，可以读读
        <Link href="https://example.com" external>
          example.com 占位页面：适合周末慢慢阅读的散步与书单手记（新窗口）
        </Link>
        。
      </Text>
      <Text size="sm" tone="muted">
        <Link href="https://example.com/#PersonalJournalWithAVeryLongUnbrokenAddress" external>
          https://example.com/#PersonalJournalWithAVeryLongUnbrokenAddress（新窗口）
        </Link>
      </Text>
    </div>
  );
}
