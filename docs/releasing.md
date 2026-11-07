# 版本与发布

Yahha UI 保持单包仓库，使用 npm 分发组件、Changesets 记录版本变更。组件包公开发布与源码仓库可见性、文档官网部署分别维护。

## 日常记录变更

修改组件行为、公开 API、样式或使用方会安装的内容时，在仓库根目录运行：

```sh
npm run changeset
```

选择 `yahha-ui`，说明使用方会看到的变化。修复使用 patch；兼容新增功能使用 minor。当前处于 0.x 早期预览，破坏性变化也必须在说明中写清迁移方式，并提升 minor。仅修改工程说明且不影响安装包时，可以不发包。

代码合入 main 且 CI 检查通过后，工作流自动创建或更新发版 PR。PR 汇总版本号、CHANGELOG 和待发布的变更；维护者检查后合并。合并后的同一提交通过 CI 后，工作流发布 npm 包，并创建 Git 标签及 GitHub Release。

发版 PR 由 GitHub 提供的 GITHUB_TOKEN 创建。如果 GitHub 把后续 PR 检查标为等待批准，拥有写权限的维护者需在 Actions 中批准运行；main 上的发布始终等待现有 CI 检查成功。

## 首次发布和可信发布配置

新包需要先完成一次手动发布，再到 npm 包设置配置 Trusted Publisher。后续自动发布使用 OIDC，不配置长期 NPM_TOKEN。

npm Trusted Publisher 的 GitHub Actions 配置：

- Organization or user：`didilili`
- Repository：`yahha-ui`
- Workflow filename：`ci.yml`
- Environment：留空
- Allowed actions：允许直接 `npm publish`

登记的是调用方 `ci.yml`；它在检查成功后调用 `.github/workflows/release.yml`。不要填写被调用的 `release.yml`，也不要填写完整文件路径。

GitHub 仓库的 Actions 设置需允许 GitHub Actions 创建 PR。仅对 main 的 push 调用发布流程，PR 检查不发布。发布工作流使用 GitHub 托管 runner，固定 npm 11.21.1；本地开发仍沿用 packageManager 中的 npm 版本。

首次发布前，检查干净源码、运行 `npm run check`，核对 `npm pack --dry-run` 清单，再发布实际验收的 tgz。包内只包含组件产物、包信息、README 和许可说明，不包含文档站、博客、字体或插画。`prepack` 会重新构建库，避免普通打包误带旧 dist。

当前源码仓库为私有仓库；npm 支持这种仓库的可信发布，但不会生成公开仓库才支持的 provenance 证明。工作流不改变仓库可见性。

## 版本与重试

同一个 npm 包版本不能重复发布。发布失败时先检查 npm 是否已经存在该版本，再判断是重试标签和 Release，还是修复问题后发布新版本。使用方可暂时锁定上一个正常版本；不要覆盖已发布版本。

参考：[Changesets 自动化](https://changesets.dev/guide/automating)、[npm 可信发布](https://docs.npmjs.com/trusted-publishers/)。
