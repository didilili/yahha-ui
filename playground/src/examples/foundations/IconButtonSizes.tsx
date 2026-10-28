import { IconButton } from 'yahha-ui';

function Star() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path
        d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function IconButtonSizes() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'grid', gap: 12 }}>
        <span>尺寸</span>
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
              <IconButton size={size} aria-label={`${size} 尺寸收藏样本`}>
                <Star />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        <span>强调程度</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
            <div key={variant} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
              <span>
                {variant === 'primary' ? '主要' : variant === 'secondary' ? '次要' : '文字'}
              </span>
              <IconButton variant={variant} aria-label={`${variant} 变体收藏样本`}>
                <Star />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        <span>可用与禁用</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {[false, true].map((disabled) => (
            <div key={String(disabled)} style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
              <span>{disabled ? '禁用' : '可用'}</span>
              <IconButton
                disabled={disabled}
                aria-label={disabled ? '禁用收藏样本' : '可用收藏样本'}
              >
                <Star />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
