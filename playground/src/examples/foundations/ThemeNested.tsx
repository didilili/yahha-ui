import { Button, Surface, ThemeProvider, type ThemeTokens } from 'yahha-ui';

const outerTokens: ThemeTokens = { accent: '#d7eee5', line: '#6e9788' };

export default function ThemeNested() {
  return (
    <ThemeProvider theme="chiikawa" tokens={outerTokens}>
      <Surface style={{ display: 'grid', gap: 20 }}>
        <div>
          <p style={{ marginTop: 0 }}>外层：吉伊主题，加上自定义绿色。</p>
          <Button>外层颜色</Button>
        </div>
        <ThemeProvider theme="usagi">
          <Surface>
            <p style={{ marginTop: 0 }}>内层：从乌萨奇主题默认值开始，不合并外层 tokens。</p>
            <Button>内层颜色</Button>
          </Surface>
        </ThemeProvider>
      </Surface>
    </ThemeProvider>
  );
}
