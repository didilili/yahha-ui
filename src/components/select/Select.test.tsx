import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { Select } from './Select.js';
import { ThemeProvider } from '../../theme/ThemeProvider.js';

afterEach(cleanup);
const options = [
  { value: 'notes', label: '手记' },
  { value: 'drafts', label: '草稿', disabled: true },
  { value: 'photos', label: '相册' },
];

describe('Select', () => {
  it.each([undefined, 'check', 'stamp'] as const)(
    'keeps %s selected indicators decorative while keyboard selection and form reset remain native',
    async (selectedIndicator) => {
      const user = userEvent.setup();
      render(
        <form aria-label="文章">
          <Select
            label="分类"
            name="category"
            options={options}
            defaultValue="notes"
            selectedIndicator={selectedIndicator}
          />
          <button type="reset">重置分类</button>
        </form>,
      );
      const trigger = screen.getByRole('combobox', { name: '分类' });
      expect(trigger.hasAttribute('selectedindicator')).toBe(false);
      await user.click(trigger);
      const selected = await screen.findByRole('option', { name: '手记', selected: true });
      const indicator = selected.querySelector('[data-selected-indicator]');
      expect(indicator?.getAttribute('data-selected-indicator')).toBe(selectedIndicator ?? 'check');
      expect(indicator?.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
      expect(screen.getByRole('option', { name: '草稿' }).getAttribute('aria-disabled')).toBe(
        'true',
      );
      await user.keyboard('{End}{Enter}');
      const form = screen.getByRole('form') as HTMLFormElement;
      await waitFor(() => expect(new FormData(form).get('category')).toBe('photos'));
      await waitFor(() => expect(document.activeElement).toBe(trigger));
      await user.click(screen.getByRole('button', { name: '重置分类' }));
      await waitFor(() => expect(new FormData(form).get('category')).toBe('notes'));
    },
  );

  it.each<{
    source: string;
    provider?: 'ltr' | 'rtl';
    outer?: 'ltr' | 'rtl';
    native?: 'ltr' | 'rtl';
    explicit?: string;
    expected: 'ltr' | 'rtl';
  }>([
    { source: 'native RTL container', native: 'rtl', expected: 'rtl' },
    { source: 'upstream RTL provider', provider: 'rtl', expected: 'rtl' },
    {
      source: 'explicit LTR over native and provider RTL',
      provider: 'rtl',
      native: 'rtl',
      explicit: 'ltr',
      expected: 'ltr',
    },
    { source: 'nearest native LTR container', outer: 'rtl', native: 'ltr', expected: 'ltr' },
    { source: 'uppercase explicit RTL', explicit: 'RTL', expected: 'rtl' },
    {
      source: 'uppercase explicit RTL over native and provider LTR',
      provider: 'ltr',
      native: 'ltr',
      explicit: 'RTL',
      expected: 'rtl',
    },
    {
      source: 'mixed-case explicit LTR over native and provider RTL',
      provider: 'rtl',
      native: 'rtl',
      explicit: 'LtR',
      expected: 'ltr',
    },
  ])('keeps trigger and portaled options in the same direction from $source', async (fixture) => {
    const user = userEvent.setup();
    render(
      <DirectionProvider direction={fixture.provider}>
        <div dir={fixture.outer}>
          <div dir={fixture.native}>
            <Select label="分类" dir={fixture.explicit} options={options} defaultValue="notes" />
          </div>
        </div>
      </DirectionProvider>,
    );
    const trigger = screen.getByRole('combobox', { name: '分类' });
    await user.click(trigger);
    const photo = await screen.findByRole('option', { name: '相册' });
    expect(trigger.parentElement?.dir).toBe(fixture.expected);
    expect(trigger.closest<HTMLElement>('[dir="ltr"], [dir="rtl"]')?.dir).toBe(fixture.expected);
    expect(photo.closest('[dir="ltr"], [dir="rtl"]')?.getAttribute('dir')).toBe(fixture.expected);
    await user.keyboard('{End}{Enter}');
    await waitFor(() => expect(trigger.textContent).toContain('相册'));
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('follows native direction changes while its portaled options remain open', async () => {
    const user = userEvent.setup();
    const select = <Select label="分类" options={options} defaultValue="notes" />;
    const { rerender } = render(<div dir="rtl">{select}</div>);
    const trigger = screen.getByRole('combobox', { name: '分类' });
    await user.click(trigger);
    const photo = await screen.findByRole('option', { name: '相册' });
    expect(photo.closest('[dir="ltr"], [dir="rtl"]')?.getAttribute('dir')).toBe('rtl');
    rerender(<div dir="ltr">{select}</div>);
    await waitFor(() =>
      expect(photo.closest('[dir="ltr"], [dir="rtl"]')?.getAttribute('dir')).toBe('ltr'),
    );
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.closest('[dir="ltr"], [dir="rtl"]')?.getAttribute('dir')).toBe('ltr');
    expect(trigger.textContent).toContain('手记');
    await user.keyboard('{End}{Enter}');
    await waitFor(() => expect(trigger.textContent).toContain('相册'));
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('follows a stable child reassigned to another slot and observes its new direction ancestors', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLButtonElement>();
    const host = document.body.appendChild(document.createElement('div'));
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const sections = ['ltr', 'rtl'].map((direction, index) => {
      const section = shadowRoot.appendChild(document.createElement('section'));
      section.dir = direction;
      section.appendChild(document.createElement('slot')).name = `slot-${index}`;
      return section;
    });
    const select = <Select ref={ref} label="分类" options={options} defaultValue="notes" />;
    const view = render(<div slot="slot-0">{select}</div>, { container: host });
    try {
      const trigger = screen.getByRole('combobox', { name: '分类' });
      await user.click(trigger);
      const photo = await screen.findByRole('option', { name: '相册' });
      expect(trigger.parentElement?.dir).toBe('ltr');
      expect(photo.closest<HTMLElement>('[dir]')?.dir).toBe('ltr');

      view.rerender(<div slot="slot-1">{select}</div>);
      expect(trigger.parentElement?.parentElement?.assignedSlot?.name).toBe('slot-1');
      await waitFor(() => expect(trigger.parentElement?.dir).toBe('rtl'));
      await waitFor(() => expect(photo.closest<HTMLElement>('[dir]')?.dir).toBe('rtl'));

      await act(async () => {
        sections[1]!.dir = 'ltr';
      });
      await waitFor(() => expect(trigger.parentElement?.dir).toBe('ltr'));
      await waitFor(() => expect(photo.closest<HTMLElement>('[dir]')?.dir).toBe('ltr'));
      expect(screen.getByRole('option', { name: '相册' })).toBe(photo);
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(ref.current).toBe(trigger);
      expect(trigger.textContent).toContain('手记');
      await user.click(photo);
      await waitFor(() => expect(trigger.textContent).toContain('相册'));
      await waitFor(() => expect(document.activeElement).toBe(trigger));
    } finally {
      view.unmount();
      host.remove();
    }
  });

  it('inherits and follows its shadow host direction while retaining ref, selection and reset', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLButtonElement>();
    const host = document.body.appendChild(document.createElement('div'));
    host.dir = 'rtl';
    const shadowRoot = host.attachShadow({ mode: 'open' });
    try {
      const { getByRole } = render(
        <form aria-label="文章">
          <Select ref={ref} label="分类" name="category" defaultValue="notes" options={options} />
          <button type="reset">重置</button>
        </form>,
        { container: shadowRoot },
      );
      const trigger = getByRole('combobox');
      const form = getByRole('form') as HTMLFormElement;
      expect(ref.current).toBe(trigger);
      await user.click(trigger);
      const photo = await screen.findByRole('option', { name: '相册' });
      expect(photo.closest('[dir="ltr"], [dir="rtl"]')?.getAttribute('dir')).toBe('rtl');
      host.dir = 'ltr';
      await waitFor(() =>
        expect(photo.closest('[dir="ltr"], [dir="rtl"]')?.getAttribute('dir')).toBe('ltr'),
      );
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(ref.current).toBe(trigger);
      await user.click(photo);
      await waitFor(() => expect(new FormData(form).get('category')).toBe('photos'));
      await waitFor(() => expect(shadowRoot.activeElement).toBe(trigger));
      await user.click(getByRole('button', { name: '重置' }));
      await waitFor(() => expect(new FormData(form).get('category')).toBe('notes'));
      expect(trigger.textContent).toContain('手记');
    } finally {
      host.remove();
    }
  });

  it('labels the trigger and associates errors while forwarding ref and style to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Select
        ref={ref}
        label="分类"
        options={options}
        hint="选择文章分类"
        error="请选择分类"
        className="field"
        style={{ color: 'red' }}
      />,
    );
    const trigger = screen.getByRole('combobox', { name: '分类' });
    expect(ref.current).toBe(trigger);
    expect(trigger.style.color).toBe('red');
    expect(trigger.parentElement?.classList.contains('field')).toBe(true);
    expect(trigger.getAttribute('aria-invalid')).toBe('true');
    expect(
      trigger
        .getAttribute('aria-describedby')
        ?.split(' ')
        .map((id) => document.getElementById(id)?.textContent),
    ).toEqual(['选择文章分类', '请选择分类']);
  });

  it('selects controlled options through a themed popup and returns focus', async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState<string | null>('notes');
      return (
        <ThemeProvider theme="blue" tokens={{ line: '#234567' }}>
          <Select label="分类" value={value} onValueChange={setValue} options={options} />
        </ThemeProvider>
      );
    }
    render(<Example />);
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    const option = await screen.findByRole('option', { name: '相册' });
    expect(option.closest('[data-yahha-theme]')?.getAttribute('data-yahha-theme')).toBe('blue');
    expect(screen.getByRole('option', { name: '草稿' }).getAttribute('aria-disabled')).toBe('true');
    await user.click(option);
    await waitFor(() => expect(trigger.textContent).toContain('相册'));
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('submits and resets an uncontrolled value using the associated native form', async () => {
    const user = userEvent.setup();
    render(
      <>
        <form id="article" aria-label="文章">
          <button type="reset">重置</button>
        </form>
        <Select
          label="分类"
          name="category"
          form="article"
          defaultValue="notes"
          options={options}
        />
      </>,
    );
    const form = screen.getByRole('form') as HTMLFormElement;
    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: '相册' }));
    await waitFor(() => expect(new FormData(form).get('category')).toBe('photos'));
    await user.click(screen.getByRole('button', { name: '重置' }));
    await waitFor(() => expect(new FormData(form).get('category')).toBe('notes'));
    expect(screen.getByRole('combobox').textContent).toContain('手记');
  });

  it.each(['mounted later', 'replaced with the same ID'])(
    'resets an uncontrolled value when its external form is %s',
    async (scenario) => {
      const user = userEvent.setup();
      function Example({ updated = false }: { updated?: boolean }) {
        return (
          <>
            <Select
              label="分类"
              name="category"
              form="article"
              defaultValue={updated ? 'photos' : 'notes'}
              options={options}
            />
            {(updated || scenario !== 'mounted later') && (
              <form key={updated ? 'replacement' : 'initial'} id="article" aria-label="文章">
                <button type="reset">重置</button>
              </form>
            )}
          </>
        );
      }
      const { rerender } = render(<Example />);
      const trigger = screen.getByRole('combobox');
      const originalForm = document.getElementById('article');
      await user.click(trigger);
      await user.click(await screen.findByRole('option', { name: '相册' }));
      rerender(<Example updated />);
      const form = screen.getByRole('form') as HTMLFormElement;
      expect(form).not.toBe(originalForm);
      expect(screen.getByRole('combobox')).toBe(trigger);
      expect((trigger as HTMLButtonElement).form).toBe(form);
      expect(new FormData(form).get('category')).toBe('photos');
      await user.click(screen.getByRole('button', { name: '重置' }));
      await waitFor(() => expect(new FormData(form).get('category')).toBe('notes'));
      expect(trigger.textContent).toContain('手记');
    },
  );

  it('ignores unrelated and canceled resets before restoring its associated form value', async () => {
    const user = userEvent.setup();
    function Example({ cancelReset = true }: { cancelReset?: boolean }) {
      return (
        <>
          <form
            id="article"
            aria-label="文章"
            onReset={(event) => {
              if (cancelReset) event.preventDefault();
            }}
          >
            <button type="reset">重置文章</button>
          </form>
          <form aria-label="其他表单">
            <button type="reset">重置其他</button>
          </form>
          <Select
            label="分类"
            name="category"
            form="article"
            defaultValue="notes"
            options={options}
          />
        </>
      );
    }
    const { rerender } = render(<Example />);
    const trigger = screen.getByRole('combobox');
    const form = screen.getByRole('form', { name: '文章' }) as HTMLFormElement;
    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: '相册' }));
    await user.click(screen.getByRole('button', { name: '重置其他' }));
    expect(trigger.textContent).toContain('相册');
    expect(new FormData(form).get('category')).toBe('photos');
    await user.click(screen.getByRole('button', { name: '重置文章' }));
    expect(trigger.textContent).toContain('相册');
    expect(new FormData(form).get('category')).toBe('photos');
    rerender(<Example cancelReset={false} />);
    await user.click(screen.getByRole('button', { name: '重置文章' }));
    await waitFor(() => expect(new FormData(form).get('category')).toBe('notes'));
    expect(trigger.textContent).toContain('手记');
  });

  it('leaves controlled reset ownership with the caller when the external form mounts later', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    function Example({ showForm = false }: { showForm?: boolean }) {
      return (
        <>
          <Select
            label="分类"
            name="category"
            form="article"
            value="photos"
            defaultValue="notes"
            options={options}
            onValueChange={onValueChange}
          />
          {showForm && (
            <form id="article" aria-label="文章">
              <button type="reset">重置</button>
            </form>
          )}
        </>
      );
    }
    const { rerender } = render(<Example />);
    rerender(<Example showForm />);
    await user.click(screen.getByRole('button', { name: '重置' }));
    expect(screen.getByRole('combobox').textContent).toContain('相册');
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('category')).toBe(
      'photos',
    );
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('resets its associated form inside a shadow root', async () => {
    const user = userEvent.setup();
    const host = document.body.appendChild(document.createElement('div'));
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const { getByRole } = render(
      <form aria-label="文章">
        <Select label="分类" name="category" defaultValue="notes" options={options} />
        <button type="reset">重置</button>
      </form>,
      { container: shadowRoot },
    );
    const trigger = getByRole('combobox');
    const form = getByRole('form') as HTMLFormElement;
    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: '相册' }));
    expect(new FormData(form).get('category')).toBe('photos');
    await user.click(getByRole('button', { name: '重置' }));
    await waitFor(() => expect(new FormData(form).get('category')).toBe('notes'));
    expect(trigger.textContent).toContain('手记');
    host.remove();
  });

  it('keeps decorated labels while matching their explicit keyboard text', async () => {
    const user = userEvent.setup();
    render(
      <Select
        label="分类"
        options={[
          {
            value: 'notes',
            label: (
              <>
                <span aria-hidden="true">✎ </span>Notes
              </>
            ),
            textValue: 'Notes',
          },
          {
            value: 'reading',
            label: (
              <>
                <span aria-hidden="true">▤ </span>Reading
              </>
            ),
            textValue: 'Reading',
          },
        ]}
      />,
    );
    const trigger = screen.getByRole('combobox', { name: '分类' });
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole('option', { name: 'Notes' })),
    );
    await user.keyboard('r');
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole('option', { name: 'Reading' })),
    );
    await user.keyboard('{Enter}');
    await waitFor(() => expect(trigger.textContent).toContain('▤ Reading'));
    expect(trigger.querySelector('[aria-hidden="true"]')?.textContent).toBe('▤ ');
  });

  it('allows inspecting readonly options without changing the submitted value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <form aria-label="文章">
        <Select
          label="分类"
          name="category"
          defaultValue="notes"
          readOnly
          options={options}
          onValueChange={onValueChange}
        />
      </form>,
    );
    const trigger = screen.getByRole('combobox', { name: '分类' });
    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: '相册' }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger.textContent).toContain('手记');
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('category')).toBe('notes');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('does not commit a portaled option when its ancestor fieldset becomes disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <fieldset aria-label="文章选项">
        <Select label="分类" defaultValue="notes" options={options} onValueChange={onValueChange} />
      </fieldset>,
    );
    const fieldset = screen.getByRole('group', { name: '文章选项' }) as HTMLFieldSetElement;
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    const photo = await screen.findByRole('option', { name: '相册' });
    fieldset.disabled = true;
    expect(trigger.matches(':disabled')).toBe(true);
    await user.click(photo);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger.textContent).toContain('手记');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    fieldset.disabled = false;
    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: '相册' }));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('photos');
    expect(trigger.textContent).toContain('相册');
  });
});
