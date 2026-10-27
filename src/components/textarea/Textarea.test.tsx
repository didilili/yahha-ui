import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea.js';

afterEach(cleanup);

describe('Textarea', () => {
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
