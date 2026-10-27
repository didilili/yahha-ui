import { createRef, useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup } from './RadioGroup.js';

afterEach(cleanup);

describe('RadioGroup', () => {
  it('associates a visible legend and descriptions, submits a controlled value and skips disabled options', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLFieldSetElement>();
    function Example() {
      const [value, setValue] = useState('all');
      return (
        <form
          aria-label="订阅"
          onReset={(event) => {
            event.preventDefault();
            setValue('all');
          }}
        >
          <RadioGroup
            ref={ref}
            label="邮件频率"
            name="frequency"
            value={value}
            onValueChange={setValue}
            hint="可随时修改"
            options={[
              { value: 'all', label: '每周', description: '周末收到一封' },
              { value: 'off', label: '每天', disabled: true },
              { value: 'monthly', label: '每月' },
            ]}
          />
          <button type="reset">重置</button>
        </form>
      );
    }
    render(<Example />);
    expect(ref.current).toBe(screen.getByRole('group', { name: '邮件频率' }));
    const weekly = screen.getByRole('radio', { name: '每周' }) as HTMLInputElement;
    expect(weekly.getAttribute('aria-describedby')?.split(' ')).toEqual([
      screen.getByText('可随时修改').id,
      screen.getByText('周末收到一封').id,
    ]);
    await user.click(screen.getByRole('radio', { name: '每天' }));
    expect(weekly.checked).toBe(true);
    await user.click(screen.getByRole('radio', { name: '每月' }));
    expect((screen.getByRole('radio', { name: '每月' }) as HTMLInputElement).checked).toBe(true);
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('frequency')).toBe(
      'monthly',
    );
    await user.click(screen.getByRole('button', { name: '重置' }));
    expect(weekly.checked).toBe(true);
  });

  it('does not submit a group disabled through a parent fieldset', () => {
    render(
      <form aria-label="偏好">
        <fieldset disabled>
          <RadioGroup
            label="排序"
            name="sort"
            value="newest"
            onValueChange={() => {}}
            options={[{ value: 'newest', label: '最新' }]}
          />
        </fieldset>
      </form>,
    );
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).has('sort')).toBe(false);
  });

  it('keeps group guidance and errors available on each focused native radio', () => {
    const options = [{ value: 'public', label: '公开', description: '所有读者都可以查看。' }];
    const { rerender } = render(
      <>
        <p id="privacy-note">提交后可以继续修改。</p>
        <RadioGroup
          label="收藏可见范围"
          options={options}
          value=""
          onValueChange={() => {}}
          hint="此设置影响个人主页。"
          error="请选择一种可见范围。"
          aria-describedby="privacy-note"
        />
      </>,
    );
    const radio = screen.getByRole('radio', { name: '公开' });
    const descriptionIds = radio.getAttribute('aria-describedby')?.split(' ');
    expect(descriptionIds).toEqual([
      'privacy-note',
      screen.getByText('此设置影响个人主页。').id,
      screen.getByText('请选择一种可见范围。').id,
      screen.getByText('所有读者都可以查看。').id,
    ]);
    expect(screen.getByRole('group', { name: '收藏可见范围' }).getAttribute('aria-invalid')).toBe(
      'true',
    );
    expect(radio.getAttribute('aria-invalid')).toBeNull();
    rerender(
      <RadioGroup label="收藏可见范围" options={options} value="public" onValueChange={() => {}} />,
    );
    const updatedRadio = screen.getByRole('radio', { name: '公开' });
    expect(updatedRadio.getAttribute('aria-invalid')).toBeNull();
    expect(updatedRadio.getAttribute('aria-describedby')).toBe(
      screen.getByText('所有读者都可以查看。').id,
    );
  });
});
