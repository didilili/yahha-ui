# 组件文档

Yahha UI 是一套漫画手账风 React 组件库，面向个人博客、个人主页与内容网站。这里收录组件示例、API 与接入说明。

首次了解这套组件库，可先看[项目介绍与实际界面](../README.md)；[完整博客](../examples/blog/README.md)、[静态部署](deployment.md)与[素材分发范围](assets-and-distribution.md)分别说明场景接入、网站输出和素材来源。

组件总览（站内路由 `#/components`）将 29 个 UI 组件按通用、排版、布局、表单、内容展示、导航、浮层、反馈分为八组；ThemeProvider 作为独立的主题配置入口。先看真实样式小样，再进入对应示例与 API；搜索和分类保留在总览 URL，浏览器返回后可以接着查看。页面复用 `component-catalog.ts` 的目录与分类，不维护另一份组件清单。

在仓库根目录完成 `npm ci` 后运行 `npm run dev`，打开终端输出的本地地址。将本文的 `#/...` 追加在该地址后即可访问相应交互页面；Markdown 链接直接指向仓库文件，便于在 GitHub 阅读。站内提供 30 个独立组件文档入口（29 个 UI 组件与 ThemeProvider）、97 个实时 TSX 示例、API 表格、入门、样式与状态场景指南。本文索引覆盖 30 份组件 Markdown，每个文档入口都有对应文件。组合示例包括[文章编辑与管理源码](../playground/src/examples/scenes/ArticleActions.tsx)（`#/guides/states?section=article-actions`）和[个人博客归档源码](../playground/src/examples/scenes/BlogArchive.tsx)（`#/guides/states?section=archive`）。

[设计语言](design-language.md) 说明漫画手账的深墨轮廓，以及按钮、白底字段、纸签、栏目和便笺浮层的结构差异。文档站以天空蓝组织场景，以白纸、暖墨与轻粉承载阅读和操作；三种强调色预设在 ThemeProvider 文档中展示。

设计规范（`#/guides/design-baseline`，见[表单组合源码](../playground/src/examples/design/DesignBaseline.tsx)与[阅读组合源码](../playground/src/examples/design/DesignReading.tsx)）用默认组件展示表单状态、36 / 44 / 52px 按钮尺度与 16px 正文阅读。两份自包含 TSX 不重写组件外观；可操作状态、原始代码与完整接入同时提供。

阅读与收藏（`#/guides/reading`，见[阅读示例源码](../playground/src/examples/ReadingExample.tsx)）展示作者信息、正文、配图与收藏。组合示例（`#/guides/states`，见[指南源码](../playground/src/docs/guides/states.tsx)）提供个人博客归档、文章编辑与管理、加载恢复、空态与 404 的同源 TSX；它们复用已有组件，不是额外的公共组件。

场景总览（`#/guides/recipes`，见[场景索引](../playground/src/docs/recipe-guide.tsx)）按用途链接到阅读、归档、文章编辑和状态示例。首次接入可按根 README 的[最小项目说明](../README.md#导出最小项目)导出独立项目。全站搜索支持组件名、章节、示例说明与 API 属性；窄屏文档可用「本页内容」跳转到对应章节。

网站按「开始使用」「组件」「组合示例」「设计与素材」划分内容。开始使用包含项目介绍、安装与使用定制；组件区包含组件总览、八类公共 UI 组件和主题配置；场景区提供按任务组织的组合示例；设计与素材区说明视觉规则与可选资源。侧栏显示当前区域的目录，完整博客通过「示例网站」在新标签页打开。

组件的公开 Props、实现中的默认值与原生属性作用目标是 API 契约依据。`playground/src/docs/components/` 是组件说明、API 和示例组织的唯一维护位置；`docs/components/` 由 `npm run sync:docs` 生成。官网与仓库文档共用说明、API、锚点和原始示例，`npm run check:docs` 检查同步、有效结构与示例来源。更新属性时仍须核对实际实现，生成器不会推断运行时默认值。

实时示例在 `playground/src/examples/`，站内预览和展示源码使用同一个 TSX 文件。Markdown 保留同一份 TSX 源码和相对导入；真实安装包验收编译 Markdown 和站内示例，并检查 Bundler / NodeNext 类型。`component-catalog.ts` 提供轻量搜索与导航目录，`component-pages.ts` 按组件加载正文和示例，页面元信息只在目录中维护。

组件从 `yahha-ui` 导入，样式从 `yahha-ui/style.css` 导入。在应用入口加载一次样式，并用 `ThemeProvider` 包住需要主题的区域。示例的 `Example.tsx` 保留实际渲染模块的完整源码；完整接入另给出 `App.tsx`，显示样式导入、示例导入和必要的主题包裹。含素材的示例还需下载对应 artwork 文件，并放在 `Example.tsx` 同级的 `artwork/` 目录，保留文件名与相对路径。

首次接入可按[项目 README 的本地安装](../README.md#构建与本地安装)或站内“开始使用”（`#/guides/getting-started`，见[指南源码](../playground/src/docs/guides/getting-started.tsx)）依次完成环境、本地包安装、首个按钮、其他示例复制与结果检查。当前仅使用本地 `.tgz`，尚未提供 npm 公开安装；第一个按钮可直接保存为 `App.tsx`，其他例子按“完整接入”的 `Example.tsx` / `App.tsx` 两文件方式使用。

完整小站在同仓库的[博客示例](../examples/blog/README.md)，从根目录运行 `npm run dev:blog`；自己的应用则安装 `.tgz`，不需要复制整个文档站或博客。

小图标、状态场景和欢迎动效见“图标与插画”（`#/guides/artwork`，[指南源码](../playground/src/docs/artwork-guide.tsx)）。基础包不包含这些可选素材：静态 SVG 可直接作为图片使用；动效 SVG 内置播放，外部按钮无法控制其内部时间线；需要暂停当前帧或重播挥手时，复制该指南的完整欢迎示例与配套静态 SVG。现有动效遵循系统减少动效设置，实际等待结束时应切回静态图。素材来源与派生关系见[SVG 说明](../playground/src/examples/scenes/artwork/little-days/README.md)。

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

安装和构建见[项目 README](../README.md)，目录与验证约定见[协作说明](../CONTRIBUTING.md)。项目保持 npm 单包与 `private: true`，通过本地打包安装，尚未发布 npm。项目自有内容采用 [MIT](../LICENSE)，字体与角色相关的第三方权利见[第三方说明](../THIRD_PARTY_NOTICES.md)，具体来源见[素材与分发范围](assets-and-distribution.md)。当前验证范围为 React 19 浏览器项目，React 与 React DOM 的 peer 范围均为 `^19.3.1`；React 18 与 SSR 尚未验证。

## 验收与问题反馈

文档站浏览器验收先执行 `npm run build:demo`，再执行 `npm run test:docs`；它使用构建后的页面和子目录资源路径。状态场景检查失败时，会额外输出 `State scene diagnostics`，记录当时的加载阶段、状态文字、页面可见性、焦点及被隐藏或设为 inert 的祖先节点，随后保留原始错误。单独复验通过不能代替完整验收通过。

试用反馈可[提交 GitHub Issue](https://github.com/didilili/yahha-ui/issues/new?template=bug_report.yml)，请保留组件包版本、React / React DOM 版本及构建工具。交互问题再附具体示例或页面、操作顺序、预期与实际结果，以及是否开启减少动效；这样可以先判断问题来自安装、资源接入还是组件交互。源码与类型声明见 [Yahha UI 仓库](https://github.com/didilili/yahha-ui)。

## 站内指南

启动文档站后，按以下路由继续查看组合与完整接入；相关源文件链接可直接在仓库阅读。

- `#/guides/getting-started`：安装、样式与第一个组件。
- `#/guides/styling`：使用与定制，包括颜色、布局、插槽、状态管理与键盘约定。
- `#/guides/recipes`：场景总览，按用途选择组合示例。
- `#/guides/reading`：阅读与收藏的完整组合。
- `#/guides/design-baseline`：[设计语言](design-language.md)与默认组件组合。
- `#/guides/states`：[文章编辑](../playground/src/examples/scenes/ArticleActions.tsx)、[博客归档](../playground/src/examples/scenes/BlogArchive.tsx)、等待与恢复。
- `#/guides/artwork`：[素材与分发范围](assets-and-distribution.md)。

旧的 `#/guides/styling?section=language` 跳转到设计规范中的设计语言；原 `reading` 与 `reading-example` 深链接跳转到阅读与收藏页的同名章节。其他已有章节地址保持可用。

维护组件页面请遵循[组件文档规范](documentation.md)，修改后运行 `npm run sync:docs` 与 `npm run check:docs`。
