# Yahha UI 开发约定

适用于本仓库全部文件。开始工作前阅读 README 与相关组件文档。

## 范围与 Git

- 当前优先完善已有组件、文档与目录结构；未经明确要求，不新增 UI 组件。
- 沿用单包仓库、npm 与 package-lock.json；不自行迁移包管理器或引入 monorepo。
- 不执行 git add、git mv、git rm、暂存、提交、推送或发布，除非用户明确授权相应操作。
- 保留用户已有暂存区与无关改动。移动文件使用文件系统操作，避免改写 Git index。
- 对清楚的局部修改直接实施，不增加多轮确认、独立设计文档或工作树等流程。

## 目录与依赖

- src/index.ts 是公共入口，仅导出稳定的组件与公开类型。
- src/components/<组件名>/ 按组件族放置实现、Props、CSS Modules、局部 index.ts 与测试。
- 组件文件使用 PascalCase，目录和 CSS 文件使用 kebab-case；小型 Props 与实现同文件。
- src/theme/ 管理主题 Provider、内部 Context、tokens 与主题样式。
- src/internal/ 只放库内部共用实现，不作为公共 API 导出。
- playground/ 只放展示页、演示状态与素材；src/ 不得反向依赖它。
- tests/package-consumer/ 验证实际安装包；scripts/ 放工程脚本；docs/ 放使用文档。
- 内部模块直接导入具体文件，不从 src/index.ts 回引；库内相对 JS 模块路径使用 .js 扩展名。
- React / ReactDOM 保持 peer dependencies；展示专用依赖与素材不得进入库产物。

## 组件与样式

- 保持既有公开 API，默认外观、尺度、字阶、图标、轮廓、状态与动效遵循[设计语言](docs/design-language.md)。新增配置应有具体使用场景，不在示例中另设一套默认规范。
- 站点品牌、基础组件与角色素材分层维护。`playground/src/site/` 组织天空、草地、群像和章节图案；组件安装包不带场景图片、字体或站点布局。三位角色采用用户于 2026-11-04 确认的造型：小八保留圆颊 r1，吉伊与乌萨奇采用同日独立评审确认的脸颊、头身与表情细化稿；原扁平 v4 仍不采用。三位角色仅维护 `playground/src/examples/scenes/artwork/friends-preview/source/characters.svg` 这一完整造型源，评审候选不作为第二份维护源，后续变更角色造型须先单独评审确认。
- `src/theme/theme.module.css` 是共享默认视觉 token 的唯一值源；使用正确语义族，fallback 与默认值一致。默认控件 44px，Button / IconButton 已有 36 / 44 / 52px 三档，不增加一次性的 45 / 46px 档位。局部图形的精确例外需记录用途，不为每个数字新建全局 token 或整文件豁免。
- 保留各组件的语义分工与默认造型；不引入整行信签边框、开关勾号或虚线分段托盘，不将内容、字段和动作全部改为同等重量的深墨卡片。具体绘制与尺寸规则统一维护在设计语言中。
- 明确受控状态、ref、原生属性和 className 的作用目标，并同步 Props 注释与文档。视觉改动不得改变尺寸、点击区域、键盘、焦点、选中语义或业务状态；禁用、减少动效和强制颜色均保留可用的静态结果。
- 组件样式留在各自 CSS Modules，共享主题规则留在 theme/，避免复制整份样式。展示页只通过公开属性、样式入口与 tokens 定制，不依赖内部标签或嵌套层级。
- 文档站的公共交互优先从 `yahha-ui` 公开入口复用已有组件，包括搜索、清空、菜单及代码操作。站点 CSS 负责布局和公开 `className` / `classNames` 定制，不通过内部 DOM 重写基础交互或缩小点击区域。
- 组件总览位于 `#/components`，入口与分组复用 `component-catalog.ts` 的 `componentCatalog` / `componentGroups`。首页、顶栏、侧栏和 404 的目录入口统一到总览，具体组件引用可直达文档；总览按需加载，不导入文档组完整示例与源码。
- 总览小样只使用公开组件及属性，不改内部样式、尺寸或交互；预览区使用 inert 与 aria-hidden，独立的卡片标题承载链接，避免嵌套交互。q/group 使用 replaceState 记录筛选，输入不触发路由聚焦或增加历史；返回恢复筛选，清空保留可用焦点。小样不计为新增公共组件或完整使用示例。
- 文档完整接入提供原样 `Example.tsx` 和独立 CSS / ThemeProvider 入口 `App.tsx`，预览与展示源码同源，不另写一份近似示例。含素材时同时提供对应 artwork 文件，保留相对路径。
- 场景素材只放在 `playground/src/examples/scenes/artwork/`，不进入 `src/` 或默认组件库产物。加载图形共用内部 LoadingMark：Button / IconButton 默认使用三墨点，通过 loadingVariant="biscuit" 显式选择小花饼；小花饼图形维护在 `src/internal/BiscuitLoadingGlyph.tsx`，Spinner / Switch 默认使用三墨点；环境动效不得拖慢操作反馈，减少动效时使用静帧。
- 小日常道具原稿仅维护在 `playground/src/examples/scenes/artwork/little-days/`；`npm run sync:artwork` 派生静态 / 动效文件，`npm run check:artwork` 防止分叉。下载资源使用 `?no-inline` 保留独立 SVG，真实等待结束即停止，不制造加载延迟。
- 欢迎场景由 `scripts/build-friends-welcome.mjs` 从当前已确认的人物源派生，仅分离前爪动作，脸、身体比例和原模型保持。`FriendsWelcome.tsx` 使用原生 SVG 与真实暂停 / 继续。离屏、后台和系统减少动效时停止；重播只重建前爪，不重置环境时间线。
- `playground/src/examples/design/` 展示默认实现，禁止通过 style、className、classNames 或内嵌 CSS 改写控件外观与几何。使用方的公开定制能力保留；专门的定制示例应说明范围，不能混进默认基准。
- 保留导航链接、表格、pre / code 等合理的原生语义，不为组件复用把页面导航改为 Tabs 或把链接改为按钮。Portal 使用统一主题上下文，不复制带布局作用的页面 className。
- 字体与素材许可统一见[第三方内容说明](THIRD_PARTY_NOTICES.md)；不虚构许可或未经验证的 React / SSR 兼容承诺。

## 验证

- 先复现问题或编写关键行为测试，再实施行为修改；不写只检查文件名或复述实现的测试。局部、低风险修改使用最小有效验证，不增加无关测试。
- 使用针对性测试及必要的 lint、格式与类型检查，避免无关的大范围重跑。涉及公共 API、构建或依赖边界时，运行 npm run check，验证真实安装包。
- 修改布局或主题传播时补必要的浏览器验证。设计修改必须通过 `npm run check:design`；尺寸以安装包浏览器 computed 值为准，覆盖相关普通 / 错误 / 只读 / 禁用 / loading 状态、全部预设、窄屏与粗指针，不只靠 min-height 或截图声称对齐。
- 设计语言在无插画和真实阅读组合中验收，检查控件 / 内容 / 浮层分工、表单层次及单一键盘焦点。视觉细化提供同内容、同视口、同状态前后图，并在无文档站 CSS 的真实安装包使用方复核；规范声明、实际绘制变化和既有行为复核分别报告。
- 新增组件后复核文档站可复用位置，并验证官网真实场景中的键盘、焦点、主题与窄屏表现，组件数量不能替代使用验收。
- 浮层组合复核使用现有 ArticleActions，不新增功能、场景或角色。覆盖 Tooltip 箭头与接缝、长标题和 44px 关闭目标、Dialog 页脚与短屏滚动、退场失效和焦点返回；未运行的长内容、边缘与焦点检查不能写成已通过。
- Dialog、Popover、DropdownMenu 通过内部 `renderInteractivePopup` 保留退场视觉并阻止已关闭节点接收按键、点击和表单提交。以 Base UI 实际 `state.open` 判断，不把受控关闭请求当成已关闭；保留原生 inert、ref、样式、children 与打开期间的捕获处理器，父级拒绝关闭时仍能正常操作。
- ArticleActions 保存成功使用现有 Toast，手动关闭后回到手记操作入口；同一结果只由 Toast 播报，持久文字不重复生成 live region。首次失败保留草稿、重试保存、关闭取消等待，不因此新增计时队列或撤销功能。
- 反馈组合复核覆盖 Alert 失败重试、Toast 第一行对齐及 8 秒计时暂停与撤销、各流程焦点恢复、EmptyState 的 320px 长内容和双按钮、Skeleton 等高布局与强制颜色轮廓，以及减少动效。区分具体组合的流程，不将其他示例的计时与撤销加入 ArticleActions；未运行的检查不能写成已通过。
- 不以测试数量或覆盖率数字代替真实使用场景的验收。

## 组件文档维护

- 遵循 [组件文档规范](docs/documentation.md)。每个组件页面位于 `playground/src/docs/components/`，元信息只维护在 `component-catalog.ts`；`component-pages.ts` 按组件加载。
- `docs/components/` 是生成结果，不直接手工维护另一份正文、API 或示例。编辑页面后运行 `npm run sync:docs`，以 `npm run check:docs` 检查同步。生成器共用页面数据，不替代对 Props、默认值和实际行为的核对。
- 用途、可运行示例、API 与相关组件为内容底线；可访问性、键盘、表单和样式章节按实际能力设置，不统一添加“语义与使用约定”兜底段。
- 分类使用通用、排版、布局、表单、内容展示、导航、浮层、反馈，ThemeProvider 单列主题配置。分类调整不修改公开导出名，也不要求源码按网站分组搬迁。
- 原有组件路由、示例与章节 id 保持稳定；新增或调整章节标题时保留已有深链接。示例展示源码与 Markdown 中的 TSX 均保留原文件内容及相对导入。
