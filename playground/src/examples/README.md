# 可运行示例

本目录保存文档站的可运行示例。预览与“展开代码”引用同一个 TSX，不另维护展示专用副本。

`forms/` 与 `new-forms/` 是沿用的历史目录名，现有基础例与新增任务共同维护；它们不表示公开 API 的新旧或稳定性。按文档页面的实际 import 定位源码，无需为分类搬迁文件。

`foundations/`、`content/`、`navigation/`、`feedback/`、`floating/` 按用途组织；`scenes/` 放跨组件组合，`design/` 展示默认设计规则，`customization/` 说明公开定制能力。

完整接入以文档提供的原样 `Example.tsx` 和独立 `App.tsx` 为准：入口加载 `yahha-ui/style.css`；显式主题示例保留自己的 `ThemeProvider`，其他例由入口包裹。含素材时按清单下载到 `artwork/`，保留原名和相对导入。

示例与 API 修改遵循[组件文档规范](../../../docs/documentation.md)；默认设计约束见 [design 说明](./design/README.md)，素材来源见 [artwork 说明](./scenes/artwork/README.md)。生成的 `docs/components/` Markdown 由同一页面模型同步，不另写一份。
