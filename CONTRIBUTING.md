# 协作说明

开始修改前阅读 [AGENTS.md](AGENTS.md)。不要自动暂存、提交、推送或发布；已有暂存内容和其他工作区改动需要原样保留。小改动采用针对性验证，流程与影响范围匹配。

## 本地开发

使用 Node.js 22.22.3、npm 10.9.8 与仓库的 `package-lock.json`：

```sh
npm ci
npm run dev
```

组件文档见 [docs/README.md](docs/README.md)。当前不新增 Storybook 依赖，展示与交互示例继续放在 `playground/`。

## 目录与边界

- `src/index.ts`：公共组件与类型的统一导出；新公开类型需同步导出。
- `src/components/<组件名>/`：组件实现、CSS Modules、行为测试与局部导出。组件内部直接引用具体模块，避免从公共入口回引。
- `src/theme/`：主题、Context 与语义颜色；`src/internal/`：不公开的工具与图标。
- `playground/src/`：独立展示页，包含演示数据、图片、字体和示例。库源码不得依赖它。
- `docs/components/`：已实现 API、默认值、原生属性与样式入口的文档。
- `tests/package-consumer/`：通过真实安装包验证类型、样式与交互的使用方。
- `scripts/`：打包与验收脚本。

库内相对模块路径使用 `.js` 扩展名，使构建后的多文件声明可被 Bundler 与 NodeNext 解析。修改公共接口时，同步检查源码导出、文档与使用方示例；不要记录尚未实现的能力。

## 验证

按本次改动选择最小有效检查。例如只改某个组件行为时：

```sh
npm test -- src/components/text-field/TextField.test.tsx
npm run typecheck
```

纯文档改动可检查涉及文件的格式：

```sh
npx prettier --check README.md CONTRIBUTING.md docs
```

常用检查：

- `npm run lint` / `npm run format:check`：代码规则与格式。
- `npm test`：组件行为测试。
- `npm run build:lib` / `npm run build:demo`：组件库、类型声明与展示页构建。
- `npm run lint:package`：对构建后的包运行 publint。
- `npm run test:package`：将实际安装包放入独立使用方，检查组件文档中的 TSX 示例类型并运行 Chromium 验证；先执行 `npm run build:lib`。
- `npm run check`：完整本地检查；涉及公共 API、构建或依赖边界时运行。

首次运行浏览器测试需要 `npx playwright install chromium`；Linux 可能需要 `npx playwright install --with-deps chromium`。`npm run format` 和 `npm run lint:fix` 会修改文件，只在确认作用范围后使用。

GitHub Actions 对 pull request 与 `main` push 执行完整检查。本地 Husky pre-commit 只对已暂存文件运行 lint-staged；hook 不代表已完成完整验证，也不授权自动暂存或提交。

## 素材与许可

当前包为 `private: true`，仅本地打包试用。代码最终许可证与第三方素材许可清单尚未确定，不要写成 MIT 或其他已获授权的结论。保留字体 OFL 声明；角色素材、字体和代码的许可分别核对，现有字体许可不覆盖角色素材。
