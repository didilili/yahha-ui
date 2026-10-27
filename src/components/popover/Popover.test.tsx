import { createRef, useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button/Button.js';
import { ThemeProvider } from '../../theme/ThemeProvider.js';
import { Popover } from './Popover.js';

afterEach(cleanup);

describe('Popover', () => {
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
    const theme = popup.closest<HTMLElement>('[data-chiikawa-theme]')!;
    expect(theme.dataset.chiikawaTheme).toBe('usagi');
    expect(theme.style.getPropertyValue('--chi-ink')).toBe('#123456');
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
