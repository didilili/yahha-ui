import { useState } from 'react';
import { Button, Dialog, Select, ThemeProvider, type ThemeName } from 'yahha-ui';

const themes = [
  'pink',
  'chiikawa',
  'blue',
  'hachiware',
  'yellow',
  'usagi',
] as const satisfies readonly ThemeName[];

export function ThemeAliases() {
  const [openSample, setOpenSample] = useState<ThemeName | null>(null);
  const [theme, setTheme] = useState<ThemeName>('blue');
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<string | null>('first');
  const [accent, setAccent] = useState('#b9dcca');

  return (
    <main style={{ display: 'grid', gap: 16, maxWidth: 560, margin: '24px auto' }}>
      <h1>Theme alias consumer</h1>
      {themes.map((name) => (
        <ThemeProvider key={name} theme={name} className={`theme-alias-${name}`}>
          <Dialog
            open={openSample === name}
            onOpenChange={(next) => setOpenSample(next ? name : null)}
            title={`Theme alias ${name}`}
            closeLabel="Close theme alias dialog"
            trigger={<Button data-testid={`theme-alias-trigger-${name}`}>{name}</Button>}
          >
            <Button data-testid={`theme-alias-probe-${name}`}>Portalled {name} action</Button>
          </Dialog>
        </ThemeProvider>
      ))}
      <ThemeProvider
        theme={theme}
        tokens={{ accent, surface: '#faf5e8' }}
        className="theme-alias-runtime"
      >
        <output data-testid="theme-alias-spelling">{theme}</output>
        <output data-testid="theme-alias-value">{selection}</output>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Runtime theme alias dialog"
          closeLabel="Close runtime alias dialog"
          trigger={<Button>Open runtime alias dialog</Button>}
        >
          <Select
            label="Alias controlled choice"
            value={selection}
            onValueChange={setSelection}
            options={[
              { value: 'first', label: 'First alias choice' },
              { value: 'second', label: 'Second alias choice' },
            ]}
          />
          <Button
            onClick={() => setTheme((current) => (current === 'blue' ? 'hachiware' : 'blue'))}
          >
            Switch alias spelling
          </Button>
          <Button onClick={() => setAccent('#e0c9f2')}>Update alias tokens</Button>
          <Button data-testid="theme-alias-runtime-probe">Alias token probe</Button>
        </Dialog>
      </ThemeProvider>
    </main>
  );
}
