# Chiikawa UI · 组件小屋

独立的本地 React 组件库与展示页。组件源码在 `src/`，可以构建为带类型声明的 ESM 本地安装包；展示页位于 `playground/` 并单独构建。当前尚未发布 npm 包，也未接入社群看板。

[组件文档](docs/README.md) · [协作说明](CONTRIBUTING.md) · [代理协作规则](AGENTS.md)

## 本地开发

开发基线为 Node.js **22.22.3**、npm **10.9.8**。使用 npm 与仓库内的 `package-lock.json`，首次使用先安装依赖：

```sh
npm ci
```

双击 `启动组件小屋.command`，或执行：

```sh
npm run dev
```

访问 [http://127.0.0.1:4175/](http://127.0.0.1:4175/) 。开发服务只监听本机地址。

## 已实现

- 吉伊、小八、乌萨奇三套主题，主题变量也传入弹窗 Portal。
- Button / IconButton：主要、次要、文字、禁用、加载与点击状态。
- TextField：标签、提示、错误关联、受控输入。
- SegmentedControl：原生单选，支持方向键。
- Dialog：复用 Base UI 的焦点管理、Escape 和关闭行为。
- EmptyState、Toast，以及 Badge、Surface。
- 独立组件源码在 `src/components/`，角色通过插槽传入；看板数据与业务逻辑未搬入。

展示页里的心愿、消息与空态内容均为演示数据，不读取或保存聊天记录。

## 目录约定

- `src/index.ts`：统一公共入口，只导出组件和公开类型。
- `src/components/<组件名>/`：按组件族放置实现、CSS Modules、单元测试和局部导出入口。
- `src/theme/`：主题 Provider、内部 Context 与主题变量样式。
- `src/internal/`：库内部共用工具和图标，不作为公共 API 导出。
- `playground/src/`：展示页、分组件演示、图片与字体，不被库源码引用。
- `docs/components/`：已实现组件的 API、样式入口、示例和键盘约定。
- `tests/package-consumer/`：通过真实安装包验证类型、样式和交互的独立使用方。
- `scripts/`：工程验收脚本；根目录配置分别负责库构建、展示页构建和单元测试。

组件内部直接引用所需模块，不从公共入口回引。库内相对模块路径使用 `.js` 扩展名，使生成的多文件声明可被 Bundler 和 NodeNext 模式解析。

## 构建与本地安装

```sh
npm run build
```

这会先检查类型，再分别生成组件库与展示页：

- `dist/index.js`：组件库的 ESM 入口。
- `dist/index.d.ts`：公共类型入口。
- `dist/style.css`：组件样式，通过 `chiikawa-ui/style.css` 导入。
- `demo-dist/`：独立展示页，不作为组件库分发内容。

预览构建后的展示页：

```sh
npm run preview
```

访问 [http://127.0.0.1:4176/](http://127.0.0.1:4176/) 。`preview` 读取 `demo-dist/`，需要先执行 `npm run build:demo` 或 `npm run build`。

在本地 React 19 项目中试用安装包：

```sh
# 在组件库目录中执行
npm run build:lib
npm pack

# 在使用组件的项目中执行，替换为实际生成的文件路径
npm install /path/to/chiikawa-ui/chiikawa-ui-0.0.1.tgz
```

React 与 React DOM 由使用组件的项目提供，当前两者的 peer 范围均为 `^19.3.1`。示例：

```tsx
import { Button, ThemeProvider } from 'chiikawa-ui';
import 'chiikawa-ui/style.css';

export function App() {
  return (
    <ThemeProvider theme="chiikawa">
      <Button onClick={() => console.log('出发啦')}>一起出发</Button>
    </ThemeProvider>
  );
}
```

`theme` 支持 `chiikawa`、`hachiware`、`usagi`。角色插画通过组件插槽传入；展示页的角色素材、字体和业务演示不应成为使用组件库的前提。

## 检查命令

- `npm run typecheck`：类型检查。
- `npm test -- src/components/button/Button.test.tsx`：针对某个组件运行行为测试。
- `npm run check`：格式、lint、类型、组件测试、构建与真实安装包验证的完整检查。

其他检查命令、Chromium 安装和 Git hooks 说明见[协作说明](CONTRIBUTING.md#验证)。按改动影响范围选择验证，不默认对小改动运行完整检查。

工具选择参考了 [Radix Primitives 的 Oxlint 配置路线](https://github.com/radix-ui/primitives/blob/main/package.json)，本项目保留 TypeScript 7，格式化使用 Prettier。

## 本轮设计参考（2026-10-23）

- [Chiikawa Bakery](https://chiikawabakery.jp/)：白底、浅粉分区、清楚的文字和行动按钮。
- [Chiikawa Pocket](https://jp.chiikawa-pocket.com/ja/)：角色参与情境，标准交互融入同一世界。
- [Chiikawa Park](https://chiikawapark-tokyo.jp/)：粉白留白、细线、栏目招牌。
- [Chiikawa Market](https://chiikawamarket.jp/)：清楚的输入、筛选与信息密度。
- [动画官网](https://www.anime-chiikawa.jp/)：功能图标与角色插画分工，暖棕线稿。
- [Chiikawa-Flex](https://chiikawa-flex.vercel.app/)：角色随操作变化，成为状态结果。
- [Chiikawa-Hidamari](https://phuahjinwei.github.io/Chiikawa-Hidamari/)：一次一个反馈，短暂回应。
- [Usagi Clock](https://shao.fun/usagi-clock/)：功能进入角色场景，首帧优先显示。
- [saya-themes](https://github.com/Heoooooon/saya-themes)：共享语义结构的三角色主题。

这些是设计观察，并非官方组件规范。

## 素材与范围

三张角色插画沿用本地社群看板已生成的同人素材；本轮没有抓取网站图片。字体沿用本地 LXGW Marker / WenKai Web 字体，原 OFL 说明保留在 `playground/src/assets/`。这是非官方同人样张，代码、字体和角色素材的许可范围应分别记录。

当前 package 名称为 `chiikawa-ui`，仍设置为 `private: true`，可在本地打包安装，不进行 npm 发布。项目代码的最终许可证及第三方素材的完整许可清单尚未确定；现有字体 OFL 声明不代表角色素材或全部代码已获同等许可。当前仅以 React 19 浏览器使用方为验证范围，React 18 与 SSR 兼容性尚未验证。
