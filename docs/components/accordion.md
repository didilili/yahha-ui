<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Accordion 折叠面板

用于可展开和收起的内容面板，支持单项或多项展开。

[安装与接入](../../README.md#安装与接入) · [接入示例](../guides/examples.md)

```tsx
import { Accordion } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于按需展开 FAQ 和补充说明。需要对照阅读时开启 multiple；多个栏目轮流占用同一内容区域时使用 [Tabs](tabs.md)。主要内容、错误信息和必要告知应始终可见。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 单项展开与收起

默认展开一项，展开另一项时收起前一项。

[查看示例文件](../../playground/src/examples/navigation/AccordionBasic.tsx)

<!-- example-source: playground/src/examples/navigation/AccordionBasic.tsx -->

```tsx
import { Accordion } from 'yahha-ui';

export default function AccordionBasic() {
  return (
    <Accordion
      defaultValue={['rss']}
      items={[
        {
          value: 'rss',
          title: '如何订阅这个小站？',
          content: (
            <p style={{ margin: 0 }}>把本站的 RSS 地址添加到你的阅读器，有新文章时就能看到更新。</p>
          ),
        },
        {
          value: 'comments',
          title: '我可以给文章留言吗？',
          content: (
            <p style={{ margin: 0 }}>可以在文章下方分享想法。联系表单适合需要单独回复的内容。</p>
          ),
        },
        {
          value: 'frequency',
          title: '多久更新一次？',
          content: <p style={{ margin: 0 }}>没有固定频率。遇到值得记下的小事，就会慢慢写出来。</p>,
        },
      ]}
    />
  );
}
```

<a id="states"></a>

### 多项展开（受控）

同时展开多个条目，由 value 管理展开项；全部收起后保留操作按钮焦点。

[查看示例文件](../../playground/src/examples/navigation/AccordionStates.tsx)

<!-- example-source: playground/src/examples/navigation/AccordionStates.tsx -->

```tsx
import { useState } from 'react';
import { Accordion, Button, Text } from 'yahha-ui';

export default function AccordionStates() {
  const [value, setValue] = useState<string[]>(['preparation', 'meeting']);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Accordion
        multiple
        value={value}
        onValueChange={setValue}
        items={[
          {
            value: 'preparation',
            title: '需要带些什么？',
            content: <p>带一本愿意分享的书，以及记录喜欢段落的小本子。</p>,
          },
          {
            value: 'meeting',
            title: '在哪里集合？',
            content: <p>先到书店门口的小桌签到，再一起去窗边的阅读区。</p>,
          },
        ]}
      />
      <Button variant="secondary" onClick={() => setValue([])}>
        全部收起
      </Button>
      <Text size="sm" tone="muted" role="status">
        已展开 {value.length} 项
      </Text>
    </div>
  );
}
```

<a id="disabled"></a>

### 禁用项目

禁用标题不能聚焦或切换展开状态。

[查看示例文件](../../playground/src/examples/navigation/AccordionDisabled.tsx)

<!-- example-source: playground/src/examples/navigation/AccordionDisabled.tsx -->

```tsx
import { Accordion } from 'yahha-ui';

export default function AccordionDisabled() {
  return (
    <Accordion
      items={[
        {
          value: 'rain',
          title: '雨天安排（确认中）',
          content: <p>确认后会补充当天的集合安排。</p>,
          disabled: true,
        },
      ]}
    />
  );
}
```

<a id="controlled"></a>

### 筛选与受控展开项同步

由调用方同步筛选后的 items 与受控 value，批量展开当前可用项；状态仅保留在本例。

[查看示例文件](../../playground/src/examples/navigation/AccordionControlled.tsx)

<!-- example-source: playground/src/examples/navigation/AccordionControlled.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Accordion, Button, EmptyState, Text, Input } from 'yahha-ui';

const items = [
  {
    value: 'preparation',
    title: '参加周末读书会前，需要带些什么？',
    content: (
      <div style={{ display: 'grid', gap: 12 }}>
        <Text>带一本愿意分享的书，以及记录喜欢段落的小本子。</Text>
        <Text>不需要准备完整讲稿，挑一段想读给大家听的文字就好。</Text>
      </div>
    ),
  },
  {
    value: 'meeting',
    title: '到达后在哪里集合？',
    content: (
      <p style={{ margin: 0 }}>先到书店门口的小桌签到，再一起去窗边的阅读区。请提前十分钟到达。</p>
    ),
  },
  {
    value: 'rain',
    title: '雨天安排（确认中）',
    content: <p>确认后会补充当天的集合安排。</p>,
    disabled: true,
  },
];

function filterItems(query: string) {
  const normalized = query.trim().toLowerCase();
  return items.filter((item) => item.title.toLowerCase().includes(normalized));
}

export default function AccordionControlled() {
  const [value, setValue] = useState<string[]>([]);
  const [editing, setEditing] = useState('');
  const [query, setQuery] = useState('');
  const composing = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const visibleItems = filterItems(query);
  const availableKeys = visibleItems.filter((item) => !item.disabled).map((item) => item.value);

  function applyQuery(nextQuery: string) {
    const nextKeys = filterItems(nextQuery)
      .filter((item) => !item.disabled)
      .map((item) => item.value);
    setQuery(nextQuery);
    setValue((current) => current.filter((key) => nextKeys.includes(key)));
  }

  return (
    <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
      <Input
        ref={inputRef}
        label="搜索说明标题"
        type="text"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        value={editing}
        onCompositionStart={() => {
          composing.current = true;
        }}
        onCompositionEnd={(event) => {
          composing.current = false;
          setEditing(event.currentTarget.value);
          applyQuery(event.currentTarget.value);
        }}
        onChange={(event) => {
          const next = event.currentTarget.value;
          setEditing(next);
          if (!composing.current && !(event.nativeEvent as InputEvent).isComposing) {
            applyQuery(next);
          }
        }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button
          variant="secondary"
          disabled={availableKeys.length === 0}
          onClick={() => setValue(availableKeys)}
        >
          展开可用说明
        </Button>
        <Button variant="ghost" onClick={() => setValue([])}>
          全部收起
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            composing.current = false;
            setEditing('');
            applyQuery('');
            inputRef.current?.focus();
          }}
        >
          清空搜索
        </Button>
      </div>
      {visibleItems.length > 0 ? (
        <Accordion
          multiple
          value={value}
          onValueChange={(next) => setValue(next.filter((key) => availableKeys.includes(key)))}
          items={visibleItems}
        />
      ) : (
        <EmptyState title="没有匹配的说明" description="换个关键词，或清空搜索查看全部说明。" />
      )}
      <Text size="sm" tone="muted" role="status">
        找到 {visibleItems.length} 条说明 · 已展开 {value.length} 项。
      </Text>
    </div>
  );
}
```

<a id="appearance"></a>

### 普通与柔和纸面

普通外观保留箭头与展开反馈；soft 增加圆形箭头底座与更明显的展开纸面。

[查看示例文件](../../playground/src/examples/navigation/AccordionAppearance.tsx)

<!-- example-source: playground/src/examples/navigation/AccordionAppearance.tsx -->

```tsx
import { Accordion, Text } from 'yahha-ui';

const items = [
  {
    value: 'rss',
    title: '如何订阅这个小站？',
    content: '把本站的 RSS 地址添加到阅读器，有新文章时就能看到更新。',
  },
  { value: 'comments', title: '我可以给文章留言吗？', content: '可以在文章下方分享想法。' },
];

export default function AccordionAppearance() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
        gap: 24,
      }}
    >
      {(['default', 'soft'] as const).map((appearance) => (
        <div
          key={appearance}
          style={{ display: 'grid', alignContent: 'start', gap: 12, minWidth: 0 }}
        >
          <Text size="sm" tone="muted">
            {appearance === 'default' ? '普通（默认）' : '柔和纸面'}
          </Text>
          <Accordion appearance={appearance} defaultValue={['rss']} items={items} />
        </div>
      ))}
    </div>
  );
}
```

<a id="design"></a>

## 展开状态与内容保留

- value / onValueChange 管理受控展开项，defaultValue 设置非受控初始展开项；默认可全部收起，一次展开一项，multiple 允许同时展开多项。
- 单项模式只使用值数组的第一项。从多项切回单项时，非受控状态保留第一项；受控状态需由调用方同步维护数组和有效的项目值。
- 默认卸载关闭内容，keepMounted 可保留输入草稿等局部状态，隐藏内容不参与键盘顺序。保留的表单字段不会自动禁用，仍可能参与提交和校验。
- 可禁用单项或整组，已展开内容仍保持可见。外部“全部展开”等操作保留当前操作位置，需要进入具体内容时再显式移动焦点。
- 筛选例从同一份数据计算可见条目与可展开值，并清理被隐藏的展开项。 清空搜索恢复说明列表，不会重新打开已被筛走的项目；批量展开只作用当前可见且可用的说明。

<a id="keyboard"></a>

## 可访问性与键盘

- 标题是 heading 中的原生按钮；headingLevel 应匹配所在页面的标题结构。标题内不嵌套链接或其他按钮。
- Tab / Shift+Tab 按顺序聚焦可用标题按钮，Enter / Space 展开或收起；当前实现不使用方向键切换标题焦点。
- 键盘焦点轮廓收进标题行；组合有内容裁切的大圆角容器时，仍需保留适当内间距。
- 组件管理展开状态与标题、面板之间的语义关联。禁用标题按钮退出 Tab 顺序，展开或收起不会自动把焦点移入正文。

<a id="styling"></a>

## 长标题与正文

标题自动换行，正文不按固定高度截断。为折叠区设置宽度或局部样式时，保留整行标题的点击区域； 链接、复制按钮和表单放在正文中，避免嵌入标题按钮。

<a id="api"></a>

## API

内容通过 items 配置；原生 div 属性作用于根元素。

### AccordionProps

| 属性                      | 说明                                                                   | 类型                                                                    | 默认值      |
| ------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------- |
| `appearance`              | 普通箭头或圆形底座与展开纸面；不改变展开状态、标题层级及整行点击区域。 | `'default' \| 'soft'`                                                   | `'default'` |
| `items` **必填**          | 每项包含唯一 value、title、content 和可选 disabled。                   | `AccordionItem[]`                                                       | —           |
| `value`                   | 受控展开项，不与 defaultValue 同时使用。                               | `string[]`                                                              | —           |
| `defaultValue`            | 非受控初始展开项。                                                     | `string[]`                                                              | `[]`        |
| `onValueChange`           | 展开或关闭后的值数组。                                                 | `(value: string[]) => void`                                             | —           |
| `multiple`                | 允许同时展开多项；单项模式只使用传入值数组第一项。                     | `boolean`                                                               | `false`     |
| `disabled`                | 禁用整个面板组，不强行关闭已展开内容。                                 | `boolean`                                                               | `false`     |
| `keepMounted`             | 关闭时保留 DOM 和表单等局部状态。                                      | `boolean`                                                               | `false`     |
| `headingLevel`            | 标题的语义层级，按所在页面的标题结构选择。                             | `2 \| 3 \| 4 \| 5 \| 6`                                                 | `3`         |
| `classNames`              | 各部位附加类名，与默认类名合并。                                       | `{ item?: string; heading?: string; trigger?: string; panel?: string }` | —           |
| `ref / className / style` | 作用于最外层 div。                                                     | `原生 div 属性`                                                         | —           |

### AccordionItem

| 属性               | 说明                             | 类型        | 默认值  |
| ------------------ | -------------------------------- | ----------- | ------- |
| `value` **必填**   | 组内唯一的稳定值。               | `string`    | —       |
| `title` **必填**   | 标题按钮内容，不放其他交互元素。 | `ReactNode` | —       |
| `content` **必填** | 展开后的内容。                   | `ReactNode` | —       |
| `disabled`         | 禁用本项操作，保留可见标题。     | `boolean`   | `false` |

<a id="related"></a>

## 相关组件

- [Tabs 标签页](tabs.md)：用于在同一区域切换相关内容面板，建立标签与面板的语义关联。
- [Heading 标题](heading.md)：通过原生 h1–h6 元素定义页面、文章与章节的标题层级。
