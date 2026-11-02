import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import userEvent from '@testing-library/user-event';
import { Button } from '../button/Button.js';
import { ThemeProvider } from '../../theme/ThemeProvider.js';
import { Popover } from './Popover.js';

afterEach(cleanup);

describe('Popover', () => {
  it('keeps portal direction in sync with its native ancestor without remounting trigger refs', async () => {
    const user = userEvent.setup();
    const release = vi.fn();
    const triggerRef = vi.fn((node: HTMLButtonElement | null) => (node ? release : undefined));
    const { unmount } = render(
      <div dir="RTL" data-testid="reading-direction">
        <Popover title="阅读设置" trigger={<button ref={triggerRef}>方向设置</button>} />
      </div>,
    );
    const trigger = screen.getByRole('button', { name: '方向设置' });
    await user.click(trigger);
    const popup = await screen.findByRole('dialog', { name: '阅读设置' });
    const portal = popup.closest<HTMLElement>('[data-yahha-theme]')!;
    await waitFor(() => expect(portal.dir).toBe('rtl'));
    await act(async () => {
      screen.getByTestId('reading-direction').dir = 'ltr';
    });
    await waitFor(() => expect(portal.dir).toBe('ltr'));
    expect(triggerRef).toHaveBeenCalledTimes(1);
    expect(triggerRef).toHaveBeenCalledWith(trigger);
    expect(release).not.toHaveBeenCalled();
    unmount();
    expect(release).toHaveBeenCalledTimes(1);
  });

  it('uses the trigger native direction before an upstream direction provider', async () => {
    const user = userEvent.setup();
    render(
      <DirectionProvider direction="rtl">
        <Popover title="本地说明" trigger={<button dir="ltr">本地设置</button>} />
      </DirectionProvider>,
    );
    await user.click(screen.getByRole('button', { name: '本地设置' }));
    const popup = await screen.findByRole('dialog', { name: '本地说明' });
    expect(popup.closest<HTMLElement>('[data-yahha-theme]')?.dir).toBe('ltr');
  });

  it('reads direction from a replacement trigger while its controlled popup stays open', async () => {
    const { rerender } = render(
      <Popover open title="阅读选项" trigger={<Button dir="rtl">阅读选项入口</Button>} />,
    );
    const popup = await screen.findByRole('dialog', { name: '阅读选项' });
    await waitFor(() => expect(popup.closest<HTMLElement>('[data-yahha-theme]')?.dir).toBe('rtl'));
    rerender(<Popover open title="阅读选项" trigger={<button dir="ltr">阅读选项入口</button>} />);
    await waitFor(() => expect(popup.closest<HTMLElement>('[data-yahha-theme]')?.dir).toBe('ltr'));
    expect(screen.getByRole('dialog', { name: '阅读选项' })).toBe(popup);
  });

  it('labels the popup, focuses its form and returns focus on Escape', async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();
    render(
      <Popover
        trigger={<Button>阅读设置</Button>}
        title="阅读偏好"
        description={0}
        initialFocus={inputRef}
      >
        <label>
          昵称
          <input ref={inputRef} />
        </label>
      </Popover>,
    );
    const trigger = screen.getByRole('button', { name: '阅读设置' });
    await user.click(trigger);
    const popup = await screen.findByRole('dialog', { name: '阅读偏好' });
    expect(document.getElementById(popup.getAttribute('aria-describedby')!)?.textContent).toBe('0');
    await waitFor(() => expect(document.activeElement).toBe(inputRef.current));
    await user.type(inputRef.current!, '小八');
    expect(inputRef.current?.value).toBe('小八');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('supports controlled close, custom popup props and themed portals', async () => {
    const user = userEvent.setup();
    const popupRef = createRef<HTMLDivElement>();
    function Example() {
      const [open, setOpen] = useState(true);
      return (
        <ThemeProvider theme="usagi" tokens={{ ink: '#123456' }} className="page-layout">
          <Popover
            title="补充说明"
            trigger={<Button>打开说明</Button>}
            open={open}
            onOpenChange={setOpen}
            ref={popupRef}
            className="custom-popover"
            style={{ width: 280 }}
            closeLabel="读完关闭"
          >
            这里是可以选择和复制的内容。
          </Popover>
        </ThemeProvider>
      );
    }
    render(<Example />);
    const popup = await screen.findByRole('dialog', { name: '补充说明' });
    expect(popupRef.current).toBe(popup);
    expect(popup.classList.contains('custom-popover')).toBe(true);
    expect(popup.style.width).toBe('280px');
    const theme = popup.closest<HTMLElement>('[data-yahha-theme]')!;
    expect(theme.dataset.yahhaTheme).toBe('usagi');
    expect(theme.style.getPropertyValue('--yahha-ink')).toBe('#123456');
    expect(theme.classList.contains('page-layout')).toBe(false);
    await user.click(screen.getByRole('button', { name: '读完关闭' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('preserves the trigger id, native ref and click callback when composed', async () => {
    const user = userEvent.setup();
    const triggerRef = createRef<HTMLButtonElement>();
    let clicks = 0;
    render(
      <Popover
        title="内容说明"
        trigger={
          <button
            id="note-details"
            ref={triggerRef}
            onClick={() => {
              clicks += 1;
            }}
          >
            查看详情
          </button>
        }
      />,
    );
    const trigger = screen.getByRole('button', { name: '查看详情' });
    expect(trigger.id).toBe('note-details');
    expect(triggerRef.current).toBe(trigger);
    await user.click(trigger);
    expect(clicks).toBe(1);
    await screen.findByRole('dialog', { name: '内容说明' });
    await user.keyboard('{Escape}');
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});
