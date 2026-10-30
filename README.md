# Yahha UI

**一起做，全宇宙最可爱的 UI 组件库。**

欢迎来到 **Yahha 星球**。朋友们在这里搭界面、写手记，也给新来的你留了个位置。

Yahha UI 是一套漫画手账风 React 组件库，适合博客、个人主页与内容网站。圆润的按钮、像纸签一样的标记，还有便笺般的弹出面板，都在这里等你动手。

[开始使用](#构建与本地安装) · [组件文档](docs/README.md) · [完整博客示例](examples/blog/README.md) · [设计语言](docs/design-language.md) · [静态部署](docs/deployment.md)

**v0.0.1 · 早期预览** · React / React DOM `^19.3.1` · 29 个 UI 组件与 ThemeProvider · 当前通过本地安装包试用，尚未发布 npm

![Yahha UI 文档站首页：一起做全宇宙最可爱的 UI 组件库](docs/images/yahha-home.png)

## 把可爱，搭进你的世界

在这颗星球上，云朵邮局会收到没有署名的信，朋友们会一起帮迷路的小星星找路，也会给晚到的伙伴留一块饼干。界面用白纸、暖墨、清亮粉色和浅蓝纸边接住这些日常；组件各有用途，故事交给你来写。

- **为内容网站准备**：阅读、分类、搜索、收藏与轻量表单可以组合成完整小站。[博客示例](examples/blog/README.md)提供库米的首页、手记归档与文章详情。
- **每次操作，都好好回应**：组件继承使用方字体，常规控件为 44px，Button / IconButton 有 36 / 44 / 52px 三档；键盘、原生表单、焦点与减少动效按实际组件能力处理。
- **按需加入小场景**：静态 SVG、状态动效和可暂停的欢迎场景独立提供。基础组件不依赖角色图片，组件安装包不包含网站、字体或场景素材。

## 浏览组件

文档站的组件总览位于 `#/components`，按八类展示现有 29 个 UI 组件，并单列 ThemeProvider 主题配置，共 30 个文档入口。小样进入对应文档后，可操作完整示例、展开代码并查阅 API；当前共 95 个同源 TSX 示例。

![组件视觉总览：真实按钮、字段、排版与容器小样](docs/images/yahha-components.png)

- **通用**：Button、IconButton。
- **排版**：Text、Heading、Link。
- **布局**：Surface、Divider。
- **表单**：TextField、Textarea、Select、Checkbox、RadioGroup、Switch、SegmentedControl。
- **内容展示**：Badge、Avatar、Image、Accordion。
- **导航**：Tabs、Pagination。
- **浮层**：DropdownMenu、Dialog、Popover、Tooltip。
- **反馈**：Alert、Toast、EmptyState、Spinner、Skeleton。
- **主题配置**：ThemeProvider。

[查阅组件示例与 API](docs/README.md) · [查看设计规则和尺寸规范](docs/design-language.md)

## 构建与本地安装

当前通过本地 `.tgz` 安装。使用方需要已有的 React / React DOM `^19.3.1` 浏览器应用，以及支持 CSS 导入的构建工具。仓库开发基线为 Node.js ≥22.22.3、npm 10.9.8。

**1. 在组件库根目录生成安装包**（已有 `.tgz` 时直接进行第 2 步）：

```sh
npm ci
npm run build:lib
npm pack
```

**2. 切换到自己的 React 项目安装**，替换成刚生成文件的实际位置：

```sh
npm install /absolute/path/yahha-ui-0.0.1.tgz
```

**3. 保存下面的 `App.tsx`**，由现有应用入口渲染：

```tsx
import { useState } from 'react';
import { Button, ThemeProvider } from 'yahha-ui';
import 'yahha-ui/style.css';

export default function App() {
  const [saved, setSaved] = useState(false);

  return (
    <ThemeProvider theme="chiikawa">
      <Button aria-pressed={saved} onClick={() => setSaved(!saved)}>
        收藏这篇文章
      </Button>
    </ThemeProvider>
  );
}
```

启动应用后，点击或用 Space 操作“收藏这篇文章”按钮，可切换收藏状态。操作名称保持稳定，选中状态通过按钮外观与 `aria-pressed` 表达。

样式只需在应用入口导入一次；`ThemeProvider` 的 `theme` 必填。默认使用 `chiikawa`，另有 `hachiware`、`usagi` 可选预设，保持同一套尺寸、排版和交互规则。

其他示例按文档站的“完整接入”保存原样 `Example.tsx` 与独立 `App.tsx`；有素材清单时，单独下载并保留 `artwork/` 相对路径。完整素材示例按 Vite 8 / TypeScript 7 验证，`?raw`、`?no-inline` 导入需要相应构建工具支持。

安装包只分发组件、类型、样式与包说明。本文的图片和相对文档链接供源码仓库阅读，不表示它们进入 `.tgz`；只有安装包时，可直接使用本节的 `App.tsx`。

## 本地开发

在本仓库完成 `npm ci` 后，可以分别运行文档站和博客：

```sh
npm run dev
```

打开终端输出的文档站地址，从首页进入组件总览与指南。站内路由包括 `#/components`、`#/guides/getting-started` 和 `#/guides/artwork`。

```sh
npm run dev:blog
```

打开终端输出的博客地址，体验搜索、分类、分页、收藏与阅读返回。示例位于同仓库的 `examples/blog/`，共用根目录工具链；没有另一份 package.json 或 workspace。所有文章均为虚构示例，收藏保存在当前浏览器，不连接后台。

![小小日常博客：首页、朋友群像和最近的手记](docs/images/yahha-blog.png)

[博客运行与改站说明](examples/blog/README.md) · [手机阅读实拍](docs/images/yahha-mobile-reading.png) · [截图来源与更新方式](docs/images/README.md)

## 构建与静态部署

```sh
npm run build:demo
npm run build:blog
```

文档站输出至 `demo-dist/`，博客输出至 `examples/blog/dist/`；两者使用相对资源和 hash 路由。可以分别托管，也可以放在同一静态目录的根路径与 `blog/` 子目录。

[部署说明](docs/deployment.md)提供构建、保留字体声明、合并副本及本地预览的完整步骤。当前提供本地构建与预览流程，尚未提供线上预览地址。

## 当前能力与边界

- 组件以 ESM、类型声明和独立 CSS 入口分发；React / React DOM 是 peer dependencies，`@base-ui/react` 是运行时依赖。展示工具与素材不进入组件安装包。
- 当前验证范围是 React 19 浏览器应用。React 18、SSR 和其他构建工具兼容性尚未验证；素材示例的构建工具范围见上文。
- Select 当前为单值选择，不包含搜索与多选；Pagination 由调用方更新列表与路由；Tooltip 是视觉文字补充，触发器需要自身可访问名称。具体 API 和键盘约定以[组件文档](docs/README.md)为准。
- 版本为 `0.0.1`，`private: true`，尚未发布 npm。本文不提供未经验证的 npm 公开安装命令或线上文档地址。

## 素材与范围

这是非官方同人项目。组件代码、人物 SVG、道具、PNG、字体和页面截图分别记录来源与分发位置；代码的最终许可证与角色素材的完整许可清单尚未确定。已有字体 OFL 声明仅对应相应字体。

[素材与分发范围](docs/assets-and-distribution.md)汇总实际目录、原始记录、派生关系与当前许可状态。[图标与插画](playground/src/examples/scenes/artwork/little-days/README.md)说明静态、动效及欢迎控制器的使用区别。

## 参与开发

源码目录、依赖边界、Git hooks 和验证方式见[协作说明](CONTRIBUTING.md)；[AGENTS.md](AGENTS.md)记录仓库协作约定。[设计语言](docs/design-language.md)保留设计依据。

小改动按影响范围选择检查；公共 API、构建或依赖边界变化使用完整 `npm run check`。
