import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea.js';

afterEach(cleanup);

describe('Textarea', () => {
  it('keeps the post-reset frame through a caller render and cancels it on unmount', () => {
    const request = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(7);
    const cancel = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    const example = (hint: string) => (
      <form aria-label="草稿表单">
        <Textarea label="草稿" defaultValue="初始" autoSize hint={hint} />
      </form>
    );
    const { rerender, unmount } = render(example('修改后重置'));
    fireEvent.reset(screen.getByRole('form', { name: '草稿表单' }));
    expect(request).toHaveBeenCalledTimes(1);
    rerender(example('调用方在 onReset 后清除了预览'));
    expect(cancel).not.toHaveBeenCalled();
    unmount();
    expect(cancel).toHaveBeenCalledWith(7);
  });

  it('opts into autoSize without leaking props and returns current styles when disabled', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const { rerender } = render(
      <Textarea
        ref={ref}
        label="草稿"
        autoSize={{ minRows: 2, maxRows: 8 }}
        rows={3}
        defaultValue="初始草稿"
        style={{ height: 180, resize: 'both', overflowY: 'scroll' }}
      />,
    );
    const input = screen.getByRole('textbox', { name: '草稿' }) as HTMLTextAreaElement;
    expect(input.hasAttribute('autoSize')).toBe(false);
    expect(input.rows).toBe(3);
    expect(ref.current).toBe(input);
    expect(input.style.height).not.toBe('180px');
    expect(input.style.resize).toBe('none');
    expect(input.style.overflowY).toBe('auto');
    rerender(
      <Textarea
        ref={ref}
        label="草稿"
        autoSize={false}
        rows={3}
        defaultValue="初始草稿"
        style={{ height: 210, resize: 'horizontal', overflowY: 'hidden' }}
      />,
    );
    expect(ref.current).toBe(input);
    expect(input.style.height).toBe('210px');
    expect(input.style.resize).toBe('horizontal');
    expect(input.style.overflowY).toBe('hidden');
  });

  it('keeps the native node, callback ref cleanup and caller input events across mode changes', async () => {
    const user = userEvent.setup();
    const detached = vi.fn();
    const attached = vi.fn();
    const onInput = vi.fn();
    const onChange = vi.fn();
    const onCompositionStart = vi.fn();
    const ref = (node: HTMLTextAreaElement | null) => {
      if (!node) return;
      attached(node);
      return detached;
    };
    const props = {
      ref,
      label: '留言',
      defaultValue: '原文',
      onInput,
      onChange,
      onCompositionStart,
    };
    const { rerender, unmount } = render(<Textarea {...props} autoSize />);
    const input = screen.getByRole('textbox', { name: '留言' }) as HTMLTextAreaElement;
    expect(attached).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
    await user.type(input, '字');
    fireEvent.compositionStart(input);
    expect(input.value).toBe('原文字');
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onCompositionStart).toHaveBeenCalledTimes(1);
    rerender(<Textarea {...props} autoSize={false} />);
    rerender(<Textarea {...props} autoSize={{ minRows: 2, maxRows: 8 }} />);
    expect(screen.getByRole('textbox', { name: '留言' })).toBe(input);
    expect(input.value).toBe('原文字');
    expect(attached).toHaveBeenCalledTimes(1);
    expect(detached).not.toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledTimes(1);
    unmount();
    expect(detached).toHaveBeenCalledTimes(1);
  });

  it('associates label, hint and error while targeting the textarea with ref and native props', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const { rerender } = render(
      <Textarea
        ref={ref}
        label="留言"
        hint={0}
        error="请填写留言"
        className="field"
        classNames={{ textarea: 'control' }}
        rows={5}
        style={{ resize: 'none' }}
      />,
    );
    const input = screen.getByRole('textbox', { name: '留言' }) as HTMLTextAreaElement;
    expect(ref.current).toBe(input);
    expect(input.rows).toBe(5);
    expect(input.style.resize).toBe('none');
    expect(input.classList.contains('control')).toBe(true);
    expect(input.parentElement?.classList.contains('field')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(
      input
        .getAttribute('aria-describedby')
        ?.split(' ')
        .map((id) => document.getElementById(id)?.textContent),
    ).toEqual(['0', '请填写留言']);
    rerender(<Textarea label="留言" aria-describedby="external" hint="可换行" />);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
    expect(input.getAttribute('aria-describedby')?.split(' ')[0]).toBe('external');
  });

  it('keeps native form submission, uncontrolled reset, readonly and inherited disabled behavior', async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="留言表单">
        <Textarea label="留言" name="message" defaultValue="你好" />
        <Textarea label="只读" name="fixed" defaultValue="保持" readOnly />
        <fieldset disabled>
          <Textarea label="禁用" name="disabled" defaultValue="不提交" />
        </fieldset>
        <button type="reset">重置</button>
      </form>,
    );
    const input = screen.getByRole('textbox', { name: '留言' }) as HTMLTextAreaElement;
    await user.type(input, '\n谢谢');
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('message')).toBe(
      '你好\n谢谢',
    );
    await user.type(screen.getByRole('textbox', { name: '只读' }), '修改');
    expect((screen.getByRole('textbox', { name: '只读' }) as HTMLTextAreaElement).value).toBe(
      '保持',
    );
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).has('disabled')).toBe(false);
    await user.click(screen.getByRole('button', { name: '重置' }));
    expect(input.value).toBe('你好');
  });
});
