import { Button, Surface, ThemeProvider, type ThemeTokens } from 'yahha-ui';

const outerTokens: ThemeTokens = { accent: '#d7eee5', line: '#6e9788' };

export default function ThemeNested() {
  return (
    <ThemeProvider theme="pink" tokens={outerTokens}>
      <Surface style={{ display: 'grid', gap: 20 }}>
        <div>
          <p style={{ marginTop: 0 }}>外层：粉色预设，自定义绿色。</p>
          <Button>外层按钮外观</Button>
        </div>
        <ThemeProvider theme="yellow">
          <Surface>
            <p style={{ marginTop: 0 }}>内层：浅黄预设。</p>
            <Button>内层按钮外观</Button>
          </Surface>
        </ThemeProvider>
      </Surface>
    </ThemeProvider>
  );
}
