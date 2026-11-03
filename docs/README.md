# 组件文档

这里收录 Yahha UI 的 29 个 UI 组件、ThemeProvider 及其示例与 API。首次使用请先按[本地安装说明](../README.md#构建与本地安装)完成安装、样式导入和主题设置；没有现成项目可[导出最小项目](../README.md#导出最小项目)。

在组件库根目录完成 `npm ci` 后运行 `npm run dev`，即可在本地文档站操作示例。下面的链接可直接在 GitHub 阅读，站内组件总览位于 `#/components`。

## 通用

- [Button](components/button.md)：触发动作、提交、加载与切换状态。
- [IconButton](components/icon-button.md)：仅有图标的操作与可访问名称。

## 排版

- [Text](components/text.md)：正文大小、行高和语义颜色。
- [Heading](components/heading.md)：原生 h1–h6 标题层级。
- [Link](components/link.md)：原生链接、下划线和焦点表现。

## 布局

- [Surface](components/surface.md)：内容容器。
- [Divider](components/divider.md)：水平、垂直和装饰性分隔线。

## 表单

- [TextField 单行输入](components/text-field.md)：标签、提示、错误与原生单行输入属性。
- [Textarea](components/textarea.md)：多行输入、原生表单与垂直调整高度。
- [Select](components/select.md)：单值下拉选择、选项禁用、表单提交与重置；不含输入搜索和多选。
- [Checkbox](components/checkbox.md)：原生复选、半选与必选约束。
- [RadioGroup](components/radio-group.md)：带说明的受控单选组。
- [Switch](components/switch.md)：即时生效的开关与原生 checkbox 状态。
- [SegmentedControl 分段选择](components/segmented-control.md)：紧凑的受控单选组与表单提交。

## 内容展示

- [Badge](components/badge.md)：行内状态标记。
- [Avatar](components/avatar.md)：作者头像、姓名缩写与失败回退。
- [Image](components/image.md)：图片替代文字、比例容器与失败回退。
- [Accordion](components/accordion.md)：FAQ 和补充内容的展开收起。

## 导航

- [Tabs](components/tabs.md)：标签与对应内容面板。
- [Pagination](components/pagination.md)：按钮模式分页，由调用方更新列表，不生成路由链接。

## 浮层

- [DropdownMenu](components/dropdown-menu.md)：可通过键盘操作的单层动作菜单，不承担值选择。

- [Dialog](components/dialog.md)：受控模态弹窗、焦点和 Portal。
- [Popover 弹出面板](components/popover.md)：带标题的非模态补充面板和短表单。
- [Tooltip](components/tooltip.md)：视觉文字补充；沿用 Base UI 1.9 约定，触发器须有自身可访问名称。

## 反馈

- [Alert 提示条](components/alert.md)：留在页面内的说明、结果与错误提示。
- [Toast](components/toast.md)：由调用方管理显示状态的提示消息。
- [EmptyState](components/empty-state.md)：空内容、说明与操作插槽。
- [Spinner](components/spinner.md)：带可读状态文字的加载指示。
- [Skeleton](components/skeleton.md)：内容形状占位，不独立播报加载状态。

## 主题配置

- [ThemeProvider 主题配置](components/theme.md)：默认配色、三套可选预设、语义颜色覆盖与 Portal 传播。

组件以原生元素为基础；各页说明原生属性、`ref`、`className` 的实际作用位置。除文档列出的入口外，不依赖内部 CSS Modules 类名或 DOM 嵌套层级。

## 使用示例

组件从 `yahha-ui` 导入，样式在应用入口通过 `yahha-ui/style.css` 加载一次，组件区域使用 `ThemeProvider theme="pink"` 包裹。

站内示例的“完整接入”提供 `Example.tsx` 与 `App.tsx`。需要复制组合时，将两份文件放在同一目录；若列出素材清单，将对应文件保存到同级 `artwork/` 目录，保留文件名和相对路径。

## 站内指南

启动文档站后，按以下路由继续查看用法与组合示例。

- `#/guides/getting-started`：安装、样式与第一个组件。
- `#/guides/styling`：使用与定制，包括颜色、布局、插槽、状态管理与键盘约定。
- `#/guides/recipes`：场景总览，按用途选择组合示例。
- `#/guides/reading`：阅读与收藏的完整组合。
- `#/guides/design-baseline`：[设计语言](design-language.md)与默认组件组合。
- `#/guides/states`：[文章编辑](../playground/src/examples/scenes/ArticleActions.tsx)、[博客归档](../playground/src/examples/scenes/BlogArchive.tsx)、等待与恢复。
- `#/guides/artwork`：[素材与分发范围](assets-and-distribution.md)。

[完整博客示例](../examples/blog/README.md)提供首页、归档和文章详情；[部署说明](deployment.md)介绍文档站与博客的静态托管。

## 问题反馈

遇到问题可[提交 GitHub Issue](https://github.com/didilili/yahha-ui/issues/new?template=bug_report.yml)，附上组件版本、React 与构建工具、重现步骤及预期和实际结果。

## 素材与许可

项目自有内容采用 [MIT](../LICENSE)，第三方内容见[第三方说明](../THIRD_PARTY_NOTICES.md)。素材来源见[素材与分发范围](assets-and-distribution.md)。

## 维护文档

组件页面的维护与检查见[组件文档规范](documentation.md)和[协作说明](../CONTRIBUTING.md)。
