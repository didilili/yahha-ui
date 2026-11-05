# Yahha UI

**一起做，全宇宙最可爱的 UI 组件库。**

Yahha UI 是一套漫画手账风 React 组件库，面向博客、个人主页与内容网站。

组件采用暖墨轮廓、白纸内容面、粉色强调与浅蓝纸边，提供交互示例、API 和可复制的网站组合。

[开始使用](#构建与本地安装) · [组件文档](https://github.com/didilili/yahha-ui/blob/main/docs/README.md) · [完整博客示例](https://github.com/didilili/yahha-ui/tree/main/examples/blog) · [设计语言](https://github.com/didilili/yahha-ui/blob/main/docs/design-language.md) · [问题反馈](https://github.com/didilili/yahha-ui/issues) · [变更记录](https://github.com/didilili/yahha-ui/blob/main/CHANGELOG.md)

**v0.0.1 · 早期预览** · React / React DOM `^19.3.1` · 29 个 UI 组件与 ThemeProvider · 当前通过本地安装包试用，尚未发布 npm

## 把可爱，搭进你的世界

站点以 **Yahha 星球** 组织首页与示例场景；基础组件可独立使用，不依赖角色图案。

- **为内容网站准备**：阅读、分类、搜索、收藏与轻量表单可以组合成完整小站。[博客示例](examples/blog/README.md)提供库米的首页、手记归档与文章详情。
- **每次操作，都好好回应**：组件继承使用方字体，提供清晰的焦点、选中与加载状态；键盘、表单和减少动效的用法见各组件文档。
- **按需加入小场景**：静态 SVG、状态动效和可暂停的欢迎场景独立提供。基础组件不依赖角色图片，组件安装包不包含网站、字体或场景素材。

## 构建与本地安装

已有 React 项目时，安装本地组件包，再导入样式和主题。没有项目可直接[导出最小项目](#导出最小项目)。

当前要求 React / React DOM `^19.3.1`、Node.js ≥22.22.3，以及支持 CSS 导入的 React 构建工具。

**1. 获取源码并生成安装包**（已有 `.tgz` 时跳到第 2 步）：

```sh
git clone https://github.com/didilili/yahha-ui.git
cd yahha-ui
npm ci
npm run build:lib
npm pack
```

**2. 切换到自己的 React 项目安装**，替换成刚生成文件的实际位置：

```sh
npm install /absolute/path/yahha-ui-0.0.1.tgz
```

**3. 在自己的项目中保存 `App.tsx`**，由现有应用入口渲染：

```tsx
import { useState } from 'react';
import { Button, ThemeProvider } from 'yahha-ui';
import 'yahha-ui/style.css';

export default function App() {
  const [saved, setSaved] = useState(false);

  return (
    <ThemeProvider theme="pink">
      <Button aria-pressed={saved} onClick={() => setSaved(!saved)}>
        收藏这篇文章
      </Button>
    </ThemeProvider>
  );
}
```

启动应用后，点击或按 Space 即可切换按钮的收藏状态。

样式在应用入口导入一次；`ThemeProvider` 的 `theme` 必填，可选 `pink`、`blue`、`yellow`。更多用法见[组件文档](docs/README.md)与[主题配置](docs/components/theme.md)。

## 导出最小项目

没有现成项目时，在已获取源码并安装依赖的组件库目录中运行：

```sh
npm run create:starter
```

项目生成在组件库旁的 `yahha-ui-starter/`。进入终端输出的项目目录，安装依赖并启动：

```sh
npm install
npm run dev
```

默认只生成包含本地组件包的项目目录。完整博客可运行 `npm run create:starter -- --example blog`；离线文档、ZIP 和指定输出位置等选项见[导出说明](CONTRIBUTING.md#导出最小接入项目)。生成项目的 README 提供后续运行与部署方法。

## 浏览组件

组件总览按通用、排版、布局、表单、内容展示、导航、浮层和反馈分类；主题配置单列。进入组件文档后，可操作示例、复制代码并查阅 API。

[查阅组件示例与 API](docs/README.md) · [查看设计规则和尺寸规范](docs/design-language.md)

## 让 AI 使用 Yahha UI

可以把下面的说明连同页面需求发送给 AI 编程工具：

```text
请用 Yahha UI 为我的 React 项目实现【页面需求】。
先阅读 https://github.com/didilili/yahha-ui/blob/main/README.md，按当前安装方式接入组件包。
组件 API 与示例从 https://github.com/didilili/yahha-ui/blob/main/docs/README.md 查阅。
在应用入口导入 yahha-ui/style.css，并使用 ThemeProvider theme="pink" 包裹组件区域。
使用库已有组件和公开 API 实现页面，布局、内容和业务状态放在我的项目中。
```

## 问题反馈

遇到安装、样式或交互问题，可[提交 GitHub Issue](https://github.com/didilili/yahha-ui/issues/new?template=bug_report.yml)，附上组件版本、React 与构建工具、重现步骤及预期和实际结果。

## 本地开发

在本仓库完成 `npm ci` 后，可以分别运行文档站和博客：

```sh
npm run dev
```

打开终端输出的文档站地址，可浏览组件、入门指南和组合示例。

```sh
npm run dev:blog
```

打开终端输出的博客地址，体验搜索、分类、分页、收藏与阅读返回。示例文章为虚构内容，收藏保存在当前浏览器。

[博客运行与改站说明](examples/blog/README.md)

## 构建与静态部署

```sh
npm run build:demo
npm run build:blog
```

文档站输出至 `demo-dist/`，博客输出至 `examples/blog/dist/`。完整步骤见[部署说明](docs/deployment.md)。

当前尚未提供线上预览地址，可先在本地浏览。

## 当前能力与边界

- 组件以 ESM、类型声明和独立 CSS 入口分发，React / React DOM 由使用方提供。组件安装包不含网站、字体或独立场景素材。
- 当前验证范围是 React 19 浏览器应用。React 18、SSR 和其他构建工具兼容性尚未验证。
- 具体组件能力、状态管理与键盘操作以[组件文档](docs/README.md)为准。含素材示例在 Vite 8 / TypeScript 7 下验证，复制方式见文档站“完整接入”。

## 素材与范围

项目自有内容采用 [MIT 许可证](LICENSE)，第三方内容见[第三方说明](THIRD_PARTY_NOTICES.md)。

[素材与分发范围](docs/assets-and-distribution.md)汇总实际目录、原始记录、派生关系与分发位置。[图标与插画](playground/src/examples/scenes/artwork/little-days/README.md)说明静态、动效及欢迎控制器的使用区别。

## 仓库目录

```text
src/             组件、公开类型与主题
playground/      文档站、交互示例及展示素材
examples/blog/   完整博客示例，共用根工具链
docs/            使用与维护说明、生成的组件 Markdown
scripts/         构建、资源同步、验收与项目导出
tests/           工程脚本、浏览器和真实安装包验收
```

## 参与开发

源码目录、文档维护、测试和 Git hooks 见[协作说明](CONTRIBUTING.md)；[AGENTS.md](AGENTS.md)记录仓库协作约定。
