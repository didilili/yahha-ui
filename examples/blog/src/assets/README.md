# 示例网站素材

本目录保存网站独立运行与安装包验收所需的素材副本。以下同步命令均在 Yahha UI 源仓库根目录运行；导出的独立博客使用单独的资源快照说明，不携带这套维护工具。SVG 成品按实际引用精简定义，不改变角色比例。

- `peek.svg` 来自仓库 `playground/src/examples/scenes/artwork/friends-preview/friends-peek.svg`，作为博客独立副本保留；由 `npm run sync:artwork` 自动同步，`npm run check:artwork` 核对副本一致。
- `author.svg` 从同一吉伊微笑模型导出头像构图，由 `npm run sync:artwork` 自动派生与同步，`npm run check:artwork` 核对结果一致；不直接复用完整人物样张的全身画幅。
- `reading.png`、`rest.png`、`lounge.png` 于 2026-11-04 使用 Codex 内置 image_gen，按已确认的三位 SVG 模型校准，并经用户确认采用。它们保留读书、盖毯休息和围着电脑的原场景、动作与道具关系，是对现有 PNG 的编辑，不从 SVG 自动生成。
- 读书图保留此前已认可的小八，主要校准吉伊与乌萨奇；休息和电脑图还包含前一轮小八圆颊校准。尺寸、SHA-256、采用日期、当前提示词、输入版本与历史提示词完整保存在 [sources.json](sources.json)，不依赖被忽略的评审目录或本机生成图片目录。原始插图可从记录中的 Git 版本追溯。
- `fonts/` 是 `playground/src/assets/fonts/` 的同步副本，包含 `manifest.json`、`marker.css`、`wenkai.css` 及两种字体的 WOFF2 分片；对应 `OFL-*.txt` 声明保留在本目录。通过根目录 `npm run sync:fonts` 同步，`npm run check:fonts` 核对覆盖、哈希和副本一致性，不单独编辑生成文件。

字体族名为 `Marker`、`WenKai`，使用官方 Regular 字体源的完整字符覆盖。两站现有源码用字集中在 `common` 首包，其余字符按每片最多 512 个码点生成 `unicode-range`，新增用字与用户输入按需加载对应的本地分片。日常安装和构建无需 Python 或 uv；重新生成入口为根目录 `npm run fonts:generate`，可选下载缓存等维护方法见[字体维护](../../../../docs/assets-and-distribution.md#字体维护)。博客构建会自动将现有声明写入 `dist/notices/OFL-marker.txt` 与 `dist/notices/OFL-wenkai.txt`。

项目自有内容采用 [MIT](../../../../LICENSE)，第三方内容见[第三方说明](../../../../THIRD_PARTY_NOTICES.md)。现有角色图像为非官方同人素材，用于示例网站，不进入组件库 `dist/` 或默认安装包。

PNG 成品是网站实际复用的素材。SVG 是角色造型参照，插画会根据姿态与表情重新组织线条；来源记录不表示生图可逐像素复现。后续变更先评审完整画面、局部与缩略效果，采用后再更新成品及其来源记录。

`little-days/` 仅保存当前实际导入的六份 SVG：`tea-cup.svg`、`empty-collection.svg`、`search-empty.svg`、`collection-saved-motion.svg`、`friends-lost.svg` 和 `friends-welcome.svg`。道具源文件集中在
`playground/src/examples/scenes/artwork/little-days/`，找路与欢迎场景另复用当前朋友模型。静态热茶和空收藏口袋分别用于首页章节和空收藏页面，搜索空结果与收藏成功也从同一源同步。
404 使用[当前已确认的人物组](../../../../playground/src/examples/scenes/artwork/friends-preview/README.md#校准与生成)：三位角色均采用 2026-11-04 已确认造型，小八保留圆颊 r1，吉伊与乌萨奇采用同日独立评审确认的细化稿。收藏提示在添加后播放一次，取消收藏不播放庆祝。复制文件由根目录 `npm run sync:artwork` 同步，
`npm run check:artwork` 检查一致性。`components/BookmarkMark.tsx` 同样从书签路径派生，
让实际按钮中的原生 SVG 继承文字颜色，不单独维护另一份图标几何。

博客不额外保存书签 SVG、翻页或加载失败素材及未使用的静态/动效版本；文档站仍保留完整十四份静态与动效下载。`npm run sync:artwork` 会先生成当前人物成品，再同步本目录的 peek、author、六份场景 SVG 与相关组件，避免人物源和派生副本分叉。

首页欢迎场景使用 `little-days/friends-welcome.svg`，由既有角色与场景派生。
`components/FriendsWelcome.tsx` 是文档完整示例的同步副本，仅将资源导入改为博客的相对路径。
暂停、继续、重播、离屏、后台与减少动效逻辑共用同一源；博客外围云和草通过运行状态同步停止。
