import { Button } from 'yahha-ui';

export default function ButtonIcons() {
  const icon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>前置图标</span>
          <Button startIcon={icon}>添加收藏</Button>
        </div>
        <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
          <span>后置图标</span>
          <Button endIcon={icon}>添加收藏</Button>
        </div>
      </div>
    </div>
  );
}
