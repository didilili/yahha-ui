import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button.js';
import { IconButton } from './IconButton.js';

afterEach(cleanup);

describe('Button', () => {
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
