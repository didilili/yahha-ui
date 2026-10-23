import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { TextField } from './TextField.js';

afterEach(cleanup);

describe('TextField', () => {
  it('associates an input with its label, hint and error', () => {
    render(<TextField label="邮箱" hint="用来接收回复" error="请填写完整邮箱" />);
    const input = screen.getByRole('textbox', { name: '邮箱' });
    const descriptions = input
      .getAttribute('aria-describedby')!
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent);
    expect(descriptions).toEqual(['用来接收回复', '请填写完整邮箱']);
    expect(input.getAttribute('aria-invalid')).toBe('true');
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
});
