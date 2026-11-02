# 小小日常 · 独立博客示例

这是从 Yahha UI 仓库导出的完整博客源码，使用配套的 `yahha-ui` {{VERSION}} 真实本地安装包。需要 Node.js {{NODE}}。导出项目独立安装依赖，不依赖原仓库源码或源码 alias；原仓库里的 `examples/blog/` 仍复用根工具链。

## 阅读组件文档

无需安装依赖，在本目录运行：

```sh
npm run docs
```

打开终端显示的本地地址，查看完整组件 API、指南、示例代码与素材下载。“示例网站”指向同一快照中的博客预览，不是你正在修改的源码。配套文档保存在 `documentation/`，应通过 HTTP 地址访问。按 Ctrl+C 停止服务。

## 运行自己的博客

```sh
npm install
npm run dev
```

首次安装依赖需要网络。打开终端显示的地址，体验首页、归档、搜索、分页、收藏和文章阅读。所有文章均为虚构示例，收藏保存在当前浏览器，不连接后台。

## 改成自己的内容

- [站点资料](src/data/site.ts)：站名、副标题、作者姓名和简介。
- [文章数据](src/data/posts.ts)：标题、摘要、分类、日期、标签与正文；保留唯一文章 id 和章节 id。
- [首页](src/pages/HomePage.tsx)：首页介绍和分类入口；新增分类时同时核对 [归档选项](src/pages/ArchivePage.tsx)与[路由校验](src/router.ts)。
- [静态页面头部](index.html)：同步更新初始 title、description 和 favicon。
- [图片映射](src/assets.ts)：替换配图，并核对 [文章图片说明](src/pages/ArticlePage.tsx)。素材与字体声明见 [assets/README.md](src/assets/README.md)。
- `vendor/`：本项目实际安装的组件 `.tgz`，保留相对路径即可移动整个项目。
- `starter-manifest.json`：导出类型、组件版本、安装包 SHA-256 和工具版本。

## 构建与部署

```sh
npm run build
npm run preview
```

构建包括类型检查。部署时只上传本项目 `dist/` **里面的内容**，保留 `assets/` 和 `notices/` 的目录与文件名。使用 HTTP/HTTPS 访问，首页为 `#/`，归档为 `#/archive`；相对资源路径和 hash 路由支持静态子目录。不要上传 `src/`、`node_modules/`、`vendor/` 或配套 `documentation/`。

自己的构建只更新博客，不更新文档快照。若需更新组件与文档，请从对应版本的组件库重新导出，并自行保留已修改的文章和站点资料；导出命令拒绝覆盖非空目录。

本项目按当前 React 19 浏览器环境准备，React 18 与 SSR 尚未验证。角色、字体和图片保持原有文件。组件代码的最终许可证尚未确定，角色展示素材的再发布与商业使用许可尚未核验；字体 OFL 声明仅适用于相应字体，保存在配套文档与博客各自的 `notices/`。
