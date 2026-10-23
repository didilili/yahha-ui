# SegmentedControl

由 fieldset、legend 和原生 radio 组成的单选组。

## Props 与默认值

- `SegmentedControlProps<T>` 的 `T` 为字符串类型。`options`、`value`、`onValueChange`、`label` 均必填。
- 每个 `SegmentedOption<T>` 包含 `value`、`label: ReactNode` 和可选 `disabled`。选项值应唯一。
- `value` / `onValueChange` 为必填受控接口；选中值应对应一个选项，由调用方更新，不提供 `defaultValue` 模式。
- `label` 是组名称，通过隐藏的 legend 提供给辅助技术。
- `name` 未传入时自动生成；传入 `name` 可让选中值以该字段名提交。`form` 可关联指定表单，`required` 启用原生必选校验。
- `disabled` 默认关闭；设置后禁用整组。单项 `disabled` 只禁用该选项。
- 其余原生 fieldset 属性传给根 fieldset。`ref` 指向 fieldset，`className` 和 `style` 也作用于它。

`classNames.options` 设置选项容器类名，`classNames.option` 设置每个选项 label 的类名。可通过这些入口调整布局。

## 示例

```tsx
import { useState } from 'react';
import { Button, SegmentedControl, ThemeProvider } from 'chiikawa-ui';
import 'chiikawa-ui/style.css';

type Scope = 'all' | 'one' | 'two';

export function SegmentedControlExample() {
  const [scope, setScope] = useState<Scope>('all');

  return (
    <ThemeProvider theme="chiikawa">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          console.log(new FormData(event.currentTarget).get('scope'));
        }}
      >
        <SegmentedControl
          label="群聊范围"
          name="scope"
          required
          value={scope}
          onValueChange={setScope}
          options={[
            { value: 'all', label: '全部' },
            { value: 'one', label: '一所' },
            { value: 'two', label: '二所', disabled: true },
          ]}
        />
        <Button type="submit">应用范围</Button>
      </form>
    </ThemeProvider>
  );
}
```

## 键盘约定

保留原生 radio 行为：Tab 进入单选组，方向键在可用选项间切换，Space 选中当前项。禁用项不参与切换。浏览器对单选组的 Tab 入口细节可能不同。
