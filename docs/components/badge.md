<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Badge 状态标记

用于展示分类、标签或当前状态的静态标记。

[安装与接入](../../README.md#安装与接入) · [接入示例](../guides/examples.md)

```tsx
import { Badge } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

Badge 是静态标签与状态标记，用途近似其他组件库的 Tag / Chip，例如“随笔”“草稿”“已发布”。它不提供通知计数或附着角标；需要点击筛选或跳转的分类入口，使用按钮或链接。

<a id="examples"></a>

## 代码演示

<a id="badge-tones"></a>

### 语义颜色

使用相同文字对比普通、强调和成功三种颜色。

[查看示例文件](../../playground/src/examples/foundations/BadgeTones.tsx)

<!-- example-source: playground/src/examples/foundations/BadgeTones.tsx -->

```tsx
import { Badge, Text } from 'yahha-ui';

export default function BadgeTones() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'start', gap: 20 }}>
      {(
        [
          { tone: 'neutral', label: '普通（默认）' },
          { tone: 'accent', label: '强调' },
          { tone: 'success', label: '成功' },
        ] as const
      ).map(({ tone, label }) => (
        <div key={tone} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <Text size="sm" tone="muted">
            {label}
          </Text>
          <Badge tone={tone}>已读</Badge>
        </div>
      ))}
    </div>
  );
}
```

<a id="badge-content"></a>

### 行内与长文本

分别查看正文中的行内标记，以及中文和连续长词的换行。

[查看示例文件](../../playground/src/examples/foundations/BadgeContent.tsx)

<!-- example-source: playground/src/examples/foundations/BadgeContent.tsx -->

```tsx
import { Badge, Text } from 'yahha-ui';

export default function BadgeContent() {
  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 24 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <Text size="sm" tone="muted">
          行内组合
        </Text>
        <Text>
          这篇 <Badge tone="accent">生活手记</Badge> 记录了一次午后散步。
        </Text>
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 12, maxWidth: 220 }}>
        <Text size="sm" tone="muted">
          长文本换行
        </Text>
        <Badge tone="success">本周已经整理完成、可以慢慢读的散步与阅读记录</Badge>
        <Badge tone="neutral">PersonalJournalWithAVeryLongUnbrokenCategoryName</Badge>
      </div>
    </div>
  );
}
```

<a id="badge-appearance"></a>

### 普通与印章

对比相同语义颜色的普通标记与印章；只有成功色印章附带小勾。

[查看示例文件](../../playground/src/examples/foundations/BadgeAppearance.tsx)

<!-- example-source: playground/src/examples/foundations/BadgeAppearance.tsx -->

```tsx
import { Badge, Text } from 'yahha-ui';

export default function BadgeAppearance() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
        gap: 24,
      }}
    >
      {(['default', 'stamp'] as const).map((appearance) => (
        <div
          key={appearance}
          style={{ display: 'grid', justifyItems: 'start', gap: 12, minWidth: 0 }}
        >
          <Text size="sm" tone="muted">
            {appearance === 'default' ? '普通（默认）' : '印章'}
          </Text>
          <Badge appearance={appearance}>随笔</Badge>
          <Badge appearance={appearance} tone="accent">
            阅读中
          </Badge>
          <Badge appearance={appearance} tone="success">
            已读
          </Badge>
        </div>
      ))}
    </div>
  );
}
```

<a id="design"></a>

## 用文字表达分类与状态

用“草稿”“已发布”等明确文案表达状态。默认使用普通实线标记，success 保留绿色语义；appearance="stamp" 增加虚线轮廓，仅 success 印章附带辅助小勾。标记适合短标签；长文案虽然可以换行，详细原因仍适合放在相邻正文中。

<a id="accessibility"></a>

## 更新标记与状态播报

分类和既有状态通常直接显示即可。需要通知检查等操作结果时，由外层 role="status" 承担温和播报；Badge 本身不会自动播报，同一结果只保留一处播报。完整表单流程见[表单校验与状态摘要](../recipes/interactions.md#badge-status)。

<a id="api"></a>

## API

### BadgeProps

| 属性                | 说明                                                                     | 类型                                 | 默认值      |
| ------------------- | ------------------------------------------------------------------------ | ------------------------------------ | ----------- |
| `appearance`        | 普通实线标记或虚线印章；印章可搭配任意 tone，只有 success 印章显示小勾。 | `'default' \| 'stamp'`               | `'default'` |
| `tone`              | 标记的语义颜色。success 不随配色预设改变。                               | `'neutral' \| 'accent' \| 'success'` | `'neutral'` |
| `children`          | 状态或分类内容，应能独立表达含义。                                       | `ReactNode`                          | —           |
| `className / style` | 作用于根 span。                                                          | `string / CSSProperties`             | —           |
| `ref`               | 指向根 span。                                                            | `Ref<HTMLSpanElement>`               | —           |
| `其余原生属性`      | 透传 span 属性，包括 aria-\*、data-\* 和事件；不会自动增加交互语义。     | `ComponentPropsWithRef<'span'>`      | —           |

<a id="related"></a>

## 相关组件

- [Text 段落正文](text.md)：固定使用 p 元素的段落正文，统一字号、行高与语义颜色。
- [Alert 提示条](alert.md)：用于页面内持续显示的信息、结果、警告或错误提示。
