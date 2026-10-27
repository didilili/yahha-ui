import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
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
});
