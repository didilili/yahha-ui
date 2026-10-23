import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider.js';

afterEach(cleanup);

describe('ThemeProvider', () => {
  it('maps optional tokens to CSS variables on its root', () => {
    render(
      <ThemeProvider
        theme="hachiware"
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
    expect(root.dataset.chiikawaTheme).toBe('hachiware');
    expect(root.classList.contains('layout-root')).toBe(true);
    expect(root.style.getPropertyValue('--chi-ink')).toBe('#111111');
    expect(root.style.getPropertyValue('--chi-muted')).toBe('#222222');
    expect(root.style.getPropertyValue('--chi-accent')).toBe('#333333');
    expect(root.style.getPropertyValue('--chi-accent-hover')).toBe('#444444');
    expect(root.style.getPropertyValue('--chi-accent-soft')).toBe('#555555');
    expect(root.style.getPropertyValue('--chi-line')).toBe('#666666');
    expect(root.style.getPropertyValue('--chi-focus')).toBe('#777777');
    expect(root.style.getPropertyValue('--chi-surface')).toBe('#888888');
    expect(root.style.getPropertyValue('--chi-field-background')).toBe('#999999');
    expect(root.style.getPropertyValue('--chi-error')).toBe('#aa0000');
  });

  it('removes a token override when it is no longer supplied', () => {
    const view = render(
      <ThemeProvider theme="chiikawa" tokens={{ accent: 'salmon' }}>
        <span>主题内容</span>
      </ThemeProvider>,
    );
    const root = screen.getByText('主题内容').parentElement!;
    expect(root.style.getPropertyValue('--chi-accent')).toBe('salmon');

    view.rerender(
      <ThemeProvider theme="chiikawa">
        <span>主题内容</span>
      </ThemeProvider>,
    );
    expect(root.style.getPropertyValue('--chi-accent')).toBe('');
  });
});
