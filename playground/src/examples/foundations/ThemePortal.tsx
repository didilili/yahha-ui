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

export default function ThemePortal() {
  const [open, setOpen] = useState(false);

  return (
    <ThemeProvider theme="pink" tokens={tokens}>
      <Surface style={{ display: 'grid', gap: 20, maxWidth: 560 }}>
        <TextField label="订阅邮箱" placeholder="you@example.com" hint="每月一封更新。" />
        <Dialog
          open={open}
          onOpenChange={setOpen}
          trigger={<Button>查看主题弹窗</Button>}
          title="同一套主题颜色"
          description="每月一封阅读推荐，分享文章与书单。"
          footer={<Button onClick={() => setOpen(false)}>明白了</Button>}
        >
          <p>本例只预览订阅界面，不会发送邮件。</p>
        </Dialog>
      </Surface>
    </ThemeProvider>
  );
}
