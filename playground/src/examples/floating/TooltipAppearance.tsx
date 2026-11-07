import { Button, Text, Tooltip } from 'yahha-ui';

export default function TooltipAppearance() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, paddingBlock: 64 }}>
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
  );
}
