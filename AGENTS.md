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
- examples/blog/ 是同仓库的完整网站示例，复用根目录工具链，不另建 package.json、workspace 或仓库。网站使用公开 exports；验收把同份源码复制到临时使用方实际安装 tgz，禁止用源码 alias 掩盖接入问题。
- 内部模块直接导入具体文件，不从 src/index.ts 回引；库内相对 JS 模块路径使用 .js 扩展名。
- React / ReactDOM 保持 peer dependencies；展示专用依赖与素材不得进入库产物。

## 组件与样式

- 保持既有公开 API，以已落地的漫画手账视觉为基线；新增配置应有具体使用场景。
- 遵循 [设计语言](docs/design-language.md)：默认统一奶白、暖墨与轻粉，用清楚墨线区分饱满按钮、白底字段、纸签、栏目与便笺浮层。Tabs 使用栏目下缘，SegmentedControl 使用纸托盘，内容容器保持平面。角色配色是 ThemeProvider 文档中的可选预设，不设为顶栏全站切换；字体继承使用方。
- 站点品牌、基础组件与角色素材分层维护：天空、草地、群像和章节花芽由 `playground/src/site/` 组织；组件安装包保留暖墨、轻粉、白字段和轻纸边，不带场景图片或站点布局。当前人物保留 v3，历史与撤回样张只在开发预览，人物细修另行评审。
- 装饰服务入口和章节组织：首页首屏一处主要群像，文档页头一处探头，每个章节标题最多一组辅助图案；正文、字段内部、代码与 API 区保留阅读和操作空间。手机重新构图并减少次要装饰，角色不得遮挡文字、焦点或浮层，必要状态仍由文字、图标与语义表达。
- 尺度唯一值源为 `src/theme/theme.module.css`。默认控件 44px，Button / IconButton 已有 sm / md / lg 为 36 / 44 / 52px；不临时增加 45 / 46px 档位。字号、行框、padding 和边框一起推导实际高度，手机输入 16px 字号也须对齐；长内容允许增长。
- 正文与控件字阶分开：Text 为 14 / 16 / 18px，默认 16px；控件字阶为 12 / 14 / 16px。Heading 字阶为 32 / 24 / 20 / 18 / 16 / 14px，先选语义层级；不通过示例局部覆盖制造另一套规范。
- 使用正确语义族的视觉 token，fallback 与默认值一致。小图形几何可按具体用途保留，经设计检查的精确例外记录原因；不为每个一次性数字新建全局 token 或整文件豁免。
- 文字按钮 SVG 图框按 sm / md / lg 使用 16 / 18 / 20px，IconButton 使用 18 / 20 / 22px，字段与 Select 展开图标使用 18px；保留 viewBox 与长宽比，核对笔触和视觉中心，不改变控件高度迁就图标。
- 按钮与主要导航链接共用动作轮廓、底边和反馈变量，保留 button / a 各自语义。TextField 与 Select 统一标签和提示起点，打开、焦点、错误与选中标记分工；Badge 保留普通轻边、强调轻粉实色和绿色成功纸签，Surface 使用平面轻纸边。不得将内容、字段和动作全部改成同等重量的深墨卡片。
- Textarea 的标签、提示和错误与 TextField / Select 同用 4px 水平文字留白，多行保持 rows 与纵向调整能力。Checkbox / Switch 标签行保留 4px 逻辑方向留白，提示跟随标签文字；RadioGroup 的组说明跟随 legend、单项说明跟随标签，选中行仅用轻纸色与加粗标签，禁用选中取消活跃纸色。SegmentedControl 托盘使用轻纸边，保留 2px 边宽、44px 单项与 56px 单行托盘；方形勾、半选短横、圆点和开关位置分别保留。
- 阅读族沿用 Text / Heading / Link 的既有字阶、行高、墨弧、下划线与语义；Divider 使用 1px 轻纸线，Avatar 姓名回退使用主题强调色纸面，Image 失败回退用不占几何空间的轻纸内边。图片比例、裁切、alt、hidden 与头像尺寸独立保留。ReadingExample 的 68ch 栏宽、8px 图注间距、24px 段距及后记到收藏反馈的分组属于示例布局，不强加到组件默认外观或使用方页面。
- 导航族分别保留 Tabs 的无托盘短墨线、Pagination 的普通轻纸边与当前页墨圈、Accordion 的轻纸分隔行与 28px 圆扣。Tabs 最小 44px，禁用墨线跟随文字；Pagination 最小 44×44px、文字数字居中、长页码自然增宽；Accordion 圆扣对齐问题第一行，标题 20px 行框加上下各 4px 留白，默认操作区最小 44px、正文 16px，禁用已展开项保留方向并使用中性圆扣。保留原生语义、受控状态、减少动效与强制颜色；不为视觉细化新增 API。BlogArchive 的 100% / 68ch 栏宽与 Divider 去除重复留白仅属于组合布局。
- 浮层族保留便笺、对白与信笺轮廓。DropdownMenu 单行最小 44px、多行自然增高，短墨记对齐文字第一行，高亮、焦点、禁用与危险动作分别保留；强制颜色下禁用文字用 GrayText。Popover 关闭按钮为 44×44px，中心对齐标题第一行，标题下用 paper-line。Dialog 无 illustration 时关闭按钮为 44×44px 并对齐标题第一行，标题保持桌面 24px / 手机 20px；有 illustration 时维持上角 top 10px，标题与页脚用 paper-line。长标题留足关闭操作空间，轮廓、字阶、滚动与语义 API 沿用既有规则。Tooltip 保留小对白、与 Popup 相邻的独立箭头及 data-uncentered 隐藏规则，只补长内容与边缘验证，不为变化重画默认。
- 反馈族保留持续说明、短结果、空内容、等待与内容占位的分工。Alert 保留 24px 图标的既有第一行对齐；Toast 的 30px 状态印签与 44×44px 关闭目标中心对齐标题第一行，文字起点、字阶与回执轮廓不变，操作区细虚线使用 paper-line。EmptyState 保留既有角色插画及 320px 长文本双按钮布局；Spinner 保留 16 / 24 / 36px 三墨点、1.2 秒节拍与减少动效规则。Skeleton 默认仍用 neutral-line，保留形状与动画，仅在强制颜色下用 CanvasText 的 1px 装饰内轮廓（outline-offset: -1px）保持可见且不改几何。
- 明确受控状态、ref、原生属性和 className 的作用目标，并同步 Props 注释与文档。
- 组件样式留在各自 CSS Modules；共享主题规则留在 theme/，避免复制整份样式。
- 展示页通过公开属性、样式入口与 tokens 定制，不依赖组件内部标签或嵌套层级。
- 文档站的公共交互优先从 `yahha-ui` 公开入口复用已有组件，包括搜索、清空、菜单及代码操作。
- 组件总览位于 `#/components`，入口与分组复用 `component-catalog.ts` 的 `componentCatalog` / `componentGroups`。首页、顶栏、侧栏和 404 的组件目录入口统一到总览；具体组件的行内引用仍可直达文档。总览按需加载，不导入各文档组完整示例与源码。
- 总览小样只使用公开组件及属性，不改内部样式、尺寸或交互；预览区使用 inert 与 aria-hidden，链接放在独立的卡片标题中，避免链接包裹按钮或形成嵌套链接。q/group 使用 replaceState 记录筛选，不在每次输入时触发路由聚焦或增加历史记录；返回后恢复筛选，清空后保留可用焦点。示例/API 数量不把总览小样算作新增公共组件或完整使用示例。
- 文档完整接入提供原样 `Example.tsx` 和单独的 CSS / ThemeProvider 入口 `App.tsx`，不得改写原始示例 source 制造另一份代码；预览与源码保持同源。含素材的示例同时提供对应 artwork 文件，并保留源码中的相对路径。
- 场景素材只放在 `playground/src/examples/scenes/artwork/`，不进入 `src/` 或默认组件库产物。Button 与 Spinner 共用内部三墨点图形；区块素材保留减少动效时的静止呈现。
- 基础操作动效沿用 60ms 按下、150ms 回位或切换：Button / IconButton 不新增悬停位移，Checkbox 保留勾和半选短横，Switch 仅平移圆扣并镜像 RTL；不以动画改写尺寸、焦点、选中语义或业务状态。禁用与减少动效直接显示静态结果，环境场景不得拖慢操作反馈。
- 填写与选择保留静止布局：TextField / Textarea 边框和错误底色、RadioGroup 圆点与选中行、SegmentedControl 底色和内阴影使用 150ms 反馈；焦点轮廓与实际值即时更新。Select 菜单仅作 180ms 透明度入场，关闭立即取消过渡，避免焦点停留在已取消的选项；沿用 Base UI 的焦点恢复规则，不为动效改变边缘定位、滚动、原生提交或重置。初始已选、禁用、减少动效及强制颜色保持相应静态结果。
- examples/blog/src/assets/ 可保存网站独立运行所需的现有素材副本及来源、字体声明，保持角色版本和字节；不从组件库 src/ 反向引用示例，也不把副本放入组件库产物。
- 小日常道具原稿仅维护在 `playground/src/examples/scenes/artwork/little-days/`；`npm run sync:artwork` 派生示例静态/动效文件、博客副本和原生书签图标，`npm run check:artwork` 防止分叉。下载资源使用 `?no-inline` 保留独立 SVG，真实等待结束即停止，静态博客不制造加载延迟。
- 欢迎场景由 `scripts/build-friends-welcome.mjs` 从既有 v3 造型派生，仅分离前爪动作；脸、身体比例及原模型文件保持。`FriendsWelcome.tsx` 是网站组合示例，使用原生 SVG 与真实暂停/继续，博客版本由同步脚本复制（仅迁移资源导入路径），不维护另一套控制器。云草循环、挥手短暂；离屏、后台和系统减少动效时停止，重播只重建前爪，不重置环境时间线。
- 组件接入处的站点 CSS 负责布局与公开 `className` / `classNames` 定制，不覆盖内部 DOM 来重写组件的基础交互或缩小点击区域。
- `examples/design/` 展示默认实现，禁止通过 style、className、classNames 或内嵌 CSS 改写控件外观与几何。使用方的公开定制能力保留；专门的定制示例必须说明范围，不能混进默认基准。
- 保留导航链接、表格、pre / code 等合理的原生语义；不要为了组件复用把页面导航改成 Tabs，或把链接改成按钮。
- Portal 使用统一主题上下文；不要复制带布局作用的页面 className。
- 保留字体与素材说明，不虚构许可证或未经验证的 React / SSR 兼容承诺。

## 验证

- 先复现问题或编写关键行为测试，再实施行为修改；不写只检查文件名或复述实现的测试。
- 使用针对性测试及必要的 lint、格式与类型检查，避免无关的大范围重跑。
- 涉及公共 API、构建或依赖边界时，运行 npm run check，验证真实安装包。
- 默认视觉应保持一致；修改布局或主题传播时补必要的浏览器验证。
- 设计修改必须通过 `npm run check:design`；尺寸以安装包浏览器 computed 值为准，覆盖普通 / 错误 / 只读 / 禁用 / loading、所有预设、窄屏与粗指针。不得只靠 min-height 声明或截图声称对齐。
- 新增组件后复核文档站中可复用的位置，并验证官网真实场景中的键盘、焦点、主题与窄屏表现；组件数量不能替代使用验收。
- 设计语言需在无插画和真实阅读组合中验收，检查控件 / 内容 / 浮层分工、安静的表单层次及单一键盘焦点；不能仅看孤立组件或角色配色。
- 组件视觉细化提供同内容、同视口、同状态的前后图，并在无文档站 CSS 的真实安装包使用方复核；规范声明与实际测试结果分别报告。
- 浮层真实组合复核使用现有 ArticleActions，不新增功能、场景或角色；实际样式细化与已有交互验收分别说明，待运行的长内容、边缘或焦点检查不能写成已通过。
- Dialog、Popover、DropdownMenu 通过内部 `renderInteractivePopup` 保留退场视觉并阻止已关闭节点接收按键、点击和表单提交；以 Base UI 实际 `state.open` 判断，不把受控关闭请求当作已经关闭。保留原生 inert、ref、样式、children 和打开期间的原捕获处理器；父级保留打开时仍能正常操作。
- ArticleActions 保存成功使用现有 Toast，手动关闭后回到手记操作入口；同一保存结果只由 Toast 播报，持久文字不重复生成 live region。首次失败保留草稿、重试保存、关闭取消等待属于既有流程；不因此新增计时队列或撤销功能。
- 反馈族收尾区分实际 CSS 修正与已有流程复核：Toast 第一行对齐和内纸线、Skeleton 强制颜色轮廓属于样式修正；Alert 失败重试、Toast 8 秒计时暂停与撤销、各流程焦点恢复和 Skeleton 等高布局属于既有行为复核。待运行的测试、320px 长内容、减少动效或强制颜色检查不能写成已通过。
- 不以测试数量或覆盖率数字代替真实使用场景的验收。
