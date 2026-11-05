import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Surface, type SurfaceProps } from './index.js';

afterEach(cleanup);

describe('Surface', () => {
  it('defaults to paper and opts into note without leaking the prop or assigning a role', () => {
    render(
      <>
        <Surface>默认纸面</Surface>
        <Surface variant="paper">显式白纸</Surface>
        <Surface variant="note">便笺纸面</Surface>
      </>,
    );
    const defaultPaper = screen.getByText('默认纸面');
    const explicitPaper = screen.getByText('显式白纸');
    const note = screen.getByText('便笺纸面');

    expect(defaultPaper.getAttribute('data-variant')).toBe('paper');
    expect(explicitPaper.getAttribute('data-variant')).toBe('paper');
    expect(defaultPaper.className).toBe(explicitPaper.className);
    expect(note.getAttribute('data-variant')).toBe('note');
    for (const surface of [defaultPaper, explicitPaper, note]) {
      expect(surface.tagName).toBe('DIV');
      expect(surface.hasAttribute('variant')).toBe(false);
      expect(surface.hasAttribute('role')).toBe(false);
    }
  });

  it('exports props that accept a native div ref and attributes', () => {
    const ref = createRef<HTMLDivElement>();
    const props: SurfaceProps = { ref, title: '内容区域', style: { color: 'red' } };
    render(<Surface {...props}>内容</Surface>);
    const surface = screen.getByText('内容');
    expect(ref.current).toBe(surface);
    expect(surface.title).toBe('内容区域');
    expect(surface.style.color).toBe('red');
  });

  it('retains native ref, attributes, styles, classes and event targets when opting into note', () => {
    const ref = createRef<HTMLDivElement>();
    let clickedTarget: EventTarget | null = null;
    const props: SurfaceProps = {
      variant: 'note',
      ref,
      role: 'region',
      'aria-labelledby': 'note-heading',
      className: 'caller-note',
      style: { color: 'red' },
      onClick: (event) => {
        clickedTarget = event.currentTarget;
      },
    };
    render(
      <Surface {...props}>
        <h3 id="note-heading">文末附言</h3>
      </Surface>,
    );
    const surface = screen.getByRole('region', { name: '文末附言' });

    expect(ref.current).toBe(surface);
    expect(surface.getAttribute('aria-labelledby')).toBe('note-heading');
    expect(surface.classList.contains('caller-note')).toBe(true);
    expect(surface.style.color).toBe('red');
    fireEvent.click(surface);
    expect(clickedTarget).toBe(surface);
  });
});
