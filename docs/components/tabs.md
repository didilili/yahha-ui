<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Tabs 标签页

在同一页面的相关内容面板之间切换，用于栏目说明、作者资料和内容分区。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Tabs } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

多个内容面板共享同一块空间时使用，组件建立标签与对应面板的语义关联。只改变一个简短筛选值时使用 [SegmentedControl](segmented-control.md)；填写带说明的单选答案时使用 [RadioGroup](radio-group.md)；需要收起选项时使用 [Select](select.md)。跨页面导航使用链接。

<a id="examples"></a>

## 代码演示

本页状态和草稿仅保留在当前示例，不发送或持久保存。

<a id="basic"></a>

### 基本栏目与内容面板

切换栏目，查看对应内容面板。

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
              <p style={{ marginBottom: 0 }}>把今天看见的树影和晚霞记下来，留给以后翻阅。</p>
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

### 受控栏目

切换栏目，查看同步更新的选中值。

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

### 长标签与禁用栏目

对比长标签与暂不可用的归档栏目。

[查看示例文件](../../playground/src/examples/navigation/TabsStates.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/navigation/TabsStates.tsx -->

```tsx
import { Tabs } from 'yahha-ui';

export default function TabsStates() {
  return (
    <Tabs
      label="小站阅读说明"
      items={[
        {
          value: 'about',
          label: '关于这个小站与慢慢更新的日常记录',
          content: <p>这里收集散步、阅读和窗边的小小日常。</p>,
        },
        {
          value: 'contact',
          label: '来信方式',
          content: <p>可以在文章末尾找到作者留下的联系方式。</p>,
        },
        {
          value: 'archive',
          label: '旧站归档（整理中）',
          content: <p>旧文章正在整理。</p>,
          disabled: true,
        },
      ]}
    />
  );
}
```

<a id="controlled"></a>

### 组合：切换栏目时保留草稿

切换栏目保留草稿，或返回明信片继续填写。

[查看示例文件](../../playground/src/examples/navigation/TabsControlled.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/navigation/TabsControlled.tsx -->

```tsx
import { useEffect, useRef, useState } from 'react';
import { Button, Tabs, Text, TextField } from 'yahha-ui';

export default function TabsControlled() {
  const [value, setValue] = useState<string | null>('write');
  const [focusDraft, setFocusDraft] = useState(false);
  const draft = useRef<HTMLInputElement>(null);
  const currentLabel =
    value === 'write' ? '写一张明信片' : value === 'about' ? '明信片说明' : '未选择';

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
        label="联系与阅读说明"
        value={value}
        onValueChange={(nextValue) => {
          setFocusDraft(false);
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
            label: '明信片说明',
            content: (
              <p style={{ margin: 0 }}>写下最近读到的一句话，或者分享今天路上遇到的小事。</p>
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

- [SegmentedControl 分段选择](segmented-control.md)：在少量互斥选项间切换，使用原生 radio 保留表单与键盘行为。
- [Accordion 折叠面板](accordion.md)：展开 FAQ 和补充说明，提供单项或多项展开，使用语义标题和按钮。
- [Pagination 分页](pagination.md)：在文章列表和归档中切换页码，保留首页、末页和当前页附近的页码。
