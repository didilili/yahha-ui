# 协作说明

开始修改前阅读 [AGENTS.md](AGENTS.md)。不要自动暂存、提交、推送或发布；已有暂存内容和其他工作区改动需要原样保留。小改动采用针对性验证，流程与影响范围匹配。

## 本地开发

使用 Node.js 22.22.3、npm 10.9.8 与仓库的 `package-lock.json`：

```sh
npm ci
npm run dev
```

组件文档见 [docs/README.md](docs/README.md)。仓库保持 npm 单包，React 与 React DOM 由使用方提供，当前 peer 范围均为 `^19.3.1`。展示与交互示例放在 `playground/`，不新增 Storybook 依赖。

## 目录与边界

- `src/index.ts`：公共组件与类型的统一导出；新公开类型需同步导出。
- `src/components/<组件名>/`：组件实现、CSS Modules、行为测试与局部导出。组件内部直接引用具体模块，避免从公共入口回引。
- `src/theme/`：主题、Context 与语义颜色；`src/internal/`：不公开的工具与图标。
- `playground/src/`：独立展示页，包含演示数据、图片、字体和示例。库源码不得依赖它。
- `playground/src/docs/`：指南与组件页数据、API、站内代码展示工具；`examples/` 放实时示例。每个示例同时作为 TSX 模块和 `?raw` 源码导入。完整接入分别提供原样的 `Example.tsx` 与负责 CSS / ThemeProvider 包裹的 `App.tsx`；含场景素材时同时提供 artwork 文件，保留 `Example.tsx` 同级 `artwork/` 的相对引用。
- `playground/src/examples/scenes/`：加载、空态与 404 页面组合及其 `artwork/` 素材。素材只属于展示示例，不进入 `src/` 或默认组件库产物。
- `playground/src/docs/component-catalog.ts`：搜索和导航的轻量元信息目录，不导入示例模块；页面 ID、名称、中文名、分组和描述需与页面定义一致。
- `playground/src/docs/component-pages.ts`：按文档组加载页面内容与示例；新增文档组时同步 loader 与目录的 module 字段。
- `docs/components/`：已实现 API、默认值、原生属性与样式入口的文档。
- `tests/package-consumer/`：真实安装包的使用方、独立边界场景与浏览器断言；不作为公开组件导出。
- `tests/package-consumer/Basics.tsx` 与配套 `basics-checks.mjs`：新增基础组件的表单、导航、图片回退和浮层组合验收。
- `tests/docs-site/`：构建后文档站的浏览器检查，包含静态子目录部署。
- `playground/src/site/`：正式首页与文档外壳；`playground/src/design-preview/`：开发评审入口 `friends.html`，不进入默认展示产物。
- `examples/blog/`：共用根工具链的完整网站示例，使用公开构建入口；`tests/blog-site/` 用实际 `.tgz` 安装验收同份源码。
- `docs/images/`：从实际页面截取的仓库展示图，拍摄路由和视口见目录内 README，不进入安装包。
- `scripts/`：打包与验收脚本。

库内相对模块路径使用 `.js` 扩展名，使构建后的多文件声明可被 Bundler 与 NodeNext 解析。公开 Props 与实际默认值是 API 契约依据；站内 API 和组件 Markdown 分别维护，公共接口变更需同步核对属性名、类型、必填项、默认值、原生属性及 ref 的作用目标，并检查源码导出和使用方示例。站内预览与展示源码使用同一个 TSX，Markdown 入门示例单独维护，两者都由真实安装包验收编译。页面元信息变更时同步 component-catalog。

组件目录与总览按通用、排版、布局、表单、内容展示、导航、浮层与反馈七组组织 29 个 UI 组件，ThemeProvider 单列为主题配置；界面分组调整只更新目录与页面元信息，文档加载模块继续按实际文件组织。TextField、SegmentedControl、ThemeProvider 的中文名称分别统一为“单行输入”“分段选择”“主题配置”，英文导出名和路由保持稳定。

组件使用文档描述当前用途、示例、API 和交互约定，不混入“本轮复核”“保留既有”“不计新增”等开发过程表述。设计原则和视觉规则集中在设计语言文档；文档不承诺尚未实现或验证的能力。

当前文档站有 30 个组件入口（29 个 UI 组件与 ThemeProvider）和 86 个同源 TSX 示例，组件 Markdown 为 29 份（Button / IconButton 共页）。[设计语言](docs/design-language.md) 单独说明视觉和使用规则；默认设计规范位于 `#/guides/design-baseline`，示例不得覆盖控件外观与尺寸；共享 token 集中在 `src/theme/theme.module.css`，改设计必须通过 `npm run check:design` 与安装包实际尺寸验证；加载、空态与 404 场景位于 `#/guides/states`，以现有组件组合，不增加公共组件。增加或删除公开组件与示例时，同时更新 README 和文档索引。

组件边界也应随实现核对：Select 当前为单值选择，不包含搜索或多选；Pagination 使用按钮与页码回调，路由与列表更新属于调用方；Tooltip 沿用 Base UI 1.9 的视觉补充约定，触发器必须具备自身可访问名称，重要说明使用可见文字或 Popover。

文档站本身也是组件的使用方，统一采用奶白、暖墨与轻粉的漫画手账语言。按钮、白底字段、纸签、栏目和浮层保持各自结构，不能只用同一套圆角包住所有内容。角色配色在 ThemeProvider 文档中作为可选预设展示。搜索、清空、菜单、代码操作和重试等公共交互优先从 `yahha-ui` 公开入口复用已有组件。组件接入处的站点 CSS 只负责布局、排版和公开 `className` / `classNames` 定制，不依赖内部 DOM 覆盖基础交互，也不为适配顶栏而缩小点击区域。导航链接、表格、pre / code 等保留合适的原生语义，页面导航不改成 Tabs。

新增组件时，除了同步示例和 API，还需复核官网中适合复用的位置。验收覆盖官网实际的键盘操作、焦点恢复、主题及 Portal 更新、窄屏布局；增加组件数量本身不代表这些使用场景已通过验证。

设计验收同时查看无插画状态及文章阅读组合：控件、内容和浮层应有各自的层次，表单不抢正文注意力，每个聚焦目标只有一套清楚的键盘提示。使用 `ReadingExample.tsx` 等真实组合检查标题、正文、分类、收藏与辅助操作；加载场景检查文字与图标保留、尺寸稳定、真实请求结束后的恢复，以及 SVG 在减少动效时保留静帧。区块可配场景素材，但可见状态说明和真实恢复入口由 HTML 承担。

## 验证

按本次改动选择最小有效检查。例如只改某个组件行为时：

```sh
npm test -- src/components/text-field/TextField.test.tsx
npm run typecheck
```

纯文档改动可检查涉及文件的格式：

```sh
npx prettier --check README.md CONTRIBUTING.md docs
```

常用检查：

- `npm run lint` / `npm run format:check`：代码规则与格式。
- `npm test`：组件行为测试。
- `npm run build:lib` / `npm run build:demo`：组件库、类型声明与展示页构建。
- `npm run lint:package`：对构建后的包运行 publint。
- `npm run test:package`：将实际安装包放入独立使用方，检查 Markdown 和文档站全部 TSX 示例类型并运行 Chromium 验证；包含 1280、320、390px 的键盘、长文本、表单重置、弹窗焦点及滚动边界，以及 Basics 中的新增组件组合场景。先执行 `npm run build:lib`。
- `npm run test:docs`：检查文档路由、API 与示例入口、复制降级、搜索、移动导航和弹窗。先执行 `npm run build:demo`。
- `npm run test:blog`：用真实本地安装包运行 `examples/blog/` 同份网站，验证三页面、URL 筛选、历史返回、收藏和窄屏布局。先执行 `npm run build:lib`。
- `npm run check`：完整本地检查；涉及公共 API、构建或依赖边界时运行。

首次运行浏览器测试需要 `npx playwright install chromium`；Linux 可能需要 `npx playwright install --with-deps chromium`。`npm run format` 和 `npm run lint:fix` 会修改文件，只在确认作用范围后使用。

GitHub Actions 对 pull request 与 `main` push 执行完整检查。本地 Husky pre-commit 先对已暂存文件运行 `lint-staged`，通过后再运行 `npm run check:design`；hook 不代表已完成完整验证，也不授权自动暂存或提交。

## 素材与许可

当前包为 `private: true`，仅本地打包试用，不进行 npm 发布。代码最终许可证与第三方素材许可清单尚未确定，不要写成 MIT 或其他已获授权的结论。保留字体 OFL 声明；角色素材、字体和代码的许可分别核对，现有字体许可不覆盖角色素材。当前以 React 19 浏览器项目为验证范围，不宣称 React 18、SSR 或其他未经验证的运行环境兼容。

新增状态场景的透明 PNG 为非官方 AI 生成同人素材，来源、尺寸与哈希见 [artwork 说明](playground/src/examples/scenes/artwork/README.md) 和同目录 `sources.json`；再发布与商业使用许可尚未核验。修改场景素材时同步对应来源记录与完整接入下载文件。

静态文档站与博客的输出、字体声明复制和本地预览见[部署说明](docs/deployment.md)；代码、字体与素材的实际分发范围见[素材清单](docs/assets-and-distribution.md)。部署时保留构建中使用字体的现有声明，不把整个源码仓库作为静态站点根目录。

## 工程与设计参考

工具选择参考了 [Radix Primitives 的 Oxlint 配置路线](https://github.com/radix-ui/primitives/blob/main/package.json)，本项目保留 TypeScript 7，格式化使用 Prettier。

以下是从原 README 保留的 2026-10-23 设计观察记录，不代表参考站点的当前版本或官方组件规范：

- [Chiikawa Bakery](https://chiikawabakery.jp/)：白底、浅粉分区、清楚的文字和行动按钮。
- [Chiikawa Pocket](https://jp.chiikawa-pocket.com/ja/)：角色参与情境，标准交互融入同一世界。
- [Chiikawa Park](https://chiikawapark-tokyo.jp/)：粉白留白、细线、栏目招牌。
- [Chiikawa Market](https://chiikawamarket.jp/)：清楚的输入、筛选与信息密度。
- [动画官网](https://www.anime-chiikawa.jp/)：功能图标与角色插画分工，暖棕线稿。
- [Chiikawa-Flex](https://chiikawa-flex.vercel.app/)：角色随操作变化，成为状态结果。
- [Chiikawa-Hidamari](https://phuahjinwei.github.io/Chiikawa-Hidamari/)：一次一个反馈，短暂回应。
- [Usagi Clock](https://shao.fun/usagi-clock/)：功能进入角色场景，首帧优先显示。
- [saya-themes](https://github.com/Heoooooon/saya-themes)：共享语义结构的三角色主题。

这些是设计观察，并非官方组件规范。
