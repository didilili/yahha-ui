# 素材与分发范围

本文分别记录组件代码、角色展示素材、生活道具、字体与页面截图的来源和分发位置。包名为 `yahha-ui`，当前版本 `0.0.1`，仍为本地试用包。项目自有内容采用 [MIT](../LICENSE)，第三方内容见[第三方说明](../THIRD_PARTY_NOTICES.md)。

## 组件代码与安装包

- 源码位于 `src/`，公共入口为 `src/index.ts`。构建生成 `dist/index.js`、类型声明与 `dist/style.css`；加载图形及代码内基础图形随组件实现构建。
- `Icon` 与十六个命名功能图标属于公开组件能力，随安装包提供，可从 `yahha-ui` 按需导入；不依赖图标字体、远端资源或文档站素材。分类、章节图案和角色场景继续留在站点层。
- Button / IconButton 的可选软团外观由组件 CSS 绘制轮廓、短高光与按压底边，功能图标通过现有图标属性或子元素传入；小花饼加载图形维护在 `src/internal/BiscuitLoadingGlyph.tsx`，随组件代码进入安装包。角色 SVG 继续作为下文的独立场景素材维护。
- [package.json](../package.json) 的分发白名单为 `dist/`。本地 `.tgz` 另附包元信息、根 README、`LICENSE` 与 `THIRD_PARTY_NOTICES.md`，不包含文档站、独立角色 SVG、PNG、字体或截图目录。
- React / React DOM 由使用方提供，`@base-ui/react` 是运行时依赖。

源码仓库 README 中的相对图片和文档链接供仓库阅读，不表示这些文件进入安装包。代码接入见[开始使用与本地安装](../README.md)。

## 角色 SVG 与生活道具

这些独立素材不进入组件安装包；文档站与组合示例按需引用。

- **朋友场景与人物模型**：原稿及当前场景位于 `playground/src/examples/scenes/artwork/friends-preview/`。完整造型源为 `source/characters.svg`，生成群像、探头图与九张人物样张；生成成品只保留实际引用的定义及其传递依赖。当前素材、用途与生成方式见[朋友 SVG 说明](../playground/src/examples/scenes/artwork/friends-preview/README.md)。这些素材为非官方绘制。
- **小日常道具**：原稿位于 `playground/src/examples/scenes/artwork/little-days/`，包括书签、热茶、翻页、口袋和状态图案。道具由本项目绘制，找路与欢迎场景还会组合既有角色模型；不能把整组素材统称为不含角色的独立道具。见[源文件、派生与动作说明](../playground/src/examples/scenes/artwork/little-days/README.md)。
- **静态与动效**：`npm run sync:artwork` 先生成当前人物成品，再通过 [sync-little-days-artwork.mjs](../scripts/sync-little-days-artwork.mjs) 从原稿派生场景，欢迎场景另复用 [build-friends-welcome.mjs](../scripts/build-friends-welcome.mjs)。文档保留十四份扁平 SVG。人物成品、定义裁剪与派生文件可用 `npm run check:artwork` 检查，下载和接入见文档站 `#/guides/artwork`。

## 可选装饰元素

`playground/src/examples/scenes/artwork/decorative-elements/` 保存六种背景纹样、四种无文字标题底形、五条装饰分隔线与六枚小图案。原始图形由本项目绘制；下载目录由同目录 `catalog.json` 维护。首页与阅读组合按需引用，不进入组件包。

同目录 `friends/` 的三枚贴纸、朋友纸签和稀疏背景由 `scripts/build-friends-decorations.mjs` 从当前 `friends-preview/source/characters.svg` 派生，保留被引用人物定义；构图与贴纸边是独立绘制。它们纳入 `sync:artwork` / `check:artwork`，预览与下载位于 `#/guides/artwork?section=artwork-decorations`。可复制示例同时提供 SVG，并列出与原始源码一致的保存路径。

## PNG 插图

PNG 不进入组件安装包；实际引用的图片会进入对应网站的静态构建。

- `playground/src/examples/scenes/artwork/empty.png` 最初于 2026-10-24 生成，2026-11-04 经人物校准与透明边缘精修后确认采用。它仍只包含小八与乌萨奇，用于文档空状态示例；[生成说明](../playground/src/examples/scenes/artwork/README.md)及 [sources.json](../playground/src/examples/scenes/artwork/sources.json)保留当前成品、编辑提示词和原版本记录，不依赖本机临时路径。

生成说明将该状态图记录为非官方同人样张，具体来源、尺寸与哈希保留在原目录。

## 字体与现有声明

文档站分别以 `Marker`、`WenKai` 字体族使用 LXGW Marker Gothic Regular 与 LXGW WenKai Regular，组件本身继承使用方字体。字体不进入组件安装包；文档站使用本地 WOFF2 分片，并保留现有声明。

字体源完整字符集按 `unicode-range` 分片保留，不再仅包含当前文案中的少量字符。文档站现有源码用字集中在各字体的 `common` 首包，其余字符按每片最多 512 个码点生成；页面新增用字或用户输入源字体支持的其他字符时，浏览器按需加载对应分片。

- `playground/src/assets/fonts/` 为生成文件的主目录：`manifest.json` 记录来源、覆盖与哈希，`wenkai.css`、`marker.css` 声明字体，`wenkai/`、`marker/` 保存分片。

- [OFL-marker.txt](../playground/src/assets/OFL-marker.txt) 记录 LXGW Marker Gothic 项目及 SIL Open Font License 1.1。
- [OFL-wenkai.txt](../playground/src/assets/OFL-wenkai.txt) 记录 LXGW WenKai / Klee 项目、保留名称和对应字体许可文本。

文档站构建时会自动输出 `notices/OFL-marker.txt`、`notices/OFL-wenkai.txt`、项目 `LICENSE` 与 `THIRD_PARTY_NOTICES.md`；分发目录保留方式见[部署说明](deployment.md)。

### 字体维护

日常安装、开发与构建直接使用仓库内的字体文件，无需 uv。修改字体资源后，在仓库根目录检查覆盖和哈希：

```sh
npm run check:fonts
```

需要更新官方字体源或重新生成分片时，先安装 [uv](https://docs.astral.sh/uv/)，再运行：

```sh
npm run fonts:generate
```

该命令通过 `uv run scripts/build-fonts.py` 使用 fonttools 生成字体目录。生成器保留所用官方 Regular 字体源的完整字符覆盖；字体与分片策略统一维护，不按某个页面缺的几个字手工补包。

已有官方字体下载缓存时，可直接向生成器提供目录：

```sh
uv run scripts/build-fonts.py --source-dir /path/to/official-font-cache
```

生成后执行 `npm run check:fonts`，再按改动范围检查网站构建与实际页面。字体的来源、版本或生成结果变化时，同时核对 `manifest.json` 和现有 OFL 声明，保留对应许可文本。

## README 截图

`docs/images/` 保存从当前文档站实际页面截取的展示图，记录组件、角色、字体与布局共同呈现的结果。它们不是从参考网站下载的图包，截图中的素材来源见上文。

截图用于仓库介绍，不进入组件安装包。页面、主题或素材发生变化时，应重新截取实际页面，避免图片与使用示例不一致。
