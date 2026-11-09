import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Button,
  Checkbox,
  Form,
  FormError,
  Input,
  RadioGroup,
  SegmentedControl,
  Select,
  Switch,
  Textarea,
  type FormState,
} from '../../index.js';

afterEach(cleanup);

function deferred<Value>() {
  let resolve!: (value: Value) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<Value>((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return { promise, resolve, reject };
}

describe('Form', () => {
  it('binds all seven controls, submits primitive values and native successful controls, and resets', async () => {
    const user = userEvent.setup();
    const save = vi.fn();
    const ref = createRef<HTMLFormElement>();
    const initialValues = {
      nickname: '库米',
      note: '散步',
      agreed: false,
      updates: true,
      category: null as string | null,
      signature: 'named',
      view: 'list',
    };
    let state!: FormState<typeof initialValues>;
    render(
      <Form
        ref={ref}
        id="profile"
        aria-label="个人资料"
        initialValues={initialValues}
        onSubmit={save}
      >
        {(form) => {
          state = form;
          return (
            <>
              <Input label="昵称" {...form.input('nickname')} />
              <Textarea label="留言" {...form.input('note')} />
              <Checkbox label="同意公开" {...form.checked('agreed')} />
              <Switch
                label="接收更新"
                {...form.checked('updates', { errorPlacement: 'external' })}
              />
              <FormError name="updates" />
              <Select
                label="分类"
                options={[{ value: 'reading', label: '阅读' }]}
                {...form.choice('category')}
              />
              <RadioGroup
                label="署名"
                options={[
                  { value: 'named', label: '昵称署名' },
                  { value: 'anonymous', label: '匿名' },
                ]}
                {...form.choice('signature')}
              />
              <SegmentedControl
                label="视图"
                options={[
                  { value: 'list', label: '列表' },
                  { value: 'cards', label: '卡片' },
                ]}
                {...form.choice('view', { errorPlacement: 'external' })}
              />
              <FormError name="view" />
              <Button type="reset">恢复</Button>
              <button type="submit">保存</button>
            </>
          );
        }}
      </Form>,
    );
    expect(ref.current).toBe(screen.getByRole('form', { name: '个人资料' }));
    const stableRef = state.input('nickname').ref;
    await user.clear(screen.getByRole('textbox', { name: '昵称' }));
    await user.type(screen.getByRole('textbox', { name: '昵称' }), '乌萨奇');
    await user.type(screen.getByRole('textbox', { name: '留言' }), '很好');
    await user.click(screen.getByRole('checkbox', { name: '同意公开' }));
    await user.click(screen.getByRole('switch', { name: '接收更新' }));
    await user.click(screen.getByRole('combobox', { name: '分类' }));
    await user.click(await screen.findByRole('option', { name: '阅读' }));
    await user.click(screen.getByRole('radio', { name: '匿名' }));
    await user.click(screen.getByRole('radio', { name: '卡片' }));
    expect(state.input('nickname').ref).toBe(stableRef);
    await user.click(screen.getByRole('button', { name: '保存' }));
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    expect(save.mock.calls[0][0]).toEqual({
      nickname: '乌萨奇',
      note: '散步很好',
      agreed: true,
      updates: false,
      category: 'reading',
      signature: 'anonymous',
      view: 'cards',
    });
    expect(Object.fromEntries(save.mock.calls[0][1].formData)).toEqual({
      nickname: '乌萨奇',
      note: '散步很好',
      agreed: 'on',
      category: 'reading',
      signature: 'anonymous',
      view: 'cards',
    });
    await user.click(screen.getByRole('button', { name: '恢复' }));
    expect(state.values).toEqual(initialValues);
    expect((screen.getByRole('textbox', { name: '昵称' }) as HTMLInputElement).value).toBe('库米');
    expect((screen.getByRole('switch', { name: '接收更新' }) as HTMLInputElement).checked).toBe(
      true,
    );
    expect(screen.getByRole('combobox', { name: '分类' }).textContent).toContain('请选择');
  });

  it('merges native constraints with custom validation, blocks submit and focuses the first field in DOM order', async () => {
    const user = userEvent.setup();
    const save = vi.fn();
    render(
      <Form
        aria-label="校验"
        initialValues={{ nickname: '', email: '' }}
        onSubmit={save}
        validate={() => ({ email: '请确认邮箱。' })}
      >
        {(form) => (
          <>
            <Input label="昵称" required {...form.input('nickname')} />
            <Input label="邮箱" {...form.input('email')} />
            <button type="submit">检查</button>
          </>
        )}
      </Form>,
    );
    await user.click(screen.getByRole('button', { name: '检查' }));
    await screen.findByText('请确认邮箱。');
    expect(save).not.toHaveBeenCalled();
    const nickname = screen.getByRole('textbox', { name: '昵称' });
    await waitFor(() => expect(document.activeElement).toBe(nickname));
    expect(nickname.getAttribute('aria-invalid')).toBe('true');
    expect(nickname.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('focuses a radio inside a group and associates external group/switch errors once', async () => {
    const user = userEvent.setup();
    render(
      <Form
        initialValues={{ view: '', updates: false }}
        validate={() => ({ view: '请选择视图。', updates: '请确认更新设置。' })}
      >
        {(form) => (
          <>
            <SegmentedControl
              label="视图"
              options={[
                { value: 'disabled', label: '不可选', disabled: true },
                { value: 'list', label: '列表' },
              ]}
              {...form.choice('view', { errorPlacement: 'external' })}
            />
            <FormError name="view" />
            <Switch label="更新" {...form.checked('updates', { errorPlacement: 'external' })} />
            <FormError name="updates" />
            <button type="submit">检查</button>
          </>
        )}
      </Form>,
    );
    await user.click(screen.getByRole('button', { name: '检查' }));
    await screen.findByText('请选择视图。');
    expect(screen.getAllByText('请选择视图。')).toHaveLength(1);
    expect(screen.getAllByText('请确认更新设置。')).toHaveLength(1);
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole('radio', { name: '列表' })),
    );
    const group = screen.getByRole('group', { name: '视图' });
    expect(group.getAttribute('aria-invalid')).toBe('true');
    const switchInput = screen.getByRole('switch', { name: '更新' });
    expect(
      document.getElementById(switchInput.getAttribute('aria-describedby')!)?.textContent,
    ).toContain('请确认更新设置。');
  });

  it('maps native Select required errors to its visible trigger', async () => {
    const user = userEvent.setup();
    const save = vi.fn();
    render(
      <Form initialValues={{ category: null as string | null }} onSubmit={save}>
        {(form) => (
          <>
            <Select
              label="分类"
              required
              options={[{ value: 'reading', label: '阅读' }]}
              {...form.choice('category')}
            />
            <button type="submit">保存</button>
          </>
        )}
      </Form>,
    );
    await user.click(screen.getByRole('button', { name: '保存' }));
    const trigger = screen.getByRole('combobox', { name: '分类' });
    await waitFor(() => expect(trigger.getAttribute('aria-invalid')).toBe('true'));
    expect(document.activeElement).toBe(trigger);
    expect(save).not.toHaveBeenCalled();
  });

  it('preserves external submit and reset buttons, first initial values and reset cancellation', async () => {
    const user = userEvent.setup();
    const save = vi.fn();
    const onReset = vi.fn((event) => event.preventDefault());
    const makeForm = (initial: string, cancel: boolean) => (
      <>
        <Form
          id="outside"
          initialValues={{ nickname: initial }}
          onSubmit={save}
          onReset={cancel ? onReset : undefined}
        >
          {(form) => <Input label="昵称" {...form.input('nickname')} />}
        </Form>
        <button type="submit" form="outside">
          外部保存
        </button>
        <button type="reset" form="outside">
          外部重置
        </button>
      </>
    );
    const { rerender } = render(makeForm('库米', true));
    const input = screen.getByRole('textbox', { name: '昵称' }) as HTMLInputElement;
    await user.clear(input);
    await user.type(input, '编辑后');
    rerender(makeForm('另一个初始值', true));
    await user.click(screen.getByRole('button', { name: '外部重置' }));
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(input.value).toBe('编辑后');
    await user.click(screen.getByRole('button', { name: '外部保存' }));
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    rerender(makeForm('另一个初始值', false));
    await user.click(screen.getByRole('button', { name: '外部重置' }));
    expect(input.value).toBe('库米');
  });

  it('clears external errors on editing and revalidates after the first failed submit', async () => {
    const user = userEvent.setup();
    render(
      <Form
        initialValues={{ nickname: '' }}
        errors={{ nickname: '服务端错误。' }}
        validate={(values) => (values.nickname.length < 2 ? { nickname: '至少两字。' } : {})}
      >
        {(form) => (
          <>
            <Input label="昵称" {...form.input('nickname')} />
            <button type="submit">检查</button>
          </>
        )}
      </Form>,
    );
    await screen.findByText('服务端错误。');
    await user.type(screen.getByRole('textbox', { name: '昵称' }), '米');
    expect(screen.queryByText('服务端错误。')).toBe(null);
    expect(screen.queryByText('至少两字。')).toBe(null);
    await user.click(screen.getByRole('button', { name: '检查' }));
    await screen.findByText('至少两字。');
    await user.type(screen.getByRole('textbox', { name: '昵称' }), '粒');
    await waitFor(() => expect(screen.queryByText('至少两字。')).toBe(null));
  });

  it.each(['onBlur', 'onChange'] as const)(
    'validates at %s without prematurely focusing an editing field',
    async (validationMode) => {
      const user = userEvent.setup();
      render(
        <Form
          initialValues={{ nickname: '' }}
          validationMode={validationMode}
          validate={(values) => (values.nickname === '好' ? {} : { nickname: '请改正。' })}
        >
          {(form) => (
            <>
              <Input label="昵称" {...form.input('nickname')} />
              <button type="button">其他</button>
            </>
          )}
        </Form>,
      );
      const input = screen.getByRole('textbox', { name: '昵称' });
      await user.type(input, '错');
      if (validationMode === 'onBlur') expect(screen.queryByText('请改正。')).toBe(null);
      await user.click(screen.getByRole('button', { name: '其他' }));
      await screen.findByText('请改正。');
      expect(document.activeElement).toBe(screen.getByRole('button', { name: '其他' }));
    },
  );

  it('ignores unmounted and disabled errors while retaining drafts in values and native omissions in formData', async () => {
    const user = userEvent.setup();
    const save = vi.fn();
    function Example() {
      const [visible, setVisible] = useState(true);
      return (
        <Form
          initialValues={{ nickname: '草稿', disabled: '禁用草稿' }}
          onSubmit={save}
          validate={() => ({ nickname: '旧字段错误。', disabled: '禁用错误。' })}
        >
          {(form) => (
            <>
              {visible && <Input label="昵称" {...form.input('nickname')} />}
              <Input label="禁用" disabled {...form.input('disabled')} />
              <button type="button" onClick={() => setVisible(false)}>
                隐藏
              </button>
              <button type="submit">保存</button>
            </>
          )}
        </Form>
      );
    }
    render(<Example />);
    await user.click(screen.getByRole('button', { name: '隐藏' }));
    await user.click(screen.getByRole('button', { name: '保存' }));
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    expect(save.mock.calls[0][0]).toEqual({ nickname: '草稿', disabled: '禁用草稿' });
    expect([...save.mock.calls[0][1].formData]).toEqual([]);
    expect(screen.queryByText('旧字段错误。')).toBe(null);
    expect(screen.queryByText('禁用错误。')).toBe(null);
  });

  it('invalidates async validation after edits and lets the current value validate independently', async () => {
    const user = userEvent.setup();
    const first = deferred<{ nickname?: string }>();
    const save = vi.fn();
    let calls = 0;
    let state!: FormState<{ nickname: string }>;
    render(
      <Form
        initialValues={{ nickname: '' }}
        onSubmit={save}
        validate={() => (++calls === 1 ? first.promise : {})}
      >
        {(form) => {
          state = form;
          return <Input label="昵称" {...form.input('nickname')} />;
        }}
      </Form>,
    );
    let pending!: Promise<boolean>;
    act(() => {
      pending = state.submit();
    });
    expect(state.isValidating).toBe(true);
    await user.type(screen.getByRole('textbox', { name: '昵称' }), '新值');
    await act(async () => first.resolve({ nickname: '过期错误。' }));
    expect(await pending).toBe(false);
    expect(screen.queryByText('过期错误。')).toBe(null);
    expect(save).not.toHaveBeenCalled();
    await act(async () => {
      expect(await state.submit()).toBe(true);
    });
    expect(save).toHaveBeenCalledTimes(1);
    expect(save.mock.calls[0][0]).toEqual({ nickname: '新值' });
  });

  it('locks duplicate submit, aborts obsolete submissions and does not let old errors or finally replace a newer attempt', async () => {
    const user = userEvent.setup();
    const old = deferred<{ nickname: string }>();
    const latest = deferred<void>();
    const signals: AbortSignal[] = [];
    const save = vi.fn((_values, context) => {
      signals.push(context.signal);
      return signals.length === 1 ? old.promise : latest.promise;
    });
    let state!: FormState<{ nickname: string }>;
    render(
      <Form initialValues={{ nickname: '原值' }} onSubmit={save}>
        {(form) => {
          state = form;
          return <Input label="昵称" {...form.input('nickname')} />;
        }}
      </Form>,
    );
    let first!: Promise<boolean>;
    act(() => {
      first = state.submit();
    });
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    await act(async () => {
      expect(await state.submit()).toBe(false);
    });
    await user.type(screen.getByRole('textbox', { name: '昵称' }), '编辑');
    expect(signals[0].aborted).toBe(true);
    let second!: Promise<boolean>;
    act(() => {
      second = state.submit();
    });
    await waitFor(() => expect(save).toHaveBeenCalledTimes(2));
    await act(async () => old.resolve({ nickname: '过期提交错误。' }));
    expect(await first).toBe(false);
    expect(state.isSubmitting).toBe(true);
    expect(screen.queryByText('过期提交错误。')).toBe(null);
    await act(async () => latest.resolve());
    expect(await second).toBe(true);
    expect(state.isSubmitting).toBe(false);
  });

  it('reset aborts pending work and submission rejections become accessible feedback rather than unhandled promises', async () => {
    const request = deferred<void>();
    const fail = vi.fn();
    let signal!: AbortSignal;
    let state!: FormState<{ nickname: string }>;
    render(
      <Form
        initialValues={{ nickname: '原值' }}
        onSubmit={(_values, context) => {
          signal = context.signal;
          return request.promise;
        }}
        onSubmitError={fail}
      >
        {(form) => {
          state = form;
          return (
            <>
              <Input label="昵称" {...form.input('nickname')} />
              <p role="alert">{form.submitError}</p>
            </>
          );
        }}
      </Form>,
    );
    let pending!: Promise<boolean>;
    act(() => {
      pending = state.submit();
    });
    await waitFor(() => expect(signal).toBeDefined());
    act(() => state.reset());
    expect(signal.aborted).toBe(true);
    await act(async () => request.reject(new Error('过期失败。')));
    expect(await pending).toBe(false);
    expect(fail).not.toHaveBeenCalled();
    expect(state.submitError).toBe(null);
  });

  it('handles a current rejection, recovers on editing and aborts on unmount', async () => {
    const fail = vi.fn();
    const request = deferred<void>();
    let signal!: AbortSignal;
    let state!: FormState<{ nickname: string }>;
    const { unmount } = render(
      <Form
        initialValues={{ nickname: '原值' }}
        onSubmit={(_values, context) => {
          signal = context.signal;
          return request.promise;
        }}
        onSubmitError={fail}
      >
        {(form) => {
          state = form;
          return (
            <>
              <Input label="昵称" {...form.input('nickname')} />
              <p role="alert">{form.submitError}</p>
            </>
          );
        }}
      </Form>,
    );
    let pending!: Promise<boolean>;
    act(() => {
      pending = state.submit();
    });
    await waitFor(() => expect(signal).toBeDefined());
    await act(async () => request.reject(new Error('保存失败，请重试。')));
    expect(await pending).toBe(false);
    expect(fail).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('alert').textContent).toBe('保存失败，请重试。');
    act(() => state.setFieldValue('nickname', '恢复编辑'));
    expect(state.submitError).toBe(null);
    unmount();
    expect(signal.aborted).toBe(true);
  });

  it('honors noValidate for native constraints while still running caller validation', async () => {
    const user = userEvent.setup();
    const save = vi.fn();
    render(
      <Form noValidate initialValues={{ nickname: '' }} onSubmit={save}>
        {(form) => (
          <>
            <Input label="昵称" required {...form.input('nickname')} />
            <button type="submit">保存</button>
          </>
        )}
      </Form>,
    );
    await user.click(screen.getByRole('button', { name: '保存' }));
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
  });
  it('keeps a submitted field error while other fields are edited', async () => {
    const user = userEvent.setup();
    render(
      <Form
        initialValues={{ nickname: '库米', email: 'used@example.com' }}
        validate={() => ({})}
        onSubmit={() => ({ email: '邮箱已占用。' })}
      >
        {(form) => (
          <>
            <Input label="昵称" {...form.input('nickname')} />
            <Input label="邮箱" {...form.input('email')} />
            <button type="submit">保存</button>
          </>
        )}
      </Form>,
    );
    await user.click(screen.getByRole('button', { name: '保存' }));
    await screen.findByText('邮箱已占用。');
    await user.type(screen.getByRole('textbox', { name: '昵称' }), '编辑');
    await waitFor(() => expect(screen.getByText('邮箱已占用。')).toBeTruthy());
    await user.type(screen.getByRole('textbox', { name: '邮箱' }), 'x');
    await waitFor(() => expect(screen.queryByText('邮箱已占用。')).toBe(null));
  });

  it('clears removed external errors after validating and allows the next submission', async () => {
    const user = userEvent.setup();
    const save = vi.fn();
    let state!: FormState<{ email: string }>;
    const example = (errors: { email?: string }) => (
      <Form initialValues={{ email: 'new@example.com' }} errors={errors} onSubmit={save}>
        {(form) => {
          state = form;
          return (
            <>
              <Input label="邮箱" {...form.input('email')} />
              <button type="submit">保存</button>
            </>
          );
        }}
      </Form>
    );
    const { rerender } = render(example({ email: '外部错误。' }));
    await screen.findByText('外部错误。');
    await act(async () => state.validate());
    await user.click(screen.getByRole('button', { name: '保存' }));
    expect(save).not.toHaveBeenCalled();
    rerender(example({}));
    await waitFor(() => expect(screen.queryByText('外部错误。')).toBe(null));
    await user.click(screen.getByRole('button', { name: '保存' }));
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
  });

  it('setErrors replaces all current errors and supersedes pending validation', async () => {
    const request = deferred<{ email: string }>();
    let state!: FormState<{ email: string }>;
    render(
      <Form
        initialValues={{ email: 'new@example.com' }}
        errors={{ email: '外部错误。' }}
        validate={() => request.promise}
      >
        {(form) => {
          state = form;
          return <Input label="邮箱" {...form.input('email')} />;
        }}
      </Form>,
    );
    await screen.findByText('外部错误。');
    let pending!: Promise<{ email?: string } | null>;
    act(() => {
      pending = state.validate();
    });
    act(() => state.setErrors({}));
    await waitFor(() => expect(screen.queryByText('外部错误。')).toBe(null));
    await act(async () => request.resolve({ email: '过期校验。' }));
    await pending;
    expect(screen.queryByText('过期校验。')).toBe(null);
    expect(state.errors).toEqual({});
  });
  it('does not blur-validate while opening Select options or moving within a radio group', async () => {
    const user = userEvent.setup();
    const validate = vi.fn(() => ({}));
    render(
      <Form
        initialValues={{ category: null as string | null, view: 'list' }}
        validationMode="onBlur"
        validate={validate}
      >
        {(form) => (
          <>
            <Select
              label="分类"
              required
              options={[{ value: 'reading', label: '阅读' }]}
              {...form.choice('category')}
            />
            <RadioGroup
              label="视图"
              options={[
                { value: 'list', label: '列表' },
                { value: 'cards', label: '卡片' },
              ]}
              {...form.choice('view')}
            />
            <button type="button">其他</button>
          </>
        )}
      </Form>,
    );
    const trigger = screen.getByRole('combobox', { name: '分类' });
    await user.click(trigger);
    await screen.findByRole('option', { name: '阅读' });
    expect(validate).not.toHaveBeenCalled();
    expect(trigger.getAttribute('aria-invalid')).not.toBe('true');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(validate).not.toHaveBeenCalled();
    await user.click(screen.getByRole('radio', { name: '列表' }));
    await waitFor(() => expect(validate).toHaveBeenCalledTimes(1));
    validate.mockClear();
    await user.click(screen.getByRole('radio', { name: '卡片' }));
    expect((screen.getByRole('radio', { name: '卡片' }) as HTMLInputElement).checked).toBe(true);
    expect(validate).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: '其他' }));
    await waitFor(() => expect(validate).toHaveBeenCalledTimes(1));
  });
  it('uses the latest committed native value when an imperative update and submit share an event', async () => {
    const save = vi.fn();
    let state!: FormState<{ nickname: string }>;
    render(
      <Form initialValues={{ nickname: '' }} onSubmit={save}>
        {(form) => {
          state = form;
          return <Input label="昵称" required {...form.input('nickname')} />;
        }}
      </Form>,
    );
    let pending!: Promise<boolean>;
    act(() => {
      state.setFieldValue('nickname', '读者');
      pending = state.submit();
    });
    await act(async () => {
      expect(await pending).toBe(true);
    });
    expect(save).toHaveBeenCalledTimes(1);
    expect(save.mock.calls[0][0]).toEqual({ nickname: '读者' });
    expect(save.mock.calls[0][1].formData.get('nickname')).toBe('读者');
  });

  it('rechecks native constraints after a field becomes disabled during async validation', async () => {
    const request = deferred<{}>();
    const save = vi.fn();
    let state!: FormState<{ nickname: string }>;
    const example = (disabled: boolean) => (
      <Form initialValues={{ nickname: '' }} validate={() => request.promise} onSubmit={save}>
        {(form) => {
          state = form;
          return <Input label="昵称" required disabled={disabled} {...form.input('nickname')} />;
        }}
      </Form>
    );
    const { rerender } = render(example(false));
    let pending!: Promise<boolean>;
    act(() => {
      pending = state.submit();
    });
    rerender(example(true));
    await act(async () => request.resolve({}));
    expect(await pending).toBe(true);
    expect(save).toHaveBeenCalledTimes(1);
    expect([...save.mock.calls[0][1].formData]).toEqual([]);
  });

  it.each([{ options: [] }, { options: [{ value: 'disabled', label: '不可选', disabled: true }] }])(
    'keeps errors blocking on a mounted radio group without a focusable option (%j)',
    async ({ options }) => {
      const user = userEvent.setup();
      const save = vi.fn();
      render(
        <Form
          initialValues={{ view: '' }}
          onSubmit={save}
          validate={() => ({ view: '没有可用选项。' })}
        >
          {(form) => (
            <>
              <RadioGroup label="视图" options={options} {...form.choice('view')} />
              <button type="submit">保存</button>
            </>
          )}
        </Form>,
      );
      await user.click(screen.getByRole('button', { name: '保存' }));
      await screen.findByText('没有可用选项。');
      expect(save).not.toHaveBeenCalled();
    },
  );

  it('keeps native required constraints blocking when an input is hidden by CSS', async () => {
    const user = userEvent.setup();
    const save = vi.fn();
    render(
      <Form initialValues={{ nickname: '' }} onSubmit={save}>
        {(form) => (
          <>
            <Input label="昵称" required style={{ display: 'none' }} {...form.input('nickname')} />
            <button type="submit">保存</button>
          </>
        )}
      </Form>,
    );
    await user.click(screen.getByRole('button', { name: '保存' }));
    await waitFor(() =>
      expect(screen.getByLabelText('昵称').getAttribute('aria-invalid')).toBe('true'),
    );
    expect(save).not.toHaveBeenCalled();
  });
  it('keeps onBlur validation timing after a failed submission', async () => {
    const user = userEvent.setup();
    render(
      <Form
        initialValues={{ nickname: '' }}
        validationMode="onBlur"
        validate={(values) => (values.nickname.length < 2 ? { nickname: '至少两字。' } : {})}
      >
        {(form) => (
          <>
            <Input label="昵称" {...form.input('nickname')} />
            <button type="submit">保存</button>
            <button type="button">其他</button>
          </>
        )}
      </Form>,
    );
    await user.click(screen.getByRole('button', { name: '保存' }));
    await screen.findByText('至少两字。');
    await user.type(screen.getByRole('textbox', { name: '昵称' }), '米');
    expect(screen.queryByText('至少两字。')).toBe(null);
    await user.click(screen.getByRole('button', { name: '其他' }));
    await screen.findByText('至少两字。');
  });

  it('ignores validation results superseded by an onInvalid handler updating a field', async () => {
    let state!: FormState<{ nickname: string }>;
    render(
      <Form
        initialValues={{ nickname: '' }}
        validate={() => ({ nickname: '旧错误。' })}
        onInvalidCapture={() => state.setFieldValue('nickname', '读者')}
      >
        {(form) => {
          state = form;
          return <Input label="昵称" required {...form.input('nickname')} />;
        }}
      </Form>,
    );
    await act(async () => state.validate());
    expect(state.values.nickname).toBe('读者');
    expect(screen.queryByText('旧错误。')).toBe(null);
  });
  it('returns null when an asynchronous explicit validation is superseded by an edit', async () => {
    const request = deferred<{}>();
    let state!: FormState<{ nickname: string }>;
    render(
      <Form initialValues={{ nickname: '' }} validate={() => request.promise}>
        {(form) => {
          state = form;
          return <Input label="昵称" {...form.input('nickname')} />;
        }}
      </Form>,
    );
    let pending!: Promise<{} | null>;
    act(() => {
      pending = state.validate();
    });
    act(() => state.setFieldValue('nickname', '新值'));
    await act(async () => request.resolve({}));
    expect(await pending).toBe(null);
  });

  it('validates before submitting state disables a consumer fieldset', async () => {
    const save = vi.fn();
    let state!: FormState<{ nickname: string }>;
    render(
      <Form initialValues={{ nickname: '' }} onSubmit={save}>
        {(form) => {
          state = form;
          return (
            <fieldset disabled={form.isSubmitting}>
              <Input label="昵称" required {...form.input('nickname')} />
            </fieldset>
          );
        }}
      </Form>,
    );
    let pending!: Promise<boolean>;
    act(() => {
      pending = state.submit();
    });
    await act(async () => {
      expect(await pending).toBe(false);
    });
    expect(save).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: '昵称' }));
  });

  it.each(['native', 'custom'] as const)(
    'restores a validating fieldset before checking %s errors and collecting submission data',
    async (constraint) => {
      const user = userEvent.setup();
      const request = deferred<{ nickname?: string }>();
      const validate = vi
        .fn(() => Promise.resolve({}))
        .mockImplementationOnce(() => request.promise);
      const save = vi.fn();
      render(
        <Form initialValues={{ nickname: '' }} validate={validate} onSubmit={save}>
          {(form) => (
            <fieldset disabled={form.isValidating || form.isSubmitting}>
              <Input label="昵称" required={constraint === 'native'} {...form.input('nickname')} />
              <button type="submit" name="intent" value="save">
                保存
              </button>
            </fieldset>
          )}
        </Form>,
      );
      const input = screen.getByRole('textbox', { name: '昵称' });
      await user.click(screen.getByRole('button', { name: '保存' }));
      expect(input.matches(':disabled')).toBe(true);
      await act(async () =>
        request.resolve(constraint === 'custom' ? { nickname: '请填写昵称。' } : {}),
      );
      await waitFor(() => expect(input.getAttribute('aria-invalid')).toBe('true'));
      expect(save).not.toHaveBeenCalled();
      expect(input.matches(':disabled')).toBe(false);
      expect(document.activeElement).toBe(input);

      await user.type(input, '读者');
      await user.click(screen.getByRole('button', { name: '保存' }));
      await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
      expect(save.mock.calls[0][0]).toEqual({ nickname: '读者' });
      expect([...save.mock.calls[0][1].formData]).toEqual([
        ['nickname', '读者'],
        ['intent', 'save'],
      ]);
    },
  );

  it('captures the native submitter before submitting state unmounts its button', async () => {
    const user = userEvent.setup();
    const save = vi.fn();
    render(
      <Form initialValues={{ nickname: '读者' }} onSubmit={save}>
        {(form) => (
          <>
            <Input label="昵称" {...form.input('nickname')} />
            {!form.isSubmitting && (
              <button type="submit" name="intent" value="save">
                保存
              </button>
            )}
          </>
        )}
      </Form>,
    );
    await user.click(screen.getByRole('button', { name: '保存' }));
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    expect(save.mock.calls[0][1].formData.get('intent')).toBe('save');
  });

  it('restores a busy fieldset before presenting and focusing returned field errors', async () => {
    const user = userEvent.setup();
    let state!: FormState<{ nickname: string }>;
    const request = deferred<{ nickname: string }>();
    render(
      <Form initialValues={{ nickname: '读者' }} onSubmit={() => request.promise}>
        {(form) => {
          state = form;
          return (
            <fieldset disabled={form.isSubmitting}>
              <Input label="昵称" {...form.input('nickname')} />
              <button type="submit">保存</button>
            </fieldset>
          );
        }}
      </Form>,
    );
    await user.click(screen.getByRole('button', { name: '保存' }));
    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: '昵称' }).matches(':disabled')).toBe(true),
    );
    await act(async () => request.resolve({ nickname: '昵称已占用。' }));
    await screen.findByText('昵称已占用。');
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole('textbox', { name: '昵称' })),
    );
    expect(state.isSubmitting).toBe(false);
  });
  it.each(['constructor', 'toString'])(
    'treats a prototype-named field %s as an ordinary literal name',
    async (name) => {
      const user = userEvent.setup();
      const save = vi.fn();
      let state!: FormState<Record<string, string>>;
      render(
        <Form initialValues={{ [name]: '读者' }} onSubmit={save}>
          {(form) => {
            state = form;
            return (
              <>
                <Input label="昵称" {...form.input(name)} />
                <FormError name={name} />
                <button type="submit">保存</button>
              </>
            );
          }}
        </Form>,
      );
      expect(state.errors[name]).toBeUndefined();
      expect(screen.getByRole('textbox', { name: '昵称' }).getAttribute('aria-invalid')).not.toBe(
        'true',
      );
      await user.click(screen.getByRole('button', { name: '保存' }));
      await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
      expect(save.mock.calls[0][0][name]).toBe('读者');
      act(() => state.setErrors({ [name]: '请更换昵称。' }));
      expect(state.errors[name]).toBe('请更换昵称。');
      await user.type(screen.getByRole('textbox', { name: '昵称' }), '编辑');
      await waitFor(() => expect(state.errors[name]).toBeUndefined());
    },
  );

  it('uses native form intrinsics when literal field names shadow form instance properties', async () => {
    const user = userEvent.setup();
    const save = vi.fn();
    let state!: FormState<{ reset: string; checkValidity: string; elements: string }>;
    render(
      <Form initialValues={{ reset: '初始', checkValidity: '', elements: '' }} onSubmit={save}>
        {(form) => {
          state = form;
          return (
            <>
              <Input label="重置字段" {...form.input('reset')} />
              <Input label="校验字段" required {...form.input('checkValidity')} />
              <Input label="元素字段" required {...form.input('elements')} />
              <button type="submit">保存</button>
              <button type="reset">重置</button>
            </>
          );
        }}
      </Form>,
    );
    await user.click(screen.getByRole('button', { name: '保存' }));
    expect(save).not.toHaveBeenCalled();
    await user.type(screen.getByRole('textbox', { name: '校验字段' }), '有效');
    await user.type(screen.getByRole('textbox', { name: '元素字段' }), '有效');
    await user.click(screen.getByRole('button', { name: '保存' }));
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    expect(Object.fromEntries(save.mock.calls[0][1].formData)).toEqual({
      reset: '初始',
      checkValidity: '有效',
      elements: '有效',
    });
    act(() => state.reset());
    expect(state.values).toEqual({ reset: '初始', checkValidity: '', elements: '' });
    await user.type(screen.getByRole('textbox', { name: '校验字段' }), '再编辑');
    await user.click(screen.getByRole('button', { name: '重置' }));
    expect(state.values.checkValidity).toBe('');
  });
  it.each(['inside-button', 'outside-button', 'submit-input', 'image-input'] as const)(
    'lets a related submitter own blur validation and focus (%s)',
    async (kind) => {
      const user = userEvent.setup();
      const validate = vi.fn(() => ({}));
      const save = vi.fn();
      const id = `blur-submit-${kind}`;
      const submitter =
        kind === 'submit-input' ? (
          <input type="submit" value="保存" />
        ) : kind === 'image-input' ? (
          <input type="image" alt="保存" />
        ) : (
          <button type="submit" form={kind === 'outside-button' ? id : undefined}>
            保存
          </button>
        );
      render(
        <>
          <Form
            id={id}
            initialValues={{ email: '' }}
            validationMode="onBlur"
            validate={validate}
            onSubmit={save}
          >
            {(form) => (
              <>
                <Input label="邮箱" required {...form.input('email')} />
                {kind !== 'outside-button' && submitter}
              </>
            )}
          </Form>
          {kind === 'outside-button' && submitter}
        </>,
      );
      const input = screen.getByRole('textbox', { name: '邮箱' });
      await user.click(input);
      await user.click(screen.getByRole('button', { name: '保存' }));
      await waitFor(() => expect(validate).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(document.activeElement).toBe(input));
      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(save).not.toHaveBeenCalled();
    },
  );

  it('keeps blur validation for an ordinary button and a different form submitter', async () => {
    const user = userEvent.setup();
    const validate = vi.fn(() => ({}));
    render(
      <>
        <form id="another-blur-form" onSubmit={(event) => event.preventDefault()} />
        <Form initialValues={{ email: '' }} validationMode="onBlur" validate={validate}>
          {(form) => (
            <>
              <Input label="邮箱" required {...form.input('email')} />
              <button type="button">其他</button>
              <button type="submit" form="another-blur-form">
                保存其他表单
              </button>
            </>
          )}
        </Form>
      </>,
    );
    const input = screen.getByRole('textbox', { name: '邮箱' });
    await user.click(input);
    await user.click(screen.getByRole('button', { name: '其他' }));
    await waitFor(() => expect(validate).toHaveBeenCalledTimes(1));
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '其他' }));
    await user.click(input);
    await user.click(screen.getByRole('button', { name: '保存其他表单' }));
    await waitFor(() => expect(validate).toHaveBeenCalledTimes(2));
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '保存其他表单' }));
  });
  it('validates and submits with Enter while the input keeps focus', async () => {
    const user = userEvent.setup();
    const validate = vi.fn(() => ({}));
    const save = vi.fn();
    render(
      <Form
        initialValues={{ email: '' }}
        validationMode="onBlur"
        validate={validate}
        onSubmit={save}
      >
        {(form) => (
          <>
            <Input label="邮箱" required type="email" {...form.input('email')} />
            <button type="submit">保存</button>
          </>
        )}
      </Form>,
    );
    const input = screen.getByRole('textbox', { name: '邮箱' });
    await user.type(input, 'invalid-email{Enter}');
    await waitFor(() => expect(validate).toHaveBeenCalledTimes(1));
    expect(document.activeElement).toBe(input);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(save).not.toHaveBeenCalled();
    await user.clear(input);
    await user.type(input, 'reader@example.com{Enter}');
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    expect(validate).toHaveBeenCalledTimes(2);
    expect(save.mock.calls[0][0]).toEqual({ email: 'reader@example.com' });
  });
});
