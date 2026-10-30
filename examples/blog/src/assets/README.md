# 示例网站素材

本目录为现有素材的原样副本，方便网站源码在独立安装包验收中使用；未重新绘制人物或改变角色比例。

- `peek.svg`、`author.svg` 来自仓库 `playground/src/examples/scenes/artwork/friends-preview/` 的当前版本；`author.svg` 对应 `portraits/chiikawa-smile.svg`，由 `npm run sync:artwork` 同步，`npm run check:artwork` 核对副本一致。
- `reading.png`、`rest.png`、`lounge.png` 来自 `playground/src/assets/`。
- `marker.woff2`、`wenkai.woff2` 及对应 `OFL-*.txt` 来自 `playground/src/assets/`，原字体声明保持。

字体、代码与角色图像的许可分别记录。现有图像为非官方同人素材；再发布与商业使用许可尚未核验。素材只用于示例网站，不进入组件库 `dist/` 或默认安装包。

`little-days/` 是新绘制的生活道具 SVG，源文件集中在
`playground/src/examples/scenes/artwork/little-days/`。书签、静态热茶和空收藏口袋分别用于
收藏操作、首页章节和空收藏页面；第二批搜索空结果、收藏成功与 404 也从同一源同步。
404 使用原 v3 人物组，收藏提示在添加后播放一次，取消收藏不播放庆祝。复制文件由根目录 `npm run sync:artwork` 同步，
`npm run check:artwork` 检查一致性。`components/BookmarkMark.tsx` 同样从书签路径派生，
让实际按钮中的原生 SVG 继承文字颜色，不单独维护另一份图标几何。

首页欢迎场景使用 `little-days/friends-welcome.svg`，由既有角色与场景派生。
`components/FriendsWelcome.tsx` 是文档完整示例的同步副本，仅将资源导入改为博客的相对路径。
暂停、继续、重播、离屏、后台与减少动效逻辑共用同一源；博客外围云和草通过运行状态同步停止。
