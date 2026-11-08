import { Button, Text, Tooltip } from 'yahha-ui';

export default function TooltipAppearance() {
  return (
    <div style={{ display: 'grid', gap: 32, paddingBlock: 48 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {(
          [
            { side: 'top', label: '上方（默认）' },
            { side: 'bottom', label: '下方' },
            { side: 'left', label: '左侧' },
            { side: 'right', label: '右侧' },
          ] as const
        ).map(({ side, label }) => (
          <Tooltip
            key={side}
            side={side}
            content="补充阅读说明"
            trigger={<Button variant="secondary">{label}</Button>}
          />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, paddingBlockStart: 32 }}>
        {[true, false].map((showArrow) => (
          <div key={String(showArrow)} style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
            <Text size="sm" tone="muted">
              {showArrow ? '有箭头（默认）' : '无箭头'}
            </Text>
            <Tooltip
              defaultOpen
              showArrow={showArrow}
              content="补充阅读说明"
              trigger={<Button variant="secondary">阅读说明</Button>}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
