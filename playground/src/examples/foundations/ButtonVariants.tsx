import { Button } from 'yahha-ui';

export default function ButtonVariants() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
          <div key={variant} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
            <span>
              {variant === 'primary' ? '主要' : variant === 'secondary' ? '次要' : '文字'}
            </span>
            <Button variant={variant}>保存草稿</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
