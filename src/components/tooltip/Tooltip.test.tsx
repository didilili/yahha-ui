import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import userEvent from '@testing-library/user-event';
import { IconButton } from '../button/IconButton.js';
import { ThemeProvider } from '../../theme/ThemeProvider.js';
import { Tooltip } from './Tooltip.js';

afterEach(cleanup);

describe('Tooltip', () => {
  it('keeps portal direction in sync with its native ancestor without remounting trigger refs', async () => {
    const release = vi.fn();
    const triggerRef = vi.fn((node: HTMLButtonElement | null) => (node ? release : undefined));
    const { unmount } = render(
      <div dir="RTL" data-testid="reading-direction">
        <Tooltip
          defaultOpen
          content="文字方向提示"
          trigger={<button ref={triggerRef}>方向提示</button>}
        />
      </div>,
    );
    const popup = await screen.findByText('文字方向提示');
    const portal = popup.closest<HTMLElement>('[data-yahha-theme]')!;
    await waitFor(() => expect(portal.dir).toBe('rtl'));
    await act(async () => {
      screen.getByTestId('reading-direction').dir = 'ltr';
    });
    await waitFor(() => expect(portal.dir).toBe('ltr'));
    expect(triggerRef).toHaveBeenCalledTimes(1);
    expect(triggerRef).toHaveBeenCalledWith(screen.getByRole('button', { name: '方向提示' }));
    expect(release).not.toHaveBeenCalled();
    unmount();
    expect(release).toHaveBeenCalledTimes(1);
  });

  it('uses the trigger native direction before an upstream direction provider', async () => {
    render(
      <DirectionProvider direction="rtl">
        <Tooltip defaultOpen content="本地文字提示" trigger={<button dir="ltr">本地提示</button>} />
      </DirectionProvider>,
    );
    const popup = await screen.findByText('本地文字提示');
    expect(popup.closest<HTMLElement>('[data-yahha-theme]')?.dir).toBe('ltr');
  });

  it('opens on keyboard focus and closes on Escape without changing the trigger name', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip trigger={<IconButton aria-label="收藏文章">☆</IconButton>} content="收藏文章" />,
    );
    await user.tab();
    const trigger = screen.getByRole('button', { name: '收藏文章' });
    const tooltip = await screen.findByText('收藏文章');
    expect(tooltip.textContent).toBe('收藏文章');
    expect(trigger.getAttribute('aria-label')).toBe('收藏文章');
    expect(document.activeElement).toBe(trigger);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('收藏文章')).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it('supports hover delay and leaves disabled tooltips closed', async () => {
    const user = userEvent.setup();
    const view = render(<Tooltip delay={0} trigger={<button>说明</button>} content="额外说明" />);
    await user.hover(screen.getByRole('button', { name: '说明' }));
    await screen.findByText('额外说明');
    await user.unhover(screen.getByRole('button', { name: '说明' }));
    await waitFor(() => expect(screen.queryByText('额外说明')).toBeNull());
    view.rerender(
      <Tooltip disabled delay={0} trigger={<button>说明</button>} content="额外说明" />,
    );
    await user.hover(screen.getByRole('button', { name: '说明' }));
    expect(screen.queryByText('额外说明')).toBeNull();
  });

  it('applies popup refs and nearest-provider theme tokens to an initially open tooltip', async () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ThemeProvider theme="hachiware" tokens={{ ink: '#123456' }} className="page-layout">
        <Tooltip
          defaultOpen
          content="更多阅读提示"
          trigger={<button>阅读提示</button>}
          ref={ref}
          className="custom-tooltip"
          style={{ maxWidth: 200 }}
        />
      </ThemeProvider>,
    );
    const tooltip = await screen.findByText('更多阅读提示');
    expect(ref.current).toBe(tooltip);
    expect(tooltip.classList.contains('custom-tooltip')).toBe(true);
    expect(tooltip.style.maxWidth).toBe('200px');
    const theme = tooltip.closest<HTMLElement>('[data-yahha-theme]')!;
    expect(theme.dataset.yahhaTheme).toBe('hachiware');
    expect(theme.style.getPropertyValue('--yahha-ink')).toBe('#123456');
    expect(theme.classList.contains('page-layout')).toBe(false);
  });

  it('supports controlled open requests and preserves trigger native props and refs', async () => {
    const user = userEvent.setup();
    const triggerRef = createRef<HTMLButtonElement>();
    function Example() {
      const [open, setOpen] = useState(false);
      return (
        <Tooltip
          open={open}
          onOpenChange={setOpen}
          content="收藏当前文章"
          trigger={
            <button id="save-current" ref={triggerRef} aria-label="收藏当前文章">
              ☆
            </button>
          }
        />
      );
    }
    render(<Example />);
    await user.tab();
    expect(triggerRef.current?.id).toBe('save-current');
    await screen.findByText('收藏当前文章');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('收藏当前文章')).toBeNull());
  });
});
