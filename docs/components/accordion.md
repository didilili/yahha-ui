# Accordion 折叠面板

按需展开 FAQ 和补充说明。基于 Base UI Accordion，标题使用语义 heading 内的原生按钮。

内容以轻纸分隔线的开放行组织，展开箭头放在 28px 小圆扣中；默认不为每条内容增加独立卡片投影。圆扣对齐问题的第一行，长问题换行后不会移到整段中央。圆扣随展开状态短暂转向，减少动效时取消过渡。

## 内容与阅读位置

折叠标题应概括展开后回答的问题，面板正文提供完整说明。长标题自然增高，正文保留阅读字阶与段落间距，不靠截断或缩小文字塞进单行。

受控示例的“展开可用说明”只设置可用项目，“全部收起”清空展开值；两种批量操作都保留当前按钮焦点。直接用标题按钮展开或收起时，焦点仍留在该标题。关闭内容不应把用户送到页面起点；若由面板内部的自定义操作关闭自身，调用方需把焦点返回仍存在的控制，而不是已经隐藏的内容。

示例将阅读进度同步、离线缓存等未提供的能力边界留在面板外，避免必须先展开才能发现限制。实际站点的隐私告知、错误处理或其他必须始终可见的信息也应直接展示；“准备中”的禁用条目不能代替可用功能。

## API

| 属性                               | 类型                                  | 默认值 | 说明                                           |
| ---------------------------------- | ------------------------------------- | ------ | ---------------------------------------------- |
| items                              | AccordionItem[]                       | 必填   | 唯一 value、title、content 和可选 disabled     |
| value                              | string[]                              | —      | 受控展开项                                     |
| defaultValue                       | string[]                              | []     | 非受控初始展开项，不与 value 同用              |
| onValueChange                      | (value: string[]) => void             | —      | 展开或关闭后的值数组                           |
| multiple                           | boolean                               | false  | 是否可同时展开多项；单项模式只使用值数组第一项 |
| disabled                           | boolean                               | false  | 禁用整个面板组                                 |
| keepMounted                        | boolean                               | false  | 关闭后保留 DOM，用于保留表单等局部状态         |
| headingLevel                       | 2 \| 3 \| 4 \| 5 \| 6                 | 3      | 根据所在页面的标题层级选择                     |
| classNames                         | { item?, heading?, trigger?, panel? } | —      | 各部位附加类名                                 |
| ref / className / style / 原生属性 | div 属性                              | —      | 均作用于最外层 div                             |

AccordionItem 的 value 必须组内唯一，title / content 为 ReactNode。title 已在 button 中，请勿再放交互元素。受控值应指向有效项目；禁用不会强行关闭已展开内容。此组件不提交表单值。

`defaultValue` 只在首次渲染时使用。非受控状态下从多项切换为单项模式时，只保留当前值数组的第一项；切回多项不会恢复被收起的项目，也不会因模式切换触发 `onValueChange`。受控值仍由调用方维护，单项模式仅展示传入数组的第一项。

## 使用示例

```tsx
import { Accordion } from 'yahha-ui';

export function SiteQuestions() {
  return (
    <Accordion
      defaultValue={['rss']}
      items={[
        { value: 'rss', title: '如何订阅？', content: <p>用 RSS 阅读器添加本站地址。</p> },
        { value: 'comments', title: '可以留言吗？', content: <p>可以在文章下方分享想法。</p> },
        { value: 'offline', title: '离线阅读准备中', content: null, disabled: true },
      ]}
    />
  );
}
```

## 键盘与样式约定

- Tab / Shift+Tab 按页面顺序聚焦可用标题按钮，Enter / Space 展开或收起；方向键不切换标题焦点。
- trigger 和 panel 的 aria-expanded、aria-controls、aria-labelledby、ID 由 Base UI 管理。多项模式用于需要同时阅读比较的说明。
- 默认卸载关闭的内容；keepMounted 可保留当前页面的局部表单状态，隐藏内容不参与键盘顺序。
- 标题操作区最小高度 44px，圆扣与标题第一行对齐，长标题自然增高。正文使用 16px 阅读字号；标题样式仅作用于组件内的 heading。
- 禁用已展开项仍保留展开方向，圆扣改为中性禁用底色；不靠取消箭头方向表达禁用。强制颜色模式下禁用文字与圆扣使用 GrayText。
- 不把必须始终可见的主要内容、错误说明或隐私告知藏进默认收起的面板。
