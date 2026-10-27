import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './Accordion.js';

afterEach(cleanup);
const items = [
  { value: 'rss', title: '如何订阅？', content: '使用 RSS 阅读器添加本站地址。' },
  { value: 'comments', title: '可以留言吗？', content: '文章下方可以留下想法。' },
  { value: 'later', title: '旧文章归档', content: '正在整理', disabled: true },
];

describe('Accordion', () => {
  it('expands and collapses a semantic heading trigger with linked content', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    render(
      <Accordion ref={ref} id="faq" headingLevel={2} items={items} style={{ marginTop: 8 }} />,
    );
    const trigger = screen.getByRole('button', { name: '如何订阅？' });
    expect(screen.getByRole('heading', { level: 2, name: '如何订阅？' })).toBeTruthy();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await user.click(trigger);
    const panel = screen.getByText('使用 RSS 阅读器添加本站地址。').parentElement!;
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(trigger.id);
    await user.click(screen.getByRole('button', { name: '可以留言吗？' }));
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(ref.current?.id).toBe('faq');
    expect(ref.current?.style.marginTop).toBe('8px');
  });

  it('supports multiple controlled panels and native keyboard activation', async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState(['rss']);
      return <Accordion items={items} multiple value={value} onValueChange={setValue} />;
    }
    render(<Example />);
    screen.getByRole('button', { name: '可以留言吗？' }).focus();
    await user.keyboard(' ');
    expect(screen.getByRole('button', { name: '如何订阅？' }).getAttribute('aria-expanded')).toBe(
      'true',
    );
    expect(screen.getByRole('button', { name: '可以留言吗？' }).getAttribute('aria-expanded')).toBe(
      'true',
    );
    expect((screen.getByRole('button', { name: '旧文章归档' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: '可以留言吗？' }).getAttribute('aria-expanded')).toBe(
      'false',
    );
  });

  it('disables the whole group and keeps form state when requested', async () => {
    const user = userEvent.setup();
    const formItems = [{ value: 'draft', title: '留言草稿', content: <input aria-label="草稿" /> }];
    const { rerender } = render(
      <Accordion keepMounted defaultValue={['draft']} items={formItems} />,
    );
    await user.type(screen.getByRole('textbox'), '你好');
    await user.click(screen.getByRole('button'));
    expect(screen.queryByRole('textbox')).toBeNull();
    await user.click(screen.getByRole('button'));
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('你好');
    rerender(<Accordion disabled items={formItems} />);
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('keeps only the first uncontrolled value when switching to single mode without remounting', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    const formItems = [
      items[0],
      { value: 'comments', title: '可以留言吗？', content: <input aria-label="草稿" /> },
    ];
    const renderAccordion = (multiple: boolean) => (
      <Accordion
        ref={ref}
        data-testid="faq"
        items={formItems}
        multiple={multiple}
        keepMounted
        onValueChange={onValueChange}
      />
    );
    const { rerender } = render(renderAccordion(true));
    const root = ref.current;
    const first = screen.getByRole('button', { name: '如何订阅？' });
    const second = screen.getByRole('button', { name: '可以留言吗？' });
    await user.click(first);
    await user.click(second);
    const draft = screen.getByRole('textbox') as HTMLInputElement;
    await user.type(draft, '保留这份草稿');

    rerender(renderAccordion(false));
    expect(first.getAttribute('aria-expanded')).toBe('true');
    expect(second.getAttribute('aria-expanded')).toBe('false');
    expect(ref.current).toBe(root);
    expect(screen.getByTestId('faq')).toBe(root);
    expect(draft.isConnected).toBe(true);
    expect(onValueChange.mock.calls.map(([next]) => next)).toEqual([['rss'], ['rss', 'comments']]);

    rerender(renderAccordion(true));
    expect(second.getAttribute('aria-expanded')).toBe('false');
    await user.click(second);
    expect(screen.getByRole('textbox')).toBe(draft);
    expect(draft.value).toBe('保留这份草稿');
    expect(onValueChange).toHaveBeenLastCalledWith(['rss', 'comments']);
  });

  it('uses defaultValue only as an initial snapshot', () => {
    const defaultValue = ['rss', 'comments'];
    const { rerender } = render(<Accordion items={items} defaultValue={defaultValue} />);
    const first = screen.getByRole('button', { name: '如何订阅？' });
    const second = screen.getByRole('button', { name: '可以留言吗？' });
    expect(first.getAttribute('aria-expanded')).toBe('true');
    expect(second.getAttribute('aria-expanded')).toBe('false');

    rerender(<Accordion items={items} multiple defaultValue={['comments']} />);
    expect(first.getAttribute('aria-expanded')).toBe('true');
    expect(second.getAttribute('aria-expanded')).toBe('false');
    expect(defaultValue).toEqual(['rss', 'comments']);
  });

  it('leaves controlled values and mode changes under the caller ownership', async () => {
    const user = userEvent.setup();
    const value = ['rss', 'comments'];
    const onValueChange = vi.fn();
    const renderAccordion = (multiple: boolean) => (
      <Accordion items={items} value={value} multiple={multiple} onValueChange={onValueChange} />
    );
    const { rerender } = render(renderAccordion(true));
    const first = screen.getByRole('button', { name: '如何订阅？' });
    const second = screen.getByRole('button', { name: '可以留言吗？' });

    rerender(renderAccordion(false));
    expect(first.getAttribute('aria-expanded')).toBe('true');
    expect(second.getAttribute('aria-expanded')).toBe('false');
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(second);
    expect(onValueChange).toHaveBeenLastCalledWith(['comments']);
    expect(first.getAttribute('aria-expanded')).toBe('true');
    expect(second.getAttribute('aria-expanded')).toBe('false');

    rerender(renderAccordion(true));
    expect(first.getAttribute('aria-expanded')).toBe('true');
    expect(second.getAttribute('aria-expanded')).toBe('true');
    expect(value).toEqual(['rss', 'comments']);
  });
});
