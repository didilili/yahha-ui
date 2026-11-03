# 独立博客素材快照

本目录是导出博客时保留的素材快照，包含现有图片、SVG、字体样式与 WOFF2 分片。运行和构建本项目直接使用这些文件，无需生成素材，也不依赖源仓库。

## 修改自己的素材

可以直接修改或替换本项目 `src/assets/` 中的图片和 SVG，通过[图片映射](../assets.ts)调整导入；同时核对使用处的替代文字、图片说明和裁切方式。欢迎场景与状态图案由 `src/components/` 和页面组合引用，替换时保留它们实际需要的文件与相对路径。

`fonts/` 保留导出时的 `Marker`、`WenKai` 字体、CSS 与分片清单。现有分片提供完整字符覆盖，新增正文或用户输入会按字体 CSS 的 `unicode-range` 加载本地文件。替换字体时同步修改字体 CSS、导入和相应许可声明。

修改后，在项目根目录运行 `npm run build` 完成类型检查和静态构建，再运行 `npm run preview` 查看自己的博客。运行 `npm run docs` 可阅读配套组件与素材指南；配套文档是独立快照，不会随应用资源的修改而更新。

## 从源仓库更新

原稿、跨站同步与字体生成工具保留在 Yahha UI 源仓库，本项目不包含这套维护工具链。需要更新共享素材或重新生成字体时，先在源仓库完成维护并核对，再重新导出到新目录。导出不会覆盖非空目录；将新快照与本项目比较后合并，保留自己的文章、站点资料和资源改动。

## 许可与字体声明

项目自有内容采用 [MIT 许可证](../../LICENSE)，第三方内容见[第三方说明](../../THIRD_PARTY_NOTICES.md)。

两种字体分别保留 [Marker 的 OFL 声明](OFL-marker.txt)和 [WenKai 的 OFL 声明](OFL-wenkai.txt)。博客构建自动将声明写入 `dist/notices/OFL-marker.txt` 与 `dist/notices/OFL-wenkai.txt`；部署时保留这些文件。配套文档的字体声明位于 `documentation/notices/`，其博客预览另保留在 `documentation/blog/notices/`。

现有角色展示为非官方同人素材。
