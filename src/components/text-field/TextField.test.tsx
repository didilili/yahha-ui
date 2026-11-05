import { createRef, useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from './TextField.js';

afterEach(cleanup);

describe('TextField', () => {
  it.each([false, true])(
    'aligns slot direction with native input props without replacing the input (trailing: %s)',
    (hasTrailing) => {
      const ref = createRef<HTMLInputElement>();
      const slots = {
        leading: '@',
        trailing: hasTrailing ? <button type="button">复制</button> : undefined,
      };
      const { rerender } = render(
        <div dir="ltr">
          <TextField ref={ref} label="地址" defaultValue="hello world" dir="rtl" {...slots} />
        </div>,
      );
      const input = screen.getByRole('textbox', { name: '地址' }) as HTMLInputElement;
      const wrapper = input.parentElement!;
      const label = screen.getByText('地址');
      input.focus();
      input.setSelectionRange(1, 5);

      for (const [dir, direction] of [
        ['rtl', undefined],
        ['ltr', 'rtl'],
        ['rtl', 'ltr'],
        [undefined, undefined],
      ] as const) {
        rerender(
          <div dir="ltr">
            <TextField
              ref={ref}
              label="地址"
              defaultValue="hello world"
              dir={dir}
              style={{ direction, color: 'red' }}
              {...slots}
            />
          </div>,
        );
        expect(ref.current).toBe(input);
        expect(input.parentElement).toBe(wrapper);
        expect(input.getAttribute('dir')).toBe(dir ?? null);
        expect(wrapper.getAttribute('dir')).toBe(dir ?? null);
        expect(input.style.direction).toBe(direction ?? '');
        expect(wrapper.style.direction).toBe(direction ?? '');
        if (direction) {
          expect(getComputedStyle(wrapper).direction).toBe(direction);
          expect(getComputedStyle(input).direction).toBe(direction);
        }
        expect(input.style.color).toBe('red');
        expect(wrapper.style.color).toBe('');
        expect(label.getAttribute('dir')).toBe(null);
        expect(label.style.direction).toBe('');
        expect(input.value).toBe('hello world');
        expect(document.activeElement).toBe(input);
        expect([input.selectionStart, input.selectionEnd]).toEqual([1, 5]);
      }
    },
  );

  it('keeps the input, selection and native value when interactive slots change', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    const onClear = () => {
      if (ref.current) ref.current.value = '';
      ref.current?.focus();
    };
    const action = (
      <button type="button" onClick={onClear}>
        清空输入
      </button>
    );
    const { rerender } = render(<TextField ref={ref} label="搜索" defaultValue="周末散步" />);
    const input = screen.getByRole('textbox', { name: '搜索' }) as HTMLInputElement;
    input.focus();
    input.setSelectionRange(1, 3);
    rerender(
      <TextField
        ref={ref}
        label="搜索"
        defaultValue="周末散步"
        leading="⌕"
        trailing={action}
        classNames={{ trailing: 'custom-trailing' }}
      />,
    );
    expect(ref.current).toBe(input);
    expect(document.activeElement).toBe(input);
    expect([input.selectionStart, input.selectionEnd]).toEqual([1, 3]);
    expect(input.value).toBe('周末散步');
    expect(input.hasAttribute('trailing')).toBe(false);
    const button = screen.getByRole('button', { name: '清空输入' });
    expect(button.closest('[aria-hidden="true"]')).toBe(null);
    expect(button.parentElement?.classList.contains('custom-trailing')).toBe(true);
    await user.tab();
    expect(document.activeElement).toBe(button);
    await user.keyboard('{Enter}');
    expect(input.value).toBe('');
    expect(document.activeElement).toBe(input);
    rerender(<TextField ref={ref} label="搜索" defaultValue="周末散步" />);
    expect(ref.current).toBe(input);
    expect(input.value).toBe('');
    expect(document.activeElement).toBe(input);
  });

  it('preserves native form reset and caller-owned trailing disabled behavior', async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="订阅设置">
        <TextField
          label="地址"
          name="address"
          defaultValue="原地址"
          trailing={<button type="button">复制地址</button>}
        />
        <TextField
          label="只读"
          name="readonly"
          value="公开地址"
          readOnly
          trailing={<button type="button">复制只读地址</button>}
        />
        <TextField
          label="禁用"
          name="disabled"
          defaultValue="未提交"
          disabled
          trailing={
            <button type="button" disabled>
              禁用操作
            </button>
          }
        />
        <button type="reset">恢复字段</button>
      </form>,
    );
    const input = screen.getByRole('textbox', { name: '地址' }) as HTMLInputElement;
    await user.clear(input);
    await user.type(input, '新地址');
    const form = screen.getByRole('form', { name: '订阅设置' }) as HTMLFormElement;
    expect([...new FormData(form)]).toEqual([
      ['address', '新地址'],
      ['readonly', '公开地址'],
    ]);
    expect(
      (screen.getByRole('button', { name: '复制只读地址' }) as HTMLButtonElement).disabled,
    ).toBe(false);
    expect((screen.getByRole('button', { name: '禁用操作' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    await user.click(screen.getByRole('button', { name: '恢复字段' }));
    expect(input.value).toBe('原地址');
  });
  it('associates descriptions and removes cleared hint, error and caller descriptions', () => {
    const { rerender } = render(
      <TextField label="邮箱" hint="用来接收回复" error="请填写完整邮箱" />,
    );
    const input = screen.getByRole('textbox', { name: '邮箱' });
    const descriptions = input
      .getAttribute('aria-describedby')!
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent);
    expect(descriptions).toEqual(['用来接收回复', '请填写完整邮箱']);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    rerender(<TextField label="邮箱" hint="用来接收回复" aria-describedby="external-hint" />);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
    expect(input.getAttribute('aria-describedby')?.split(' ')).toEqual([
      'external-hint',
      screen.getByText('用来接收回复').id,
    ]);
    rerender(<TextField label="邮箱" />);
    expect(input.hasAttribute('aria-describedby')).toBe(false);
    expect(screen.queryByText('用来接收回复')).toBe(null);
    expect(screen.queryByText('请填写完整邮箱')).toBe(null);
  });

  it('allows styling every part while retaining the root className contract', () => {
    render(
      <TextField
        label="邮箱"
        leading="@"
        hint="用来接收回复"
        error="请填写完整邮箱"
        className="custom-field"
        classNames={{
          label: 'custom-label',
          inputWrapper: 'custom-wrapper',
          leading: 'custom-leading',
          input: 'custom-input',
          hint: 'custom-hint',
          error: 'custom-error',
        }}
      />,
    );
    const input = screen.getByRole('textbox', { name: '邮箱' });
    expect(input.parentElement?.parentElement?.classList.contains('custom-field')).toBe(true);
    expect(input.classList.contains('custom-field')).toBe(false);
    expect(screen.getByText('邮箱').classList.contains('custom-label')).toBe(true);
    expect(input.parentElement?.classList.contains('custom-wrapper')).toBe(true);
    expect(screen.getByText('@').classList.contains('custom-leading')).toBe(true);
    expect(input.classList.contains('custom-input')).toBe(true);
    expect(screen.getByText('用来接收回复').classList.contains('custom-hint')).toBe(true);
    expect(screen.getByText('请填写完整邮箱').classList.contains('custom-error')).toBe(true);
    expect(input.hasAttribute('classNames')).toBe(false);
  });

  it('keeps style, ref and native form attributes on the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <TextField
        ref={ref}
        label="邮箱"
        name="email"
        form="signup"
        required
        style={{ color: 'red' }}
        aria-describedby="external-hint"
        hint="用来接收回复"
      />,
    );
    const input = screen.getByRole('textbox', { name: '邮箱' }) as HTMLInputElement;
    expect(ref.current).toBe(input);
    expect(input.style.color).toBe('red');
    expect(input.parentElement?.parentElement?.style.color).toBe('');
    expect(input.name).toBe('email');
    expect(input.getAttribute('form')).toBe('signup');
    expect(input.required).toBe(true);
    expect(input.getAttribute('aria-describedby')?.split(' ')[0]).toBe('external-hint');
  });

  it('updates controlled values and removes a cleared error from the descriptions', async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState('');
      return (
        <>
          <p id="external-hint">不会公开邮箱</p>
          <TextField
            label="邮箱"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            hint="用来接收回复"
            error={value ? undefined : '请填写邮箱'}
            aria-describedby="external-hint"
            aria-invalid={false}
          />
        </>
      );
    }
    render(<Example />);
    const input = screen.getByRole('textbox', { name: '邮箱' }) as HTMLInputElement;
    const errorId = screen.getByText('请填写邮箱').id;
    expect(input.getAttribute('aria-describedby')?.split(' ')).toContain(errorId);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    await user.type(input, 'hachiware@example.com');
    expect(input.value).toBe('hachiware@example.com');
    expect(input.getAttribute('aria-invalid')).toBe('false');
    expect(screen.queryByText('请填写邮箱')).toBe(null);
    expect(
      input
        .getAttribute('aria-describedby')
        ?.split(' ')
        .map((id) => document.getElementById(id)?.textContent),
    ).toEqual(['不会公开邮箱', '用来接收回复']);
  });

  it('retains native readonly and disabled behavior while exposing their errors', async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="个人资料">
        <TextField label="昵称" name="nickname" value="小八" readOnly error="暂时不可修改" />
        <TextField
          label="邮箱"
          name="email"
          defaultValue="old@example.com"
          disabled
          error="请稍后再试"
        />
      </form>,
    );
    const readOnlyInput = screen.getByRole('textbox', { name: '昵称' }) as HTMLInputElement;
    const disabledInput = screen.getByRole('textbox', { name: '邮箱' }) as HTMLInputElement;
    await user.type(readOnlyInput, '新昵称');
    await user.type(disabledInput, 'new@example.com');
    expect(readOnlyInput.value).toBe('小八');
    expect(disabledInput.value).toBe('old@example.com');
    expect(disabledInput.disabled).toBe(true);
    expect(readOnlyInput.getAttribute('aria-invalid')).toBe('true');
    expect(disabledInput.getAttribute('aria-invalid')).toBe('true');
    expect([
      ...new FormData(screen.getByRole('form', { name: '个人资料' }) as HTMLFormElement),
    ]).toEqual([['nickname', '小八']]);
  });

  it('lets a native form reset restore an uncontrolled default value', async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="个人资料">
        <TextField label="昵称" name="nickname" defaultValue="小八" />
        <button type="reset">重置</button>
      </form>,
    );
    const input = screen.getByRole('textbox', { name: '昵称' }) as HTMLInputElement;
    await user.clear(input);
    await user.type(input, '吉伊');
    expect(input.value).toBe('吉伊');
    await user.click(screen.getByRole('button', { name: '重置' }));
    expect(input.value).toBe('小八');
  });

  it('retains numeric zero content with its description and decoration semantics', () => {
    const { rerender } = render(<TextField label="剩余次数" hint={0} error={0} leading={0} />);
    const input = screen.getByRole('textbox', { name: '剩余次数' });
    expect(
      input
        .getAttribute('aria-describedby')
        ?.split(' ')
        .map((id) => document.getElementById(id)?.textContent),
    ).toEqual(['0', '0']);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.parentElement?.querySelector('[aria-hidden="true"]')?.textContent).toBe('0');
    for (const content of [undefined, null, false, true, '']) {
      rerender(<TextField label="剩余次数" hint={content} error={content} leading={content} />);
      expect(input.hasAttribute('aria-describedby')).toBe(false);
      expect(input.hasAttribute('aria-invalid')).toBe(false);
      expect(input.parentElement?.querySelector('[aria-hidden="true"]')).toBe(null);
    }
  });
});
