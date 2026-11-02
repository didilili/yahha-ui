import { useState } from 'react';
import { SelectionContract } from './SelectionContract.js';
import {
  Badge,
  Button,
  IconButton,
  Select,
  Surface,
  Text,
  TextField,
  Textarea,
  ThemeProvider,
  type ThemeName,
} from 'yahha-ui';

const themes: ThemeName[] = ['pink', 'blue', 'yellow'];
const nativeDates = [
  { type: 'date', value: '2026-10-28' },
  { type: 'time', value: '10:30' },
  { type: 'datetime-local', value: '2026-10-28T10:30' },
  { type: 'month', value: '2026-10' },
  { type: 'week', value: '2026-W44' },
] as const;
const options = [
  { value: 'first', label: 'First design option' },
  { value: 'next', label: 'Next design option' },
  { value: 'disabled', label: 'Disabled design option', disabled: true },
];
const longLabel =
  'A long selected option must wrap naturally and keep every line readable. '.repeat(4);

const longOptions = Array.from({ length: 8 }, (_, index) => ({
  value: `long-${index + 1}`,
  label: `Long menu option ${index + 1}. ${'A longer label wraps across several lines and stays separate from the next choice. '.repeat(2)}`,
}));

function DesignGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 4v16M4 12h16" strokeLinecap="round" />
    </svg>
  );
}

export function DesignContract() {
  const [loading, setLoading] = useState(true);
  return (
    <main>
      <h1>Installed design contract</h1>
      <Button onClick={() => setLoading((value) => !value)}>Toggle design loading</Button>
      {themes.map((theme) => (
        <ThemeProvider key={theme} theme={theme}>
          <section
            data-design-theme={theme}
            style={{ display: 'grid', gap: 16, minWidth: 0, maxWidth: 420, margin: '24px auto' }}
          >
            <Text data-testid="design-body">Default body copy remains readable.</Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'start', gap: 12 }}>
              <Button data-testid="design-button">Default</Button>
              <Button data-testid="design-button-disabled" disabled>
                Disabled
              </Button>
              <Button data-testid="design-button-loading" loading={loading}>
                Loading
              </Button>
              <Button
                data-testid="design-button-sm"
                size="sm"
                startIcon={
                  <svg aria-hidden="true" viewBox="0 0 16 16">
                    <path d="M2 8h12" />
                  </svg>
                }
              >
                Small
              </Button>
              <Button data-testid="design-button-lg" size="lg">
                Large
              </Button>
              {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
                <Button
                  key={variant}
                  data-testid={`design-pressed-${variant}`}
                  variant={variant}
                  aria-pressed
                >
                  Selected {variant}
                </Button>
              ))}
              <IconButton data-testid="design-icon" aria-label="Design icon">
                <DesignGlyph />
              </IconButton>
              <IconButton
                data-testid="design-icon-loading"
                aria-label="Loading design icon"
                loading={loading}
              >
                <DesignGlyph />
              </IconButton>
              {(['sm', 'md', 'lg'] as const).map((size) => (
                <IconButton
                  key={size}
                  size={size}
                  data-testid={`design-icon-${size}`}
                  aria-label={`Design ${size} icon`}
                >
                  <DesignGlyph />
                </IconButton>
              ))}
              {(['sm', 'md', 'lg'] as const).map((size) => (
                <Button
                  key={size}
                  size={size}
                  data-testid={`design-button-icons-${size}`}
                  startIcon={<DesignGlyph />}
                  endIcon={<DesignGlyph />}
                >
                  With icons
                </Button>
              ))}
              <Button data-testid="design-button-long" startIcon={<DesignGlyph />}>
                {'A longer action keeps its complete label readable. '.repeat(3)}
              </Button>
            </div>
            <Surface data-testid="design-surface" style={{ display: 'grid', gap: 12 }}>
              <Text>Paper holds the content; controls hold the actions.</Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Badge data-testid="design-badge-neutral">Reading note</Badge>
                <Badge data-testid="design-badge-accent" tone="accent">
                  Current category
                </Badge>
                <Badge data-testid="design-badge-success" tone="success">
                  Finished reading
                </Badge>
              </div>
            </Surface>
            <TextField
              label="Normal design field"
              data-testid="design-field-normal"
              defaultValue="Normal"
              leading={<DesignGlyph />}
              classNames={{ leading: 'design-leading-normal' }}
            />
            <TextField
              label="Read only design field"
              data-testid="design-field-readonly"
              defaultValue="Read only"
              readOnly
            />
            <TextField
              label="Invalid design field"
              data-testid="design-field-error"
              defaultValue="Invalid"
              error="A clear error"
              hint="A clear hint"
              leading={<DesignGlyph />}
              classNames={{
                leading: 'design-leading-error',
                label: 'design-field-error-label',
                hint: 'design-field-error-hint',
                error: 'design-field-error-message',
              }}
            />
            <TextField
              label="Disabled design field"
              data-testid="design-field-disabled"
              defaultValue="Disabled"
              disabled
            />
            <form
              data-testid="design-native-dates"
              style={{ display: 'grid', gap: 16 }}
              onSubmit={(event) => event.preventDefault()}
            >
              {nativeDates.map(({ type, value }) => (
                <TextField
                  key={type}
                  type={type}
                  name={type}
                  label={`Native ${type} field`}
                  data-testid={`design-native-${type}`}
                  defaultValue={value}
                  required
                />
              ))}
              <Button type="reset" variant="secondary">
                Reset native dates
              </Button>
            </form>
            {(['normal', 'readonly', 'error', 'disabled'] as const).map((state) => (
              <Textarea
                key={state}
                label={`Invalid design area ${state}`}
                rows={1}
                defaultValue="A small reading note"
                data-testid={`design-area-${state}`}
                readOnly={state === 'readonly'}
                disabled={state === 'disabled'}
                hint={state === 'error' ? 'A clear hint' : undefined}
                error={state === 'error' ? 'A clear error' : undefined}
                classNames={
                  state === 'error'
                    ? {
                        label: 'design-area-error-label',
                        hint: 'design-area-error-hint',
                        error: 'design-area-error-message',
                      }
                    : undefined
                }
              />
            ))}
            <Textarea
              label="Multiline reading note"
              data-testid="design-area-multiline"
              rows={4}
              defaultValue={'给今天留一点空白。\n把喜欢的小事写下来。'}
            />
            <Select
              label="Normal design select"
              data-testid="design-select-normal"
              options={options}
              defaultValue="first"
            />
            <Select
              label="Read only design select"
              data-testid="design-select-readonly"
              options={options}
              defaultValue="first"
              readOnly
            />
            <Select
              label="Invalid design select"
              data-testid="design-select-error"
              options={options}
              defaultValue="first"
              error="A clear error"
            />
            <Select
              label="Disabled design select"
              data-testid="design-select-disabled"
              options={options}
              defaultValue="first"
              disabled
            />
            <Select
              label="Long design menu"
              data-testid="design-select-long-menu"
              options={longOptions}
              defaultValue="long-1"
            />
            <Select
              label="Long design select"
              data-testid="design-select-long"
              options={[{ value: 'long', label: longLabel }]}
              defaultValue="long"
            />
            <SelectionContract idPrefix={theme} />
          </section>
        </ThemeProvider>
      ))}
    </main>
  );
}
