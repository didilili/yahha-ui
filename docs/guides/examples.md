<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/guides/getting-started.tsx 的 copy-example 章节。 -->

# 接入示例

首次使用时，先按[安装指南](../../README.md#构建与本地安装)完成组件安装、样式导入和主题配置。

在已经加载 `yahha-ui/style.css` 并配置 `ThemeProvider` 的项目中，将示例源码保存为 `Example.tsx`，在需要的位置导入并渲染 `<Example />`。已有主题区域可直接使用示例。

需要将某个示例作为独立页面运行时，使用下面的入口。

1. 复制组件页或指南页的示例源码，原样保存为 `Example.tsx`。
2. 根据示例是否自带 `ThemeProvider` 选择下方入口，保存为同目录的 `App.tsx`，由现有 React 应用入口渲染。

### 通用示例

入口加载样式，并以粉色主题包裹示例。

```tsx
import { ThemeProvider } from 'yahha-ui';
import Example from './Example';
import 'yahha-ui/style.css';

export default function App() {
  return (
    <ThemeProvider theme="pink">
      <Example />
    </ThemeProvider>
  );
}
```

### 自带主题的示例

主题配置、阅读组合等示例已经包含 `ThemeProvider`，沿用源码中的主题。入口加载样式并渲染示例。

```tsx
import Example from './Example';
import 'yahha-ui/style.css';

export default function App() {
  return <Example />;
}
```

### 示例素材

含素材的示例会列出配套文件。以 `Example.tsx` 所在目录为起点，按素材清单标注的相对路径保存文件，保留源码中的导入路径。

完整示例在 React 19、Vite 8、TypeScript 7 的浏览器项目中验证。含素材的源码使用 Vite 的 `?no-inline` 或 `?raw` 导入；其他工具链需配置对应资源处理，尚未验证原样复制。
