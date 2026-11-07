import { Button } from 'yahha-ui';

export default function ButtonAppearance() {
  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>常规</span>
          <Button>打个招呼</Button>
        </div>
        <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>软团</span>
          <Button appearance="soft">打个招呼</Button>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
        {(
          [
            ['sm', '小号'],
            ['md', '中号'],
            ['lg', '大号'],
          ] as const
        ).map(([size, label]) => (
          <div key={size} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
            <span>
              {label} {size}
            </span>
            <Button appearance="soft" size={size}>
              打个招呼
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
