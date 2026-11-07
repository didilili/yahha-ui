import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button.js';
import { IconButton } from './IconButton.js';

afterEach(cleanup);

describe('Button', () => {
  it.each([false, true])(
    'defaults to dots and opts into biscuit loading with leading slot=%s without changing actions',
    async (withIcon) => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const view = (loading: boolean, loadingVariant?: 'dots' | 'biscuit') => (
        <Button
          appearance="soft"
          loading={loading}
          loadingVariant={loadingVariant}
          startIcon={withIcon ? <svg data-testid="leading-icon" /> : undefined}
          onClick={onClick}
        >
          保存草稿
        </Button>
      );
      const { rerender } = render(view(true));
      const button = screen.getByRole('button', { name: '保存草稿' });
      expect(button.querySelector('[data-loading-mark="biscuit"]')).toBeNull();
      expect(button.getAttribute('aria-busy')).toBe('true');
      expect(button.hasAttribute('disabled')).toBe(true);
      rerender(view(true, 'biscuit'));
      expect(button.querySelector('[data-loading-mark="biscuit"] svg')).toBeTruthy();
      expect(button.hasAttribute('loadingvariant')).toBe(false);
      expect(button.getAttribute('data-appearance')).toBe('soft');
      expect(Boolean(screen.queryByTestId('leading-icon'))).toBe(withIcon);
      await user.click(button);
      expect(onClick).not.toHaveBeenCalled();
      rerender(view(false, 'biscuit'));
      expect(button.querySelector('[data-loading-mark="biscuit"]')).toBeNull();
      await user.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    },
  );

  it('inherits the loading choice in IconButton without coupling it to soft appearance', () => {
    const view = (loadingVariant?: 'dots' | 'biscuit') => (
      <IconButton aria-label="收藏文章" loading loadingVariant={loadingVariant}>
        <svg data-testid="action-glyph" />
      </IconButton>
    );
    const { rerender } = render(view());
    const button = screen.getByRole('button', { name: '收藏文章' });
    expect(button.querySelector('[data-loading-mark="biscuit"]')).toBeNull();
    expect(screen.queryByTestId('action-glyph')).toBeNull();
    rerender(view('biscuit'));
    expect(button.querySelector('[data-loading-mark="biscuit"] svg')).toBeTruthy();
    expect(button.hasAttribute('loadingvariant')).toBe(false);
    expect(button.hasAttribute('data-appearance')).toBe(false);
    expect(button.hasAttribute('disabled')).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    rerender(view('dots'));
    expect(button.querySelector('[data-loading-mark="biscuit"]')).toBeNull();
  });

  it.each(['default', 'soft'] as const)(
    'keeps the %s appearance named and connected to its native form action',
    async (appearance) => {
      const user = userEvent.setup();
      const ref = createRef<HTMLButtonElement>();
      const submit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());
      render(
        <form onSubmit={submit}>
          <Button ref={ref} appearance={appearance} type="submit" name="save" value="draft">
            保存草稿
          </Button>
        </form>,
      );
      const button = screen.getByRole('button', { name: '保存草稿' });
      expect(ref.current).toBe(button);
      expect(button.hasAttribute('appearance')).toBe(false);
      expect(screen.queryByRole('img')).toBeNull();
      await user.tab();
      await user.keyboard('{Enter}');
      expect(submit).toHaveBeenCalledTimes(1);
      expect([...new FormData(button.closest('form')!, button as HTMLButtonElement)]).toEqual([
        ['save', 'draft'],
      ]);
    },
  );

  it('keeps soft button icons, selection and loading guards independent', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const view = (loading: boolean) => (
      <Button
        appearance="soft"
        variant="secondary"
        aria-pressed
        loading={loading}
        onClick={onClick}
        startIcon={<svg data-testid="action-icon" aria-hidden="true" />}
      >
        收藏文章
      </Button>
    );
    const { rerender } = render(view(false));
    const button = screen.getByRole('button', { name: '收藏文章' });
    await user.tab();
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(view(true));
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(screen.getByTestId('action-icon')).toBeTruthy();
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('keeps a soft IconButton named and replaces its action glyph only while loading', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    const view = (loading = false) => (
      <IconButton
        ref={ref}
        appearance="soft"
        aria-label="收藏文章"
        loading={loading}
        onClick={onClick}
      >
        <svg data-testid="bookmark-icon" aria-hidden="true" />
      </IconButton>
    );
    const { rerender } = render(view());
    const button = screen.getByRole('button', { name: '收藏文章' });
    expect(ref.current).toBe(button);
    expect(screen.getByTestId('bookmark-icon')).toBeTruthy();
    await user.tab();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(view(true));
    expect(screen.queryByTestId('bookmark-icon')).toBeNull();
    expect(button.getAttribute('aria-busy')).toBe('true');
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it.each(['primary', 'secondary', 'ghost'] as const)(
    'keeps destructive %s actions native, explicitly opt-in and independent of emphasis',
    async (variant) => {
      const user = userEvent.setup();
      const ref = createRef<HTMLButtonElement>();
      const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());
      const view = (destructive?: boolean) => (
        <form onSubmit={onSubmit}>
          <Button
            ref={ref}
            variant={variant}
            destructive={destructive}
            type="submit"
            name="action"
            value="delete"
          >
            删除草稿
          </Button>
        </form>
      );
      const { rerender } = render(view(true));
      const button = screen.getByRole('button', { name: '删除草稿' });
      expect(ref.current).toBe(button);
      expect(button.getAttribute('data-destructive')).toBe('true');
      expect(button.hasAttribute('destructive')).toBe(false);
      expect(button.getAttribute('data-variant')).toBe(variant);
      expect(button.getAttribute('name')).toBe('action');
      expect(button.getAttribute('value')).toBe('delete');
      expect(button.hasAttribute('aria-invalid')).toBe(false);
      await user.tab();
      await user.keyboard('{Enter}');
      expect(onSubmit).toHaveBeenCalledTimes(1);
      rerender(view(false));
      expect(button.hasAttribute('data-destructive')).toBe(false);
      rerender(view());
      expect(button.hasAttribute('data-destructive')).toBe(false);
    },
  );

  it('inherits destructive styling in IconButton while keeping loading and disabled activation guards', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(
      <IconButton destructive aria-label="删除草稿" onClick={onClick}>
        ×
      </IconButton>,
    );
    const button = screen.getByRole('button', { name: '删除草稿' });
    expect(button.getAttribute('data-destructive')).toBe('true');
    await user.tab();
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(
      <IconButton destructive aria-label="删除草稿" loading onClick={onClick}>
        ×
      </IconButton>,
    );
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.hasAttribute('disabled')).toBe(true);
    await user.click(button);
    rerender(
      <IconButton destructive aria-label="删除草稿" disabled onClick={onClick}>
        ×
      </IconButton>,
    );
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('prevents activation while a button is disabled or loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <>
        <Button disabled onClick={onClick}>
          暂不可用
        </Button>
        <Button loading onClick={onClick}>
          正在保存
        </Button>
      </>,
    );
    await user.click(screen.getByRole('button', { name: '暂不可用' }));
    await user.click(screen.getByRole('button', { name: '正在保存' }));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: '正在保存' }).getAttribute('aria-busy')).toBe('true');
  });

  it('retains its accessible label when loading replaces a decorative start icon', () => {
    const { rerender } = render(
      <Button
        startIcon={
          <svg role="img" aria-label="收藏图标">
            <title>收藏图标</title>
          </svg>
        }
        endIcon={
          <svg role="img" aria-label="前进图标">
            <title>前进图标</title>
          </svg>
        }
      >
        保存心愿
      </Button>,
    );
    expect(screen.getByRole('button', { name: '保存心愿' })).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();

    rerender(
      <Button
        loading
        startIcon={
          <svg role="img" aria-label="收藏图标">
            <title>收藏图标</title>
          </svg>
        }
        endIcon={
          <svg role="img" aria-label="前进图标">
            <title>前进图标</title>
          </svg>
        }
      >
        保存心愿
      </Button>,
    );
    const button = screen.getByRole('button', { name: '保存心愿' });
    expect(button.hasAttribute('disabled')).toBe(true);
    expect(screen.getByText('收藏图标').closest('[aria-hidden="true"]')).toBeTruthy();
    expect(screen.getByText('前进图标')).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('supports native keyboard activation without submitting a surrounding form by default', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button onClick={onClick}>保存草稿</Button>
        <Button type="submit">提交心愿</Button>
      </form>,
    );

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '保存草稿' }));
    await user.keyboard('{Enter} ');
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(onSubmit).not.toHaveBeenCalled();

    await user.tab();
    await user.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('keeps an icon-only button named and skips it while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(
      <IconButton aria-label="关闭提示" onClick={onClick}>
        <svg aria-hidden="true">
          <title>关闭图标</title>
        </svg>
      </IconButton>,
    );
    await user.tab();
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <>
        <IconButton aria-label="关闭提示" loading onClick={onClick}>
          <svg aria-hidden="true">
            <title>关闭图标</title>
          </svg>
        </IconButton>
        <Button>下一步</Button>
      </>,
    );
    const iconButton = screen.getByRole('button', { name: '关闭提示' });
    expect(iconButton.getAttribute('aria-busy')).toBe('true');
    expect(screen.queryByTitle('关闭图标')).toBeNull();
    await user.click(iconButton);
    expect(onClick).toHaveBeenCalledTimes(1);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '下一步' }));
  });

  it('keeps numeric zero icons decorative', () => {
    render(
      <Button startIcon={0} endIcon={0}>
        保存心愿
      </Button>,
    );

    expect(screen.getByRole('button', { name: '保存心愿' })).toBeTruthy();
    for (const icon of screen.getAllByText('0')) {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    }
  });
});
