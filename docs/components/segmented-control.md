# SegmentedControl 分段选择

由 fieldset、legend 和原生 radio 组成的单选组。

选项以 150ms 同步过渡底色、边框与选中内阴影，纸托盘保持静止。键盘焦点和原生选择立即更新；禁用、减少动效及强制颜色下直接显示最终状态。

## 何时使用与设计细节

用于少量、相互排斥的同级值，例如文章类型、排序和可见性。选项一直展开，适合需要快速比较和切换的场景。选项较多时使用 [Select](select.md)；带关联内容面板的栏目使用 [Tabs](tabs.md)；页面跳转使用 [Link](link.md)。

浅色纸托盘收纳选项，选中纸片使用轻粉底色、暖墨轮廓和轻内凹。选择前后整体尺寸不变，选中状态与键盘焦点分别可辨。

- **尺度**：每项最小高度为 44px，整组另含 4px 内边距与 2px 边框；单行托盘总高度为 56px。长标签自然换行并允许高度增长，不省略关键文字。
- **选中与焦点**：轮廓和底色表示选中，外层单一 2px 焦点线表示键盘位置；悬停保留当前选择。强制颜色模式使用系统颜色与虚线轮廓保留选中标记。
- **可见说明**：`label` 通过隐藏 legend 提供组名称，不会自动显示标题。建议在旁边显示任务名称、必选要求或禁用原因，并通过 `aria-describedby` 关联说明；此关联同时保留在 fieldset 与每个 radio，直接聚焦选项时也能读取。
- **点击与禁用**：原生 radio 覆盖整片选项。单项或整组禁用时保留文字与当前选中状态，退出键盘操作且不参与表单提交。禁用不是只读；组件没有 `readOnly` 模式。

## Props 与默认值

- `SegmentedControlProps<T>` 的 `T` 为字符串类型。`options`、`value`、`onValueChange`、`label` 均必填。
- 每个 `SegmentedOption<T>` 包含 `value`、`label: ReactNode` 和可选 `disabled`。选项值应唯一。
- `value` / `onValueChange` 为必填受控接口；选中值应对应一个选项，由调用方更新，不提供 `defaultValue` 模式。待选择状态可使用不对应任何选项的值，例如字符串联合中的 `''`；配合 `required` 时，原生校验会要求先选择。
- `label` 是组名称，通过隐藏的 legend 提供给辅助技术。
- `name` 未传入时自动生成；传入 `name` 可让选中值以该字段名提交。`form` 可关联指定表单，`required` 启用原生必选校验。
- `disabled` 默认关闭；设置后禁用整组。单项 `disabled` 只禁用该选项。位于原生 `<fieldset disabled>` 中时同样继承禁用；外层 fieldset 第一个 legend 内的控件遵循浏览器原生例外规则。
- 其余原生 fieldset 属性传给根 fieldset。`ref` 指向 fieldset，`className` 和 `style` 也作用于它。

`classNames.options` 设置选项容器类名，`classNames.option` 设置每个选项 label 的类名。可通过这些入口调整布局。

每个选项的 `label` 应包含可访问名称，支持文字和简单图标组合；不要在 radio 的 label 中嵌套链接、按钮或其他输入控件。

组件保持受控状态；需要重置表单时，在表单 `onReset` 中阻止原生重置，并将 `value` 更新为初始值，使原生 checked 与纸片选中状态一起恢复。筛选、结果提示、错误说明、URL 同步和持久化由调用方实现。

## 示例

```tsx
import { useId, useState } from 'react';
import { Button, SegmentedControl, ThemeProvider } from 'yahha-ui';
import 'yahha-ui/style.css';

type Scope = 'all' | 'one' | 'two';

export function SegmentedControlExample() {
  const descriptionId = useId();
  const [scope, setScope] = useState<Scope>('all');
  const [result, setResult] = useState('');

  return (
    <ThemeProvider theme="chiikawa">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setResult(`提交的 scope：${new FormData(event.currentTarget).get('scope')}`);
        }}
        onReset={(event) => {
          event.preventDefault();
          setScope('all');
          setResult('已恢复为全部范围。');
        }}
      >
        <p id={descriptionId}>群聊范围。二所暂未开放。</p>
        <SegmentedControl
          label="群聊范围"
          aria-describedby={descriptionId}
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
        <Button type="reset" variant="secondary">
          恢复初始值
        </Button>
        <p role="status">{result}</p>
      </form>
    </ThemeProvider>
  );
}
```

## 键盘约定

保留原生 radio 行为：Tab 进入单选组，方向键在可用选项间切换并选择，Space 选中当前项。禁用项不参与切换。组内通常只有一个 Tab 入口，不给每项额外添加 tabIndex；浏览器对未选择组和反向进入的细节可能不同。

传入原生 `dir="rtl"` 可继承从右到左布局；方向键沿浏览器的原生 radio 规则操作，不另外重写键盘事件。窄屏允许选项换到下一行；若任务依赖严格的单行顺序，应缩短标签或改用 Select。

## 接入建议

文档页提供可复制示例，展示本页文章筛选、禁用项与外层 fieldset 禁用、缺选校验及显式重置、350px 窄容器长标签。接入时确认标签有意义、name 在同一表单中不与其他 radio 组冲突、方向键跳过禁用项、提交只包含当前可用选中值，重置后文字结果与选中纸片一致。
