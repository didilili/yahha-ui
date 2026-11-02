import { useContext } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Dialog } from '../components/dialog/Dialog.js';
import { ThemeProvider } from './ThemeProvider.js';
import { ThemeContext, type ThemeName } from './theme-context.js';

afterEach(cleanup);

function ThemeProbe() {
  const { theme } = useContext(ThemeContext);
  return <span data-testid="context-theme">{theme}</span>;
}

describe('ThemeProvider', () => {
  it.each([
    ['pink', 'pink'],
    ['blue', 'blue'],
    ['yellow', 'yellow'],
    ['chiikawa', 'pink'],
    ['hachiware', 'blue'],
    ['usagi', 'yellow'],
  ] satisfies [ThemeName, string][])(
    'shares the %s preset as %s with its root and consumers',
    (theme, expected) => {
      render(
        <ThemeProvider theme={theme}>
          <ThemeProbe />
        </ThemeProvider>,
      );
      const probe = screen.getByTestId('context-theme');
      expect(probe.textContent).toBe(expected);
      expect(probe.parentElement?.dataset.yahhaTheme).toBe(expected);
    },
  );

  it('maps optional tokens to CSS variables on its root', () => {
    render(
      <ThemeProvider
        theme="blue"
        className="layout-root"
        tokens={{
          ink: '#111111',
          muted: '#222222',
          accent: '#333333',
          accentHover: '#444444',
          accentSoft: '#555555',
          line: '#666666',
          focus: '#777777',
          surface: '#888888',
          fieldBackground: '#999999',
          error: '#aa0000',
        }}
      >
        <span>主题内容</span>
      </ThemeProvider>,
    );
    const root = screen.getByText('主题内容').parentElement!;
    expect(root.dataset.yahhaTheme).toBe('blue');
    expect(root.classList.contains('layout-root')).toBe(true);
    expect(root.style.getPropertyValue('--yahha-ink')).toBe('#111111');
    expect(root.style.getPropertyValue('--yahha-muted')).toBe('#222222');
    expect(root.style.getPropertyValue('--yahha-accent')).toBe('#333333');
    expect(root.style.getPropertyValue('--yahha-accent-hover')).toBe('#444444');
    expect(root.style.getPropertyValue('--yahha-accent-soft')).toBe('#555555');
    expect(root.style.getPropertyValue('--yahha-line')).toBe('#666666');
    expect(root.style.getPropertyValue('--yahha-contour')).toBe('#666666');
    expect(root.style.getPropertyValue('--yahha-paper-line')).toBe('#666666');
    expect(root.style.getPropertyValue('--yahha-neutral-line')).toBe('');
    expect(root.style.getPropertyValue('--yahha-focus')).toBe('#777777');
    expect(root.style.getPropertyValue('--yahha-surface')).toBe('#888888');
    expect(root.style.getPropertyValue('--yahha-field-background')).toBe('#999999');
    expect(root.style.getPropertyValue('--yahha-error')).toBe('#aa0000');
  });

  it('removes a token override when it is no longer supplied', () => {
    const view = render(
      <ThemeProvider theme="pink" tokens={{ accent: 'salmon', line: '#846973' }}>
        <span>主题内容</span>
      </ThemeProvider>,
    );
    const root = screen.getByText('主题内容').parentElement!;
    expect(root.style.getPropertyValue('--yahha-accent')).toBe('salmon');
    expect(root.style.getPropertyValue('--yahha-contour')).toBe('#846973');
    expect(root.style.getPropertyValue('--yahha-paper-line')).toBe('#846973');
    expect(root.style.getPropertyValue('--yahha-neutral-line')).toBe('');

    view.rerender(
      <ThemeProvider theme="pink">
        <span>主题内容</span>
      </ThemeProvider>,
    );
    expect(root.style.getPropertyValue('--yahha-accent')).toBe('');
    expect(root.style.getPropertyValue('--yahha-contour')).toBe('');
    expect(root.style.getPropertyValue('--yahha-paper-line')).toBe('');
  });

  it('updates an existing portal when switching between color names and legacy aliases', () => {
    function Example({ theme, surface }: { theme: ThemeName; surface: string }) {
      return (
        <ThemeProvider theme={theme} tokens={{ surface }}>
          <span data-testid="provider-content">内容</span>
          <Dialog open onOpenChange={() => {}} title="切换主题" />
        </ThemeProvider>
      );
    }
    const view = render(<Example theme="yellow" surface="#fff000" />);
    const root = screen.getByTestId('provider-content').parentElement!;
    const dialog = screen.getByRole('dialog', { name: '切换主题' });
    const portal = dialog.closest<HTMLElement>('[data-yahha-theme]')!;
    expect(root.contains(portal)).toBe(false);
    expect(portal.dataset.yahhaTheme).toBe('yellow');

    for (const [theme, expected, surface] of [
      ['hachiware', 'blue', '#0000ff'],
      ['blue', 'blue', '#1111ff'],
      ['chiikawa', 'pink', '#ff0000'],
      ['pink', 'pink', '#ff1111'],
      ['usagi', 'yellow', '#ffff00'],
    ] satisfies [ThemeName, string, string][]) {
      view.rerender(<Example theme={theme} surface={surface} />);
      expect(screen.getByRole('dialog', { name: '切换主题' })).toBe(dialog);
      expect(root.dataset.yahhaTheme).toBe(expected);
      expect(portal.dataset.yahhaTheme).toBe(expected);
      expect(portal.style.getPropertyValue('--yahha-surface')).toBe(surface);
    }
  });

  it('keeps a nested provider and its portal on their own preset and token overrides', () => {
    function Example({ theme, surface }: { theme: ThemeName; surface: string }) {
      return (
        <ThemeProvider
          theme="blue"
          tokens={{ ink: '#123456', surface: '#abcdef' }}
          className="outer-layout"
        >
          <span data-testid="outer-content">外层内容</span>
          <ThemeProvider theme={theme} tokens={{ surface }} className="inner-layout">
            <span data-testid="inner-content">内层内容</span>
            <Dialog open onOpenChange={() => {}} title="局部主题" />
          </ThemeProvider>
        </ThemeProvider>
      );
    }
    const view = render(<Example theme="usagi" surface="#fff000" />);
    const outer = screen.getByTestId('outer-content').parentElement!;
    const inner = screen.getByTestId('inner-content').parentElement!;
    const portal = screen
      .getByRole('dialog', { name: '局部主题' })
      .closest<HTMLElement>('[data-yahha-theme]')!;
    expect(outer.dataset.yahhaTheme).toBe('blue');
    expect(outer.style.getPropertyValue('--yahha-ink')).toBe('#123456');
    for (const target of [inner, portal]) {
      expect(target.dataset.yahhaTheme).toBe('yellow');
      expect(target.style.getPropertyValue('--yahha-surface')).toBe('#fff000');
      expect(target.style.getPropertyValue('--yahha-ink')).toBe('');
    }
    expect(portal.classList.contains('outer-layout')).toBe(false);
    expect(portal.classList.contains('inner-layout')).toBe(false);

    view.rerender(<Example theme="pink" surface="#000fff" />);
    for (const target of [inner, portal]) {
      expect(target.dataset.yahhaTheme).toBe('pink');
      expect(target.style.getPropertyValue('--yahha-surface')).toBe('#000fff');
      expect(target.style.getPropertyValue('--yahha-ink')).toBe('');
    }
    expect(outer.dataset.yahhaTheme).toBe('blue');
    expect(outer.style.getPropertyValue('--yahha-surface')).toBe('#abcdef');
  });

  it('uses the pink preset without token overrides in a portal outside any provider', () => {
    render(
      <>
        <ThemeProbe />
        <Dialog open onOpenChange={() => {}} title="默认主题" />
      </>,
    );
    expect(screen.getByTestId('context-theme').textContent).toBe('pink');
    const portal = screen
      .getByRole('dialog', { name: '默认主题' })
      .closest<HTMLElement>('[data-yahha-theme]')!;
    expect(portal.dataset.yahhaTheme).toBe('pink');
    expect(portal.style.length).toBe(0);
  });
});
