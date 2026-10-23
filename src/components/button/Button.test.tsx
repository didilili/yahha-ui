import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button.js';

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
});
