import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentedControl } from './SegmentedControl.js';

afterEach(cleanup);

describe('SegmentedControl', () => {
  it('keeps caller-provided guidance directly associated with each focused radio', () => {
    render(
      <>
        <p id="choice-help">请选择文章排序方式。</p>
        <SegmentedControl
          label="文章排序"
          value="latest"
          onValueChange={() => {}}
          aria-describedby="choice-help"
          options={[
            { value: 'latest', label: '最新' },
            { value: 'oldest', label: '最早' },
          ]}
        />
      </>,
    );
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio.getAttribute('aria-describedby')).toBe('choice-help');
      expect(document.getElementById(radio.getAttribute('aria-describedby')!)?.textContent).toBe(
        '请选择文章排序方式。',
      );
    }
  });
  it('changes a native single-choice group while preserving disabled options', async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState<'all' | 'one' | 'two'>('all');
      return (
        <SegmentedControl
          label="群聊范围"
          value={value}
          onValueChange={setValue}
          options={[
            { value: 'all', label: '全部' },
            { value: 'one', label: '一所' },
            { value: 'two', label: '二所', disabled: true },
          ]}
        />
      );
    }
    render(<Example />);
    await user.click(screen.getByRole('radio', { name: '一所' }));
    expect((screen.getByRole('radio', { name: '一所' }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole('radio', { name: '全部' }) as HTMLInputElement).checked).toBe(false);
    await user.click(screen.getByRole('radio', { name: '二所' }));
    expect((screen.getByRole('radio', { name: '一所' }) as HTMLInputElement).checked).toBe(true);
  });

  it('only changes the selection when the caller updates the controlled value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const options = [
      { value: 'all', label: '全部' },
      { value: 'one', label: '一所' },
    ];
    const example = (value: string) => (
      <form aria-label="筛选">
        <SegmentedControl
          label="群聊范围"
          name="audience"
          value={value}
          onValueChange={onValueChange}
          options={options}
        />
      </form>
    );
    const { rerender } = render(example('all'));
    const all = screen.getByRole('radio', { name: '全部' }) as HTMLInputElement;
    const one = screen.getByRole('radio', { name: '一所' }) as HTMLInputElement;
    await user.click(one);
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('one');
    expect(all.checked).toBe(true);
    expect(one.checked).toBe(false);
    rerender(example('one'));
    expect(all.checked).toBe(false);
    expect(one.checked).toBe(true);
    expect(one.parentElement?.hasAttribute('data-checked')).toBe(true);
    expect([
      ...new FormData(screen.getByRole('form', { name: '筛选' }) as HTMLFormElement),
    ]).toEqual([['audience', 'one']]);
  });

  it('applies custom classes to the segmented root, options and each option', () => {
    render(
      <SegmentedControl
        label="群聊范围"
        value="all"
        onValueChange={() => {}}
        className="custom-root"
        classNames={{ options: 'custom-options', option: 'custom-option' }}
        options={[
          { value: 'all', label: '全部' },
          { value: 'one', label: '一所' },
        ]}
      />,
    );
    const group = screen.getByRole('group', { name: '群聊范围' });
    const options = screen.getAllByRole('radio');
    expect(group.classList.contains('custom-root')).toBe(true);
    expect(options[0].parentElement?.parentElement?.classList.contains('custom-options')).toBe(
      true,
    );
    expect(
      options.every((option) => option.parentElement?.classList.contains('custom-option')),
    ).toBe(true);
  });

  it('forwards native fieldset attributes and ref and submits the selected named value', () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(
      <form aria-label="筛选">
        <SegmentedControl
          ref={ref}
          id="audience"
          name="audience"
          data-context="filters"
          style={{ marginTop: 12 }}
          label="群聊范围"
          value="one"
          onValueChange={() => {}}
          options={[
            { value: 'all', label: '全部' },
            { value: 'one', label: '一所' },
          ]}
        />
      </form>,
    );
    const group = screen.getByRole('group', { name: '群聊范围' });
    const form = screen.getByRole('form', { name: '筛选' }) as HTMLFormElement;
    expect(ref.current).toBe(group);
    expect(group.id).toBe('audience');
    expect(group.getAttribute('data-context')).toBe('filters');
    expect(group.style.marginTop).toBe('12px');
    expect(
      screen.getAllByRole('radio').every((radio) => radio.getAttribute('name') === 'audience'),
    ).toBe(true);
    expect([...new FormData(form)]).toEqual([['audience', 'one']]);
  });

  it('associates every radio with an external form', () => {
    render(
      <>
        <form id="external-filters" aria-label="外部筛选" />
        <SegmentedControl
          form="external-filters"
          name="audience"
          label="群聊范围"
          value="all"
          onValueChange={() => {}}
          options={[
            { value: 'all', label: '全部' },
            { value: 'one', label: '一所' },
          ]}
        />
      </>,
    );
    const form = screen.getByRole('form', { name: '外部筛选' }) as HTMLFormElement;
    expect(
      screen.getAllByRole('radio').every((radio) => (radio as HTMLInputElement).form === form),
    ).toBe(true);
    expect([...new FormData(form)]).toEqual([['audience', 'all']]);
  });

  it('disables the whole group and reflects disabled state on each option', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <form aria-label="筛选">
        <SegmentedControl
          disabled
          name="audience"
          label="群聊范围"
          value="all"
          onValueChange={onValueChange}
          options={[
            { value: 'all', label: '全部' },
            { value: 'one', label: '一所' },
          ]}
        />
      </form>,
    );
    const group = screen.getByRole('group', { name: '群聊范围' }) as HTMLFieldSetElement;
    expect(group.disabled).toBe(true);
    for (const radio of screen.getAllByRole('radio')) {
      expect((radio as HTMLInputElement).disabled).toBe(true);
      expect(radio.parentElement?.hasAttribute('data-disabled')).toBe(true);
    }
    await user.click(screen.getByRole('radio', { name: '一所' }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect([
      ...new FormData(screen.getByRole('form', { name: '筛选' }) as HTMLFormElement),
    ]).toEqual([]);
  });

  it('requires a selection through native form validation', () => {
    const options = [
      { value: 'all', label: '全部' },
      { value: 'one', label: '一所' },
    ];
    const { rerender } = render(
      <form aria-label="筛选">
        <SegmentedControl
          required
          name="audience"
          label="群聊范围"
          value=""
          onValueChange={() => {}}
          options={options}
        />
      </form>,
    );
    const form = screen.getByRole('form', { name: '筛选' }) as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    rerender(
      <form aria-label="筛选">
        <SegmentedControl
          required
          name="audience"
          label="群聊范围"
          value="all"
          onValueChange={() => {}}
          options={options}
        />
      </form>,
    );
    expect(form.checkValidity()).toBe(true);
  });

  it('keeps generated names stable and separates unnamed groups', () => {
    const options = [{ value: 'all', label: '全部' }];
    const { rerender } = render(
      <SegmentedControl label="群聊范围" value="all" onValueChange={() => {}} options={options} />,
    );
    const name = (screen.getByRole('radio') as HTMLInputElement).name;
    rerender(
      <>
        <SegmentedControl label="群聊范围" value="all" onValueChange={() => {}} options={options} />
        <SegmentedControl label="其他范围" value="all" onValueChange={() => {}} options={options} />
      </>,
    );
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios[0].name).toBe(name);
    expect(radios[1].name).not.toBe(name);
  });
});
