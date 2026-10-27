import { useState } from 'react';
import { Button, Dialog, Surface, TextField, ThemeProvider, type ThemeTokens } from 'yahha-ui';

const tokens: ThemeTokens = {
  ink: '#243b40',
  muted: '#566b70',
  accent: '#d7eee5',
  accentHover: '#c2e1d4',
  accentSoft: '#f1f9f5',
  line: '#6e9788',
  focus: '#326a59',
  surface: '#fbfefa',
  fieldBackground: '#ffffff',
  error: '#9b374c',
};

export default function ThemeTokensExample() {
  const [open, setOpen] = useState(false);

  return (
    <ThemeProvider theme="chiikawa" tokens={tokens}>
      <Surface style={{ display: 'grid', gap: 20, maxWidth: 560 }}>
        <TextField label="订阅邮箱" placeholder="you@example.com" hint="每月一封更新。" />
        <Dialog
          open={open}
          onOpenChange={setOpen}
          trigger={<Button>查看主题弹窗</Button>}
          title="同一套主题颜色"
          description="弹窗挂载到 Portal 后，仍使用这个 Provider 的 tokens。"
          footer={<Button onClick={() => setOpen(false)}>明白了</Button>}
        >
          <p>使用 tokens 传入的颜色会随主题上下文进入弹窗，无需复制页面布局样式。</p>
        </Dialog>
      </Surface>
    </ThemeProvider>
  );
}
