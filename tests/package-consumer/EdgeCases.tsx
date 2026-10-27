import { useRef, useState } from 'react';
import {
  Alert,
  Accordion,
  Avatar,
  Badge,
  Button,
  Dialog,
  EmptyState,
  IconButton,
  SegmentedControl,
  Select,
  Skeleton,
  Spinner,
  Surface,
  Tabs,
  TextField,
  ThemeProvider,
  Toast,
  type ThemeName,
} from 'yahha-ui';
import './edge-cases.css';

const longWord = 'https://example.com/' + 'W'.repeat(160);

/** Installed-package fixtures, deliberately isolated from the public playground. */
export function EdgeCases() {
  const [theme, setTheme] = useState<ThemeName>('chiikawa');
  const [choice, setChoice] = useState<'first' | 'disabled' | 'last'>('first');
  const [open, setOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(true);
  const [fieldValue, setFieldValue] = useState('initial');
  const [forcedPressed, setForcedPressed] = useState(true);
  const [forcedLoading, setForcedLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [externalFormVersion, setExternalFormVersion] = useState<number | null>(null);
  const [multiplePanels, setMultiplePanels] = useState(true);
  const [avatarSource, setAvatarSource] = useState<string>();

  return (
    <ThemeProvider theme={theme}>
      <main className="edge-cases">
        <h1>Component edge cases</h1>
        <label>
          Form preview theme
          <select
            aria-label="Form preview theme"
            value={theme}
            onChange={(event) => setTheme(event.target.value as ThemeName)}
          >
            <option value="chiikawa">chiikawa</option>
            <option value="hachiware">hachiware</option>
            <option value="usagi">usagi</option>
          </select>
        </label>
        <form
          onReset={() => {
            setChoice('first');
            setFieldValue('initial');
          }}
        >
          <SegmentedControl
            label="Keyboard choices"
            name="choice"
            value={choice}
            onValueChange={setChoice}
            options={[
              { value: 'first', label: 'First choice' },
              { value: 'disabled', label: 'Disabled choice', disabled: true },
              { value: 'last', label: 'Last choice' },
            ]}
          />
          <TextField
            label="Reset field"
            value={fieldValue}
            onChange={(event) => setFieldValue(event.target.value)}
          />
          <Button type="reset">Reset form</Button>
        </form>
        <section className="forced-states" data-testid="forced-states">
          <h2>Forced color states</h2>
          {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
            <div className="forced-state-pair" key={variant}>
              <Button
                variant={variant}
                aria-pressed={forcedPressed}
                onClick={() => setForcedPressed((value) => !value)}
                data-testid={`forced-button-${variant}-pressed`}
              >
                Toggle {variant}
              </Button>
              <Button
                variant={variant}
                aria-pressed={false}
                data-testid={`forced-button-${variant}-plain`}
              >
                Plain {variant}
              </Button>
              <IconButton
                variant={variant}
                aria-label={`Toggle ${variant} icon`}
                aria-pressed={forcedPressed}
                onClick={() => setForcedPressed((value) => !value)}
                data-testid={`forced-icon-${variant}-pressed`}
              >
                ☆
              </IconButton>
              <IconButton
                variant={variant}
                aria-label={`Plain ${variant} icon`}
                aria-pressed={false}
                data-testid={`forced-icon-${variant}-plain`}
              >
                ☆
              </IconButton>
            </div>
          ))}
          <div className="forced-state-pair">
            <Button disabled aria-pressed="true" data-testid="forced-disabled-pressed">
              Disabled pressed
            </Button>
            <Button disabled aria-pressed="false" data-testid="forced-disabled-plain">
              Disabled plain
            </Button>
          </div>
          <Tabs
            label="Forced color tabs"
            items={[
              { value: 'first', label: 'First forced tab', content: 'First forced panel' },
              { value: 'last', label: 'Last forced tab', content: 'Last forced panel' },
            ]}
            data-testid="forced-tabs"
          />
          <div className="forced-state-pair">
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <Spinner
                key={size}
                size={size}
                label={`Forced color spinner ${size}`}
                data-testid={`forced-spinner-${size}`}
              />
            ))}
            <Skeleton data-testid="forced-skeleton" variant="rect" width={144} height={24} />
            <Button loading={forcedLoading} data-testid="forced-loading-button">
              Loading comparison
            </Button>
            <Button
              loading={forcedLoading}
              startIcon={<span aria-hidden="true">★</span>}
              aria-pressed="true"
              data-testid="forced-loading-start-icon"
            >
              Loading with icon
            </Button>
            <IconButton
              loading={forcedLoading}
              aria-label="Loading forced icon"
              data-testid="forced-loading-icon"
            >
              ☆
            </IconButton>
            <Button onClick={() => setForcedLoading((value) => !value)}>
              Toggle loading fixtures
            </Button>
          </div>
        </section>
        <section data-testid="long-button">
          <Button
            startIcon={<span aria-hidden="true">★</span>}
            endIcon={<span aria-hidden="true">→</span>}
          >
            {longWord}
          </Button>
          <Button size="sm">{longWord}</Button>
          <Button size="lg">{longWord}</Button>
        </section>
        <section>
          <Button loading startIcon={<span aria-hidden="true">★</span>}>
            Loading edge button
          </Button>
        </section>
        <section data-testid="long-alert">
          <Alert title={longWord}>{longWord}</Alert>
        </section>
        <section data-testid="long-empty">
          <EmptyState
            title={longWord}
            description={longWord}
            action={<Button>{longWord}</Button>}
          />
        </section>
        <section data-testid="long-toast">
          <Toast
            open={feedbackOpen}
            onClose={() => setFeedbackOpen(false)}
            title={longWord}
            description={longWord}
            tone="error"
            action={<Button>{longWord}</Button>}
          />
        </section>
        <section data-testid="long-field">
          <TextField label={longWord} hint={longWord} error={longWord} />
        </section>
        <section data-testid="disabled-field">
          <TextField
            label="Disabled invalid field"
            disabled
            error="An existing error"
            defaultValue="Unavailable"
          />
        </section>
        <section data-testid="disabled-plain">
          <TextField label="Disabled plain field" disabled defaultValue="Unavailable" />
        </section>
        <TextField
          label="Readonly field"
          name="readonly"
          readOnly
          defaultValue="Copy this address"
        />
        <TextField
          label="External invalid field"
          aria-invalid="true"
          defaultValue="Needs correction"
        />
        <fieldset disabled>
          <legend>Inherited native disabling</legend>
          <TextField label="Inherited disabled field" defaultValue="Unavailable" />
          <SegmentedControl
            label="Inherited disabled choices"
            value="first"
            onValueChange={() => {}}
            options={[
              { value: 'first', label: 'Inherited selected choice' },
              { value: 'last', label: 'Inherited other choice' },
            ]}
          />
        </fieldset>
        <SegmentedControl
          label="Disabled selected choices"
          disabled
          value="first"
          onValueChange={() => {}}
          options={[
            { value: 'first', label: 'Selected while disabled' },
            { value: 'last', label: 'Other disabled choice' },
          ]}
        />
        <section data-testid="long-choice">
          <SegmentedControl
            label="Long choices"
            value="long"
            onValueChange={() => {}}
            options={[
              { value: 'long', label: longWord },
              { value: 'short', label: 'Short' },
            ]}
          />
        </section>
        <section data-testid="long-badge">
          <Badge>{longWord}</Badge>
        </section>
        <section data-testid="long-surface">
          <Surface>{longWord}</Surface>
        </section>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          trigger={<Button data-testid="edge-dialog-trigger">Open edge dialog</Button>}
          title={longWord}
          description={longWord}
          className="edge-dialog"
          initialFocus={inputRef}
          footer={
            <Button aria-label="Confirm edge dialog" onClick={() => setOpen(false)}>
              {longWord}
            </Button>
          }
        >
          <TextField ref={inputRef} label="Dialog keyboard input" />
          <Button
            onClick={() => setTheme((value) => (value === 'chiikawa' ? 'hachiware' : 'chiikawa'))}
          >
            Change open dialog theme
          </Button>
          {Array.from({ length: 15 }, (_, index) => (
            <p key={index}>{longWord}</p>
          ))}
        </Dialog>
        <section aria-label="Review regression cases">
          <h2>Review regression cases</h2>
          <Tabs
            dir="rtl"
            label="RTL review tabs"
            defaultValue="b"
            data-testid="review-rtl-tabs"
            items={['a', 'b', 'c'].map((value) => ({
              value,
              label: value.toUpperCase(),
              content: `${value.toUpperCase()} panel`,
            }))}
          />
          <Select
            label="Delayed external select"
            name="review-choice"
            form="review-external-form"
            defaultValue="a"
            options={[
              { value: 'a', label: 'Review A' },
              { value: 'b', label: 'Review B' },
            ]}
          />
          <Button onClick={() => setExternalFormVersion((version) => (version ?? -1) + 1)}>
            Mount or replace external form
          </Button>
          {externalFormVersion !== null && (
            <form key={externalFormVersion} id="review-external-form">
              <Button type="reset">Reset external select</Button>
            </form>
          )}
          <Button onClick={() => setMultiplePanels((value) => !value)}>
            Toggle review accordion mode
          </Button>
          <Accordion
            multiple={multiplePanels}
            keepMounted
            data-testid="review-accordion"
            items={[
              {
                value: 'a',
                title: 'Review panel A',
                content: <input aria-label="Review retained draft" />,
              },
              { value: 'b', title: 'Review panel B', content: 'Second review panel' },
            ]}
          />
          <Avatar name="Review author" src={avatarSource} data-testid="review-avatar" />
          <Button onClick={() => setAvatarSource('/review-avatar.svg')}>Load review avatar</Button>
          <Button onClick={() => setAvatarSource(undefined)}>Clear review avatar</Button>
        </section>
      </main>
    </ThemeProvider>
  );
}
