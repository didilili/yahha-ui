import { Button } from 'yahha-ui';

export default function ButtonAppearance() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
      {(['default', 'soft'] as const).map((appearance) => (
        <div key={appearance} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>{appearance === 'default' ? '常规（默认）' : '软团'}</span>
          <Button appearance={appearance}>打个招呼</Button>
        </div>
      ))}
    </div>
  );
}
