<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Accordion 折叠面板

展开 FAQ 和补充说明，提供单项或多项展开，使用语义标题和按钮。

首次接入请完成[样式导入与主题设置](../../README.md#构建与本地安装)。本文与官网使用相同的说明、API 和原始示例源码。

```tsx
import { Accordion } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

按需展开帮助、FAQ 和次要说明，在一个页面保留多个条目的入口。需要对照阅读时开启 multiple；多个栏目轮流占用同一内容区域时使用 [Tabs](tabs.md)。主要内容、错误信息和必要告知应始终可见。

<a id="examples"></a>

## 代码演示

<a id="basic"></a>

### 常见问题

defaultValue 设置初始展开项，默认一次只展开一个；再次点击可关闭。

[查看示例文件](../../playground/src/examples/navigation/AccordionBasic.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

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

<a id="controlled"></a>

### 受控的多项展开

展开两项读书会说明以便对照查看，也可逐项收起或全部收起。尚未确认的雨天安排保持禁用。

[查看示例文件](../../playground/src/examples/navigation/AccordionControlled.tsx)。示例保留原始相对导入路径；完整接入与素材下载见官网对应示例。

<!-- example-source: playground/src/examples/navigation/AccordionControlled.tsx -->

```tsx
import { useState } from 'react';
import { Accordion, Button, Text } from 'yahha-ui';

export default function AccordionControlled() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button variant="secondary" onClick={() => setValue(['preparation', 'meeting'])}>
          展开可用说明
        </Button>
        <Button variant="ghost" onClick={() => setValue([])}>
          全部收起
        </Button>
      </div>
      <Accordion
        multiple
        value={value}
        onValueChange={setValue}
        items={[
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
              <p style={{ margin: 0 }}>
                先到书店门口的小桌签到，再一起去窗边的阅读区。请提前十分钟到达。
              </p>
            ),
          },
          {
            value: 'rain',
            title: '雨天安排（确认中）',
            content: <p>确认后会补充当天的集合安排。</p>,
            disabled: true,
          },
        ]}
      />
      <Text size="sm" tone="muted" role="status">
        已展开 {value.length} 项说明。
      </Text>
    </div>
  );
}
```

<a id="design"></a>

## 展开状态与内容保留

- value / onValueChange 管理受控展开项，defaultValue 设置非受控初始展开项；默认可全部收起，一次展开一项，multiple 允许同时展开多项。
- 单项模式只使用值数组的第一项。从多项切回单项时，非受控状态保留第一项；受控状态需由调用方同步维护数组和有效的项目值。
- 默认卸载关闭内容，keepMounted 可保留输入草稿等局部状态，隐藏内容不参与键盘顺序。展开状态与内容中的表单值由各自的状态逻辑管理。
- 可禁用单项或整组，已展开内容仍保持可见。外部“全部展开”等操作保留当前操作位置，需要进入具体内容时再显式移动焦点。

<a id="api"></a>

## API

AccordionProps 支持原生 div 属性，children 和 defaultValue 除外。

### AccordionProps

| 参数                      | 说明                                                 | 类型                                                                    | 默认值  |
| ------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------- | ------- |
| `items` **必填**          | 每项包含唯一 value、title、content 和可选 disabled。 | `AccordionItem[]`                                                       | —       |
| `value`                   | 受控展开项，不与 defaultValue 同时使用。             | `string[]`                                                              | —       |
| `defaultValue`            | 非受控初始展开项。                                   | `string[]`                                                              | `[]`    |
| `onValueChange`           | 展开或关闭后的值数组。                               | `(value: string[]) => void`                                             | —       |
| `multiple`                | 允许同时展开多项；单项模式只使用传入值数组第一项。   | `boolean`                                                               | `false` |
| `disabled`                | 禁用整个面板组，不强行关闭已展开内容。               | `boolean`                                                               | `false` |
| `keepMounted`             | 关闭时保留 DOM 和表单等局部状态。                    | `boolean`                                                               | `false` |
| `headingLevel`            | 标题的语义层级，按所在页面的标题结构选择。           | `2 \| 3 \| 4 \| 5 \| 6`                                                 | `3`     |
| `classNames`              | 各部位附加类名，与默认类名合并。                     | `{ item?: string; heading?: string; trigger?: string; panel?: string }` | —       |
| `ref / className / style` | 作用于最外层 div。                                   | `原生 div 属性`                                                         | —       |

### AccordionItem

| 参数               | 说明                             | 类型        | 默认值  |
| ------------------ | -------------------------------- | ----------- | ------- |
| `value` **必填**   | 组内唯一的稳定值。               | `string`    | —       |
| `title` **必填**   | 标题按钮内容，不放其他交互元素。 | `ReactNode` | —       |
| `content` **必填** | 展开后的内容。                   | `ReactNode` | —       |
| `disabled`         | 禁用本项操作，保留可见标题。     | `boolean`   | `false` |

<a id="keyboard"></a>

## 可访问性与键盘

- 标题是 heading 中的原生按钮；headingLevel 应匹配所在页面的标题结构。标题内不嵌套链接或其他按钮。
- Tab / Shift+Tab 按顺序聚焦可用标题按钮，Enter / Space 展开或收起；当前实现不使用方向键切换标题焦点。
- 组件管理展开状态与标题、面板之间的语义关联。禁用标题按钮退出 Tab 顺序，展开或收起不会自动把焦点移入正文。

<a id="styling"></a>

## 长标题与正文

可用的展开标题使用浅粉纸面与白色内缘，28px 圆扣由浅蓝变为粉色；正文上方留出 8px，保留与标题一致的 4px 阅读起点。 标题自动换行，正文不按固定高度截断。为折叠区设置宽度或局部样式时，保留整行标题的点击区域； 链接、复制按钮和表单放在正文中，避免嵌入标题按钮。

<a id="related"></a>

## 相关组件

- [Tabs 标签页](tabs.md)：在同一页面的相关内容面板之间切换，用于栏目说明、作者资料和内容分区。
- [Heading 标题](heading.md)：通过真实 h1–h6 元素建立清楚的文档层级。
