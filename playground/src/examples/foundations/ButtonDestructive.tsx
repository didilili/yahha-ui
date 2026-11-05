import { Button } from 'yahha-ui';

export default function ButtonDestructive() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
        <div key={variant} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>{variant === 'primary' ? '主要' : variant === 'secondary' ? '次要' : '文字'}</span>
          <Button variant={variant} destructive>
            删除草稿
          </Button>
        </div>
      ))}
    </div>
  );
}
