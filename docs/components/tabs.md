<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Tabs 标签页

用于在同一区域切换相关内容面板，建立标签与面板的语义关联。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Tabs } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于在同一区域切换相关内容面板，建立标签与面板的语义关联。只改变一个简短筛选值时使用 [SegmentedControl](segmented-control.md)；填写带说明的单选答案时使用 [RadioGroup](radio-group.md)；需要收起选项时使用 [Select](select.md)。跨页面导航使用链接。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 基础用法

切换标签，查看对应内容面板。

[查看示例文件](../../playground/src/examples/navigation/TabsBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/navigation/TabsBasic.tsx -->

```tsx
import { Tabs } from 'yahha-ui';

export default function TabsBasic() {
  return (
    <Tabs
      label="小站栏目"
      items={[
        {
          value: 'notes',
          label: '日常随笔',
          content: (
            <article>
              <h3 style={{ marginTop: 0 }}>沿着河岸，慢慢走回家</h3>
              <p style={{ marginBottom: 0 }}>走到桥边才发现，手里还攥着面包店的小票。</p>
            </article>
          ),
        },
        {
          value: 'photos',
          label: '窗边相册',
          content: (
            <ul style={{ margin: 0, paddingLeft: 24 }}>
              <li>清晨落在书页上的阳光</li>
              <li>雨停之后的小花</li>
              <li>厨房里刚烤好的面包</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
```

<a id="controlled-value"></a>

### 受控切换

切换标签，同步显示当前选择。

[查看示例文件](../../playground/src/examples/navigation/TabsValue.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/navigation/TabsValue.tsx -->

```tsx
import { useState } from 'react';
import { Tabs, Text } from 'yahha-ui';

export default function TabsValue() {
  const [value, setValue] = useState<string | null>('notes');

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Tabs
        label="小站栏目"
        value={value}
        onValueChange={setValue}
        items={[
          { value: 'notes', label: '手记', content: <p>今天想记下的一件小事。</p> },
          { value: 'photos', label: '相册', content: <p>这一周拍下的树影与晚霞。</p> },
        ]}
      />
      <Text size="sm" tone="muted" role="status">
        当前栏目：{value === 'notes' ? '手记' : '相册'}
      </Text>
    </div>
  );
}
```

<a id="states"></a>

### 禁用标签与长标签

分别查看不可用的标签，以及窄容器中长标签的换行。

[查看示例文件](../../playground/src/examples/navigation/TabsStates.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/navigation/TabsStates.tsx -->

```tsx
import { Tabs, Text } from 'yahha-ui';

export default function TabsStates() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'grid', gap: 12 }}>
        <Text size="sm" tone="muted">
          禁用标签
        </Text>
        <Tabs
          label="小站栏目可用状态"
          items={[
            { value: 'notes', label: '手记', content: <p>今天想记下的一件小事。</p> },
            {
              value: 'archive',
              label: '旧站归档（整理中）',
              content: <p>旧文章正在整理。</p>,
              disabled: true,
            },
          ]}
        />
      </div>
      <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
        <Text size="sm" tone="muted">
          长标签换行
        </Text>
        <Tabs
          label="小站阅读说明"
          items={[
            {
              value: 'about',
              label: '关于这个小站与慢慢更新的日常记录',
              content: <p>这里记下散步绕过的路、书里的句子和没忍住多买的点心。</p>,
            },
            {
              value: 'contact',
              label: '来信方式',
              content: <p>可以在文章末尾找到作者留下的联系方式。</p>,
            },
          ]}
        />
      </div>
    </div>
  );
}
```

<a id="appearance"></a>

### 普通与墨线

普通标签保留直线选中标记；ink 增加倾斜墨线与选中纸面。

[查看示例文件](../../playground/src/examples/navigation/TabsAppearance.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/navigation/TabsAppearance.tsx -->

```tsx
import { Tabs, Text } from 'yahha-ui';

const items = [
  { value: 'notes', label: '日常随笔', content: '走到桥边才发现，手里还攥着面包店的小票。' },
  { value: 'photos', label: '窗边相册', content: '雨停之后，书页上落着一小片阳光。' },
];

export default function TabsAppearance() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
        gap: 24,
      }}
    >
      {(['default', 'ink'] as const).map((appearance) => (
        <div
          key={appearance}
          style={{ display: 'grid', alignContent: 'start', gap: 12, minWidth: 0 }}
        >
          <Text size="sm" tone="muted">
            {appearance === 'default' ? '普通（默认）' : '墨线'}
          </Text>
          <Tabs
            appearance={appearance}
            label={appearance === 'default' ? '普通栏目' : '墨线栏目'}
            items={items}
          />
        </div>
      ))}
    </div>
  );
}
```

<a id="integration"></a>

## 进阶用法

明信片例保持输入非受控，预览展示当前草稿原文；再次修改后切换预览会更新内容。 预览正文不重复播报，草稿只在当前示例，不发送或持久保存。

<a id="counts"></a>

### 标签数量与列表同步

归档清单中的手记，数量标记与两个面板同步更新。

[查看示例文件](../../playground/src/examples/navigation/TabsCounts.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/navigation/TabsCounts.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Heading, Tabs, Text } from 'yahha-ui';

const initialNotes = [
  { id: 'rain', title: '雨天的读书笔记' },
  { id: 'walk', title: '周末散步的小发现' },
  { id: 'window', title: '窗边的植物记录' },
];

export default function TabsCounts() {
  const [archivedIds, setArchivedIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const pendingHeading = useRef<HTMLHeadingElement>(null);
  const pendingFocus = useRef<{ id?: string } | null>(null);
  const pendingNotes = initialNotes.filter((note) => !archivedIds.includes(note.id));
  const archivedNotes = initialNotes.filter((note) => archivedIds.includes(note.id));

  useEffect(() => {
    const destination = pendingFocus.current;
    if (!destination) return;
    pendingFocus.current = null;
    if (document.activeElement === document.body) {
      (destination.id ? buttons.current.get(destination.id) : pendingHeading.current)?.focus();
    }
  }, [archivedIds]);

  function archive(id: string, button: HTMLButtonElement) {
    const index = pendingNotes.findIndex((note) => note.id === id);
    const remaining = pendingNotes.filter((note) => note.id !== id);
    if (document.activeElement === button) {
      pendingFocus.current = { id: (remaining[index] ?? remaining[index - 1])?.id };
    }
    setArchivedIds((current) => [...current, id]);
    setMessage(`已归档《${initialNotes.find((note) => note.id === id)?.title}》。`);
  }

  return (
    <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
      <Tabs
        label="手记整理"
        items={[
          {
            value: 'pending',
            label: (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                待整理 <Badge>{pendingNotes.length}</Badge>
              </span>
            ),
            content: (
              <div style={{ display: 'grid', gap: 12, minWidth: 0 }}>
                {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
                <Heading level={3} ref={pendingHeading} tabIndex={-1}>
                  待整理手记
                </Heading>
                {pendingNotes.length === 0 ? (
                  <Text tone="muted">当前清单已整理完。</Text>
                ) : (
                  <ul
                    style={{ display: 'grid', gap: 12, padding: 0, margin: 0, listStyle: 'none' }}
                  >
                    {pendingNotes.map((note) => (
                      <li
                        key={note.id}
                        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}
                      >
                        <Text style={{ flex: '1 1 140px', margin: 0 }}>{note.title}</Text>
                        <Button
                          ref={(node) => {
                            if (node) buttons.current.set(note.id, node);
                            else buttons.current.delete(note.id);
                          }}
                          variant="secondary"
                          aria-label={`归档《${note.title}》`}
                          onClick={(event) => archive(note.id, event.currentTarget)}
                        >
                          归档
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ),
          },
          {
            value: 'archived',
            label: (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                已归档 <Badge tone="success">{archivedNotes.length}</Badge>
              </span>
            ),
            content: (
              <div style={{ display: 'grid', gap: 12, minWidth: 0 }}>
                <Heading level={3}>已归档手记</Heading>
                {archivedNotes.length === 0 ? (
                  <Text tone="muted">还没有归档的手记。</Text>
                ) : (
                  <ul style={{ margin: 0, paddingInlineStart: 24 }}>
                    {archivedNotes.map((note) => (
                      <li key={note.id}>{note.title}</li>
                    ))}
                  </ul>
                )}
              </div>
            ),
          },
        ]}
      />
      <Button
        variant="ghost"
        style={{ justifySelf: 'start' }}
        onClick={() => {
          setArchivedIds([]);
          setMessage('已恢复示例清单。');
        }}
      >
        恢复示例清单
      </Button>
      {message && (
        <Text size="sm" tone="muted" role="status">
          {message}
        </Text>
      )}
    </div>
  );
}
```

<a id="controlled"></a>

### 保留面板状态

切换到预览，再返回编辑；输入内容保持不变。

[查看示例文件](../../playground/src/examples/navigation/TabsControlled.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/navigation/TabsControlled.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Button, Heading, Surface, Tabs, Text, TextField } from 'yahha-ui';

export default function TabsControlled() {
  const [value, setValue] = useState<string | null>('write');
  const [preview, setPreview] = useState('');
  const [focusDraft, setFocusDraft] = useState(false);
  const draft = useRef<HTMLInputElement>(null);
  const currentLabel =
    value === 'write' ? '写一张明信片' : value === 'about' ? '预览明信片' : '未选择';

  useEffect(() => {
    if (!focusDraft || value !== 'write') return;
    const frame = requestAnimationFrame(() => {
      draft.current?.focus();
      setFocusDraft(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [focusDraft, value]);

  return (
    <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
      <Tabs
        label="明信片编辑与预览"
        value={value}
        onValueChange={(nextValue) => {
          setFocusDraft(false);
          if (nextValue === 'about') setPreview(draft.current?.value ?? '');
          setValue(nextValue);
        }}
        keepMounted
        items={[
          {
            value: 'write',
            label: '写一张明信片',
            content: (
              <TextField ref={draft} label="明信片草稿" placeholder="写下今天想分享的一件小事" />
            ),
          },
          {
            value: 'about',
            label: '预览明信片',
            content: (
              <article aria-label="明信片预览" style={{ minWidth: 0 }}>
                <Surface style={{ display: 'grid', gap: 12, minWidth: 0 }}>
                  <Heading level={3}>写给朋友的明信片</Heading>
                  {preview === '' ? (
                    <Text tone="muted">还没有写下明信片内容。</Text>
                  ) : (
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      <Text>{preview}</Text>
                    </div>
                  )}
                </Surface>
              </article>
            ),
          },
        ]}
      />
      <Button
        variant="secondary"
        style={{ justifySelf: 'start' }}
        onClick={() => {
          setValue('write');
          setFocusDraft(true);
        }}
      >
        回到明信片
      </Button>
      <Text size="sm" tone="muted" role="status">
        当前栏目：{currentLabel}
      </Text>
    </div>
  );
}
```

<a id="design"></a>

## 状态与内容面板

- value / onValueChange 管理受控选择，defaultValue 设置非受控初始值；未指定初始值时选择首个可用项，null 可表示不选中任何面板。
- 非受控选中项被移除或禁用后，会回退到可用项并报告变化；受控模式需由调用方在 items 变化时维护有效 value。
- 默认卸载未选中面板，keepMounted 保留 DOM 和草稿等局部状态，隐藏内容不参与键盘顺序。面板中的受控输入仍由调用方维护；保留的字段不会自动禁用，仍可能参与提交和校验。
- 面板切换不会自动移动焦点到内容中的输入；“继续填写”等操作可由调用方显式聚焦。组合示例见 [个人博客归档](../README.md#站内指南)。

<a id="api"></a>

## API

标签和面板通过 items 配置；原生 div 属性作用于根元素。

### TabsProps

| 属性                      | 说明                                                                      | 类型                                              | 默认值       |
| ------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------- | ------------ |
| `appearance`              | 普通直线选中标记，或倾斜墨线与选中纸面；不改变选择和键盘行为。            | `'default' \| 'ink'`                              | `'default'`  |
| `label` **必填**          | 标签列表 tablist 的可访问名称。                                           | `string`                                          | —            |
| `items` **必填**          | 标签及其对应内容面板。value 组内唯一。                                    | `TabItem[]`                                       | —            |
| `value`                   | 受控选中值；null 不选中任何面板。                                         | `string \| null`                                  | —            |
| `defaultValue`            | 非受控初始值，不与 value 同时使用。                                       | `string \| null`                                  | `首个可用项` |
| `onValueChange`           | 选择变化；非受控选中项被禁用或移除时也会报告回退，无可用项时可能为 null。 | `(value: string \| null) => void`                 | —            |
| `activateOnFocus`         | 方向键聚焦时直接切换内容，适合可即时显示的面板；默认需要 Enter / Space。  | `boolean`                                         | `false`      |
| `keepMounted`             | 保留隐藏面板 DOM 和局部状态。                                             | `boolean`                                         | `false`      |
| `classNames`              | 标签列表、各标签按钮、各内容面板的附加类名。                              | `{ list?: string; tab?: string; panel?: string }` | —            |
| `ref / className / style` | 指向根 div，不指向列表或当前面板。                                        | `原生 div 属性`                                   | —            |

### TabItem

| 属性               | 说明                                     | 类型        | 默认值  |
| ------------------ | ---------------------------------------- | ----------- | ------- |
| `value` **必填**   | 组内唯一的稳定值。                       | `string`    | —       |
| `label` **必填**   | 标签按钮内容，不放其他交互控件。         | `ReactNode` | —       |
| `content` **必填** | 对应面板的内容。                         | `ReactNode` | —       |
| `disabled`         | 禁用该项激活，保留可被方向键发现的名称。 | `boolean`   | `false` |

<a id="keyboard"></a>

## 可访问性与键盘

- Tab 进入标签列表后，左右方向键移动焦点并在首尾循环，Home / End 移到首项或末项。默认 Enter / Space 激活，activateOnFocus 开启后随聚焦切换；切换后焦点留在标签上，再按 Tab 进入面板。左右方向键遵循当前 LTR / RTL 方向。
- label 为 tablist 提供可访问名称；组件管理 tab / tabpanel 的角色、ID 和相互关联。标签按钮内不嵌套其他交互控件。
- 禁用标签使用 aria-disabled，允许方向键聚焦以读取名称，但不可激活。焦点所在标签与当前选中面板可能不同。
- 方向优先读取 Tabs 根节点或最近容器上的显式 dir，包括 Shadow DOM 宿主与 slot 所在的容器；未指定时继承上游 DirectionProvider。仅使用 CSS direction 或 dir="auto" 时，请同时配置 Tabs 的显式 dir；没有原生 dir 覆盖时，也可同步 Base UI DirectionProvider 的 direction，保证视觉顺序与键盘一致。

<a id="styling"></a>

## 长标签与面板布局

每个标签至少 44px 高，列表四周为焦点轮廓留出空间。 长标签与标签列表可以换行。即使列表分成多行，左右方向键仍按标签顺序移动；不要把换行布局当作二维网格。 面板中的文章、表单等内容由调用方排版，局部间距可通过 classNames.panel 调整。

<a id="related"></a>

## 相关组件

- [SegmentedControl 分段选择](segmented-control.md)：紧凑的受控单选组，适用于分类、排序等简短选项，保留原生 radio 的表单与键盘行为。
- [Accordion 折叠面板](accordion.md)：用于可展开和收起的内容面板，支持单项或多项展开。
- [Pagination 分页](pagination.md)：用于列表分页，显示首页、末页和当前页附近的页码。
