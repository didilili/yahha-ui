import { Button } from 'yahha-ui';

export default function ButtonSizes() {
  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
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
            <Button size={size}>保存草稿</Button>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 12, width: 'min(100%, 240px)' }}>
        <span>全宽与长文案换行 · 240px 窄栏</span>
        <Button
          variant="secondary"
          startIcon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          }
          endIcon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          style={{ width: '100%' }}
        >
          将这篇周末散步记录加入稍后阅读
        </Button>
      </div>
    </div>
  );
}
