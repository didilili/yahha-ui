import { Badge, Button, Surface, ThemeProvider, type ThemeName } from 'yahha-ui';

const themes: { value: ThemeName; label: string }[] = [
  { value: 'chiikawa', label: '吉伊 · chiikawa' },
  { value: 'hachiware', label: '小八 · hachiware' },
  { value: 'usagi', label: '乌萨奇 · usagi' },
];

export default function ThemeVariants() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
          gap: 16,
        }}
      >
        {themes.map(({ value, label }) => (
          <ThemeProvider key={value} theme={value}>
            <Surface>
              <p style={{ marginTop: 0 }}>{label}</p>
              <div style={{ display: 'grid', justifyItems: 'start', gap: 16 }}>
                <Badge tone="accent">主题标记</Badge>
                <Button>主要按钮外观</Button>
              </div>
            </Surface>
          </ThemeProvider>
        ))}
      </div>
    </div>
  );
}
