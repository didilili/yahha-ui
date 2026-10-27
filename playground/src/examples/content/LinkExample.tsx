import { Link, Text } from 'yahha-ui';

export default function LinkExample() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Text>
        <Link href="#/guides/getting-started">阅读入门指南</Link>，继续了解组件的使用方式。
      </Text>
      <Text>
        <Link href="https://example.com" external>
          示例作者主页（新窗口）
        </Link>
      </Text>
      <Text>
        参考链接也可以放在连续的正文中，例如
        <Link href="https://example.com" external>
          一段较长的链接文字，用来观察正文中的自然换行（新窗口）
        </Link>
        。Tab 聚焦时保持可见轮廓，Enter 沿用浏览器导航。
      </Text>
      <Text size="sm" tone="muted">
        <Link href="https://example.com/#PersonalJournalWithAVeryLongUnbrokenAddress" external>
          https://example.com/#PersonalJournalWithAVeryLongUnbrokenAddress
        </Link>
      </Text>
    </div>
  );
}
