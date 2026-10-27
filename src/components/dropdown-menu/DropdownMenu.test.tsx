import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button/Button.js';
import { ThemeProvider } from '../../theme/ThemeProvider.js';
import { DropdownMenu } from './DropdownMenu.js';

afterEach(cleanup);

describe('DropdownMenu', () => {
  it('navigates actions, keeps disabled items discoverable without activating and returns focus', async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    render(
      <DropdownMenu
        trigger={<Button>文章操作</Button>}
        items={[
          { id: 'save', label: '收藏', onSelect: () => select('save') },
          { id: 'publish', label: '发布', disabled: true, onSelect: () => select('publish') },
          { id: 'remove', label: '移除', destructive: true, onSelect: () => select('remove') },
        ]}
      />,
    );
    const trigger = screen.getByRole('button', { name: '文章操作' });
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    await screen.findByRole('menu');
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: '收藏' })),
    );
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: '发布' }));
    await user.keyboard('{Enter}');
    expect(select).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeTruthy();
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: '移除' }));
    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: '收藏' }));
    await user.keyboard('{End}{Enter}');
    expect(select).toHaveBeenCalledExactlyOnceWith('remove');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('supports controlled state, popup refs and custom portal themes without page classes', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    const container = document.createElement('div');
    document.body.append(container);
    function Example() {
      const [open, setOpen] = useState(false);
      return (
        <ThemeProvider theme="hachiware" tokens={{ surface: '#fefefe' }} className="page-layout">
          <DropdownMenu
            trigger={<Button id="article-actions">更多</Button>}
            open={open}
            onOpenChange={setOpen}
            portalContainer={container}
            ref={ref}
            className="custom-menu"
            style={{ width: 220 }}
            items={[{ id: 'read', label: '继续阅读', onSelect: () => {} }]}
          />
        </ThemeProvider>
      );
    }
    const view = render(<Example />);
    try {
      await user.click(screen.getByRole('button', { name: '更多' }));
      const menu = await screen.findByRole('menu');
      expect(menu.getAttribute('aria-labelledby')).toBe('article-actions');
      expect(ref.current).toBe(menu);
      expect(container.contains(menu)).toBe(true);
      expect(menu.classList.contains('custom-menu')).toBe(true);
      expect(menu.style.width).toBe('220px');
      const theme = menu.closest<HTMLElement>('[data-chiikawa-theme]')!;
      expect(theme.dataset.chiikawaTheme).toBe('hachiware');
      expect(theme.style.getPropertyValue('--chi-surface')).toBe('#fefefe');
      expect(theme.classList.contains('page-layout')).toBe(false);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    } finally {
      view.unmount();
      container.remove();
    }
  });

  it('keeps controlled actions available when the parent declines a close request', async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <DropdownMenu
        trigger={<Button>保留打开的菜单</Button>}
        open
        onOpenChange={onOpenChange}
        items={[{ id: 'save', label: '保存手记', onSelect: select }]}
      />,
    );
    const action = await screen.findByRole('menuitem', { name: '保存手记' });
    action.focus();
    await user.keyboard('{Escape}');
    expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);
    expect(screen.getByRole('menu')).toBeTruthy();
    action.focus();
    await user.keyboard('{Enter}');
    expect(select).toHaveBeenCalledOnce();
    expect(screen.getByRole('menu')).toBeTruthy();
  });
});
