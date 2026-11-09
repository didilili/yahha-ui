# 场景预览截图

这些 PNG 来自当前文档站的真实 `.example-preview`，不是独立插画或可运行示例。场景变更后，在开发服务器运行期间执行：

```sh
node scripts/capture-recipe-previews.mjs
```

也可传入文档站地址作为第一个参数。脚本使用独立 Chromium、浅色、减少动效和 1494 × 1600 视口，输出统一的 960 × 600 PNG。仅为截图设置画布和取景，不修改示例源码、组件样式、文字或数据，也不截取文档顶栏与代码操作区。

阅读场景通过公开开关隐藏可选配图，从文章正文起取景；加载场景通过实际操作切换到失败状态，展示恢复入口。短场景在画布中居中，长归档场景展示搜索、分类和文章列表开头。

| 文件 | 文档路由 |
| --- | --- |
| reading.png | `#/guides/reading?section=reading-example` |
| archive.png | `#/guides/states?section=scene-blog-archive` |
| editing.png | `#/guides/states?section=scene-article-actions` |
| loading.png | `#/guides/states?section=scene-loading`（加载失败与重试） |
| empty.png | `#/guides/states?section=scene-empty`（默认首次没有内容） |
| not-found.png | `#/guides/states?section=scene-not-found` |
