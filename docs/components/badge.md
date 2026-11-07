<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Badge 状态标记

用于展示分类、标签或当前状态的静态标记。

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

### 标记类型与组合

对比三种标记、行内组合和长标签换行。

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

<a id="badge-appearance"></a>

### 普通与印章

对比相同语义颜色的普通标记与印章；只有成功色印章附带小勾。

[查看示例文件](../../playground/src/examples/foundations/BadgeAppearance.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

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

<a id="integration"></a>

## 进阶用法

修改摘要后，上一次检查结果会清除；再次检查时，分类与结果分别显示。 本例只检查摘要是否为空，校验和预览由示例管理，不会保存或发布内容。

<a id="badge-status"></a>

### 表单校验状态组合

根据摘要检查结果切换标记。

[查看示例文件](../../playground/src/examples/foundations/BadgeStatus.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/foundations/BadgeStatus.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Badge, Button, Heading, Surface, Text, TextField } from 'yahha-ui';

type Phase = 'unchecked' | 'editing' | 'missing' | 'checked';
const labels = {
  unchecked: '未检查',
  editing: '待检查',
  missing: '需补充',
  checked: '已检查',
};

export default function BadgeStatus() {
  const [phase, setPhase] = useState<Phase>('unchecked');
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tone = phase === 'checked' ? 'success' : phase === 'editing' ? 'accent' : 'neutral';

  return (
    <Surface style={{ display: 'grid', gap: 24, minWidth: 0, maxWidth: 560 }}>
      <header style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <Badge>生活手记</Badge>
        <Heading level={3}>沿着河边，慢慢走</Heading>
      </header>
      <form
        noValidate
        style={{ display: 'grid', gap: 16, minWidth: 0 }}
        onInput={() => {
          setPhase('editing');
          setPreview(null);
        }}
        onReset={() => {
          setPhase('unchecked');
          setPreview(null);
        }}
        onSubmit={(event) => {
          event.preventDefault();
          const summary = String(new FormData(event.currentTarget).get('summary') ?? '');
          if (!summary.trim()) {
            setPhase('missing');
            setPreview(null);
            inputRef.current?.focus();
            return;
          }
          setPhase('checked');
          setPreview(summary);
        }}
      >
        <TextField
          ref={inputRef}
          label="手记摘要"
          name="summary"
          defaultValue=""
          required
          hint="必填，写下一两句手记的内容。"
          error={phase === 'missing' ? '请先填写摘要。' : undefined}
        />
        <div>
          <Badge tone={tone}>{labels[phase]}</Badge>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Button type="submit">检查摘要</Button>
          <Button type="reset" variant="secondary">
            恢复示例
          </Button>
        </div>
        <Text role="status" size="sm" tone="muted">
          {phase === 'checked' ? '摘要检查通过，预览已更新；内容未保存或发布。' : ''}
        </Text>
        {preview !== null && (
          <section aria-label="摘要预览" style={{ whiteSpace: 'pre-wrap' }}>
            <Text>{preview}</Text>
          </section>
        )}
      </form>
    </Surface>
  );
}
```

<a id="design"></a>

## 用文字表达分类与状态

用“草稿”“已发布”等明确文案表达状态。默认使用普通实线标记，success 保留绿色语义；appearance="stamp" 增加虚线轮廓，仅 success 印章附带辅助小勾。标记适合短标签；长文案虽然可以换行，详细原因仍适合放在相邻正文中。

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

<a id="accessibility"></a>

## 更新标记与状态播报

分类和既有状态通常直接显示即可。需要通知检查等操作结果时，可像示例一样由外层 role="status" 承担温和播报；Badge 本身不会自动播报，同一结果只保留一处播报。

<a id="related"></a>

## 相关组件

- [Text 正文](text.md)：用于正文、摘要和辅助说明，统一字号、行高与语义颜色。
- [Alert 提示条](alert.md)：用于页面内持续显示的信息、结果、警告或错误提示。
