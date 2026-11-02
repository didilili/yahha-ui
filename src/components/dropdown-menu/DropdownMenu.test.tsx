import { createRef, useState, type ComponentPropsWithRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { Button } from '../button/Button.js';
import { ThemeProvider } from '../../theme/ThemeProvider.js';
import { DropdownMenu } from './DropdownMenu.js';

afterEach(cleanup);

describe('DropdownMenu', () => {
  it('follows a stable child reassigned to another slot and observes its new direction ancestors', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLButtonElement>();
    const select = vi.fn();
    const host = document.body.appendChild(document.createElement('div'));
    const shadow = host.attachShadow({ mode: 'open' });
    const sections = ['ltr', 'rtl'].map((direction, index) => {
      const section = shadow.appendChild(document.createElement('section'));
      section.dir = direction;
      section.appendChild(document.createElement('slot')).name = `slot-${index}`;
      return section;
    });
    const menu = (
      <DropdownMenu
        defaultOpen
        trigger={<button ref={ref}>阅读操作</button>}
        items={[{ id: 'save', label: '收藏', onSelect: select }]}
      />
    );
    const view = render(<div slot="slot-0">{menu}</div>, { container: host });
    try {
      const trigger = screen.getByRole('button', { name: '阅读操作' });
      const popup = await screen.findByRole('menu');
      await waitFor(() => expect(popup.closest<HTMLElement>('[dir]')?.dir).toBe('ltr'));
      view.rerender(<div slot="slot-1">{menu}</div>);
      expect(trigger.parentElement?.assignedSlot?.name).toBe('slot-1');
      await waitFor(() => expect(popup.closest<HTMLElement>('[dir]')?.dir).toBe('rtl'));
      await act(async () => {
        sections[1]!.dir = 'ltr';
      });
      await waitFor(() => expect(popup.closest<HTMLElement>('[dir]')?.dir).toBe('ltr'));
      expect(screen.getByRole('menu')).toBe(popup);
      expect(ref.current).toBe(trigger);
      await user.click(screen.getByRole('menuitem', { name: '收藏' }));
      expect(select).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(document.activeElement).toBe(trigger));
    } finally {
      view.unmount();
      host.remove();
    }
  });

  it('follows a trigger reassigned to a slot with another native direction', async () => {
    const host = document.body.appendChild(document.createElement('div'));
    const shadow = host.attachShadow({ mode: 'open' });
    for (const [direction, name] of [
      ['ltr', 'first'],
      ['rtl', 'second'],
    ]) {
      const section = shadow.appendChild(document.createElement('section'));
      section.dir = direction;
      section.appendChild(document.createElement('slot')).name = name;
    }
    shadow.appendChild(document.createElement('slot'));
    function Example() {
      const [slot, setSlot] = useState('first');
      return (
        <>
          <DropdownMenu
            open
            trigger={<button slot={slot}>阅读操作</button>}
            items={[{ id: 'save', label: '收藏这篇手记', onSelect: () => {} }]}
          />
          <button onClick={() => setSlot('second')}>移动操作入口</button>
        </>
      );
    }
    const view = render(<Example />, { container: host });
    try {
      const popup = await screen.findByRole('menu');
      await waitFor(() => expect(popup.closest<HTMLElement>('[dir]')?.dir).toBe('ltr'));
      const trigger = screen.getByRole('button', { name: '阅读操作' });
      fireEvent.click(screen.getByRole('button', { name: '移动操作入口' }));
      expect(screen.getByRole('button', { name: '阅读操作' })).toBe(trigger);
      expect(trigger.assignedSlot?.name).toBe('second');
      await waitFor(() => expect(popup.closest<HTMLElement>('[dir]')?.dir).toBe('rtl'));
    } finally {
      view.unmount();
      host.remove();
    }
  });

  it('follows a custom trigger that replaces its own native button', async () => {
    function SwappingTrigger({ ref, ...props }: ComponentPropsWithRef<'button'>) {
      const [swapped, setSwapped] = useState(false);
      return (
        <button
          {...props}
          key={swapped ? 'replacement' : 'initial'}
          ref={ref}
          dir={swapped ? 'rtl' : 'ltr'}
          onContextMenu={(event) => {
            event.preventDefault();
            setSwapped(true);
          }}
        >
          阅读操作
        </button>
      );
    }
    render(
      <DropdownMenu
        open
        trigger={<SwappingTrigger />}
        items={[{ id: 'save', label: '收藏这篇手记', onSelect: () => {} }]}
      />,
    );
    const popup = await screen.findByRole('menu');
    await waitFor(() => expect(popup.closest<HTMLElement>('[dir]')?.dir).toBe('ltr'));
    const original = screen.getByRole('button', { name: '阅读操作' });
    fireEvent.contextMenu(original);
    expect(screen.getByRole('button', { name: '阅读操作' })).not.toBe(original);
    await waitFor(() => expect(popup.closest<HTMLElement>('[dir]')?.dir).toBe('rtl'));
  });

  it('inherits native direction and follows ancestor changes in its portalled menu', async () => {
    const menu = (
      <DropdownMenu
        defaultOpen
        trigger={<Button>阅读操作</Button>}
        items={[{ id: 'save', label: '收藏这篇手记', onSelect: () => {} }]}
      />
    );
    const { rerender } = render(<div dir="rtl">{menu}</div>);
    const popup = await screen.findByRole('menu');
    await waitFor(() => expect(popup.closest<HTMLElement>('[dir]')?.dir).toBe('rtl'));
    rerender(<div dir="ltr">{menu}</div>);
    await waitFor(() => expect(popup.closest<HTMLElement>('[dir]')?.dir).toBe('ltr'));
  });

  it('gives the trigger explicit direction priority over its native ancestor', async () => {
    render(
      <div dir="rtl">
        <DropdownMenu
          defaultOpen
          trigger={<Button dir="ltr">阅读操作</Button>}
          items={[{ id: 'save', label: '收藏这篇手记', onSelect: () => {} }]}
        />
      </div>,
    );
    const popup = await screen.findByRole('menu');
    await waitFor(() => expect(popup.closest<HTMLElement>('[dir]')?.dir).toBe('ltr'));
  });

  it('uses the direction provider when no native direction is specified', async () => {
    render(
      <DirectionProvider direction="rtl">
        <DropdownMenu
          defaultOpen
          trigger={<Button>阅读操作</Button>}
          items={[{ id: 'save', label: '收藏这篇手记', onSelect: () => {} }]}
        />
      </DirectionProvider>,
    );
    const popup = await screen.findByRole('menu');
    await waitFor(() => expect(popup.closest<HTMLElement>('[dir]')?.dir).toBe('rtl'));
  });

  it('preserves a custom trigger callback ref and its cleanup across direction changes', async () => {
    const release = vi.fn();
    const ref = vi.fn((node: HTMLButtonElement | null) => (node ? release : undefined));
    const menu = (
      <DropdownMenu
        trigger={<Button ref={ref}>阅读操作</Button>}
        items={[{ id: 'save', label: '收藏这篇手记', onSelect: () => {} }]}
      />
    );
    const { rerender, unmount } = render(<div dir="rtl">{menu}</div>);
    expect(ref).toHaveBeenCalledTimes(1);
    expect(ref.mock.calls[0]?.[0]).toBe(screen.getByRole('button', { name: '阅读操作' }));
    rerender(<div dir="ltr">{menu}</div>);
    expect(ref).toHaveBeenCalledTimes(1);
    expect(release).not.toHaveBeenCalled();
    unmount();
    expect(release).toHaveBeenCalledTimes(1);
  });

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
        <ThemeProvider theme="blue" tokens={{ surface: '#fefefe' }} className="page-layout">
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
      const theme = menu.closest<HTMLElement>('[data-yahha-theme]')!;
      expect(theme.dataset.yahhaTheme).toBe('blue');
      expect(theme.style.getPropertyValue('--yahha-surface')).toBe('#fefefe');
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
