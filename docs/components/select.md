<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Select 下拉选择器

在有限的文章分类、排序或归档选项中选择一项。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Select } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

从固定列表中选择一项，例如文章分类或排列方式，适合将选项收在下拉列表中。 选项较少且要直接比较说明时使用 [RadioGroup](radio-group.md)；少量简短的互斥筛选值使用 [SegmentedControl](segmented-control.md)；切换对应内容面板使用 [Tabs](tabs.md)。当前 Select 支持单选和键盘前缀匹配，需要输入搜索或多选时应选择适合该交互的组件。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 基础用法

从三个分类中选择一项。

[查看示例文件](../../playground/src/examples/new-forms/SelectBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/SelectBasic.tsx -->

```tsx
import { Select } from 'yahha-ui';

export default function SelectBasic() {
  return (
    <div style={{ maxWidth: 340 }}>
      <Select
        label="文章分类"
        placeholder="选择一个分类"
        options={[
          { value: 'journal', label: '生活手记' },
          { value: 'reading', label: '读书笔记' },
          { value: 'photos', label: '散步相册' },
        ]}
      />
    </div>
  );
}
```

<a id="controlled"></a>

### 受控选择与禁用选项

切换或清空当前选择，禁用选项不可选。

[查看示例文件](../../playground/src/examples/new-forms/SelectControlled.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/SelectControlled.tsx -->

```tsx
import { useState } from 'react';
import { Button, Select, Text } from 'yahha-ui';

export default function SelectControlled() {
  const [sort, setSort] = useState<string | null>('newest');
  const labels: Record<string, string> = {
    newest: '最近发布',
    oldest: '从第一篇开始',
    popular: '最多阅读',
  };
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 340 }}>
      <Select
        label="排列方式"
        value={sort}
        onValueChange={setSort}
        options={[
          { value: 'newest', label: '最近发布' },
          { value: 'oldest', label: '从第一篇开始' },
          { value: 'popular', label: '最多阅读', disabled: true },
        ]}
        hint="“最多阅读”暂未开放。"
      />
      <Text size="sm" tone="muted" role="status">
        当前值：{sort === null ? '未选择' : labels[sort]}。
      </Text>
      <Button variant="secondary" onClick={() => setSort(null)}>
        清空选择
      </Button>
    </div>
  );
}
```

<a id="states"></a>

### 错误、只读与禁用

选择分类清除预设错误，并对比只读与禁用状态。

[查看示例文件](../../playground/src/examples/new-forms/SelectStates.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/SelectStates.tsx -->

```tsx
import { useState } from 'react';
import { Select } from 'yahha-ui';

const options = [
  { value: 'journal', label: '生活手记' },
  { value: 'reading', label: '读书笔记' },
];

export default function SelectStates() {
  const [category, setCategory] = useState<string | null>(null);
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 340 }}>
      <Select
        label="必选分类"
        options={options}
        value={category}
        onValueChange={setCategory}
        required
        error={category === null ? '请先选择文章分类。' : undefined}
        hint="请选择一个文章分类。"
      />
      <Select
        label="只读分类"
        options={options}
        defaultValue="journal"
        readOnly
        hint="可以查看选项，不能修改。"
      />
      <Select
        label="暂不可用"
        options={options}
        defaultValue="reading"
        disabled
        hint="此分类暂不可更改。"
      />
    </div>
  );
}
```

<a id="select-collection"></a>

### 自定义选项内容

选项与选中值均显示名称和辅助说明。

[查看示例文件](../../playground/src/examples/new-forms/SelectCollection.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/SelectCollection.tsx -->

```tsx
import { Select } from 'yahha-ui';

const collections = [
  { value: 'journal', title: 'Journal 日常手记', description: '散步、天气和日常的小事。' },
  { value: 'reading', title: 'Reading 阅读摘记', description: '读过的文章与想留下的句子。' },
  {
    value: 'archive',
    title: 'Archive 已归档',
    description: '已归档，暂不接收新手记。',
    disabled: true,
  },
];
const options = collections.map((collection) => ({
  value: collection.value,
  textValue: collection.title,
  disabled: collection.disabled,
  label: (
    <span>
      <span style={{ display: 'block' }}>{collection.title}</span>
      <span
        style={{
          display: 'block',
          fontSize: 'var(--yahha-font-size-sm, 12px)',
          fontWeight: 400,
          lineHeight: 'var(--yahha-leading-caption, 1.6)',
          color: 'var(--yahha-muted, #7a5c6d)',
        }}
      >
        {collection.description}
      </span>
    </span>
  ),
}));

export default function SelectCollection() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Select label="收藏夹" defaultValue="journal" placeholder="请选择收藏夹" options={options} />
    </div>
  );
}
```

<a id="integration"></a>

## 进阶用法

示例在本地运行，状态只保留在当前示例。

<a id="form"></a>

### 必选表单与重置

读取必选分类或重置为未选择。

[查看示例文件](../../playground/src/examples/new-forms/SelectForm.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/SelectForm.tsx -->

```tsx
import { useRef, useState } from 'react';
import { Button, Select, Text } from 'yahha-ui';

export default function SelectForm() {
  const [result, setResult] = useState('');
  const [invalid, setInvalid] = useState(false);
  const selectRef = useRef<HTMLButtonElement>(null);
  return (
    <form
      style={{ display: 'grid', gap: 16, maxWidth: 340 }}
      onInvalidCapture={(event) => {
        event.preventDefault();
        setInvalid(true);
        setResult('');
        selectRef.current?.focus();
      }}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(`读取结果：category=${new FormData(event.currentTarget).get('category')}。`);
      }}
      onReset={() => {
        setResult('');
        setInvalid(false);
      }}
    >
      <Select
        ref={selectRef}
        label="归档分类"
        name="category"
        required
        placeholder="请选择归档分类"
        options={[
          { value: 'journal', label: '生活手记' },
          { value: 'reading', label: '读书笔记' },
          { value: 'photos', label: '散步相册' },
        ]}
        onValueChange={() => {
          setInvalid(false);
          setResult('');
        }}
        hint="必选，请选择归档分类。"
        error={invalid ? '请选择归档分类后再读取表单。' : undefined}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="submit">读取表单</Button>
        <Button type="reset" variant="secondary">
          重置为未选择
        </Button>
      </div>
      <Text size="sm" tone="muted" role="status">
        {result}
      </Text>
    </form>
  );
}
```

<a id="long-options"></a>

### 长列表与长选项

查看长选项换行与列表滚动。

[查看示例文件](../../playground/src/examples/new-forms/SelectLongOptions.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/SelectLongOptions.tsx -->

```tsx
import { Select } from 'yahha-ui';

export default function SelectLongOptions() {
  return (
    <div style={{ maxWidth: 340 }}>
      <Select
        label="浏览归档分类"
        defaultValue="journal"
        options={[
          { value: 'journal', label: '生活手记' },
          { value: 'reading', label: '读书笔记' },
          { value: 'walking', label: '那些沿着河边散步时记录下来的小小发现与漫长想法' },
          { value: 'photos', label: '散步相册' },
          { value: 'letters', label: '写给朋友的信' },
          { value: 'recipes', label: '厨房里的小记录' },
          { value: 'travel', label: '旅途与见闻' },
          { value: 'favorites', label: '值得再看的收藏' },
        ]}
      />
    </div>
  );
}
```

<a id="select-available-collections"></a>

### 动态选项与空状态

恢复可选项，移除选中项后清空选择；空列表保留恢复入口。

[查看示例文件](../../playground/src/examples/new-forms/SelectAvailableCollections.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/new-forms/SelectAvailableCollections.tsx -->

```tsx
import { useState } from 'react';
import { Button, Select, Text } from 'yahha-ui';

const exampleCollections = [
  { value: 'journal', label: 'Journal 日常手记' },
  { value: 'reading', label: 'Reading 阅读摘记' },
];

export default function SelectAvailableCollections() {
  const [options, setOptions] = useState<typeof exampleCollections>([]);
  const [value, setValue] = useState<string | null>(null);
  const [result, setResult] = useState('');

  return (
    <form
      style={{ display: 'grid', gap: 16, maxWidth: 480 }}
      onSubmit={(event) => event.preventDefault()}
      onReset={() => {
        setValue(null);
        setResult('');
      }}
    >
      <Select
        label="可用收藏夹"
        name="collection"
        options={options}
        value={value}
        disabled={options.length === 0}
        placeholder={options.length === 0 ? '暂无可用收藏夹' : '请选择收藏夹'}
        hint={
          options.length === 0 ? '没有可选项，请先恢复示例选项。' : '移除选中项后，选择值同步清空。'
        }
        onValueChange={(next) => {
          if (next === value) return;
          setValue(next);
          setResult('');
        }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setOptions(exampleCollections);
            setValue(null);
            setResult(`已恢复 ${exampleCollections.length} 个示例选项，请选择一个。`);
          }}
        >
          恢复选项
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={value === null}
          onClick={() => {
            if (value === null) return;
            const removed = options.find((option) => option.value === value);
            const remaining = options.filter((option) => option.value !== value);
            setOptions(remaining);
            setValue(null);
            setResult(
              remaining.length > 0
                ? `已移除「${removed?.label ?? '当前收藏夹'}」，请重新选择。`
                : '已移除最后一个选项，可恢复示例选项后再选择。',
            );
          }}
        >
          移除选中项
        </Button>
      </div>
      <Text size="sm" tone="muted" role="status">
        {result}
      </Text>
    </form>
  );
}
```

<a id="design"></a>

## 状态与表单

- value / onValueChange 管理受控选择，null 表示未选择；defaultValue 设置非受控初始值。选项值须为唯一的非空字符串。
- name 将选中值加入 FormData，form 可关联外部表单。非受控选择随表单重置到初始值；受控选择需由调用方在 onReset 中恢复 value。
- readOnly 允许打开并浏览选项，保留提交值但阻止修改；disabled 阻止交互与提交。单个 disabled 选项保留在列表中但不可选择。
- required 保留原生必选约束。校验规则、error 的设置和选择后的错误清除由调用方维护，必选要求还应提供可见说明。
- 复杂 label 同时用于选项和当前值显示，使用非交互行内内容；textValue 提供稳定的可见标题，让键盘前缀匹配不受说明文字干扰。
- 空数据时，可用 disabled、placeholder 和 hint 说明原因，在字段旁提供创建或恢复入口。 options 动态变化时，由调用方同步维护有效 value 并清除旧结果；移除当前项时可显式置为 null，让用户重新选择。

<a id="api"></a>

## API

### SelectProps

| 属性                              | 说明                                                                                               | 类型                                                                                | 默认值          |
| --------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------- |
| `label` **必填**                  | 可见标签，自动关联触发按钮。                                                                       | `ReactNode`                                                                         | —               |
| `options` **必填**                | 选项列表。value 必须唯一且为非空字符串。                                                           | `readonly SelectOption[]`                                                           | —               |
| `value`                           | 受控当前值，null 表示未选择。                                                                      | `string \| null`                                                                    | —               |
| `defaultValue`                    | 非受控初始值；原生表单重置时恢复该初始值。                                                         | `string \| null`                                                                    | `null`          |
| `onValueChange`                   | 选择值变化时调用，参数为值而非 DOM 事件；受控模式需同步更新 value。                                | `(value: string \| null) => void`                                                   | —               |
| `placeholder`                     | 没有选中值时显示的补充文字，不能替代 label。                                                       | `ReactNode`                                                                         | `请选择`        |
| `hint / error`                    | 通过 aria-describedby 关联；有 error 时设置 aria-invalid。                                         | `ReactNode`                                                                         | —               |
| `name / form`                     | 提交字段名及外部表单 ID；传给内部表单输入。form 也作用于触发按钮。                                 | `string`                                                                            | —               |
| `disabled / required / readOnly`  | 禁用、必选、只读。只读允许浏览选项但阻止修改。                                                     | `boolean`                                                                           | `false`         |
| `autoComplete`                    | 内部表单输入的浏览器自动填充提示。                                                                 | `string`                                                                            | —               |
| `portalContainer`                 | 列表的挂载目标；弹出列表保留当前 ThemeProvider 的主题配置。                                        | `HTMLElement \| ShadowRoot \| RefObject<HTMLElement \| ShadowRoot \| null> \| null` | `document.body` |
| `className`                       | 根字段 div 的附加类名。                                                                            | `string`                                                                            | —               |
| `classNames`                      | 各部分附加类名；每个值为 string。popup / option 位于 Portal。                                      | `{ label?, trigger?, value?, popup?, option?, hint?, error? }`                      | —               |
| `ref / style / id / 其他按钮属性` | 作用于真实触发 button；固定 type=button。不提供 children、type、原生 value/defaultValue/onChange。 | `ComponentPropsWithRef<"button">`                                                   | `id 自动生成`   |

### SelectOption

| 属性             | 说明                                           | 类型        | 默认值         |
| ---------------- | ---------------------------------------------- | ----------- | -------------- |
| `value` **必填** | 唯一非空字符串，作为提交值。                   | `string`    | —              |
| `label` **必填** | 选项及当前值显示的内容；使用非交互行内节点。   | `ReactNode` | —              |
| `disabled`       | 禁用该选项。                                   | `boolean`   | `false`        |
| `textValue`      | 带图标或复杂内容时提供明确的键盘前缀匹配文字。 | `string`    | `读取选项文字` |

<a id="keyboard"></a>

## 可访问性与键盘

- Tab 聚焦触发按钮；Enter、Space 或上下方向键打开列表。方向键移动焦点，Home / End 到达边界，输入选项文字进行前缀匹配；Enter / Space 选择，Escape 关闭并返回触发按钮。
- 列表打开时，移动焦点不会改变选中值；禁用选项可以由方向键聚焦，以便读取名称，但不能选中。 列表关闭且非只读时，输入字符会直接选择匹配项。
- 选项只承载选择值，避免在 label 中嵌套按钮或链接。校验失败时，可通过 ref 聚焦触发按钮，让用户重新选择。

<a id="limits"></a>

## 样式定制

字段宽度通过 className 或外层容器设置；style 调整的是触发按钮。列表挂载在 Portal 中，定制列表和选项时直接使用 classNames.popup / classNames.option， 不依赖字段容器的后代选择器。默认长选项会换行，列表在可用视口内滚动。

设置原生 dir="rtl" 或 dir="ltr" 时，字段与弹出列表保持同一方向；未显式设置时，优先沿用最近原生容器的方向，再沿用上游方向配置。容器方向变化时，已打开的列表同步更新。

定制例的 CSS 随源码一起复制，浅蓝列表背景为局部固定颜色；整体配色使用 ThemeProvider。选中、高亮和禁用反馈保持。

<a id="select-portal-customization"></a>

### Portal 列表的局部定制

通过 classNames 定制列表背景与选项字重。

[查看示例文件](../../playground/src/examples/customization/SelectPortalCustomization.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/customization/SelectPortalCustomization.tsx -->

```tsx
import { Select } from 'yahha-ui';

export default function SelectPortalCustomization() {
  return (
    <>
      <style>{`
        .yahha-example-archive-field {
          width: 100%;
          max-width: 360px;
        }
        .yahha-example-archive-popup {
          background: #f1f8ff;
        }
        .yahha-example-archive-option {
          font-weight: 600;
        }
      `}</style>
      <Select
        label="手记分类"
        defaultValue="reading"
        hint="给这篇手记选一个归档位置。"
        className="yahha-example-archive-field"
        classNames={{
          popup: 'yahha-example-archive-popup',
          option: 'yahha-example-archive-option',
        }}
        options={[
          { value: 'walking', label: '散步手记' },
          { value: 'reading', label: '阅读摘记' },
          { value: 'travel', label: '旅行记录（稍后开放）', disabled: true },
        ]}
      />
    </>
  );
}
```

<a id="related"></a>

## 相关组件

- [RadioGroup 单选组](radio-group.md)：将互斥选项和说明完整展示，适合订阅频率、可见范围等少量选择。
- [SegmentedControl 分段选择](segmented-control.md)：在少量互斥选项间切换，使用原生 radio 保留表单与键盘行为。
- [DropdownMenu 下拉菜单](dropdown-menu.md)：将文章操作或轻量工具收进一组可通过键盘操作的动作菜单。
