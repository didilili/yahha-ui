import { createRef, useState } from 'react';
import type { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import userEvent from '@testing-library/user-event';
import { Button } from '../button/Button.js';
import { ThemeProvider } from '../../theme/ThemeProvider.js';
import { Dialog, type DialogProps } from './Dialog.js';

afterEach(cleanup);

describe('Dialog', () => {
  it('preserves portal CSS inheritance when no direction is explicitly configured', () => {
    const originalDirection = document.documentElement.style.direction;
    document.documentElement.style.direction = 'rtl';
    const view = render(
      <Dialog open onOpenChange={() => {}} title="CSS 方向" trigger={<button>方向入口</button>} />,
    );
    try {
      const popup = screen.getByRole('dialog', { name: 'CSS 方向' });
      expect(popup.closest<HTMLElement>('[data-yahha-theme]')!.hasAttribute('dir')).toBe(false);
      expect(popup.style.direction).toBe('');
    } finally {
      view.unmount();
      document.documentElement.style.direction = originalDirection;
    }
  });

  it.each(['ltr', 'rtl'] as const)(
    'keeps an explicitly inherited %s direction before portal CSS',
    (direction) => {
      const originalDirection = document.documentElement.style.direction;
      document.documentElement.style.direction = direction === 'ltr' ? 'rtl' : 'ltr';
      const view = render(
        <DirectionProvider direction={direction}>
          <Dialog
            open
            onOpenChange={() => {}}
            title="方向上下文"
            trigger={<button>方向入口</button>}
          />
        </DirectionProvider>,
      );
      try {
        const popup = screen.getByRole('dialog', { name: '方向上下文' });
        expect(popup.closest<HTMLElement>('[data-yahha-theme]')!.dir).toBe(direction);
      } finally {
        view.unmount();
        document.documentElement.style.direction = originalDirection;
      }
    },
  );

  it('keeps portal direction in sync with its trigger ancestry without remounting refs', async () => {
    const user = userEvent.setup();
    const release = vi.fn();
    const triggerRef = vi.fn((node: HTMLButtonElement | null) => (node ? release : undefined));
    const popupRef = createRef<HTMLDivElement>();
    function Example() {
      const [open, setOpen] = useState(false);
      return (
        <div dir="RTL" data-testid="reading-direction">
          <Dialog
            open={open}
            onOpenChange={setOpen}
            title="方向说明"
            ref={popupRef}
            trigger={<button ref={triggerRef}>方向设置</button>}
          />
        </div>
      );
    }
    const view = render(<Example />);
    const trigger = screen.getByRole('button', { name: '方向设置' });
    await user.click(trigger);
    const popup = await screen.findByRole('dialog', { name: '方向说明' });
    const portal = popup.closest<HTMLElement>('[data-yahha-theme]')!;
    await waitFor(() => expect(portal.dir).toBe('rtl'));
    await act(async () => {
      screen.getByTestId('reading-direction').dir = 'ltr';
    });
    await waitFor(() => expect(portal.dir).toBe('ltr'));
    expect(popupRef.current).toBe(popup);
    expect(screen.getByRole('dialog')).toBe(popup);
    expect(triggerRef).toHaveBeenCalledTimes(1);
    expect(release).not.toHaveBeenCalled();
    view.unmount();
    expect(release).toHaveBeenCalledTimes(1);
  });

  it.each(['ltr', 'rtl'] as const)(
    'preserves explicit popup %s style before trigger direction',
    async (direction) => {
      const view = render(
        <DirectionProvider direction={direction === 'ltr' ? 'rtl' : 'ltr'}>
          <Dialog
            open
            onOpenChange={() => {}}
            title="显式方向"
            style={{ direction }}
            trigger={<button dir={direction === 'ltr' ? 'rtl' : 'ltr'}>方向入口</button>}
          />
        </DirectionProvider>,
      );
      const popup = screen.getByRole('dialog', { name: '显式方向' });
      await waitFor(() =>
        expect(popup.closest<HTMLElement>('[data-yahha-theme]')!.dir).toBe(direction),
      );
      expect(popup.style.direction).toBe(direction);
      view.unmount();
    },
  );

  it('keeps programmatic dialogs free to inherit their native portal direction', () => {
    const container = document.createElement('div');
    container.dir = 'rtl';
    container.style.direction = 'rtl';
    document.body.append(container);
    const view = render(
      <Dialog open onOpenChange={() => {}} title="原生方向" portalContainer={container} />,
    );
    try {
      const popup = screen.getByRole('dialog', { name: '原生方向' });
      const theme = popup.closest<HTMLElement>('[data-yahha-theme]')!;
      expect(container.contains(popup)).toBe(true);
      expect(theme.hasAttribute('dir')).toBe(false);
      expect(popup.style.direction).toBe('');
    } finally {
      view.unmount();
      container.remove();
    }
  });

  it('updates direction when a trigger is replaced and restores native inheritance when omitted', async () => {
    const view = render(
      <Dialog
        open
        onOpenChange={() => {}}
        title="更换入口"
        trigger={<Button dir="rtl">方向入口</Button>}
      />,
    );
    const popup = screen.getByRole('dialog', { name: '更换入口' });
    const theme = popup.closest<HTMLElement>('[data-yahha-theme]')!;
    await waitFor(() => expect(theme.dir).toBe('rtl'));
    view.rerender(
      <Dialog
        open
        onOpenChange={() => {}}
        title="更换入口"
        trigger={<button dir="ltr">方向入口</button>}
      />,
    );
    await waitFor(() => expect(theme.dir).toBe('ltr'));
    expect(screen.getByRole('dialog')).toBe(popup);
    view.rerender(<Dialog open onOpenChange={() => {}} title="更换入口" />);
    await waitFor(() => expect(theme.hasAttribute('dir')).toBe(false));
    expect(screen.getByRole('dialog')).toBe(popup);
  });

  it('associates a numeric zero description and hides decorative zero content', () => {
    render(
      <Dialog open onOpenChange={() => {}} title="零值说明" description={0} illustration={0} />,
    );
    const dialog = screen.getByRole('dialog', { name: '零值说明' });
    const descriptionId = dialog.getAttribute('aria-describedby');
    expect(descriptionId).toBeTruthy();
    expect(document.getElementById(descriptionId!)?.textContent).toBe('0');
    expect(screen.getAllByText('0').some((node) => node.closest('[aria-hidden="true"]'))).toBe(
      true,
    );
  });

  it('keeps an empty dialog usable and removes a cleared description association', async () => {
    const user = userEvent.setup();
    const view = render(
      <Dialog open onOpenChange={() => {}} title="空内容" description="即将清除的说明" />,
    );
    const dialog = screen.getByRole('dialog', { name: '空内容' });
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
    view.rerender(<Dialog open onOpenChange={() => {}} title="空内容" />);
    expect(screen.queryByText('即将清除的说明')).toBeNull();
    expect(dialog.getAttribute('aria-describedby')).toBeNull();
    const close = screen.getByRole('button', { name: '关闭弹窗' });
    close.focus();
    await user.keyboard('{Enter}');
    // A controlled caller can decline the close request without losing the popup.
    expect(screen.getByRole('dialog', { name: '空内容' })).toBe(dialog);
  });

  it('preserves the Base UI focus and portal option types', () => {
    expectTypeOf<DialogProps['initialFocus']>().toEqualTypeOf<
      BaseDialog.Popup.Props['initialFocus']
    >();
    expectTypeOf<DialogProps['finalFocus']>().toEqualTypeOf<BaseDialog.Popup.Props['finalFocus']>();
    expectTypeOf<DialogProps['portalContainer']>().toEqualTypeOf<
      BaseDialog.Portal.Props['container']
    >();
  });

  it('opens a dialog, closes on Escape, and returns focus to its trigger', async () => {
    const user = userEvent.setup();
    function Example() {
      const [open, setOpen] = useState(false);
      return (
        <ThemeProvider theme="blue">
          <Dialog
            open={open}
            onOpenChange={setOpen}
            trigger={<Button>查看说明</Button>}
            title="欢迎来玩"
            description="这里可以放一些说明。"
          >
            <p>弹窗内容</p>
          </Dialog>
        </ThemeProvider>
      );
    }
    render(<Example />);
    const trigger = screen.getByRole('button', { name: '查看说明' });
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: '欢迎来玩' });
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
    expect(dialog.closest('[data-yahha-theme]')?.getAttribute('data-yahha-theme')).toBe('blue');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('opens programmatically without rendering an empty trigger', () => {
    const view = render(<Dialog open onOpenChange={() => {}} title="程序打开" />);

    expect(screen.getByRole('dialog', { name: '程序打开' })).toBeTruthy();
    expect(view.container.querySelector('button')).toBeNull();
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByRole('button', { name: '关闭弹窗' })).toBeTruthy();
  });

  it('applies popup props and moves focus to the requested elements', async () => {
    const user = userEvent.setup();
    const popupRef = createRef<HTMLDivElement>();
    const initialFocus = createRef<HTMLInputElement>();
    const finalFocus = createRef<HTMLButtonElement>();
    function Example() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>程序打开</Button>
          <Button ref={finalFocus}>返回这里</Button>
          <Dialog
            open={open}
            onOpenChange={setOpen}
            title="焦点控制"
            ref={popupRef}
            className="custom-popup"
            style={{ width: 320 }}
            initialFocus={initialFocus}
            finalFocus={finalFocus}
            closeLabel="完成并关闭"
          >
            <input ref={initialFocus} aria-label="先填写这里" />
          </Dialog>
        </>
      );
    }
    render(<Example />);
    const returnButton = screen.getByRole('button', { name: '返回这里' });
    await user.click(screen.getByRole('button', { name: '程序打开' }));
    const dialog = await screen.findByRole('dialog', { name: '焦点控制' });

    expect(popupRef.current).toBe(dialog);
    expect(dialog.classList.contains('custom-popup')).toBe(true);
    expect(dialog.style.width).toBe('320px');
    await waitFor(() => expect(document.activeElement).toBe(initialFocus.current));
    await user.click(screen.getByRole('button', { name: '完成并关闭' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(returnButton));
  });

  it.each(['element', 'ref'] as const)(
    'uses a supplied %s portal container and can prevent pointer dismissal',
    async (containerType) => {
      const user = userEvent.setup();
      const portalContainer = document.createElement('div');
      document.body.append(portalContainer);
      function Example({ disablePointerDismissal }: { disablePointerDismissal?: boolean }) {
        const [open, setOpen] = useState(true);
        return (
          <Dialog
            open={open}
            onOpenChange={setOpen}
            title="确认选择"
            portalContainer={
              containerType === 'element' ? portalContainer : { current: portalContainer }
            }
            disablePointerDismissal={disablePointerDismissal}
          />
        );
      }
      const view = render(<Example disablePointerDismissal />);
      try {
        const dialog = await screen.findByRole('dialog', { name: '确认选择' });
        expect(portalContainer.contains(dialog)).toBe(true);
        const backdrop = dialog.parentElement!.querySelector<HTMLElement>('[role="presentation"]')!;
        await user.click(backdrop);
        expect(screen.getByRole('dialog', { name: '确认选择' })).toBe(dialog);

        view.rerender(<Example />);
        await user.click(backdrop);
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      } finally {
        view.unmount();
        portalContainer.remove();
      }
    },
  );

  it('shares the nearest provider tokens across its portal and updates them on rerender', () => {
    function Example({ surface }: { surface: string }) {
      return (
        <ThemeProvider theme="blue" tokens={{ ink: '#123456' }} className="outer-layout">
          <ThemeProvider
            theme="yellow"
            tokens={{ ink: '#654321', surface }}
            className="playground-layout"
          >
            <Dialog open onOpenChange={() => {}} title="主题同步" />
          </ThemeProvider>
        </ThemeProvider>
      );
    }
    const view = render(<Example surface="#fff000" />);
    const dialog = screen.getByRole('dialog', { name: '主题同步' });
    const portalTheme = dialog.closest<HTMLElement>('[data-yahha-theme]')!;

    expect(portalTheme.dataset.yahhaTheme).toBe('yellow');
    expect(portalTheme.style.getPropertyValue('--yahha-ink')).toBe('#654321');
    expect(portalTheme.style.getPropertyValue('--yahha-surface')).toBe('#fff000');
    expect(portalTheme.classList.contains('playground-layout')).toBe(false);
    expect(portalTheme.classList.contains('outer-layout')).toBe(false);

    view.rerender(<Example surface="#000fff" />);
    expect(portalTheme.style.getPropertyValue('--yahha-surface')).toBe('#000fff');
  });

  it('uses the default theme when there is no provider', () => {
    render(<Dialog open onOpenChange={() => {}} title="默认主题" />);
    expect(
      screen.getByRole('dialog', { name: '默认主题' }).closest<HTMLElement>('[data-yahha-theme]')
        ?.dataset.yahhaTheme,
    ).toBe('pink');
  });
});
