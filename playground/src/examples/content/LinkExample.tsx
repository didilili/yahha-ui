import { Link, Text } from 'yahha-ui';

export default function LinkExample() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Text>
        <Link href="#/guides/getting-started">阅读入门指南</Link>，继续了解组件的使用方式。
      </Text>
      <Text>
        链接的原生用法见
        <Link
          href="https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/a"
          external
        >
          MDN 链接元素（新标签页打开）
        </Link>
        。
      </Text>
      <Text size="sm" tone="muted" style={{ maxWidth: '32ch' }}>
        <Link
          href="https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/a"
          external
        >
          https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/a（新标签页打开）
        </Link>
      </Text>
    </div>
  );
}
