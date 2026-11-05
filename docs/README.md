# 组件文档

首次使用请参考[本地安装说明](../README.md#构建与本地安装)，完成安装、样式导入和主题设置。没有现成 React 项目时，可[导出最小项目](../README.md#导出最小项目)。

本文档收录 30 个 UI 组件、ThemeProvider 及其用途、示例与 API。

在组件库根目录完成 `npm ci` 后运行 `npm run dev`，即可在本地文档站操作示例。下面的链接可直接在 GitHub 阅读，站内组件总览位于 `#/components`。

## 通用

- [Button](components/button.md)：用于触发操作，支持不同强调程度、禁用与加载状态。
- [IconButton](components/icon-button.md)：仅以图标呈现的操作按钮，必须提供可访问名称。
- [Icon 图标](components/icon.md)：显示自定义 SVG，或按需导入搜索、收藏、关闭等手绘功能图标。

## 排版

- [Text](components/text.md)：正文、摘要和辅助说明的字号、行高与语义颜色。
- [Heading](components/heading.md)：原生 h1–h6 标题层级。
- [Link](components/link.md)：前往页面、文章和外部资源，保留原生链接行为。

## 布局

- [Surface](components/surface.md)：用于组织内容的容器，提供背景、边框和内边距。
- [Divider](components/divider.md)：水平、垂直和装饰性分隔线。

## 表单

- [TextField 单行输入](components/text-field.md)：单行输入、标签、辅助说明与错误反馈。
- [Textarea](components/textarea.md)：输入留言、简介等多行文字，保留原生表单行为，可垂直调整高度。
- [Select](components/select.md)：从固定选项里选一项，支持禁用选项、表单提交与重置，不含输入搜索和多选。
- [Checkbox](components/checkbox.md)：原生复选、半选与必选约束。
- [RadioGroup](components/radio-group.md)：带选项说明的受控单选组。
- [Switch](components/switch.md)：打开或关闭即时生效的设置，使用原生 checkbox 状态。
- [SegmentedControl 分段选择](components/segmented-control.md)：紧凑的受控单选组与表单提交。

## 内容展示

- [Badge](components/badge.md)：分类、标签与状态的静态标记。
- [Avatar](components/avatar.md)：作者头像、姓名缩写与图片失败回退。
- [Image](components/image.md)：展示封面或配图，设置替代文字、预留比例与失败回退。
- [Accordion](components/accordion.md)：FAQ 和补充说明的展开与收起。

## 导航

- [Tabs](components/tabs.md)：在同一区域切换标签对应的内容面板。
- [Pagination](components/pagination.md)：列表分页，支持按钮或真实链接；列表与网址更新由应用管理。

## 浮层

- [DropdownMenu](components/dropdown-menu.md)：可通过键盘操作的单层动作菜单；值选择使用 Select。

- [Dialog](components/dialog.md)：在受控模态弹窗中完成编辑或确认，由组件管理焦点与 Portal。
- [Popover 弹出面板](components/popover.md)：在按钮旁展开补充说明或短表单，允许继续操作页面。
- [Tooltip](components/tooltip.md)：视觉文字补充；沿用 Base UI 1.9 约定，触发器须有自身可访问名称。

## 反馈

- [Alert 提示条](components/alert.md)：页面内持续可见的信息、结果与错误提示。
- [Toast](components/toast.md)：反馈保存等操作结果，显示与关闭由调用方管理。
- [EmptyState](components/empty-state.md)：列表为空或搜索无结果时的说明与操作入口。
- [Spinner](components/spinner.md)：带可读状态文字的加载指示。
- [Skeleton](components/skeleton.md)：按内容形状预留加载空间，不独立播报状态。

## 主题配置

- [ThemeProvider 主题配置](components/theme.md)：默认配色、三套可选预设、语义颜色覆盖与 Portal 传播。

组件以原生元素为基础；各页说明原生属性、`ref`、`className` 的实际作用位置。除文档列出的入口外，不依赖内部 CSS Modules 类名或 DOM 嵌套层级。

## 使用示例

组件从 `yahha-ui` 导入，样式在应用入口通过 `yahha-ui/style.css` 加载一次，组件区域使用 `ThemeProvider theme="pink"` 包裹。

复制示例时，在示例下展开“完整接入”，将 `Example.tsx` 与 `App.tsx` 放在同一目录；若列出素材清单，将对应文件保存到同级 `artwork/` 目录，保留文件名和相对路径。

## 站内指南

启动文档站后，可通过以下路由查阅指南和组合示例。

- `#/guides/getting-started`：安装、样式与第一个组件。
- `#/guides/styling`：使用与定制，包括颜色、布局、插槽、状态管理与键盘约定。
- `#/guides/recipes`：场景总览，按用途选择组合示例。
- `#/guides/reading`：阅读与收藏的完整组合。
- `#/guides/design-baseline`：[设计语言](design-language.md)与默认组件组合。
- `#/guides/states`：[文章编辑](../playground/src/examples/scenes/ArticleActions.tsx)、[博客归档](../playground/src/examples/scenes/BlogArchive.tsx)、等待与恢复。
- `#/guides/artwork`：[素材与分发范围](assets-and-distribution.md)。

[部署说明](deployment.md)介绍文档站的静态托管。

## 问题反馈

遇到问题可[提交 GitHub Issue](https://github.com/didilili/yahha-ui/issues/new?template=bug_report.yml)，附上组件版本、React 与构建工具、重现步骤及预期和实际结果。

## 素材与许可

项目自有内容采用 [MIT](../LICENSE)，第三方内容见[第三方说明](../THIRD_PARTY_NOTICES.md)。素材来源见[素材与分发范围](assets-and-distribution.md)。

## 维护文档

组件页面的维护与检查见[组件文档规范](documentation.md)和[协作说明](../CONTRIBUTING.md)。
