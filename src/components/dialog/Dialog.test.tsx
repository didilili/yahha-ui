import { createRef, useState } from 'react';
import type { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { afterEach, describe, expect, expectTypeOf, it } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button/Button.js';
import { ThemeProvider } from '../../theme/ThemeProvider.js';
import { Dialog, type DialogProps } from './Dialog.js';

afterEach(cleanup);

describe('Dialog', () => {
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
