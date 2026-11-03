# 你好，Yahha UI

这是包含真实 `yahha-ui` {{VERSION}} 本地安装包的最小 React / Vite / TypeScript 项目，附当前版本的静态文档与博客预览。无需获取组件库源码。需要 Node.js {{NODE}}，首次安装项目依赖需要网络。

## 先查看配套文档

解压后进入本目录，无需安装依赖即可运行：

```sh
npm run docs
```

打开终端显示的本地地址，按组件查阅 API、操作示例、复制代码和下载素材；“示例网站”也在本地打开。文档快照位于 `documentation/`，保留其目录和文件名。请通过此命令的 HTTP 地址访问，不直接双击 HTML。按 Ctrl+C 停止文档服务。

## 运行

解压后进入含有本文件和 `package.json` 的目录，运行：

```sh
npm install
npm run dev
```

打开终端输出的本地地址。修改“手记标题”会更新文字；点击或用键盘 Space 操作“收藏这篇手记”，可以切换选中状态。标题与收藏只在本页保留，刷新后恢复。

检查类型并构建静态页面：

```sh
npm run build
npm run preview
```

## 从这里修改

- `src/App.tsx`：组件导入、一次 CSS 导入、`ThemeProvider` 和两个交互。
- `src/styles.css`：页面布局，字体继承系统字体，不覆盖组件内部样式。
- `vendor/`：本项目实际安装的 `.tgz`，保留相对路径即可移动整个项目。
- `documentation/`：配套文档、API、素材和博客的静态快照；运行自己的页面不依赖它。
- `starter-manifest.json`：组件版本、tarball 的 SHA-256，以及从组件库根 package.json / lockfile 读取的工具版本。

已有项目只需安装 `vendor/` 内的 `.tgz`，在自己的应用入口导入 `yahha-ui/style.css`，并用 `ThemeProvider theme="pink"` 包住组件区域。无需复制本项目的 Vite 配置或全部页面。

## 部署自己的页面

运行 `npm run build` 后，将本项目 `dist/` **里面的内容**上传到静态托管目录，保留 `assets/` 的目录与文件名。使用 HTTP/HTTPS 访问；不要把整个源码目录、`vendor/` 或配套 `documentation/` 当作自己页面的部署文件。页面使用相对资源路径，放入静态站点子目录时保留结构即可。

构建会把项目的 `LICENSE` 与 `THIRD_PARTY_NOTICES.md` 写入 `dist/notices/`，部署时一并保留。

若要更新配套文档，应从相同版本的组件库重新导出项目；自己的 `npm run build` 只构建页面，不会更新 `documentation/`。

本项目按当前 React 19 浏览器环境准备，React 18、SSR 与其他构建工具尚未验证。示例页面和组件包不含角色图片或站点字体，也没有后台服务；配套文档快照包含官网与示例博客使用的展示素材。

项目自有内容采用 [MIT 许可证](LICENSE)，第三方内容见[第三方说明](THIRD_PARTY_NOTICES.md)。配套文档的字体 OFL 声明位于 `documentation/notices/` 与 `documentation/blog/notices/`。
