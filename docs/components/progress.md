<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Progress 进度条

显示任务完成比例，支持未知进度和可选的纸签端点。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Progress } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

用于有明确总量的任务，例如已读条数或处理完成数量。暂时无法确定比例时传入 null；只有等待说明时也可使用 Spinner。

<a id="examples"></a>

## 代码演示

本页使用受控数值演示，不模拟网络请求。

<a id="progress-basic"></a>

### 基础用法

显示当前完成比例。

[查看示例文件](../../playground/src/examples/content/ProgressBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/ProgressBasic.tsx -->

```tsx
import { Progress } from 'yahha-ui';

export default function ProgressBasic() {
  return <Progress label="阅读进度" value={40} />;
}
```

<a id="progress-states"></a>

### 进度状态

使用默认外观对比进行中、未知进度和已完成状态。

[查看示例文件](../../playground/src/examples/content/ProgressStates.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/ProgressStates.tsx -->

```tsx
import { Progress, Text } from 'yahha-ui';

export default function ProgressStates() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div>
        <Text size="sm" tone="muted">
          进行中
        </Text>
        <Progress label="整理进度" value={40} />
      </div>
      <div>
        <Text size="sm" tone="muted">
          未知进度
        </Text>
        <Progress label="整理进度" value={null} valueText="正在计算" />
      </div>
      <div>
        <Text size="sm" tone="muted">
          已完成
        </Text>
        <Progress label="整理进度" value={100} />
      </div>
    </div>
  );
}
```

<a id="progress-appearance"></a>

### 常规与纸签

切换同一个数值，对比纸签端点与完成勾记。

[查看示例文件](../../playground/src/examples/content/ProgressAppearance.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/ProgressAppearance.tsx -->

```tsx
import { useState } from 'react';
import { Progress, SegmentedControl, Text } from 'yahha-ui';

export default function ProgressAppearance() {
  const [value, setValue] = useState('60');
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <SegmentedControl
        label="示例进度"
        value={value}
        onValueChange={setValue}
        options={['0', '25', '60', '100'].map((amount) => ({
          value: amount,
          label: `${amount}%`,
        }))}
      />
      <div>
        <Text size="sm" tone="muted">
          常规
        </Text>
        <Progress label="阅读进度" value={Number(value)} />
      </div>
      <div>
        <Text size="sm" tone="muted">
          纸签
        </Text>
        <Progress label="阅读进度" value={Number(value)} appearance="bookmark" />
      </div>
    </div>
  );
}
```

<a id="integration"></a>

## 进阶用法

<a id="progress-checklist"></a>

### 由清单计算进度

勾选已读条目，进度根据实际勾选数量更新。

[查看示例文件](../../playground/src/examples/content/ProgressChecklist.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/content/ProgressChecklist.tsx -->

```tsx
import { useState } from 'react';
import { Button, Checkbox, Progress } from 'yahha-ui';

const articles = ['雨天的读书笔记', '沿着河边，慢慢走', '周末散步的小发现'];

export default function ProgressChecklist() {
  const [read, setRead] = useState<string[]>([]);
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Progress
        label="阅读清单"
        value={read.length}
        max={articles.length}
        valueText={`${read.length} / ${articles.length} 篇`}
        appearance="bookmark"
      />
      <fieldset style={{ display: 'grid', gap: 12, margin: 0, padding: 0, border: 0 }}>
        <legend>标记已读文章</legend>
        {articles.map((title) => (
          <Checkbox
            key={title}
            label={title}
            checked={read.includes(title)}
            onChange={(event) => {
              const checked = event.target.checked;
              setRead((current) =>
                checked ? [...current, title] : current.filter((article) => article !== title),
              );
            }}
          />
        ))}
      </fieldset>
      <div>
        <Button variant="secondary" disabled={read.length === 0} onClick={() => setRead([])}>
          重置已读标记
        </Button>
      </div>
    </div>
  );
}
```

<a id="design"></a>

## 纸签与完成状态

默认外观保留普通轨道。bookmark 使用一枚随确定进度移动的纸签，真正达到总量时改为勾记；0% 和 100% 均保持在轨道边界内。未知进度不显示纸签或百分比，减少动效时保留静态等待片段。

<a id="api"></a>

## API

### ProgressProps

| 属性                  | 说明                                                                                                                  | 类型                                                            | 默认值      |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------- |
| `label` **必填**      | 可见任务名称，同时作为默认可访问名称。                                                                                | `string`                                                        | —           |
| `value`               | 当前完成数量；省略、null 或非有限数字表示未知进度。有限数字限制在 0 至 max。                                          | `number \| null`                                                | —           |
| `max`                 | 任务总量，须为有限正数；非法值回退为 100。                                                                            | `number`                                                        | `100`       |
| `appearance`          | 普通轨道或可选的纸签端点，数值、语义和整体尺寸保持一致。                                                              | `'default' \| 'bookmark'`                                       | `'default'` |
| `valueText`           | 自定义可见进度说明和 aria-valuetext，例如“2 / 3 篇”；不改变实际数值。默认显示向下取整的百分比，未知进度显示“计算中”。 | `string`                                                        | —           |
| `className / style`   | 作用于根 div。                                                                                                        | `string / CSSProperties`                                        | —           |
| `ref`                 | 指向根 div。                                                                                                          | `Ref<HTMLDivElement>`                                           | —           |
| `其他原生属性 / 事件` | 作用于根 div；可通过 aria-describedby 关联外部说明。role、aria-valuemin/max/now/text 由组件维护，不接受 children。    | `ComponentPropsWithRef<"div">（排除内容、role 与进度数值属性）` | —           |

<a id="behavior"></a>

## 名称与状态语义

组件为只读的 progressbar，不创建键盘入口或自动播报。确定进度时提供 0、max 和当前值；未知进度省略 aria-valuenow。原生 aria-label 或 aria-labelledby 可提供更合适的名称。

说明和操作放在进度条外；不要把按钮或链接放入标签。任务的开始、暂停、失败、重试和完成反馈由调用方管理，不把计时器当作真实处理百分比。

<a id="related"></a>

## 相关组件

- [Spinner 加载指示](spinner.md)：表示正在进行的加载或等待，提供可读的状态文字。
- [Skeleton 骨架占位](skeleton.md)：为即将出现的内容预留形状，减少布局跳动。
- [Checkbox 复选框](checkbox.md)：用于独立选择、多项选择或确认事项，支持半选状态。
