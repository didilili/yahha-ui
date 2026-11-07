import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox.js';

afterEach(cleanup);

describe('Checkbox', () => {
  it('opts into selected-row highlighting without changing mixed state, form values or reset', async () => {
    const user = userEvent.setup();
    const view = (highlightSelected?: boolean) => (
      <form aria-label="偏好">
        <Checkbox
          label="全选分类"
          name="all"
          value="yes"
          defaultChecked
          indeterminate
          highlightSelected={highlightSelected}
        />
        <button type="reset">重置</button>
      </form>
    );
    const { rerender } = render(view());
    const input = screen.getByRole('checkbox', { name: '全选分类' }) as HTMLInputElement;
    const label = input.closest('label')!;
    expect(label.hasAttribute('data-highlight-selected')).toBe(false);
    rerender(view(true));
    expect(label.getAttribute('data-highlight-selected')).toBe('true');
    expect(input.hasAttribute('highlightselected')).toBe(false);
    expect(input.getAttribute('aria-checked')).toBe('mixed');
    expect(input.indeterminate).toBe(true);
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('all')).toBe('yes');
    await user.click(label);
    expect(input.checked).toBe(false);
    expect(input.indeterminate).toBe(true);
    await user.click(screen.getByRole('button', { name: '重置' }));
    expect(input.checked).toBe(true);
    expect(input.indeterminate).toBe(true);
    rerender(view(false));
    expect(label.hasAttribute('data-highlight-selected')).toBe(false);
    expect(input.checked).toBe(true);
  });

  it('uses native checked state, label click, required validation and form reset', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    render(
      <form aria-label="订阅">
        <Checkbox
          ref={ref}
          label="接收更新"
          hint="每月一封"
          name="updates"
          value="yes"
          required
          onChange={onChange}
        />
        <button type="reset">重置</button>
      </form>,
    );
    const input = screen.getByRole('checkbox', { name: '接收更新' }) as HTMLInputElement;
    expect(ref.current).toBe(input);
    expect(input.checkValidity()).toBe(false);
    await user.click(screen.getByText('接收更新'));
    expect(input.checked).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('updates')).toBe('yes');
    expect(input.getAttribute('aria-describedby')).toBe(screen.getByText('每月一封').id);
    await user.click(screen.getByRole('button', { name: '重置' }));
    expect(input.checked).toBe(false);
  });

  it('exposes mixed state and keeps disabled fields out of submission', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Checkbox label="全选" indeterminate error="请至少选择一项" />);
    const input = screen.getByRole('checkbox', { name: '全选' }) as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    expect(input.getAttribute('aria-checked')).toBe('mixed');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    rerender(
      <form aria-label="订阅">
        <fieldset disabled>
          <Checkbox label="全选" defaultChecked name="all" />
        </fieldset>
      </form>,
    );
    await user.click(screen.getByRole('checkbox', { name: '全选' }));
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).has('all')).toBe(false);
  });

  it('retains the controlled mixed mark through clicks and external form reset without changing submission', async () => {
    const user = userEvent.setup();
    render(
      <>
        <p id="context">部分分类已开启。</p>
        <form id="preferences" aria-label="偏好">
          <button type="reset">重置偏好</button>
        </form>
        <Checkbox
          label="订阅所有分类"
          form="preferences"
          name="all"
          value="yes"
          indeterminate
          hint="再次选择可以全选。"
          error="请确认订阅范围。"
          aria-describedby="context"
        />
      </>,
    );
    const input = screen.getByRole('checkbox', { name: '订阅所有分类' }) as HTMLInputElement;
    const form = screen.getByRole('form') as HTMLFormElement;
    expect(input.getAttribute('aria-describedby')?.split(' ')).toEqual([
      'context',
      screen.getByText('再次选择可以全选。').id,
      screen.getByText('请确认订阅范围。').id,
    ]);
    expect(new FormData(form).has('all')).toBe(false);
    await user.click(screen.getByText('订阅所有分类'));
    expect(input.checked).toBe(true);
    expect(input.indeterminate).toBe(true);
    expect(new FormData(form).get('all')).toBe('yes');
    await user.click(screen.getByRole('button', { name: '重置偏好' }));
    expect(input.checked).toBe(false);
    expect(input.indeterminate).toBe(true);
  });

  it('uses the updated controlled mixed state after a native form reset', async () => {
    function Example() {
      const [indeterminate, setIndeterminate] = useState(true);
      return (
        <form onReset={() => setIndeterminate(false)}>
          <Checkbox label="全选" indeterminate={indeterminate} />
          <button type="reset">重置</button>
        </form>
      );
    }
    render(<Example />);
    const input = screen.getByRole('checkbox', { name: '全选' }) as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: '重置' }));
    expect(input.hasAttribute('aria-checked')).toBe(false);
    await Promise.resolve();
    expect(input.indeterminate).toBe(false);
  });
});
