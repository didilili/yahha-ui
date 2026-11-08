import { Button, Surface, ThemeProvider, type ThemeTokens } from 'yahha-ui';

const tokens: ThemeTokens = { accent: '#d7eee5', accentHover: '#c2e1d4' };

export default function ThemeTokensExample() {
  return (
    <ThemeProvider theme="pink" tokens={tokens}>
      <Surface>
        <Button>自定义强调色</Button>
      </Surface>
    </ThemeProvider>
  );
}
