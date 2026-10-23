# Chiikawa UI 开发约定

适用于本仓库全部文件。开始工作前阅读 README 与相关组件文档。

## 范围与 Git

- 当前优先完善已有组件、文档与目录结构；未经明确要求，不新增 UI 组件。
- 沿用单包仓库、npm 与 package-lock.json；不自行迁移包管理器或引入 monorepo。
- 不执行 git add、git mv、git rm、暂存、提交、推送或发布，除非用户明确授权相应操作。
- 保留用户已有暂存区与无关改动。移动文件使用文件系统操作，避免改写 Git index。
- 对清楚的局部修改直接实施，不增加多轮确认、独立设计文档或工作树等流程。

## 目录与依赖

- src/index.ts 是公共入口，仅导出稳定的组件与公开类型。
- src/components/<组件名>/ 按组件族放置实现、Props、CSS Modules、局部 index.ts 与测试。
- 组件文件使用 PascalCase，目录和 CSS 文件使用 kebab-case；小型 Props 与实现同文件。
- src/theme/ 管理主题 Provider、内部 Context、tokens 与主题样式。
- src/internal/ 只放库内部共用实现，不作为公共 API 导出。
- playground/ 只放展示页、演示状态与素材；src/ 不得反向依赖它。
- tests/package-consumer/ 验证实际安装包；scripts/ 放工程脚本；docs/ 放使用文档。
- 内部模块直接导入具体文件，不从 src/index.ts 回引；库内相对 JS 模块路径使用 .js 扩展名。
- React / ReactDOM 保持 peer dependencies；展示专用依赖与素材不得进入库产物。

## 组件与样式

- 保持既有 API 和默认视觉兼容；新增配置应有具体使用场景。
- 明确受控状态、ref、原生属性和 className 的作用目标，并同步 Props 注释与文档。
- 组件样式留在各自 CSS Modules；共享主题规则留在 theme/，避免复制整份样式。
- 展示页通过公开属性、样式入口与 tokens 定制，不依赖组件内部标签或嵌套层级。
- Portal 使用统一主题上下文；不要复制带布局作用的页面 className。
- 保留字体与素材说明，不虚构许可证或未经验证的 React / SSR 兼容承诺。

## 验证

- 先复现问题或编写关键行为测试，再实施行为修改；不写只检查文件名或复述实现的测试。
- 使用针对性测试及必要的 lint、格式与类型检查，避免无关的大范围重跑。
- 涉及公共 API、构建或依赖边界时，运行 npm run check，验证真实安装包。
- 默认视觉应保持一致；修改布局或主题传播时补必要的浏览器验证。
- 不以测试数量或覆盖率数字代替真实使用场景的验收。
