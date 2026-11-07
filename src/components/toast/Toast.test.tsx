import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button/Button.js';
import { Toast } from './Toast.js';

afterEach(cleanup);

describe('Toast', () => {
  it('defaults to the ordinary appearance and opts into the receipt while preserving the status and action', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onClose = vi.fn();
    const view = render(
      <div dir="rtl">
        <Toast
          open
          onClose={onClose}
          title="已保存"
          tone="info"
          action={<Button onClick={onAction}>查看</Button>}
        />
      </div>,
    );
    const status = screen.getByRole('status');
    expect(status.dataset.appearance).toBe('default');
    expect(status.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
    expect(status.getAttribute('aria-atomic')).toBe('true');
    await user.tab();
    await user.keyboard('{Enter}');
    expect(onAction).toHaveBeenCalledTimes(1);
    view.rerender(
      <div dir="rtl">
        <Toast
          open
          appearance="receipt"
          onClose={onClose}
          title="已保存"
          tone="info"
          action={<Button onClick={onAction}>查看</Button>}
        />
      </div>,
    );
    expect(screen.getByRole('status')).toBe(status);
    expect(status.dataset.appearance).toBe('receipt');
    expect(status.textContent).toContain('已保存');
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '关闭提示' }));
    await user.keyboard('{Enter}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders a numeric zero description inside its paragraph', () => {
    render(<Toast open onClose={() => {}} title="剩余数量" description={0} />);

    expect(screen.getByText('0', { selector: 'p' })).toBeTruthy();
  });

  it('lets the consumer dismiss a status message', async () => {
    const user = userEvent.setup();
    function Example() {
      const [open, setOpen] = useState(true);
      return (
        <Toast
          open={open}
          onClose={() => setOpen(false)}
          title="保存好了"
          description="可以继续编辑。"
        />
      );
    }
    render(<Example />);
    expect(screen.getByRole('status').textContent).toContain('保存好了');
    await user.click(screen.getByRole('button', { name: '关闭提示' }));
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('requests closing without changing the controlled open value', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { rerender } = render(<Toast open onClose={onClose} title="保存好了" tone="error" />);
    const status = screen.getByRole('status');
    expect(status.getAttribute('aria-atomic')).toBe('true');
    expect(screen.queryByRole('alert')).toBeNull();
    expect(document.activeElement).toBe(document.body);

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '关闭提示' }));
    await user.keyboard('{Enter}');
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toBe(status);

    rerender(<Toast open={false} onClose={onClose} title="保存好了" />);
    expect(screen.queryByRole('status')).toBeNull();
    rerender(<Toast open onClose={onClose} title="又保存好了" />);
    expect(screen.getByRole('status').textContent).toContain('又保存好了');
  });

  it('leaves the action usable before the close button in keyboard order', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onClose = vi.fn();
    render(
      <Toast
        open
        onClose={onClose}
        title="心愿已移除"
        action={<Button onClick={onAction}>撤销</Button>}
      />,
    );

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '撤销' }));
    await user.keyboard(' ');
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toBeTruthy();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '关闭提示' }));
  });
});
