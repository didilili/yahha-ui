# 素材与分发范围

本文按当前仓库文件区分组件代码、展示素材与页面截图。包名为 `yahha-ui`，当前版本 `0.0.1`，仍为本地试用包；最终代码许可证与角色素材的完整许可清单尚未确定。素材的生成、重绘或同步记录，不等于已核验再发布或商业使用许可。

## 组件代码与安装包

- 源码位于 `src/`，公共入口为 `src/index.ts`。构建生成 `dist/index.js`、类型声明与 `dist/style.css`；按钮的三墨点及代码内基础图形随组件实现构建。
- [package.json](../package.json) 的分发白名单为 `dist/`。本地 `.tgz` 另附包元信息与根 README，不包含文档站、博客源码、独立角色 SVG、PNG、字体或截图目录。
- React / React DOM 由使用方提供，`@base-ui/react` 是运行时依赖。各依赖保留各自的声明，不将它们的许可证名称当作本项目代码已采用的许可证。

源码仓库 README 中的相对图片和文档链接供仓库阅读，不表示这些文件进入安装包。代码接入见[开始使用与本地安装](../README.md)。

## 角色 SVG 与生活道具

这些独立素材不进入组件安装包；文档和示例网站按需引用。

- **朋友场景与人物模型**：原稿及当前场景位于 `playground/src/examples/scenes/artwork/friends-preview/`。造型源为 `source/characters.svg`，正式页面复用当前 v3 场景与探头图；历史和撤回版本保留在开发评审目录。现有说明记录了项目绘制、参考来源及其非官方属性，未将其标为官方资产。见[朋友 SVG 原始说明](../playground/src/examples/scenes/artwork/friends-preview/README.md)。
- **小日常道具**：原稿位于 `playground/src/examples/scenes/artwork/little-days/`，包括书签、热茶、翻页、口袋和状态图案。道具由本项目绘制，找路与欢迎场景还会组合既有角色模型；不能把整组素材统称为不含角色的独立道具。见[源文件、派生与动作说明](../playground/src/examples/scenes/artwork/little-days/README.md)。
- **静态、动效与博客副本**：由 [sync-little-days-artwork.mjs](../scripts/sync-little-days-artwork.mjs) 从原稿派生，欢迎场景另复用 [build-friends-welcome.mjs](../scripts/build-friends-welcome.mjs)。文档使用扁平 SVG，博客使用 `examples/blog/src/assets/little-days/` 副本；原生书签与欢迎控制器也由同一同步流程维护。来源一致性可用 `npm run check:artwork` 检查，下载和接入见文档站 `#/guides/artwork`。

当前记录能够说明绘制和派生路径；角色素材的再发布与商业使用许可仍未核验。文件格式为 SVG、由项目重新绘制或包含原创道具，都不改变这一记录状态。

## PNG 插图

PNG 不进入组件安装包；实际引用的图片会进入对应网站的静态构建。

- `playground/src/assets/reading.png`、`rest.png`、`lounge.png` 是仓库既有插图，博客保存同名副本。目前[博客素材说明](../examples/blog/src/assets/README.md)记录了这些副本的来源路径，未给出与下列状态图同等的独立生成清单；不补写未经核实的作者、工具或许可。
- `playground/src/examples/scenes/artwork/empty.png` 有[生成说明](../playground/src/examples/scenes/artwork/README.md)及 [sources.json](../playground/src/examples/scenes/artwork/sources.json)，记录 Codex 内置 image_gen、生成日期、尺寸、字节数和 SHA-256，仍用于部分示例。

现有状态图说明明确记录为非官方同人样张，角色素材的再发布与商业使用许可尚未核验。哈希证明文件与记录对应，不代表授权状态。

## 字体与现有声明

站点使用 `marker.woff2`、`wenkai.woff2`，组件本身继承使用方字体。这两份字体不进入组件安装包，文档站和博客各保存使用副本及声明。

- [OFL-marker.txt](../playground/src/assets/OFL-marker.txt) 记录 LXGW Marker Gothic 项目及 SIL Open Font License 1.1。
- [OFL-wenkai.txt](../playground/src/assets/OFL-wenkai.txt) 记录 LXGW WenKai / Klee 项目、保留名称和对应字体许可文本。
- 博客副本的两份声明保存在 [examples/blog/src/assets/](../examples/blog/src/assets/README.md)。

已确认的是这些声明文件在源码中存在，并随字体副本保留。它们适用于相应字体，不覆盖组件代码或角色图像。静态网站使用字体时，分发目录中的声明位置按[部署说明](deployment.md)记录。

## README 截图

`docs/images/` 保存从当前文档站和博客实际页面截取的展示图，记录组件、角色、字体与布局共同呈现的结果。它们不是从参考网站下载的图包，也不是独立的角色授权素材；截图中的素材继续按上述来源分别说明。

截图用于仓库介绍，不进入组件安装包。页面、主题或素材发生变化时，应重新截取实际页面，避免图片与使用示例不一致。
