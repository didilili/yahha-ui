import { useRef, useState } from 'react';
import {
  Button,
  Checkbox,
  Form,
  FormError,
  Input,
  RadioGroup,
  SegmentedControl,
  Select,
  Switch,
  Textarea,
  ThemeProvider,
  type FormErrors,
} from 'yahha-ui';

const initialValues = {
  nickname: '',
  biography: 'Initial reading note',
  category: null as string | null,
  accepted: false,
  frequency: 'daily',
  notifications: false,
  layout: 'list',
  disabledDraft: 'Disabled draft',
  conditionalDraft: 'Conditional draft',
};

type AsyncValues = { nickname: string };
type Request = {
  resolve: (errors?: FormErrors<AsyncValues>) => void;
  reject: (error: Error) => void;
  signal: AbortSignal;
  settled: boolean;
};

function ControlBindings() {
  const [showDraft, setShowDraft] = useState(true);
  const [submitted, setSubmitted] = useState('');
  const [nativeValues, setNativeValues] = useState('');
  const [cancelReset, setCancelReset] = useState(false);
  return (
    <section
      aria-label="Installed Form controls"
      style={{ display: 'grid', gap: 16, overflowWrap: 'anywhere' }}
    >
      <Form
        id="installed-form-controls"
        data-testid="installed-form-controls"
        initialValues={initialValues}
        validate={(values) =>
          values.nickname === 'reserved' ? { nickname: 'This nickname is reserved.' } : {}
        }
        onReset={(event) => {
          if (cancelReset) event.preventDefault();
          else {
            setSubmitted('');
            setNativeValues('');
          }
        }}
        onSubmit={(values, { formData }) => {
          setSubmitted(JSON.stringify(values));
          setNativeValues(JSON.stringify([...formData]));
        }}
      >
        {(form) => (
          <fieldset disabled={form.isSubmitting || form.isValidating}>
            <Input
              {...form.input('nickname')}
              label="Form nickname"
              required
              minLength={3}
              hint="At least three characters."
            />
            <Textarea {...form.input('biography')} label="Form biography" />
            <Select
              {...form.choice('category')}
              label="Form category"
              required
              options={[
                { value: 'journal', label: 'Journal category' },
                { value: 'reading', label: 'Reading category' },
              ]}
            />
            <Checkbox {...form.checked('accepted')} label="Form accepted" value="yes" />
            <RadioGroup
              {...form.choice('frequency')}
              label="Form frequency"
              required
              options={[
                { value: 'daily', label: 'Daily frequency' },
                { value: 'weekly', label: 'Weekly frequency' },
              ]}
            />
            <Switch
              {...form.checked('notifications', { errorPlacement: 'external' })}
              label="Form notifications"
            />
            <FormError name="notifications" />
            <SegmentedControl
              {...form.choice('layout', { errorPlacement: 'external' })}
              label="Form layout"
              required
              options={[
                { value: 'list', label: 'List layout' },
                { value: 'tiles', label: 'Tiles layout' },
              ]}
            />
            <FormError name="layout" />
            <Input {...form.input('disabledDraft')} label="Form disabled draft" disabled />
            {showDraft && (
              <Input {...form.input('conditionalDraft')} label="Form conditional draft" />
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Button type="submit">Submit installed controls</Button>
              <Button type="reset" variant="secondary">
                Reset installed controls
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  form.setErrors({
                    notifications: 'Enable notifications to continue.',
                    layout: 'Choose the tiles layout.',
                  })
                }
              >
                Show external control errors
              </Button>
              <Button type="button" variant="secondary" onClick={() => form.reset()}>
                Reset through Form action
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => form.setFieldValue('frequency', '')}
              >
                Clear bound frequency
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => form.setFieldValue('layout', '')}
              >
                Clear bound layout
              </Button>
            </div>
            <output data-testid="installed-form-values">{JSON.stringify(form.values)}</output>
          </fieldset>
        )}
      </Form>
      <Button type="submit" form="installed-form-controls">
        Submit controls externally
      </Button>
      <Button type="button" variant="secondary" onClick={() => setShowDraft((value) => !value)}>
        Toggle conditional field
      </Button>
      <label>
        <input
          type="checkbox"
          checked={cancelReset}
          onChange={(event) => setCancelReset(event.currentTarget.checked)}
        />{' '}
        Cancel controls reset
      </label>
      <output data-testid="installed-form-submitted">{submitted}</output>
      <output data-testid="installed-form-native">{nativeValues}</output>
    </section>
  );
}

function AsyncSubmission() {
  const [visible, setVisible] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [aborted, setAborted] = useState(0);
  const [rejections, setRejections] = useState(0);
  const requests = useRef<Request[]>([]);

  function settle(kind: 'success' | 'field-error' | 'rejection') {
    const request = requests.current.find((candidate) => !candidate.settled);
    if (!request) return;
    request.settled = true;
    if (kind === 'rejection') request.reject(new Error('Installed save request failed.'));
    else
      request.resolve(
        kind === 'field-error' ? { nickname: 'Server rejected this nickname.' } : undefined,
      );
  }

  return (
    <section
      aria-label="Installed async Form"
      style={{ display: 'grid', gap: 16, overflowWrap: 'anywhere' }}
    >
      {visible && (
        <Form
          data-testid="installed-async-form"
          initialValues={{ nickname: 'Initial async name' }}
          onSubmit={(_values, { signal }) => {
            setAttempts((value) => value + 1);
            let request: Request;
            return new Promise<void | FormErrors<AsyncValues>>((resolve, reject) => {
              request = { resolve, reject, signal, settled: false };
              requests.current.push(request);
              signal.addEventListener(
                'abort',
                () => {
                  if (!request.settled) setAborted((value) => value + 1);
                },
                { once: true },
              );
            });
          }}
          onSubmitError={() => setRejections((value) => value + 1)}
        >
          {(form) => (
            <>
              <Input {...form.input('nickname')} label="Async form nickname" required />
              <Button type="submit" loading={form.isSubmitting}>
                Start installed save
              </Button>
              <Button type="reset" variant="secondary">
                Reset installed save
              </Button>
              <output data-testid="installed-async-pending">{String(form.isSubmitting)}</output>
              <output data-testid="installed-async-field-error">
                {form.errors.nickname ?? ''}
              </output>
              <output data-testid="installed-async-submit-error">{form.submitError ?? ''}</output>
            </>
          )}
        </Form>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="button" onClick={() => settle('success')}>
          Complete oldest save
        </Button>
        <Button type="button" onClick={() => settle('field-error')}>
          Return oldest field error
        </Button>
        <Button type="button" onClick={() => settle('rejection')}>
          Reject oldest save
        </Button>
        <Button type="button" onClick={() => setVisible((value) => !value)}>
          Toggle async form
        </Button>
      </div>
      <output data-testid="installed-async-attempts">{attempts}</output>
      <output data-testid="installed-async-aborted">{aborted}</output>
      <output data-testid="installed-async-rejections">{rejections}</output>
    </section>
  );
}

function ReservedFieldNames() {
  const [submitted, setSubmitted] = useState('');
  return (
    <section
      aria-label="Installed Form reserved names"
      style={{ display: 'grid', gap: 16, overflowWrap: 'anywhere' }}
    >
      <Form
        data-testid="installed-reserved-form"
        initialValues={{
          constructor: '',
          toString: '',
          reset: '',
          checkValidity: '',
          elements: '',
        }}
        onReset={() => setSubmitted('')}
        onSubmit={(_values, { formData }) => {
          setSubmitted(JSON.stringify(Object.fromEntries(formData)));
        }}
      >
        {(form) => (
          <>
            <Input {...form.input('constructor')} label="Reserved constructor" />
            <Input {...form.input('toString')} label="Reserved toString" />
            <Input {...form.input('reset')} label="Reserved reset" required />
            <Input {...form.input('checkValidity')} label="Reserved checkValidity" required />
            <Input {...form.input('elements')} label="Reserved elements" required />
            <Button type="submit">Submit reserved names</Button>
            <Button type="reset" variant="secondary">
              Reset reserved names
            </Button>
            <Button type="button" variant="secondary" onClick={() => form.reset()}>
              Reset reserved names through action
            </Button>
            <output data-testid="installed-reserved-errors">
              {Object.keys(form.errors).join(',')}
            </output>
          </>
        )}
      </Form>
      <output data-testid="installed-reserved-submitted">{submitted}</output>
    </section>
  );
}

export function FormConsumer() {
  const parameters = new URLSearchParams(location.search);
  const requestedTheme = parameters.get('theme');
  const theme = requestedTheme === 'blue' || requestedTheme === 'yellow' ? requestedTheme : 'pink';
  const direction = parameters.get('direction') === 'rtl' ? 'rtl' : 'ltr';
  return (
    <ThemeProvider theme={theme}>
      <main
        dir={direction}
        style={{ display: 'grid', gap: 40, maxWidth: 560, margin: '24px auto', padding: 16 }}
      >
        <h1>Form package consumer</h1>
        <ControlBindings />
        <AsyncSubmission />
        <ReservedFieldNames />
      </main>
    </ThemeProvider>
  );
}
