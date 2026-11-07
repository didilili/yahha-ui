---
'yahha-ui': minor
---

0.1.0 是 Yahha UI 的第一个正式版本。

- 新增 `Progress`，支持确定与未知进度、自定义总量和显示文本，以及可选的纸签端点；新增公共 `Icon` 与 16 个命名功能图标，支持尺寸、语义色和可访问名称。
- 新增 `Switch.loading`、`Textarea.autoSize`、`TextField.trailing`、`Pagination.getPageHref`，以及 `Button` / `IconButton` 的 `destructive` 危险操作外观。分页链接保留修饰键与新标签页等原生操作。
- 增加按需开启的纸感装饰，并提供 `Spinner variant="biscuit"`、`Surface variant="note"` 与 `Tooltip.showArrow`。装饰开关保留必要的状态反馈和控件交互。
- 修正 Dialog 经 Portal 渲染后对触发区域方向的继承与更新、按钮加载图形的占位、输入框槽位的 RTL 对齐和图片 `aspectRatio="auto"` 的失败回退；未指定尺寸的圆形 Skeleton 在窄容器中保持等比缩小。
- 更新组件文档、官网导航与阅读、归档、编辑组合示例；移除独立博客工程及其导出入口。

升级时请检查默认外观：部分原有装饰改为显式开启，可按需设置以下属性。

- `Heading` 默认无墨线，使用 `decoration="underline"` 开启。
- `Badge appearance="stamp"`、`Tabs appearance="ink"`、`Accordion appearance="soft"`、`Pagination appearance="circled"`、`Toast appearance="receipt"` 分别开启印章、墨线、圆扣、圈页码与回执装饰。
- `EmptyState` 默认无内置图案，使用 `motif="paper"` 开启；自定义 `illustration` 仍优先，传入 `null` 或 `false` 可隐藏图案。
- `Checkbox` / `RadioGroup` 使用 `highlightSelected` 开启选中底色，`Select` 使用 `selectedIndicator="stamp"` 开启选中印章；默认保留勾选与选择反馈。
- `Button` / `IconButton` 的 `appearance="soft"` 与 `loadingVariant="biscuit"` 均为可选项，可独立使用；默认仍使用常规外观与墨点加载图形。
