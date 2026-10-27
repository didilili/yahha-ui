# Chiikawa 和朋友们 · 视觉候选

用户已确认先制作可见的视觉方案，再决定是否替换全站。本目录只承担本轮评审：角色成为首页主角、环境延续到文档、SVG 图案共用一套轮廓。当前正式站点及公共组件外观保持原样；这不是已完成的全组件视觉升级。

## 查看

在组件库根目录运行现有的 `npm run dev`，然后打开：

- 首页：`http://127.0.0.1:4175/friends.html`
- Button 文档：`http://127.0.0.1:4175/friends.html?view=components`
- SVG 图案：`http://127.0.0.1:4175/friends.html?view=artwork`
- 人物重绘与表情对照：`http://127.0.0.1:4175/friends.html?view=characters`
- 同视口对照：`http://127.0.0.1:4175/friends.html?view=compare`

独立 HTML 入口为 `playground/friends.html`。它未加入正式站点导航或默认 `build:demo` 输入，不修改现有默认页面。对照页两侧使用同一个 1440px 或 390px 布局宽度，在容器内等比缩放；各自可滚动操作。左侧读取当前正式文档，右侧读取候选，因此左侧会随后续正式站点变动，不是冻结的历史版本。

## 文件责任与边界

- `FriendsPreview.tsx`：首页、素材查看、对照页、候选导航。
- `FriendsDocs.tsx`：代表性 Button 文档与真实示例；展示源码从同一文件读取。
- `CharacterStudy.tsx`：同画幅场景、完整头脸轮廓、等比例五官放大、九种表情、72px 预览与 SVG 下载。v4 扁脸改动已被用户否决并撤回，当前恢复 v3；默认左侧为已撤回 v4，右侧为已恢复 v3，历史保留 v3 / v2 / v1。恢复旧稿不代表圆润问题已解决，本轮暂停继续改造型。旧图仅作真实记录，不作为采用方案。
- `Motif.tsx`：候选页面私有的小型矢量装饰，不作为公共组件导出。
- `friends-preview.css` / `friends-docs.css`：候选布局与环境样式，不覆盖公共组件内部结构或注入尺寸 token。
- `../examples/scenes/artwork/friends-preview/`：三组手工 SVG 候选和素材说明，不进入默认库产物。

公共交互复用现有 Button、IconButton、Badge、TextField、Select、Checkbox；原有尺寸规则与 API 不变。装饰图使用空 alt 或 aria-hidden；首页主场景提供描述。减少动效时不播放入场动画。小站名字、收藏和表单示例均只保存在当前页面内存。

## 设计依据

本轮参考页面实际观察：

- [Chiikawa 动画官网](https://www.anime-chiikawa.jp/)：角色与草地、树丛和日常道具延续到内容区。
- [Chiikawa Pocket](https://jp.chiikawa-pocket.com/ja/)：朋友共同活动的场景；手机单独构图。
- [Animal Island UI](https://guokaigdg.github.io/animal-island-ui/)：组件文档延续环境与形状，示例区清楚展示控件。
- [Sanrio](https://www.sanrio.co.jp/) 与 [Kirby](https://www.kirby.jp/)：群像关系与重复出现的世界符号。

天空、草地、探头角色与搭站情节是本库的候选推导，不代表上述站点的官方规范。未复制或下载它们的图片。

## 评审重点

1. 不读名称时，首屏是否已表达“Chiikawa 和朋友们”。
2. 桌面与手机是否都保留角色主视觉，正文是否清楚。
3. 进入文档后是否仍属于同一个世界，同时便于找示例和 API。
4. SVG 的比例、表情、线条与道具是否值得继续细化。

尚未调整全组件造型、重写正式设计约束或发布素材接口。确定这一轮视觉方向后，才将确认的规则迁入正式设计语言并逐组件落地。
