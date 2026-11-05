# 文档站的静态部署

本页准备本地构建、预览和静态文件整理流程。当前没有配置远程站点、域名或自动发布；现有 CI 负责检查，不包含部署步骤。组件库仍通过本地 `.tgz` 试用，站点构建与 npm 包发布分别处理。

通过 `create:starter` 导出的最小项目，按项目自带的 README 构建和部署自己的 `dist/` 即可。导出时加上 `--with-docs` 才会附带 `documentation/`，用于本地阅读配套组件文档；它与自己的网页输出分别构建。下文的文档站构建步骤供组件库仓库维护者使用。

## 构建文档站

在仓库根目录使用 Node.js ≥22.22.3、npm 10.9.8，首次运行先安装依赖：

```sh
npm ci
npm run build:demo
```

文档站构建会自动输出 `notices/LICENSE`、`notices/THIRD_PARTY_NOTICES.md`、`notices/OFL-marker.txt` 与 `notices/OFL-wenkai.txt`。整理部署文件时保留 `notices/` 和 `assets/`，无需手工拼接许可文本。

文档站使用仓库内生成的本地字体分片，按页面实际用字加载；构建不下载外部字体，也不需要 Python 或 uv。更新字体源或重新生成分片的方法见[字体维护](assets-and-distribution.md#字体维护)。

- `demo-dist/`：文档站，包含首页、组件总览、使用指南、实时示例与 API。
- `dist/`：组件库代码、声明和样式，供安装包使用，不是网站入口。

文档站的 [Vite 配置](../vite.config.ts) 使用 `base: './'`，页面使用 hash 路由；资源 URL 相对于 `index.html`，支持静态站点的子目录部署。

## 本地预览

在仓库根目录执行：

```sh
npm run preview
```

打开终端显示的地址，追加 `#/components` 或 `#/guides/getting-started`。该命令默认本机端口为 `4176`，读取 `demo-dist/`。预览命令使用严格端口；端口占用时会报错，不会自动切换。

## 静态托管

将 `demo-dist/` 的**内容**作为静态站点的根目录，保留生成的目录和文件名：

```text
静态根目录/
├── index.html
├── assets/
└── notices/
```

使用 HTTP/HTTPS 预览与访问。如果托管服务在外层增加项目目录，保留这层结构即可，例如 `/项目目录/#/components`。目录地址中的 `/` 应保留在 `#` 之前。

## 核对部署内容与路由

文档站的既有浏览器验收会在 `/docs-preview/` 子目录运行。命令见[协作说明](../CONTRIBUTING.md#验证)：

```sh
npm run test:docs
```

整理或更换托管目录后，核对首页与直接打开的 hash 路由、刷新、组件示例和素材下载。子目录中的 JS、CSS、字体与图片都应由 `assets/` 正常加载；不能把原始源码路径当作线上资源地址。

部署文件取自 `demo-dist/`。不要把仓库根目录整体当作网站输出；`src/`、`node_modules/`、本地 `.tgz` 和测试均不属于文档站的部署内容。

项目自有内容采用 [MIT](../LICENSE)，第三方内容见[第三方说明](../THIRD_PARTY_NOTICES.md)。素材来源与产物范围见[素材与分发说明](assets-and-distribution.md)。
