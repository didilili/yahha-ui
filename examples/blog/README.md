# 小小日常 · 博客示例网站

「小小日常」是 Yahha 星球上的一本生活手记。库米和朋友们在这里记下散步、读书，也记下留给朋友的热汤和一起分过的点心。

这是当前仓库内的完整网站示例，源码位于 `examples/blog/`。它与组件库共用根目录的 npm 和工具链，没有单独的 `package.json`、workspace 或新仓库。

首页、文章详情、归档与搜索均使用 `yahha-ui` 公开组件。页面 CSS 负责站点布局和装饰，不覆盖组件内部 DOM。所有文章为虚构示例内容，收藏只保存在当前浏览器，不连接后台。

这是**在仓库内运行网站示例**的路径。如果只想在自己的项目使用按钮、表单或浮层，按[组件库的本地安装说明](../../README.md#构建与本地安装)安装 `.tgz` 即可；无需复制整个博客。交互文档在根目录运行 `npm run dev` 后进入 `#/components`，页面中的“完整接入”提供单个示例及素材清单。

## 启动与构建

在组件库根目录安装依赖后启动：

```sh
npm ci
npm run dev:blog
```

打开终端输出的地址（默认本机 `127.0.0.1:4186`）。命令先构建组件库，再启动网站；修改网站源码支持热更新。若修改了组件库源码，重新运行此命令以更新库构建。脚本使用严格端口；端口占用时会报错，不会自动切换。

生成可独立托管的静态文件：

```sh
npm run build:blog
npm run preview:blog
```

打开终端输出的预览地址（默认本机端口 `4187`），输出目录是 `examples/blog/dist/`。相对资源路径与 hash 路由支持静态站点的子目录部署；这里的命令只在本地运行。

## 页面与操作

- `#/`：朋友群像、最近手记、分类入口、作者介绍与关于小站。
- `#/archive`：搜索、分类、排序、收藏筛选与每页四篇的分页。筛选条件保存在网址，便于刷新或返回列表。
- `#/posts/river-evening`：完整文章、目录跳转、收藏、下一篇与返回列表。目录位置也可以通过网址直接打开。
- 找不到的文章提供返回首页入口。

浏览器返回会恢复原列表条件、浏览位置与可用的焦点目标。收藏会在刷新后保留；提示支持关闭、撤销，默认八秒后收起，悬停或聚焦时暂停。浏览器不允许存储时，当前页面仍可使用，并显示保存范围说明。

从首页或归档进入文章后，页内会显示对应的“返回首页”或“返回手记归档”，并恢复本次来源页面的位置和焦点；直接打开或刷新文章、没有本次来源记录时，正常返回来源页面顶部。窄屏的文章目录默认收起，点击“这一页的小路标”展开；桌面仍显示完整目录，文内链接支持直接打开和刷新定位。收藏最后一页的唯一手记被取消后，会自动校正页码，并保留本次操作的撤销提示。

## 改成自己的小站

先修改已有内容入口，保留页面组合和组件的公开用法：

- [站点资料](src/data/site.ts)：`siteName`、`siteSubtitle`、`authorName`、`authorBio` 分别控制站名、副标题、作者名和作者简介。页头、页脚、动态页面标题及欢迎场景会读取对应资料；首页其余介绍、章节文案在 [HomePage.tsx](src/pages/HomePage.tsx)。
- [静态页面头部](index.html)：同步修改 `<title>` 和 description。这里在 JavaScript 运行前生效，不会自动读取 TypeScript 资料。替换头像时，核对 [assets.ts](src/assets.ts) 的 `author` 导入和此文件的 favicon 引用。
- [文章数据](src/data/posts.ts)：修改标题、摘要、日期、标签和分段正文，保留唯一的文章 `id` 与文内章节 `id`。数组按发布日期降序排列：首页取前三篇，“下一篇”也按数组顺序；归档页面另外按日期排序。
- **分类**：只改现有显示名称时，核对 `posts.ts` 的 `categoryLabels`、首页分类描述和 [ArchivePage.tsx](src/pages/ArchivePage.tsx) 的短标签。新增分类 ID 时，还需同步 `posts.ts` 的 `Category`、首页分类入口、归档选项及 [router.ts](src/router.ts) 的校验；它们保留各自的类型、路由和显示职责。
- **配图**：`Post.image` 当前使用 `reading`、`rest`、`lounge` 三个资源键。替换原图可修改 `assets.ts` 的对应导入，并核对 [ArticlePage.tsx](src/pages/ArticlePage.tsx) 的 `imageDescriptions`。增加资源键时同步文章类型、资源映射和替代文字，不把图片 URL 直接写进 `Post.image`。
- **导航与页脚补充文字**：现有三个导航和演示范围说明在 [App.tsx](src/App.tsx)。调整入口时使用现有 `SiteLink`，保留相应路由和可访问名称。

完成后运行 `npm run build:blog`，再按下面的真实安装包验收检查；收藏仍保存在当前浏览器，修改这些文件不会接入后台。

## 目录

```text
examples/blog/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── App.tsx              # 外壳、收藏与通知
    ├── router.ts            # URL、历史与浏览位置
    ├── SiteLink.tsx         # 保留原生链接行为的站内跳转
    ├── data/site.ts         # 站名、副标题、作者名与简介
    ├── data/posts.ts        # 十二篇完整的虚构手记
    ├── components/         # 本示例的页面组合，不对外导出
    ├── pages/              # 首页、归档、文章
    └── assets/             # 现有素材副本和许可说明
```

## 真实安装包验收

```sh
npm run build:lib
npm run test:blog
```

本地开发通过仓库包的公开 `exports` 加载 `dist/`，Vite 与 TypeScript 没有将 `yahha-ui` 指向 `src/` 的别名。验收脚本则把**同一份网站源码**复制到临时使用方，实际安装本地 `.tgz`，检查类型、构建和桌面/手机阅读流程；组件库打包白名单不会包含网站。

示例当前使用已验证的 React 19 浏览器环境。它没有扩展 React 18 或 SSR 的兼容承诺，也没有新增公开 UI 组件。

## 按需复用与动效

先从 `src/pages/` 的页面组合和 `src/components/` 中选择需要的内容，再保留它们实际导入的素材与布局样式；这些组合不属于 `yahha-ui` 的公共导出。运行现有示例不需要另装依赖或生成素材。

欢迎场景的 `FriendsWelcome.tsx` 使用配套静态 SVG 渲染原生场景，可暂停当前帧、继续并单独重播挥手；离屏、页面后台或系统减少动效时停止。普通 `*-motion.svg` 以图片引用时只能使用文件内置动效，外部按钮不能直接控制内部时间线。单独复制时，可在文档站 `#/guides/artwork?section=artwork-welcome` 下载原样完整示例及素材；素材路径跟随复制的文件，不能保留只在原仓库成立的跨目录导入。

站点静态内容不制造等待；收藏与错误等实际状态由组件和页面逻辑处理，图案提供补充。小图案、单次状态和循环场景的选用说明见[素材指南源码](../../playground/src/docs/artwork-guide.tsx)及[SVG 素材说明](../../playground/src/examples/scenes/artwork/little-days/README.md)。

## 素材与使用范围

示例代码和项目自有内容采用 [MIT](../../LICENSE)。角色、插图与字体来源见[素材说明](src/assets/README.md)；字体继续保留 OFL，第三方角色形象、名称和商标不在 MIT 授权范围内，详见[第三方说明](../../THIRD_PARTY_NOTICES.md)。
