import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Button,
  Badge,
  Dialog,
  IconButton,
  SegmentedControl,
  Skeleton,
  Surface,
  TextField,
  ThemeProvider,
  Toast,
  type ThemeName,
  type ThemeTokens,
  type SurfaceProps,
} from 'yahha-ui';
import 'yahha-ui/style.css';
import { EdgeCases } from './EdgeCases.js';
import { Basics } from './Basics.js';
import { DesignContract } from './DesignContract.js';
import { OverlayLifecycle } from './OverlayLifecycle.js';
import { ThemeAliases } from './ThemeAliases.js';
import { Icons } from './Icons.js';
import { ProgressConsumer } from './Progress.js';
import { OptionalDecorations } from './OptionalDecorations.js';

function Consumer() {
  const [theme, setTheme] = useState<ThemeName>('pink');
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const customTriggerRef = useRef<HTMLButtonElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [scope, setScope] = useState<'all' | 'one' | ''>('');
  const [submittedScope, setSubmittedScope] = useState('');
  const [scopeDisabled, setScopeDisabled] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customAccent, setCustomAccent] = useState('#b9dcca');
  const customTokens: ThemeTokens = {
    accent: customAccent,
    line: '#846973',
    surface: '#faf5e8',
    fieldBackground: '#fff4fa',
    error: '#923b53',
  };
  const surfaceProps: SurfaceProps = { ref: surfaceRef };

  useEffect(() => {
    for (const node of [
      buttonRef.current,
      inputRef.current,
      badgeRef.current,
      surfaceRef.current,
    ]) {
      if (node instanceof HTMLElement) {
        node.dataset.refChecked = node.tagName;
      }
    }
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <h1>Standalone package consumer</h1>
        <SegmentedControl
          label="Theme"
          value={theme}
          onValueChange={setTheme}
          options={(['pink', 'blue', 'yellow'] as const).map((value) => ({
            value,
            label: value,
          }))}
        />
        <TextField ref={inputRef} label="Consumer input" data-testid="ref-input" />
        <IconButton
          aria-label="Focus consumer input"
          data-testid="ref-icon"
          ref={(node) => {
            if (node instanceof HTMLButtonElement) node.dataset.refChecked = node.tagName;
          }}
          onClick={() => inputRef.current?.focus()}
        >
          →
        </IconButton>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Package consumer dialog"
          description="This dialog is imported from the installed tarball."
          trigger={
            <Button ref={buttonRef} variant="secondary" data-testid="dialog-trigger">
              Open dialog
            </Button>
          }
        >
          <p>Portalled package content</p>
        </Dialog>
        <form
          data-testid="consumer-form"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmittedScope(String(new FormData(event.currentTarget).get('scope')));
          }}
        >
          <SegmentedControl
            label="Consumer scope"
            name="scope"
            required
            disabled={scopeDisabled}
            value={scope}
            onValueChange={setScope}
            options={[
              { value: 'all', label: 'All sources' },
              { value: 'one', label: 'One source' },
            ]}
          />
          <Button type="submit">Submit scope</Button>
          <Button onClick={() => setScopeDisabled((value) => !value)}>Toggle scope disabled</Button>
          <output aria-label="Submitted scope">{submittedScope}</output>
        </form>
        <ThemeProvider theme="yellow" tokens={customTokens} className="custom-theme-root">
          <Surface {...surfaceProps} data-testid="consumer-surface">
            <Badge ref={badgeRef} data-testid="consumer-badge">
              Consumer badge
            </Badge>
            <Skeleton data-testid="consumer-line-skeleton" />
            <TextField
              label="Custom themed input"
              className="consumer-field-root"
              classNames={{ input: 'consumer-field-input' }}
            />
            <TextField
              label="Custom invalid input"
              error="Custom field error"
              classNames={{ error: 'consumer-field-error' }}
            />
            <Toast
              open
              onClose={() => {}}
              title="Custom error notification"
              tone="error"
              className="consumer-error-toast"
            />
            <Button ref={customTriggerRef} onClick={() => setCustomOpen(true)}>
              Open custom dialog
            </Button>
            <Dialog
              open={customOpen}
              onOpenChange={setCustomOpen}
              title="Custom themed dialog"
              description="Uses explicit tokens and a custom portal host."
              portalContainer={portalRef}
              initialFocus={customInputRef}
              finalFocus={customTriggerRef}
              disablePointerDismissal
              className="consumer-custom-popup"
              style={{ width: 360 }}
              closeLabel="Close custom dialog"
              ref={(node) => {
                if (node) node.dataset.refChecked = node.tagName;
              }}
            >
              <input ref={customInputRef} aria-label="Dialog input" />
              <Button onClick={() => setCustomAccent('#e0c9f2')}>Update custom tokens</Button>
            </Dialog>
          </Surface>
        </ThemeProvider>
      </ThemeProvider>
      <div ref={portalRef} data-testid="consumer-portal" />
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  new URLSearchParams(location.search).has('optional-decorations') ? (
    <OptionalDecorations />
  ) : new URLSearchParams(location.search).has('progress') ? (
    <ProgressConsumer />
  ) : new URLSearchParams(location.search).has('icons') ? (
    <Icons />
  ) : new URLSearchParams(location.search).has('theme-aliases') ? (
    <ThemeAliases />
  ) : new URLSearchParams(location.search).has('overlay-lifecycle') ? (
    <OverlayLifecycle />
  ) : new URLSearchParams(location.search).has('design-contract') ? (
    <DesignContract />
  ) : new URLSearchParams(location.search).has('basics') ? (
    <Basics />
  ) : new URLSearchParams(location.search).has('edge-cases') ? (
    <EdgeCases />
  ) : (
    <Consumer />
  ),
);
