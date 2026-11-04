<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# SegmentedControl 分段选择

在少量互斥选项间切换，使用原生 radio 保留表单与键盘行为。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { SegmentedControl } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用一组紧凑的简短选项切换分类、排序等互斥值。选项需要补充说明或纵向比较时使用 [RadioGroup](radio-group.md)；需要收起选项时使用 [Select](select.md)；切换同一区域中对应的内容面板使用 [Tabs](tabs.md)。页面导航使用链接。

<a id="examples"></a>

## 代码演示

本页使用本地状态和文章，不请求接口或保存设置。

<a id="basic"></a>

### 基础用法

切换文章类型。

[查看示例文件](../../playground/src/examples/forms/SegmentedBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/forms/SegmentedBasic.tsx -->

```tsx
import { useState } from 'react';
import { SegmentedControl, Text } from 'yahha-ui';

type View = 'all' | 'journal' | 'notes';

export default function SegmentedBasic() {
  const [view, setView] = useState<View>('all');

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 16 }}>
      <Text size="sm">文章类型</Text>
      <SegmentedControl
        label="文章类型"
        value={view}
        onValueChange={setView}
        options={[
          { value: 'all', label: '全部' },
          { value: 'journal', label: '日记' },
          { value: 'notes', label: '随手记' },
        ]}
      />
    </div>
  );
}
```

<a id="filtering"></a>

### 筛选本地文章

按类型筛选文章，查看列表与数量变化。

[查看示例文件](../../playground/src/examples/forms/SegmentedFiltering.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/forms/SegmentedFiltering.tsx -->

```tsx
import { useId, useState } from 'react';
import { SegmentedControl, Text } from 'yahha-ui';

type View = 'all' | 'journal' | 'notes';

export default function SegmentedFiltering() {
  const descriptionId = useId();
  const [view, setView] = useState<View>('all');
  const labels = { all: '全部内容', journal: '日记', notes: '随手记' };
  const articles = [
    { title: '周末散步，遇到一朵小花', type: 'journal' },
    { title: '把今天喜欢的句子记下来', type: 'notes' },
    { title: '给自己做一顿简单的晚饭', type: 'journal' },
  ];
  const visibleArticles = articles.filter((article) => view === 'all' || article.type === view);

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 16 }}>
      <Text id={descriptionId} size="sm" tone="muted">
        按文章类型筛选下方文章。
      </Text>
      <SegmentedControl
        label="筛选文章类型"
        aria-describedby={descriptionId}
        value={view}
        onValueChange={setView}
        options={[
          { value: 'all', label: '全部' },
          { value: 'journal', label: '日记' },
          { value: 'notes', label: '随手记' },
        ]}
      />
      <Text role="status" size="sm" tone="muted">
        {labels[view]} · {visibleArticles.length} 篇文章
      </Text>
      <ul aria-label="筛选后的文章" style={{ margin: 0, paddingInlineStart: 24 }}>
        {visibleArticles.map((article) => (
          <li key={article.title}>{article.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

<a id="disabled"></a>

### 禁用选项与整组禁用

对比单项与整组禁用，并切换整组可用状态。

[查看示例文件](../../playground/src/examples/forms/SegmentedDisabled.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/forms/SegmentedDisabled.tsx -->

```tsx
import { useId, useState } from 'react';
import { Button, SegmentedControl, Text } from 'yahha-ui';

type Visibility = 'public' | 'private' | 'unlisted';

export default function SegmentedDisabled() {
  const descriptionId = useId();
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [lockedVisibility, setLockedVisibility] = useState<Visibility>('public');
  const [locked, setLocked] = useState(true);

  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 24 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <Text size="sm">暂未开放“仅持链接者可见”。</Text>
        <SegmentedControl
          label="文章可见性"
          value={visibility}
          onValueChange={setVisibility}
          options={[
            { value: 'public', label: '公开' },
            { value: 'private', label: '仅自己' },
            { value: 'unlisted', label: '仅持链接者', disabled: true },
          ]}
        />
      </div>
      <div style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <Text id={descriptionId} size="sm">
          {locked ? '整组已禁用，保留当前选择。' : '整组已恢复，可以更改选择。'}
        </Text>
        <fieldset
          aria-label="文章设置"
          disabled={locked}
          style={{ margin: 0, padding: 0, border: 0, minWidth: 0 }}
        >
          <SegmentedControl
            label="整组文章可见性"
            aria-describedby={descriptionId}
            value={lockedVisibility}
            onValueChange={setLockedVisibility}
            options={[
              { value: 'public', label: '公开' },
              { value: 'private', label: '仅自己' },
            ]}
          />
        </fieldset>
        <Button variant="secondary" onClick={() => setLocked((current) => !current)}>
          {locked ? '解除整组禁用' : '禁用整组'}
        </Button>
      </div>
    </div>
  );
}
```

<a id="form"></a>

### 原生表单与显式重置

选择必选排序值后读取，或恢复为未选择；不重排文章。

[查看示例文件](../../playground/src/examples/forms/SegmentedForm.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/forms/SegmentedForm.tsx -->

```tsx
import { useId, useState } from 'react';
import { Button, SegmentedControl, Text } from 'yahha-ui';

type Sort = '' | 'latest' | 'oldest' | 'popular';

export default function SegmentedForm() {
  const descriptionId = useId();
  const errorId = useId();
  const [sort, setSort] = useState<Sort>('');
  const [invalid, setInvalid] = useState(false);
  const [result, setResult] = useState('');

  return (
    <form
      style={{ display: 'grid', justifyItems: 'start', gap: 16 }}
      onInvalidCapture={() => {
        setInvalid(true);
        setResult('');
      }}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setResult(`读取结果：sort=${data.get('sort')}。`);
      }}
      onReset={(event) => {
        event.preventDefault();
        setSort('');
        setInvalid(false);
        setResult('已恢复为未选择，请重新选择排序方式。');
      }}
    >
      <Text id={descriptionId} size="sm">
        请选择一种文章排序方式（必选）。
      </Text>
      <SegmentedControl
        label="文章排序"
        aria-describedby={[descriptionId, invalid ? errorId : ''].filter(Boolean).join(' ')}
        aria-invalid={invalid || undefined}
        name="sort"
        required
        value={sort}
        onValueChange={(value) => {
          setSort(value);
          setInvalid(false);
          setResult('');
        }}
        options={[
          { value: 'latest', label: '最新' },
          { value: 'oldest', label: '最早' },
          { value: 'popular', label: '最多阅读' },
        ]}
      />
      {invalid && (
        <Text id={errorId} role="alert" size="sm">
          请选择一种文章排序方式，再读取排序值。
        </Text>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="submit">读取排序值</Button>
        <Button type="reset" variant="secondary">
          恢复初始值
        </Button>
      </div>
      <Text role="status" size="sm" tone="muted">
        {result}
      </Text>
    </form>
  );
}
```

<a id="long-labels"></a>

### 长标签与窄容器

在窄栏中切换专题，查看选项如何换行排列。

[查看示例文件](../../playground/src/examples/forms/SegmentedLongLabels.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/forms/SegmentedLongLabels.tsx -->

```tsx
import { useId, useState } from 'react';
import { SegmentedControl, Text } from 'yahha-ui';

type Topic = 'life' | 'learning' | 'travel';

export default function SegmentedLongLabels() {
  const descriptionId = useId();
  const [topic, setTopic] = useState<Topic>('life');
  const labels = {
    life: '日常生活里的小小发现',
    learning: '慢慢积累的学习笔记',
    travel: '出门走走与旅行记录',
  };

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 350 }}>
      <Text id={descriptionId} size="sm" tone="muted">
        选择一个想浏览的文章专题。
      </Text>
      <SegmentedControl
        label="文章专题"
        aria-describedby={descriptionId}
        value={topic}
        onValueChange={setTopic}
        options={[
          { value: 'life', label: labels.life },
          { value: 'learning', label: labels.learning },
          { value: 'travel', label: labels.travel },
        ]}
      />
    </div>
  );
}
```

<a id="design"></a>

## 状态与表单

- 这是受控单选组：value 指定当前值，onValueChange 返回选项值，由调用方更新。选项值须保持唯一；用空字符串表示待选择时，不再将它用作有效选项值。
- 显式 name 提供稳定的 FormData 字段名；省略时仍有自动生成的唯一名称。同一表单内的独立组使用不同 name，form 可关联外部表单。
- required 使用原生必选约束。表单重置需在 onReset 中同步恢复 React 状态。
- disabled 禁用整组，单项 disabled 只禁用该项，也支持父 fieldset 禁用。禁用项不参与操作与提交，已选项被禁用后仍保留选中标记。
- 选择变化后的筛选、正文更新与 URL 同步由调用方处理；需要可见的校验错误时，在组旁提供说明，并用 aria-describedby 关联。

<a id="api"></a>

## API

`SegmentedControlProps<T>` 的 `T` 为字符串类型，组件只支持受控选择。未单列的原生 fieldset 属性作用于整组，不支持 children、defaultValue 或 defaultChecked。选项由 options 提供，补充内容放在组件外。

### SegmentedControlProps<T extends string>

| 属性                     | 说明                                                                                                    | 类型                                    | 默认值             |
| ------------------------ | ------------------------------------------------------------------------------------------------------- | --------------------------------------- | ------------------ |
| `options` **必填**       | 所有选项。每项 value 必须唯一。                                                                         | `readonly SegmentedOption<T>[]`         | —                  |
| `value` **必填**         | 当前受控值。空字符串可表示待选择；有值时应对应 options 中的一项。                                       | `T`                                     | —                  |
| `onValueChange` **必填** | 选择变化时传入选项值。调用方需要更新 value；参数不是 DOM 事件。                                         | `(value: T) => void`                    | —                  |
| `label` **必填**         | 单选组的可访问名称，通过隐藏的 legend 提供。需要可见标题时在外部添加。                                  | `string`                                | —                  |
| `name`                   | 组内 radio 的共同名称。显式设置可使用稳定字段名读取 FormData。                                          | `string`                                | `自动生成唯一名称` |
| `form`                   | 通过表单 ID 关联 fieldset 及内部所有 radio。                                                            | `string`                                | —                  |
| `required`               | 将原生必选约束传给 radio。有效的受控选中值通常已经满足约束。                                            | `boolean`                               | `false`            |
| `disabled`               | 禁用整个 fieldset 及全部 radio。禁用字段不参与提交。                                                    | `boolean`                               | `false（原生）`    |
| `className`              | 根 fieldset 的附加类名。                                                                                | `string`                                | —                  |
| `classNames`             | 选项容器与每个选项 label 的附加类名。                                                                   | `{ options?: string; option?: string }` | —                  |
| `style`                  | 作用于根 fieldset。                                                                                     | `CSSProperties`                         | —                  |
| `ref`                    | 指向根 fieldset，不指向某个 radio。                                                                     | `Ref<HTMLFieldSetElement>`              | —                  |
| `其他原生属性 / 事件`    | id、aria-\*、onFocus、onBlur 等作用于 fieldset；onChange 可接收冒泡事件，状态更新仍使用 onValueChange。 | `ComponentPropsWithRef<"fieldset">`     | —                  |

### SegmentedOption<T extends string>

| 属性             | 说明                                                                       | 类型        | 默认值  |
| ---------------- | -------------------------------------------------------------------------- | ----------- | ------- |
| `value` **必填** | 唯一选项值，作为 radio 的 value 和变化回调参数。                           | `T`         | —       |
| `label` **必填** | 选项内容，支持文字或简单图标组合；应包含清楚的可访问名称，不嵌套交互控件。 | `ReactNode` | —       |
| `disabled`       | 仅禁用此选项；组件级 disabled 优先。                                       | `boolean`   | `false` |

### classNames

| 属性      | 说明                                   | 类型     | 默认值 |
| --------- | -------------------------------------- | -------- | ------ |
| `options` | 选项的共同容器，可用于调整组内布局。   | `string` | —      |
| `option`  | 每个选项的 label，可用于调整单项布局。 | `string` | —      |

<a id="keyboard"></a>

## 可访问性与键盘

- Tab 进入原生单选组，方向键在可用项间移动并选择，Space 选择聚焦项；禁用项不参与选择。组内 Tab 入口和方向键边界行为依浏览器而异。
- 选项应有可读名称，标签内不嵌套链接或按钮。外部提示或错误通过 aria-describedby 关联后，聚焦各选项时也能读取。

<a id="styling"></a>

## 样式定制

需要等宽选项时，可为 classNames.option 对应的类设置 `flex: 1 1 0`，再通过 classNames.options 设置选项容器宽度。默认允许选项和长标签换行，避免用固定高度截断文字。

<a id="related"></a>

## 相关组件

- [RadioGroup 单选组](radio-group.md)：将互斥选项和说明完整展示，适合订阅频率、可见范围等少量选择。
- [Select 下拉选择器](select.md)：在有限的文章分类、排序或归档选项中选择一项。
- [Tabs 标签页](tabs.md)：在同一页面的相关内容面板之间切换，用于栏目说明、作者资料和内容分区。
