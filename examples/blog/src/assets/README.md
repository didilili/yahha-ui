# 示例网站素材

本目录保存网站独立运行与安装包验收所需的素材副本。以下同步命令均在 Yahha UI 源仓库根目录运行；导出的独立博客使用单独的资源快照说明，不携带这套维护工具。SVG 成品按实际引用精简定义，不改变角色比例。

- `peek.svg` 来自仓库 `playground/src/examples/scenes/artwork/friends-preview/friends-peek.svg`，作为博客独立副本保留；由 `npm run sync:artwork` 自动同步，`npm run check:artwork` 核对副本一致。
- `author.svg` 对应当前 `friends-preview/portraits/chiikawa-smile.svg`，由 `npm run sync:artwork` 自动同步，`npm run check:artwork` 核对副本一致。
- `reading.png`、`rest.png`、`lounge.png` 是博客直接维护的插图，没有自动生成流程。原 playground 副本的清理记录可从 `git show 995dd82^:playground/src/assets/reading.png` 查询；不需要仓库外的本机归档。
- `fonts/` 是 `playground/src/assets/fonts/` 的同步副本，包含 `manifest.json`、`marker.css`、`wenkai.css` 及两种字体的 WOFF2 分片；对应 `OFL-*.txt` 声明保留在本目录。通过根目录 `npm run sync:fonts` 同步，`npm run check:fonts` 核对覆盖、哈希和副本一致性，不单独编辑生成文件。

字体族名为 `Marker`、`WenKai`，使用官方 Regular 字体源的完整字符覆盖。两站现有源码用字集中在 `common` 首包，其余字符按每片最多 512 个码点生成 `unicode-range`，新增用字与用户输入按需加载对应的本地分片。日常安装和构建无需 Python 或 uv；重新生成入口为根目录 `npm run fonts:generate`，可选下载缓存等维护方法见[字体维护](../../../../docs/assets-and-distribution.md#字体维护)。博客构建会自动将现有声明写入 `dist/notices/OFL-marker.txt` 与 `dist/notices/OFL-wenkai.txt`。

项目自有内容采用 [MIT](../../../../LICENSE)，第三方字体和角色相关权利见[第三方说明](../../../../THIRD_PARTY_NOTICES.md)。现有角色图像为非官方同人素材，MIT 不授予第三方角色权利。素材用于示例网站，不进入组件库 `dist/` 或默认安装包。

`little-days/` 仅保存当前实际导入的六份 SVG：`tea-cup.svg`、`empty-collection.svg`、`search-empty.svg`、`collection-saved-motion.svg`、`friends-lost.svg` 和 `friends-welcome.svg`。道具源文件集中在
`playground/src/examples/scenes/artwork/little-days/`，找路与欢迎场景另复用当前朋友模型。静态热茶和空收藏口袋分别用于首页章节和空收藏页面，搜索空结果与收藏成功也从同一源同步。
404 使用原 v3 人物组，收藏提示在添加后播放一次，取消收藏不播放庆祝。复制文件由根目录 `npm run sync:artwork` 同步，
`npm run check:artwork` 检查一致性。`components/BookmarkMark.tsx` 同样从书签路径派生，
让实际按钮中的原生 SVG 继承文字颜色，不单独维护另一份图标几何。

博客不额外保存书签 SVG、翻页或加载失败素材及未使用的静态/动效版本；文档站仍保留完整十四份静态与动效下载。`npm run sync:artwork` 会先生成当前人物成品，再同步本目录的 peek、author、六份场景 SVG 与相关组件，避免人物源和派生副本分叉。

首页欢迎场景使用 `little-days/friends-welcome.svg`，由既有角色与场景派生。
`components/FriendsWelcome.tsx` 是文档完整示例的同步副本，仅将资源导入改为博客的相对路径。
暂停、继续、重播、离屏、后台与减少动效逻辑共用同一源；博客外围云和草通过运行状态同步停止。
