# 小小日常 · 独立博客示例

这是从 Yahha UI 仓库导出的完整博客源码，使用配套的 `yahha-ui` {{VERSION}} 本地安装包。需要 Node.js {{NODE}}，可在本目录独立安装和运行。

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
- `starter-manifest.json`：组件包与工具版本记录。

## 构建与部署

```sh
npm run build
npm run preview
```

构建包括类型检查。部署时只上传本项目 `dist/` **里面的内容**，保留 `assets/` 和 `notices/` 的目录与文件名。使用 HTTP/HTTPS 访问，首页为 `#/`，归档为 `#/archive`；相对资源路径和 hash 路由支持静态子目录。

更新组件时，可从对应版本的 Yahha UI 仓库重新导出到新目录，再合并自己的文章、站点资料与资源改动。

本项目按当前 React 19 浏览器环境准备，React 18 与 SSR 尚未验证。项目自有内容采用 [MIT 许可证](LICENSE)，第三方内容见[第三方说明](THIRD_PARTY_NOTICES.md)。字体 OFL 声明位于 `src/assets/OFL-*.txt`，构建后写入 `dist/notices/`。
