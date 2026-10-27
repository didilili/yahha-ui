import { Button } from 'yahha-ui';

export default function ButtonSizes() {
  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
        <Button size="sm">小号 sm · 36px</Button>
        <Button size="md">中号 md · 44px</Button>
        <Button size="lg">大号 lg · 52px</Button>
      </div>
      <div style={{ display: 'grid', gap: 12, width: 'min(100%, 240px)' }}>
        <span>长操作名称随内容换行，保留完整文字。</span>
        <Button
          variant="secondary"
          startIcon={<span>＋</span>}
          endIcon={<span>→</span>}
          style={{ width: '100%' }}
        >
          将这篇周末散步记录加入稍后阅读
        </Button>
      </div>
    </div>
  );
}
