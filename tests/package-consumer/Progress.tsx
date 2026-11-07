import { useState } from 'react';
import { Button, Progress, Spinner, ThemeProvider, type ThemeName } from 'yahha-ui';

export function ProgressConsumer() {
  const [theme, setTheme] = useState<ThemeName>('pink');
  const [value, setValue] = useState(60);
  const [unknown, setUnknown] = useState(false);
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
  return (
    <ThemeProvider theme={theme}>
      <h1>Progress package consumer</h1>
      <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
        <label>
          Progress theme{' '}
          <select value={theme} onChange={(event) => setTheme(event.target.value as ThemeName)}>
            <option value="pink">pink</option>
            <option value="blue">blue</option>
            <option value="yellow">yellow</option>
          </select>
        </label>
        <label>
          Progress value{' '}
          <input
            type="number"
            value={value}
            style={{ maxWidth: '100%', boxSizing: 'border-box' }}
            onChange={(event) => setValue(Number(event.target.value))}
          />
        </label>
        <Button onClick={() => setUnknown((current) => !current)} aria-pressed={unknown}>
          Toggle unknown progress
        </Button>
        <Button onClick={() => setDirection((current) => (current === 'ltr' ? 'rtl' : 'ltr'))}>
          Toggle progress direction
        </Button>
      </div>
      <div
        dir={direction}
        data-testid="progress-direction"
        style={{ maxWidth: 360, display: 'grid', gap: 20 }}
      >
        <Progress
          label="Reading progress with a long title that wraps naturally on small screens"
          value={unknown ? null : value}
          data-testid="progress-plain"
        />
        <Progress
          label="Reading progress with a long title that wraps naturally on small screens"
          value={unknown ? null : value}
          appearance="bookmark"
          data-testid="progress-bookmark"
          ref={(node) => {
            if (node) node.dataset.refChecked = node.tagName;
          }}
        />
        <Progress
          label="Read articles"
          value={2}
          max={3}
          valueText="2 / 3 read"
          appearance="bookmark"
          data-testid="progress-count"
        />
        {[0, 1, 99.9, 100].map((amount) => (
          <Progress
            key={amount}
            label={`Case ${amount}`}
            value={amount}
            appearance="bookmark"
            data-testid={`progress-case-${amount}`}
          />
        ))}
        <Progress label="Unknown progress" appearance="bookmark" data-testid="progress-unknown" />
        <Progress
          label="Visible upload label"
          value={35}
          aria-label="Custom accessible upload"
          data-testid="progress-named"
        />
        <span id="progress-label-name">Externally named progress</span>
        <Progress
          label="Visible reading label"
          value={35}
          aria-label="Overridden aria label"
          aria-labelledby="progress-label-name"
          data-testid="progress-labelled"
        />
        <ThemeProvider
          theme="pink"
          tokens={{ line: '#425c52', accent: '#cce6dc', accentSoft: '#f4fbf7' }}
        >
          <Progress
            label="Custom tokens"
            value={55}
            appearance="bookmark"
            data-testid="progress-custom"
          />
        </ThemeProvider>
        <Progress
          label="."
          aria-label="Very narrow progress"
          value={1}
          valueText=""
          appearance="bookmark"
          style={{ inlineSize: 16 }}
          data-testid="progress-narrow"
        />
        <div
          data-testid="spinner-variants"
          style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}
        >
          {(['dots', 'biscuit'] as const).flatMap((variant) =>
            (['sm', 'md', 'lg'] as const).map((size) => (
              <Spinner
                key={`${variant}-${size}`}
                variant={variant}
                size={size}
                label={`${variant} ${size} waiting`}
                data-testid={`progress-spinner-${variant}-${size}`}
              />
            )),
          )}
        </div>
      </div>
      <Button data-testid="progress-focus-after">After progress samples</Button>
    </ThemeProvider>
  );
}
