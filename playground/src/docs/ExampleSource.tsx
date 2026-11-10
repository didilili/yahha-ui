import { CodeBlock } from './CodeBlock';
import type { DocExample } from './types';

export function ExampleSource({
  source,
  themeHint = false,
  assets = [],
  expanded,
  onExpandedChange,
}: {
  source: string;
  themeHint?: boolean;
  assets?: DocExample['assets'];
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}) {
  return (
    <div className="example-source">
      {themeHint && (
        <p className="example-theme-note">示例自带 ThemeProvider，沿用源码中的主题设置。</p>
      )}
      <div className="component-source">
        <CodeBlock
          source={source}
          collapsible
          expanded={expanded}
          onExpandedChange={onExpandedChange}
        />
      </div>
      {assets.length > 0 && (
        <details className="example-assets">
          <summary>
            示例素材 <span className="example-assets-label">{assets.length} 个文件</span>
          </summary>
          <div className="example-assets-content">
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
            <p>
              源码中的 <code>?no-inline</code> 和 <code>?raw</code> 使用 Vite
              资源导入，其他工具链需配置对应资源处理。
            </p>
          </div>
        </details>
      )}
    </div>
  );
}
