import { useState } from 'react';
import { Button, Heading, Text, TextField, ThemeProvider } from 'yahha-ui';
import 'yahha-ui/style.css';
import './styles.css';

export default function App() {
  const [title, setTitle] = useState('河边散步');
  const [saved, setSaved] = useState(false);

  return (
    <ThemeProvider theme="pink" className="starter-page">
      <main className="starter-content">
        <header className="starter-intro">
          <Text size="sm" tone="muted">
            Yahha UI · 把可爱，搭进你的世界。
          </Text>
          <Heading level={1}>你的小站，从这里开始</Heading>
          <Text>给手记起个名字，再试试收藏。</Text>
        </header>
        <TextField
          label="手记标题"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          hint="输入标题时，下面的预览会一起更新。"
        />
        <Text>正在写：{title.trim() || '还没起名字的手记'}</Text>
        <div className="starter-action">
          <Button aria-pressed={saved} onClick={() => setSaved((value) => !value)}>
            收藏这篇手记
          </Button>
          <Text size="sm" role="status">
            {saved ? '已收藏。' : '尚未收藏。'}
          </Text>
        </div>
        <Text size="sm" tone="muted">
          标题与收藏只保留在本页，刷新后恢复。
        </Text>
      </main>
    </ThemeProvider>
  );
}
