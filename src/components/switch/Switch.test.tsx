import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './Switch.js';

afterEach(cleanup);

describe('Switch', () => {
  it('supports native form values, label and Space toggling, ref and reset', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    render(
      <form aria-label="偏好">
        <Switch
          ref={ref}
          label="显示封面"
          hint="即时生效"
          name="covers"
          value="show"
          defaultChecked
        />
        <button type="reset">重置</button>
      </form>,
    );
    const input = screen.getByRole('switch', { name: '显示封面' }) as HTMLInputElement;
    expect(ref.current).toBe(input);
    expect(input.checked).toBe(true);
    await user.click(screen.getByText('显示封面'));
    expect(input.checked).toBe(false);
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).has('covers')).toBe(false);
    input.focus();
    await user.keyboard(' ');
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('covers')).toBe('show');
    await user.click(screen.getByText('显示封面'));
    await user.click(screen.getByRole('button', { name: '重置' }));
    expect(input.checked).toBe(true);
  });

  it('respects disabled state inherited from a fieldset', async () => {
    const user = userEvent.setup();
    render(
      <fieldset disabled>
        <Switch label="通知" defaultChecked />
      </fieldset>,
    );
    const input = screen.getByRole('switch') as HTMLInputElement;
    await user.click(screen.getByText('通知'));
    expect(input.checked).toBe(true);
  });

  it('keeps a stable name and both descriptions while omitting disabled form values', async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="阅读偏好">
        <p id="local-only">仅在当前页面生效</p>
        <Switch
          label="显示文章摘要"
          hint="切换后立即更新预览"
          aria-describedby="local-only"
          name="excerpt"
          value="visible"
          defaultChecked
        />
        <Switch label="署名" name="signature" defaultChecked disabled />
        <fieldset disabled>
          <Switch label="通知" name="notifications" defaultChecked />
        </fieldset>
      </form>,
    );
    const input = screen.getByRole('switch', { name: '显示文章摘要' });
    const descriptions = input.getAttribute('aria-describedby')?.split(' ') ?? [];
    expect(descriptions).toHaveLength(2);
    expect(descriptions.map((id) => document.getElementById(id)?.textContent)).toEqual([
      '仅在当前页面生效',
      '切换后立即更新预览',
    ]);
    const form = screen.getByRole('form', { name: '阅读偏好' }) as HTMLFormElement;
    expect([...new FormData(form)]).toEqual([['excerpt', 'visible']]);
    await user.click(screen.getByText('显示文章摘要'));
    expect(screen.getByRole('switch', { name: '显示文章摘要' })).toBe(input);
    expect([...new FormData(form)]).toEqual([]);
  });

  it.each([false, true])(
    'locks native activation while loading with checked=%s',
    async (checked) => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const onClick = vi.fn();
      render(
        <form aria-label="加载中的偏好">
          <Switch
            label="启用通知"
            name="notifications"
            value="enabled"
            defaultChecked={checked}
            loading
            onChange={onChange}
            onClick={onClick}
          />
        </form>,
      );
      const input = screen.getByRole('switch', { name: '启用通知' }) as HTMLInputElement;
      const form = screen.getByRole('form') as HTMLFormElement;
      input.focus();
      await user.keyboard(' ');
      expect(input.checked).toBe(checked);
      await user.click(input);
      expect(input.checked).toBe(checked);
      await user.click(screen.getByText('启用通知'));
      expect(input.checked).toBe(checked);
      expect(new FormData(form).get('notifications')).toBe(checked ? 'enabled' : null);
      expect(input.disabled).toBe(false);
      expect(input.getAttribute('aria-busy')).toBe('true');
      expect(input.getAttribute('aria-disabled')).toBe('true');
      expect(input.hasAttribute('loading')).toBe(false);
      expect(onChange).not.toHaveBeenCalled();
      expect(onClick).not.toHaveBeenCalled();
      input.focus();
      expect(document.activeElement).toBe(input);
    },
  );

  it('preserves current focus on loading label clicks without stealing outside focus', async () => {
    const user = userEvent.setup();
    const example = (loading: boolean) => (
      <>
        <Switch label="启用通知" loading={loading} />
        <button>外部操作</button>
      </>
    );
    const { rerender } = render(example(true));
    const input = screen.getByRole('switch') as HTMLInputElement;
    const label = screen.getByText('启用通知');
    const outside = screen.getByRole('button', { name: '外部操作' });
    input.focus();
    await user.click(label);
    expect(document.activeElement).toBe(input);
    expect(input.checked).toBe(false);

    await user.click(outside);
    expect(document.activeElement).toBe(outside);
    await user.click(label);
    expect(document.activeElement).toBe(outside);
    expect(input.checked).toBe(false);

    rerender(example(false));
    await user.click(label);
    expect(document.activeElement).toBe(input);
    expect(input.checked).toBe(true);
  });

  it('does not warn when a controlled switch starts loading', async () => {
    const user = userEvent.setup();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onChange = vi.fn();
    const { rerender } = render(<Switch label="启用通知" checked loading onChange={onChange} />);
    const input = screen.getByRole('switch') as HTMLInputElement;
    expect(consoleError.mock.calls).toEqual([]);
    await user.click(input);
    input.focus();
    await user.keyboard(' ');
    expect(input.checked).toBe(true);
    expect(onChange).not.toHaveBeenCalled();

    rerender(<Switch label="启用通知" checked onChange={onChange} />);
    expect(screen.getByRole('switch')).toBe(input);
    await user.click(input);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(input.checked).toBe(true);
    expect(consoleError.mock.calls).toEqual([]);
  });

  it('mirrors direction without redirecting native input props or remounting the control', () => {
    const ref = createRef<HTMLInputElement>();
    const example = (dir: 'ltr' | 'rtl', direction?: 'ltr' | 'rtl') => (
      <form aria-label="方向偏好">
        <Switch
          ref={ref}
          label="启用通知"
          name="notifications"
          value="enabled"
          defaultChecked
          loading
          dir={dir}
          style={{ direction, marginInlineStart: 3 }}
        />
      </form>
    );
    const { rerender } = render(example('rtl'));
    const input = screen.getByRole('switch') as HTMLInputElement;
    const label = input.closest('label');
    const track = input.parentElement;
    expect(ref.current).toBe(input);
    expect(input.dir).toBe('rtl');
    expect(track?.dir).toBe('rtl');
    expect(label?.dir).toBe('');
    expect(input.style.marginInlineStart).toBe('3px');
    expect(track?.style.marginInlineStart).toBe('');
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('notifications')).toBe(
      'enabled',
    );

    rerender(example('rtl', 'ltr'));
    expect(ref.current).toBe(input);
    expect(input.parentElement).toBe(track);
    expect(input.dir).toBe('rtl');
    expect(input.style.direction).toBe('ltr');
    expect(track?.dir).toBe('rtl');
    expect(track?.style.direction).toBe('ltr');
    expect(label?.dir).toBe('');
    expect(input.checked).toBe(true);

    rerender(example('ltr'));
    expect(ref.current).toBe(input);
    expect(input.parentElement).toBe(track);
    expect(input.dir).toBe('ltr');
    expect(track?.dir).toBe('ltr');
    expect(input.style.direction).toBe('');
    expect(track?.style.direction).toBe('');
  });

  it('retains the input, label, value, focus and native slots across loading changes', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const onClick = vi.fn();
    const example = (loading: boolean) => (
      <form aria-label="可恢复的偏好">
        <Switch
          ref={ref}
          label="启用通知"
          name="notifications"
          value="enabled"
          defaultChecked={false}
          loading={loading}
          style={{ marginInlineStart: 3 }}
          classNames={{ label: 'custom-label', input: 'custom-input', text: 'custom-text' }}
          onChange={onChange}
          onClick={onClick}
        />
      </form>
    );
    const { rerender } = render(example(false));
    const input = screen.getByRole('switch') as HTMLInputElement;
    const label = input.closest('label');
    const track = input.parentElement;
    const text = screen.getByText('启用通知');
    const form = screen.getByRole('form') as HTMLFormElement;
    await user.click(input);
    expect(input.checked).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(example(true));
    expect(ref.current).toBe(input);
    expect(screen.getByRole('switch')).toBe(input);
    expect(input.closest('label')).toBe(label);
    expect(input.parentElement).toBe(track);
    expect(track?.nextElementSibling).toBe(text);
    expect(document.activeElement).toBe(input);
    expect(input.classList.contains('custom-input')).toBe(true);
    expect(label?.classList.contains('custom-label')).toBe(true);
    expect(text.classList.contains('custom-text')).toBe(true);
    expect(input.style.marginInlineStart).toBe('3px');
    expect(new FormData(form).get('notifications')).toBe('enabled');
    expect(track?.lastElementChild?.getAttribute('aria-hidden')).toBe('true');
    expect(screen.queryByRole('status')).toBe(null);
    await user.keyboard(' ');
    expect(input.checked).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(example(false));
    expect(ref.current).toBe(input);
    expect(input.closest('label')).toBe(label);
    expect(input.parentElement).toBe(track);
    expect(track?.nextElementSibling).toBe(text);
    expect(track?.lastElementChild).toBe(input);
    expect(label?.lastElementChild).toBe(text);
    expect(document.activeElement).toBe(input);
    expect(input.hasAttribute('aria-busy')).toBe(false);
    expect(input.hasAttribute('aria-disabled')).toBe(false);
    await user.keyboard(' ');
    expect(input.checked).toBe(false);
    expect(new FormData(form).has('notifications')).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('preserves native reset and disabled fieldset semantics while loading', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onClick = vi.fn();
    render(
      <form aria-label="禁用和重置">
        <Switch label="可重置" name="active" defaultChecked loading />
        <Switch
          label="显式禁用"
          name="disabled"
          defaultChecked
          disabled
          loading
          onChange={onChange}
          onClick={onClick}
        />
        <fieldset disabled>
          <Switch
            label="父级禁用"
            name="fieldset"
            defaultChecked
            loading
            onChange={onChange}
            onClick={onClick}
          />
        </fieldset>
        <button type="reset">重置</button>
      </form>,
    );
    const input = screen.getByRole('switch', { name: '可重置' }) as HTMLInputElement;
    const form = screen.getByRole('form') as HTMLFormElement;
    input.checked = false;
    await user.click(screen.getByRole('button', { name: '重置' }));
    expect(input.checked).toBe(true);
    expect([...new FormData(form)]).toEqual([['active', 'on']]);
    for (const name of ['显式禁用', '父级禁用']) {
      const disabled = screen.getByRole('switch', { name }) as HTMLInputElement;
      expect(disabled.matches(':disabled')).toBe(true);
      await user.click(screen.getByText(name));
      expect(disabled.checked).toBe(true);
    }
    input.focus();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '重置' }));
    expect(onChange).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards capture and non-activation keyboard events while blocking loading clicks', async () => {
    const user = userEvent.setup();
    const onKeyDownCapture = vi.fn();
    const onKeyDown = vi.fn();
    const onKeyUp = vi.fn();
    const onFocus = vi.fn();
    const onClickCapture = vi.fn();
    render(
      <Switch
        label="启用通知"
        loading
        onKeyDownCapture={onKeyDownCapture}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onFocus={onFocus}
        onClickCapture={onClickCapture}
      />,
    );
    const input = screen.getByRole('switch');
    input.focus();
    expect(onFocus).toHaveBeenCalledTimes(1);
    await user.keyboard('{ArrowRight} ');
    expect(onKeyDownCapture.mock.calls.map(([event]) => event.key)).toEqual(['ArrowRight', ' ']);
    expect(onKeyDown.mock.calls.map(([event]) => event.key)).toEqual(['ArrowRight']);
    expect(onKeyUp.mock.calls.map(([event]) => event.key)).toEqual(['ArrowRight', ' ']);
    await user.click(input);
    expect(onClickCapture).not.toHaveBeenCalled();
  });
});
