# 组件文档

组件从 `chiikawa-ui` 导入，样式从 `chiikawa-ui/style.css` 导入。建议在应用入口加载一次样式，并用 `ThemeProvider` 包住需要主题的区域。每页示例均包含完整导入，可以作为独立组件复制使用。

- [Button / IconButton](components/button.md)：文字按钮、图标按钮、加载状态。
- [TextField](components/text-field.md)：标签、提示、错误与原生输入属性。
- [SegmentedControl](components/segmented-control.md)：受控单选组与表单提交。
- [Dialog](components/dialog.md)：受控弹窗、焦点和 Portal。
- [EmptyState](components/empty-state.md)：空内容与操作插槽。
- [Toast](components/toast.md)：由调用方管理显示状态的提示消息。
- [Badge](components/badge.md)：行内状态标记。
- [Surface](components/surface.md)：内容容器。
- [ThemeProvider](components/theme.md)：角色主题与语义颜色覆盖。

组件以原生元素为基础；各页说明原生属性、`ref`、`className` 的实际作用位置。除文档列出的入口外，不依赖内部 CSS Modules 类名或 DOM 嵌套层级。

安装和构建见[项目 README](../README.md)，目录与验证约定见[协作说明](../CONTRIBUTING.md)。当前验证范围为 React 19 浏览器项目，React 18 与 SSR 尚未验证。
