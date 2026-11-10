# 可运行示例

本目录保存文档站的可运行示例。预览与“展开代码”引用同一个 TSX，不另维护展示专用副本。

`forms/` 与 `new-forms/` 是沿用的历史目录名，现有基础例与新增任务共同维护；它们不表示公开 API 的新旧或稳定性。按文档页面的实际 import 定位源码，无需为分类搬迁文件。

`foundations/`、`content/`、`navigation/`、`feedback/`、`floating/` 按用途组织；`scenes/` 放跨组件组合，`design/` 展示默认设计规则，`customization/` 说明公开定制能力。

复制方式见[集中接入说明](https://yahhaui.com/#/guides/getting-started?section=copy-example)。入门首例直接保存为 `App.tsx`，其他示例原样保存为 `Example.tsx`，由项目引入或使用指南中的入口。入口加载 `yahha-ui/style.css`，并按示例是否自带 `ThemeProvider` 选择对应模板。含素材时按「示例素材」清单标注的相对路径保存文件，保留原名和相对导入。

示例与 API 修改遵循[组件文档规范](../../../docs/documentation.md)；默认设计约束见 [design 说明](./design/README.md)，素材来源见 [artwork 说明](./scenes/artwork/README.md)。生成的 `docs/components/` Markdown 由同一页面模型同步，不另写一份。
