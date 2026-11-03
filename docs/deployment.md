# 文档站与博客的静态部署

本页准备本地构建、预览和静态文件整理流程。当前没有配置远程站点、域名或自动发布；现有 CI 负责检查，不包含部署步骤。组件库仍通过本地 `.tgz` 试用，站点构建与 npm 包发布分别处理。

通过 `create:starter` 导出的最小项目或独立博客，请按项目自带的 README 构建和部署自己的 `dist/`。其中的 `documentation/` 只用于本地阅读配套文档，不是自己的网页输出。下文的两份官网构建步骤供组件库仓库维护者使用。

## 构建两份网站

在仓库根目录使用 Node.js ≥22.22.3、npm 10.9.8，首次运行先安装依赖：

```sh
npm ci
npm run build:demo
npm run build:blog
```

两份网站构建会自动输出 `notices/LICENSE`、`notices/THIRD_PARTY_NOTICES.md`、`notices/OFL-marker.txt` 与 `notices/OFL-wenkai.txt`。整理部署文件时保留 `notices/` 和 `assets/`，无需手工拼接许可文本。

两份网站使用仓库内生成的本地字体分片，按页面实际用字加载；构建不下载外部字体，也不需要 Python 或 uv。更新字体源或重新生成分片的方法见[字体维护](assets-and-distribution.md#字体维护)。

- `demo-dist/`：文档站，包含首页、组件总览、使用指南、实时示例与 API。
- `examples/blog/dist/`：完整的“小小日常”示例网站，包含首页、归档、文章与配套资源。
- `dist/`：组件库代码、声明和样式，供安装包使用，不是网站入口。

两份网站的 Vite 配置均使用 `base: './'`，页面使用 hash 路由；资源 URL 相对于各自的 `index.html`。配置见[文档站](../vite.config.ts)与[博客](../examples/blog/vite.config.ts)。

## 官网中的博客入口

文档站顶部「示例网站」、手机目录、首页「体验小小日常」及完整博客说明中的体验链接共用同一个地址，在新标签页打开博客。

- 本地开发：文档站默认指向 `http://127.0.0.1:4186/`，需同时运行 `npm run dev:blog`。
- 构建产物：默认指向文档站所在目录下的 `./blog/`，配合下文的同目录部署方式，外层增加项目目录时也适用。
- 分别托管：在构建文档站时通过 `VITE_BLOG_URL` 指定博客地址，也可以使用其他相对路径。

```sh
VITE_BLOG_URL=https://example.com/my-blog/ npm run build:demo
```

该配置在启动开发服务或构建时读取；修改后需重启开发服务或重新构建。单独运行文档站构建预览不会同时提供博客文件，需组合两份构建产物，或构建时将地址设置为已启动的博客预览地址。

## 分别预览或托管

文档站在仓库根目录执行：

```sh
npm run preview
```

打开终端显示的地址，追加 `#/components` 或 `#/guides/getting-started`。该命令默认本机端口为 `4176`，读取 `demo-dist/`。

博客在另一个终端执行：

```sh
npm run preview:blog
```

打开终端显示的地址，追加 `#/archive` 或 `#/posts/river-evening`。该命令默认本机端口为 `4187`，读取 `examples/blog/dist/`。预览命令使用严格端口；端口占用时会报错，不会自动切换。

分别托管时，将上述两个构建目录各自的**内容**作为对应静态站点的根目录。使用 HTTP/HTTPS 预览与访问，保留生成的 `assets/` 目录和文件名。

## 放在同一个静态目录

可以将文档站放在静态根目录，博客放在它的 `blog/` 子目录。两个网站的 `assets/` 分别保留，不能混在同一层：

```text
静态根目录/
├── index.html          # 来自 demo-dist/
├── assets/             # 文档站资源
├── notices/            # 文档站字体声明
└── blog/
    ├── index.html      # 来自 examples/blog/dist/
    ├── assets/         # 博客资源
    └── notices/        # 博客字体声明
```

完成构建后，以下命令在系统临时目录整理副本，不改动源码和两份构建产物：

```sh
site_output="$(mktemp -d /tmp/yahha-site.XXXXXX)"
mkdir "$site_output/blog"
cp -R demo-dist/. "$site_output/"
cp -R examples/blog/dist/. "$site_output/blog/"
npm exec -- vite preview --outDir "$site_output" --host 127.0.0.1 --port 4190 --strictPort
```

打开该命令输出的地址：文档站位于根目录，博客位于 `blog/`。如果托管服务还在外层增加项目目录，保留这层结构即可，例如文档路径 `/项目目录/#/components`、博客路径 `/项目目录/blog/#/archive`。目录地址中的 `/` 应保留在 `#` 之前。

该临时目录只是两份静态输出的组合，不是新项目。文档站的博客入口默认指向其中的 `blog/`，博客不额外加入返回文档站的导航。最终托管时使用的是这个目录的内容，包括两层各自的 `notices/`；本步骤不会上传文件或启用 GitHub Pages。

## 核对部署内容与路由

文档站的既有浏览器验收会在 `/docs-preview/` 子目录运行；博客验收会把同份网站源码复制到临时应用、实际安装 `.tgz`，再在 `/examples/blog/` 子目录运行。命令见[协作说明](../CONTRIBUTING.md#验证)：

```sh
npm run test:docs
npm run test:blog
```

整理或更换托管目录后，核对首页与直接打开的 hash 路由、刷新、组件示例、素材下载、博客文章和返回列表。子目录中的 JS、CSS、字体与图片都应由该网站自己的 `assets/` 正常加载；不能把原始源码路径当作线上资源地址。

部署文件取自构建目录。不要把仓库根目录整体当作网站输出；`src/`、`node_modules/`、本地 `.tgz` 和测试均不属于这两份网站的部署内容。

项目自有内容采用 [MIT](../LICENSE)，第三方内容见[第三方说明](../THIRD_PARTY_NOTICES.md)。素材来源与产物范围见[素材与分发说明](assets-and-distribution.md)。
