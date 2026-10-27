# Alert 静态提示

持续展示阅读说明、完成结果或需要处理的问题。

本页示例按[入门指南](../../README.md#构建与本地安装)（站内路由 `#/guides/getting-started`）在应用入口导入一次 `yahha-ui/style.css` 并包裹 ThemeProvider。交互示例和更多状态见[文档站](../../README.md#本地开发)（站内路由 `#/components/alert`）。

持续说明使用平面提示纸、语义色背景与清楚的状态符号，不带浮层投影。颜色之外保留原因与后续动作；错误不能只靠插画或图标表达。

## 设计与状态

- info、success、warning、error 使用平面的语义提示纸。24px 图标对齐文字第一行；长中文和长单词自然换行。
- `tone` 仅表达视觉语义。默认 `role="note"`，不会因为 error 自动抢占播报；紧急动态结果可由调用方显式设置 `role="alert"`。
- `hidden={true}` 隐藏整个提示与其中的操作，且不占布局空间；取消隐藏后显示当前内容。
- 保存流程示例包含保留选项、首次模拟失败及重试成功的过程；加载状态、请求、结果和焦点恢复由调用方管理。

## API

| 参数                | 类型                                        | 默认值 | 说明                                                                        |
| ------------------- | ------------------------------------------- | ------ | --------------------------------------------------------------------------- |
| tone                | 'info' \| 'success' \| 'warning' \| 'error' | 'info' | 说明类型，决定图标与背景颜色。                                              |
| title               | ReactNode                                   | —      | 可选标题，渲染为 p，不是原生 title 属性。                                   |
| children            | ReactNode                                   | —      | 内容，可组合正文、链接或按钮。                                              |
| role                | AriaRole                                    | 'note' | 静态说明默认 note；紧急动态结果可显式使用 alert。                           |
| className / style   | string / CSSProperties                      | —      | 作用于根 div 元素。                                                         |
| ref                 | ComponentPropsWithRef<'div'>['ref']         | —      | 指向真实 div 元素。                                                         |
| 其他原生属性 / 事件 | ComponentPropsWithRef<'div'>                | —      | 沿用对应原生元素的事件、`aria-*`、`data-*` 等属性；下表列出的组件属性优先。 |

## 使用约定

- 不会主动抢焦点、自动关闭或自动滚动。动态播报策略由调用方选择 role / aria-live。加载失败可用 Alert 说明原因与重试方式；等待过程使用 [Spinner](spinner.md) 或 [Skeleton](skeleton.md)，成功但无内容使用 [EmptyState](empty-state.md)。
- className、style 与 ref 作用于根 div；没有内置关闭按钮或额外插槽样式 API。

## 示例

```tsx
import { Alert } from 'yahha-ui';

export default function AlertExample() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Alert title="阅读提示">这篇文章包含一些个人记录，可以慢慢读。</Alert>
      <Alert tone="success" title="草稿已保存">
        下次打开时可以继续编辑。
      </Alert>
      <Alert tone="warning" title="还有一项没有填写">
        补充联系邮箱后再提交。
      </Alert>
      <Alert tone="error" title="这次没有发送成功">
        内容仍保留在输入框中，请稍后重试。
      </Alert>
    </div>
  );
}
```
