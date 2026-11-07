import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { Tabs } from './Tabs.js';

afterEach(cleanup);
const items = [
  { value: 'draft', label: '未发布', content: '暂未公开', disabled: true },
  { value: 'notes', label: '随笔', content: '河边的散步记录' },
  { value: 'photos', label: '相册', content: '窗边的照片' },
];
const directionItems = ['A', 'B', 'C'].map((label) => ({
  value: label,
  label,
  content: `${label} panel`,
}));

describe('Tabs', () => {
  it('keeps selection, focus, panel state and root ref when ink appearance changes', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    const formItems = [
      { value: 'edit', label: '编辑', content: <input aria-label="草稿" /> },
      { value: 'preview', label: '预览', content: '预览内容' },
    ];
    const { rerender } = render(<Tabs ref={ref} label="手记" keepMounted items={formItems} />);
    const root = ref.current;
    expect(root?.getAttribute('data-appearance')).toBe('default');
    await user.type(screen.getByRole('textbox'), '保留草稿');
    const preview = screen.getByRole('tab', { name: '预览' });
    await user.click(preview);
    rerender(<Tabs ref={ref} label="手记" keepMounted appearance="ink" items={formItems} />);
    expect(ref.current).toBe(root);
    expect(root?.getAttribute('data-appearance')).toBe('ink');
    expect(root?.hasAttribute('appearance')).toBe(false);
    expect(document.activeElement).toBe(preview);
    expect(preview.getAttribute('aria-selected')).toBe('true');
    await user.keyboard('{ArrowLeft}{Enter}');
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('保留草稿');
  });

  it.each([false, true])(
    'follows stable child slot reassignment and new ancestors with activateOnFocus=%s',
    async (activateOnFocus) => {
      const user = userEvent.setup();
      const host = document.body.appendChild(document.createElement('div'));
      const shadow = host.attachShadow({ mode: 'open' });
      const sections = ['ltr', 'rtl'].map((direction, index) => {
        const section = shadow.appendChild(document.createElement('section'));
        section.dir = direction;
        section.appendChild(document.createElement('slot')).name = `slot-${index}`;
        return section;
      });
      const tabs = (
        <Tabs
          label="Slotted tabs"
          items={directionItems}
          defaultValue="B"
          activateOnFocus={activateOnFocus}
        />
      );
      const view = render(<div slot="slot-0">{tabs}</div>, { container: host });
      try {
        const middle = screen.getByRole('tab', { name: 'B' });
        await user.click(middle);
        await act(async () => {
          view.rerender(<div slot="slot-1">{tabs}</div>);
        });
        expect(middle.closest('[slot]')?.assignedSlot?.name).toBe('slot-1');
        await user.keyboard('{ArrowLeft}');
        expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'C' }));
        expect(
          screen
            .getByRole('tab', { name: activateOnFocus ? 'C' : 'B' })
            .getAttribute('aria-selected'),
        ).toBe('true');
        await act(async () => {
          sections[1]!.dir = 'ltr';
        });
        await user.keyboard('{ArrowLeft}');
        expect(document.activeElement).toBe(middle);
        expect(middle.getAttribute('aria-selected')).toBe('true');
      } finally {
        view.unmount();
        host.remove();
      }
    },
  );

  it.each([false, true])(
    'uses explicit RTL arrows with activateOnFocus=%s',
    async (activateOnFocus) => {
      const user = userEvent.setup();
      render(
        <Tabs
          dir="rtl"
          label="RTL tabs"
          items={directionItems}
          defaultValue="B"
          activateOnFocus={activateOnFocus}
        />,
      );
      await user.tab();
      await user.keyboard('{ArrowLeft}');
      expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'C' }));
      expect(
        screen
          .getByRole('tab', { name: activateOnFocus ? 'C' : 'B' })
          .getAttribute('aria-selected'),
      ).toBe('true');
      await user.keyboard('{Enter}{ArrowRight}');
      expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'B' }));
      await user.keyboard('{Home}');
      expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'A' }));
      await user.keyboard('{End}');
      expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'C' }));
    },
  );

  it('inherits RTL arrows from a native container and follows its direction changes', async () => {
    const user = userEvent.setup();
    const tabs = <Tabs label="Inherited tabs" items={directionItems} defaultValue="B" />;
    const { rerender } = render(<div dir="rtl">{tabs}</div>);
    await user.tab();
    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'C' }));
    rerender(<div dir="ltr">{tabs}</div>);
    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'B' }));
  });

  it('preserves an upstream direction provider when no native direction is specified', async () => {
    const user = userEvent.setup();
    render(
      <DirectionProvider direction="rtl">
        <Tabs label="Provider tabs" items={directionItems} defaultValue="B" />
      </DirectionProvider>,
    );
    await user.tab();
    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'C' }));
  });

  it.each([undefined, 'ltr'] as const)('retains LTR arrows for dir=%s', async (dir) => {
    const user = userEvent.setup();
    render(<Tabs dir={dir} label="LTR tabs" items={directionItems} defaultValue="B" />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'C' }));
  });

  it('lets explicit LTR override an upstream RTL provider', async () => {
    const user = userEvent.setup();
    render(
      <DirectionProvider direction="rtl">
        <Tabs dir="ltr" label="LTR override" items={directionItems} defaultValue="B" />
      </DirectionProvider>,
    );
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'C' }));
  });

  it('uses the nearest native direction when containers differ', async () => {
    const user = userEvent.setup();
    render(
      <div dir="rtl">
        <div dir="ltr">
          <Tabs label="Nested tabs" items={directionItems} defaultValue="B" />
        </div>
      </div>,
    );
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'C' }));
  });

  it.each([false, true])(
    'inherits and follows its shadow host direction with activateOnFocus=%s',
    async (activateOnFocus) => {
      const user = userEvent.setup();
      const host = document.body.appendChild(document.createElement('div'));
      host.dir = 'rtl';
      const shadowRoot = host.attachShadow({ mode: 'open' });
      try {
        const { getByRole } = render(
          <Tabs
            label="Shadow tabs"
            items={directionItems}
            defaultValue="B"
            activateOnFocus={activateOnFocus}
          />,
          { container: shadowRoot },
        );
        await user.click(getByRole('tab', { name: 'B' }));
        await user.keyboard('{ArrowLeft}');
        expect(shadowRoot.activeElement).toBe(getByRole('tab', { name: 'C' }));
        expect(
          getByRole('tab', { name: activateOnFocus ? 'C' : 'B' }).getAttribute('aria-selected'),
        ).toBe('true');
        await act(async () => {
          host.dir = 'ltr';
        });
        await user.keyboard('{ArrowLeft}');
        expect(shadowRoot.activeElement).toBe(getByRole('tab', { name: 'B' }));
      } finally {
        host.remove();
      }
    },
  );

  it('lets explicit root direction override an RTL shadow host', async () => {
    const user = userEvent.setup();
    const host = document.body.appendChild(document.createElement('div'));
    host.dir = 'rtl';
    const shadowRoot = host.attachShadow({ mode: 'open' });
    try {
      const { getByRole } = render(
        <Tabs dir="ltr" label="Shadow override" items={directionItems} defaultValue="B" />,
        { container: shadowRoot },
      );
      await user.click(getByRole('tab', { name: 'B' }));
      await user.keyboard('{ArrowRight}');
      expect(shadowRoot.activeElement).toBe(getByRole('tab', { name: 'C' }));
    } finally {
      host.remove();
    }
  });

  it('uses and follows the nearest slotted ancestor direction before its light DOM host', async () => {
    const user = userEvent.setup();
    const host = document.body.appendChild(document.createElement('div'));
    host.dir = 'ltr';
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const slotContainer = document.createElement('section');
    slotContainer.dir = 'rtl';
    slotContainer.appendChild(document.createElement('slot'));
    shadowRoot.appendChild(slotContainer);
    const container = host.appendChild(document.createElement('div'));
    try {
      const { getByRole } = render(
        <Tabs label="Slotted tabs" items={directionItems} defaultValue="B" />,
        { container },
      );
      await user.click(getByRole('tab', { name: 'B' }));
      await user.keyboard('{ArrowLeft}');
      expect(document.activeElement).toBe(getByRole('tab', { name: 'C' }));
      await act(async () => {
        slotContainer.dir = 'ltr';
      });
      await user.keyboard('{ArrowLeft}');
      expect(document.activeElement).toBe(getByRole('tab', { name: 'B' }));
    } finally {
      host.remove();
    }
  });

  it('normalizes a native container direction attribute', async () => {
    const user = userEvent.setup();
    render(
      <div dir="RTL">
        <Tabs label="Native direction" items={directionItems} defaultValue="B" />
      </div>,
    );
    await user.tab();
    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'C' }));
  });

  it('preserves callback refs and their cleanup when direction changes', () => {
    const releaseRef = vi.fn();
    const ref = vi.fn((element: HTMLDivElement | null) => (element ? releaseRef : undefined));
    const { rerender, unmount } = render(
      <Tabs ref={ref} dir="rtl" label="Ref tabs" items={directionItems} />,
    );
    const root = ref.mock.calls[0]?.[0];
    expect(root?.tagName).toBe('DIV');
    expect(root?.contains(screen.getByRole('tablist'))).toBe(true);
    rerender(<Tabs ref={ref} dir="ltr" label="Ref tabs" items={directionItems} />);
    expect(ref).toHaveBeenCalledTimes(1);
    expect(root?.dir).toBe('ltr');
    expect(releaseRef).not.toHaveBeenCalled();
    unmount();
    expect(releaseRef).toHaveBeenCalledTimes(1);
  });

  it('selects the first enabled tab and links its named panel', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tabs
        ref={ref}
        id="reading"
        className="reading-tabs"
        data-reading="notes"
        label="阅读栏目"
        items={items}
        style={{ marginTop: 8 }}
      />,
    );
    const tab = screen.getByRole('tab', { name: '随笔' });
    const panel = screen.getByRole('tabpanel', { name: '随笔' });
    expect(screen.getByRole('tablist', { name: '阅读栏目' })).toBeTruthy();
    expect(tab.getAttribute('aria-selected')).toBe('true');
    expect(tab.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
    expect(panel.textContent).toBe('河边的散步记录');
    expect(ref.current?.id).toBe('reading');
    expect(ref.current?.classList.contains('reading-tabs')).toBe(true);
    expect(ref.current?.dataset.reading).toBe('notes');
    expect(ref.current?.style.marginTop).toBe('8px');
  });

  it('prevents disabled tab activation and uses arrows then Enter in controlled mode', async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState<string | null>('photos');
      return <Tabs label="阅读栏目" items={items} value={value} onValueChange={setValue} />;
    }
    render(<Example />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: '相册' }));
    await user.keyboard('{ArrowRight}{Enter}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: '未发布' }));
    expect(screen.getByRole('tab', { name: '未发布' }).getAttribute('aria-disabled')).toBe('true');
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: '随笔' }));
    expect(screen.getByRole('tab', { name: '相册' }).getAttribute('aria-selected')).toBe('true');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('tabpanel', { name: '随笔' }).textContent).toBe('河边的散步记录');
  });

  it('falls back when the selected uncontrolled tab is removed without changing its initial default', () => {
    const onValueChange = vi.fn();
    const warn = vi.spyOn(console, 'error');
    const { rerender } = render(
      <Tabs label="阅读栏目" items={items} onValueChange={onValueChange} />,
    );
    rerender(<Tabs label="阅读栏目" items={[items[2]]} onValueChange={onValueChange} />);
    expect(screen.getByRole('tab', { name: '相册' }).getAttribute('aria-selected')).toBe('true');
    expect(onValueChange).toHaveBeenCalledWith('photos');
    expect(warn).not.toHaveBeenCalled();
  });

  it('preserves mounted input state when switching and supports null selection', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const formItems = [
      { value: 'write', label: '留言', content: <input aria-label="留言草稿" /> },
      { value: 'read', label: '说明', content: '草稿留在当前页面' },
    ];
    const { rerender } = render(<Tabs label="留言区" keepMounted items={formItems} />);
    await user.type(screen.getByRole('textbox'), '明天见');
    await user.click(screen.getByRole('tab', { name: '说明' }));
    expect(screen.queryByRole('textbox')).toBeNull();
    await user.click(screen.getByRole('tab', { name: '留言' }));
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('明天见');
    rerender(
      <Tabs
        key="no-selection"
        label="留言区"
        value={null}
        onValueChange={onValueChange}
        items={formItems}
      />,
    );
    expect(screen.queryByRole('tabpanel')).toBeNull();
  });
});
