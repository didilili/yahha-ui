import { CodeBlock } from './CodeBlock';
import { createExampleEntry, type ExampleThemeScope } from './example-source';
import type { DocExample } from './types';

export function ExampleSource({
  source,
  themeScope = 'inherited',
  assets = [],
}: {
  source: string;
  themeScope?: ExampleThemeScope;
  assets?: DocExample['assets'];
}) {
  return (
    <div className="example-source">
      <div className="component-source">
        <CodeBlock source={source} collapsible />
      </div>
      <details className="example-setup">
        <summary>
          完整接入{' '}
          <span className="example-setup-label">2 个文件{assets.length > 0 ? ' + 素材' : ''}</span>
        </summary>
        <div className="example-setup-content">
          <p>在已安装组件包的 React 项目中，分开保存示例组件和入口，两个文件放在同一目录。</p>
          <a href="#/guides/getting-started">安装组件与环境准备</a>
          <ol className="example-setup-steps">
            <li>
              <strong className="example-file-label">Example.tsx · 示例组件</strong>
              <p>
                点击上方“展开代码”，将源码保存为 <code>Example.tsx</code>。
              </p>
            </li>
            <li>
              <strong className="example-file-label">App.tsx · 页面入口</strong>
              <p>
                {themeScope === 'explicit'
                  ? '此示例已在原始源码中配置 ThemeProvider；入口只加载样式并渲染示例，保留其自身的主题配置。'
                  : '入口导入组件库样式，并使用粉色预设（pink）包裹示例。'}
              </p>
              <p>
                将下面的入口保存为 <code>App.tsx</code>，与 <code>Example.tsx</code> 放在一起。
              </p>
              <div className="example-entry" aria-label="App.tsx 完整入口">
                <CodeBlock source={createExampleEntry(themeScope)} />
              </div>
            </li>
          </ol>
          {assets.length > 0 && (
            <div className="example-assets">
              <p>
                此例还需要单独下载图片。以下路径相对于 <code>Example.tsx</code>
                ，按路径新建目录并保存文件，保留源码中的相对导入。
              </p>
              <ul>
                {assets.map((asset) => (
                  <li key={asset.name}>
                    <a href={asset.href} download={asset.name}>
                      下载 {asset.name}
                    </a>
                    {' → '}
                    <code>{asset.path ?? `artwork/${asset.name}`}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
