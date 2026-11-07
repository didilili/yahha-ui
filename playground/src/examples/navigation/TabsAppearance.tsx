import { Tabs, Text } from 'yahha-ui';

const items = [
  { value: 'notes', label: '日常随笔', content: '走到桥边才发现，手里还攥着面包店的小票。' },
  { value: 'photos', label: '窗边相册', content: '雨停之后，书页上落着一小片阳光。' },
];

export default function TabsAppearance() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
        gap: 24,
      }}
    >
      {(['default', 'ink'] as const).map((appearance) => (
        <div
          key={appearance}
          style={{ display: 'grid', alignContent: 'start', gap: 12, minWidth: 0 }}
        >
          <Text size="sm" tone="muted">
            {appearance === 'default' ? '普通（默认）' : '墨线'}
          </Text>
          <Tabs
            appearance={appearance}
            label={appearance === 'default' ? '普通栏目' : '墨线栏目'}
            items={items}
          />
        </div>
      ))}
    </div>
  );
}
