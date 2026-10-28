<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Badge 状态标记

在文章标题、分类或阅读信息旁展示紧凑的静态标记。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Badge } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用简短文字展示分类、标签或当前状态，例如“随笔”“草稿”“已发布”。需要点击筛选或跳转的分类入口，使用按钮或链接。

<a id="examples"></a>

## 代码演示

<a id="badge-tones"></a>

### 标记类型、行内组合与长标签

比较普通、强调和成功标记，再展示正文行内组合与窄栏中的长标签。

[查看示例文件](../../playground/src/examples/foundations/BadgeTones.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/BadgeTones.tsx -->

```tsx
import { Badge, Text } from 'yahha-ui';

export default function BadgeTones() {
  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 20 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'start', gap: 20 }}>
        {(
          [
            { tone: 'neutral', label: '随笔' },
            { tone: 'accent', label: '阅读中' },
            { tone: 'success', label: '已读' },
          ] as const
        ).map(({ tone, label }) => (
          <div key={tone} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
            <Text size="sm" tone="muted">
              {tone === 'neutral' ? '普通' : tone === 'accent' ? '强调' : '成功'}
              {tone === 'neutral' ? '（默认）' : ''}
            </Text>
            <Badge tone={tone}>{label}</Badge>
          </div>
        ))}
      </div>
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
          长标签换行
        </Text>
        <Badge tone="success">本周已经整理完成、可以慢慢读的散步与阅读记录</Badge>
        <Badge tone="neutral">PersonalJournalWithAVeryLongUnbrokenCategoryName</Badge>
      </div>
    </div>
  );
}
```

<a id="badge-status"></a>

### 展示动态状态

操作由外部 Button 触发，状态文字由调用方更新。外层 role="status" 提供温和播报。

[查看示例文件](../../playground/src/examples/foundations/BadgeStatus.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/BadgeStatus.tsx -->

```tsx
import { useState } from 'react';
import { Badge, Button } from 'yahha-ui';

export default function BadgeStatus() {
  const [read, setRead] = useState(false);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
      <span role="status">
        <Badge tone={read ? 'success' : 'neutral'}>{read ? '已读' : '未读'}</Badge>
      </span>
      <Button variant="secondary" aria-pressed={read} onClick={() => setRead((value) => !value)}>
        标记为已读
      </Button>
    </div>
  );
}
```

<a id="design"></a>

## 用文字表达分类与状态

用“草稿”“已发布”等明确文案表达状态，颜色和小勾只作辅助。纸签适合短标签；长文案虽然可以换行，详细原因仍适合放在相邻正文中。

<a id="api"></a>

## API

### BadgeProps

| 参数                | 说明                                                                 | 类型                                 | 默认值      |
| ------------------- | -------------------------------------------------------------------- | ------------------------------------ | ----------- |
| `tone`              | 标记的语义颜色。success 不随角色主题改变。                           | `'neutral' \| 'accent' \| 'success'` | `'neutral'` |
| `children`          | 状态或分类内容，应能独立表达含义。                                   | `ReactNode`                          | —           |
| `className / style` | 作用于根 span。                                                      | `string / CSSProperties`             | —           |
| `ref`               | 指向根 span。                                                        | `Ref<HTMLSpanElement>`               | —           |
| `其余原生属性`      | 透传 span 属性，包括 aria-\*、data-\* 和事件；不会自动增加交互语义。 | `ComponentPropsWithRef<'span'>`      | —           |

<a id="accessibility"></a>

## 更新标记与状态播报

分类和既有状态通常直接显示即可。需要通知保存、发布等操作结果时，可像示例一样由外层 role="status" 承担温和播报；Badge 本身不会自动播报，同一结果只保留一处播报。

<a id="related"></a>

## 相关组件

- [Text 正文](text.md)：为段落提供统一的字号、行高和语义文字颜色。
- [Alert 静态提示](alert.md)：持续展示阅读说明、完成结果或需要处理的问题。
