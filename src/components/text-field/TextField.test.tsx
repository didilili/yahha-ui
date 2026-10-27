import { createRef, useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from './TextField.js';

afterEach(cleanup);

describe('TextField', () => {
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
