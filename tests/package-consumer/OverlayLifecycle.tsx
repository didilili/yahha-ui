import { useRef, useState } from 'react';
import { Button, Dialog, DropdownMenu, Popover, TextField, ThemeProvider, Tooltip } from 'yahha-ui';

function MenuCase({ controlled = false }: { controlled?: boolean }) {
  const id = controlled ? 'controlled-menu' : 'menu';
  const [open, setOpen] = useState(false);
  const [hold, setHold] = useState(false);
  const [actions, setActions] = useState(0);
  const [closeRequests, setCloseRequests] = useState(0);
  return (
    <section data-testid={`${id}-case`}>
      {controlled && (
        <Button aria-pressed={hold} onClick={() => setHold((value) => !value)}>
          Hold controlled menu open
        </Button>
      )}
      <DropdownMenu
        trigger={<Button data-testid={`${id}-trigger`}>Open {id}</Button>}
        {...(controlled
          ? {
              open,
              onOpenChange: (next: boolean) => {
                if (!next) setCloseRequests((count) => count + 1);
                if (next || !hold) setOpen(next);
              },
            }
          : {})}
        className={`${id}-popup`}
        ref={(node) => {
          if (node) node.dataset.refChecked = node.tagName;
        }}
        items={[
          {
            id: 'first',
            label: `${id} first action`,
            onSelect: () => setActions((count) => count + 1),
          },
          {
            id: 'next',
            label: `${id} next action`,
            onSelect: () => setActions((count) => count + 1),
          },
          {
            id: 'locked',
            label: `${id} disabled action`,
            disabled: true,
            onSelect: () => setActions((count) => count + 1),
          },
        ]}
      />
      <output data-testid={`${id}-actions`}>{actions}</output>
      <output data-testid={`${id}-close-requests`}>{closeRequests}</output>
    </section>
  );
}

function FormCase({ kind }: { kind: 'dialog' | 'popover' }) {
  const [open, setOpen] = useState(false);
  const [submissions, setSubmissions] = useState(0);
  const [actions, setActions] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const common = {
    open,
    onOpenChange: setOpen,
    title: `${kind} lifecycle form`,
    className: `${kind}-lifecycle-popup`,
    initialFocus: inputRef,
    finalFocus: triggerRef,
    trigger: (
      <Button ref={triggerRef} data-testid={`${kind}-trigger`}>
        Open {kind}
      </Button>
    ),
    ref: (node: HTMLDivElement | null) => {
      if (node) node.dataset.refChecked = node.tagName;
    },
    children: (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmissions((count) => count + 1);
        }}
      >
        <TextField ref={inputRef} label={`${kind} draft`} defaultValue="A retained draft" />
        <Button type="submit">{kind} submit</Button>
        <Button type="button" variant="secondary" onClick={() => setActions((count) => count + 1)}>
          {kind} action
        </Button>
      </form>
    ),
  };
  return (
    <section data-testid={`${kind}-case`}>
      {kind === 'dialog' ? <Dialog {...common} /> : <Popover {...common} />}
      <output data-testid={`${kind}-submissions`}>{submissions}</output>
      <output data-testid={`${kind}-actions`}>{actions}</output>
    </section>
  );
}

export function OverlayLifecycle() {
  const [tooltipActions, setTooltipActions] = useState(0);
  return (
    <ThemeProvider theme="chiikawa">
      <main style={{ display: 'grid', gap: 24, maxWidth: 420, margin: '24px auto', padding: 16 }}>
        <h1>Overlay lifecycle consumer</h1>
        <TextField label="Outside overlay field" data-testid="overlay-outside-field" />
        <MenuCase />
        <MenuCase controlled />
        <FormCase kind="dialog" />
        <FormCase kind="popover" />
        <Tooltip
          content="Tooltip action"
          delay={0}
          trigger={
            <Button onClick={() => setTooltipActions((count) => count + 1)}>Tooltip action</Button>
          }
          className="lifecycle-tooltip"
        />
        <output data-testid="tooltip-actions">{tooltipActions}</output>
      </main>
    </ThemeProvider>
  );
}
