import { CodeBlock } from './CodeBlock';
import { createExampleEntry, type ExampleThemeScope } from './example-source';
import type { DocExample } from './types';

export function ExampleSource({
  source,
  themeScope = 'inherited',
  assets = [],
  expanded,
  onExpandedChange,
}: {
  source: string;
  themeScope?: ExampleThemeScope;
  assets?: DocExample['assets'];
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}) {
  return (
    <div className="example-source">
      <div className="component-source">
        <CodeBlock
          source={source}
          collapsible
          expanded={expanded}
          onExpandedChange={onExpandedChange}
        />
      </div>
      <details className="example-setup">
        <summary>
          完整接入{' '}
          <span className="example-setup-label">2 个文件{assets.length > 0 ? ' + 素材' : ''}</span>
        </summary>
        <div className="example-setup-content">
          <p>将以下两个文件放在同一目录。</p>
          <a href="#/guides/getting-started">安装组件与环境准备</a>
          <ol className="example-setup-steps">
            <li>
              <strong className="example-file-label">Example.tsx · 示例组件</strong>
              <p>展开上方代码，原样保存。</p>
            </li>
            <li>
              <strong className="example-file-label">App.tsx · 页面入口</strong>
              <p>
                {themeScope === 'explicit'
                  ? '示例自带 ThemeProvider，入口只导入样式并渲染示例。'
                  : '入口导入样式，并以 ThemeProvider 的 pink 配色包裹示例。'}
              </p>
              <div className="example-entry" aria-label="App.tsx 完整入口">
                <CodeBlock source={createExampleEntry(themeScope)} />
              </div>
            </li>
          </ol>
          {assets.length > 0 && (
            <div className="example-assets">
              <p>
                下载素材并按下列路径保存，路径相对于 <code>Example.tsx</code>，保持源码的相对导入。
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
