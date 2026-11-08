import { SearchIcon } from 'yahha-ui';

export default function IconSizes() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <div key={size} style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
            <span>{size}</span>
            <SearchIcon size={size} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
        {(
          [
            ['default', '主要'],
            ['muted', '次要'],
            ['accent', '主题色'],
          ] as const
        ).map(([tone, label]) => (
          <div key={tone} style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
            <span>{label}</span>
            <SearchIcon tone={tone} />
          </div>
        ))}
      </div>
    </div>
  );
}
