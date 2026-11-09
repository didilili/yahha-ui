import { Link } from 'yahha-ui';
import { ChevronRight } from 'lucide-react';
import { version as packageVersion } from '../../../../package.json';
import { feedbackHref, repositoryHref } from '../../site/site-links';
import GettingStarted from '../../examples/GettingStarted';
import gettingStartedSource from '../../examples/GettingStarted.tsx?raw';
import { CodeBlock } from '../CodeBlock';
import type { DocPage } from '../types';
import { guideMetadata } from '../guide-catalog';

const page: DocPage = {
  ...guideMetadata('getting-started'),
  sections: [
    {
      id: 'choose-path',
      title: '接入方式',
      content: (
        <>
          <nav className="guide-paths getting-started-paths" aria-label="接入路径">
            <Link href="#/guides/getting-started?section=install">
              <strong>在现有项目中使用组件 →</strong>
              <span>在现有 React 项目中安装组件包、导入样式并配置主题。</span>
            </Link>
            <Link href="#/guides/getting-started?section=starter-project">
              <strong>运行最小项目 →</strong>
              <span>没有现有项目时，可导出包含本地组件包和基础示例的独立项目。</span>
            </Link>
          </nav>
          <p className="getting-started-related">
            素材资源：
            <Link href="#/guides/artwork?section=artwork-language">图标与插画</Link>
          </p>
        </>
      ),
    },
    {
      id: 'requirements',
      title: '使用要求',
      toc: false,
      content: (
        <p>
          当前在 React / React DOM ^19.3.1 的浏览器应用中验证，构建工具需支持 CSS 导入；安装包要求
          Node.js ≥22.22.3。React 18 与 SSR 尚未验证，详见
          <Link href="#/guides/introduction?section=status">当前范围</Link>。
        </p>
      ),
    },
    {
      id: 'install',
      title: '1. 安装组件',
      content: (
        <>
          <p>在自己的 React 项目根目录安装最新已发布版本：</p>
          <CodeBlock language="sh" source={'npm install yahha-ui'} />
          <p>本指南随仓库源码更新，使用前请确认安装版本支持所需 API。</p>
          <details className="doc-disclosure">
            <summary>
              可选：安装本地构建的组件包
              <ChevronRight size={16} aria-hidden="true" />
            </summary>
            <div className="doc-disclosure-content">
              <p>需要使用尚未发布的改动时，可安装本地构建的组件包，将路径替换为实际文件位置：</p>
              <CodeBlock
                language="sh"
                source={`npm install /absolute/path/yahha-ui-${packageVersion}.tgz`}
              />
              <p>
                还没有安装包时，先
                <Link href={repositoryHref} external>
                  获取仓库源码
                </Link>
                ，在仓库根目录生成，再回到自己的项目安装：
              </p>
              <CodeBlock language="sh" source={'npm ci\nnpm run build:lib\nnpm pack'} />
            </div>
          </details>
        </>
      ),
    },
    {
      id: 'first-component',
      title: '2. 使用第一个组件',
      content: (
        <>
          <p>
            下例已包含 <code>yahha-ui/style.css</code> 样式导入、<code>ThemeProvider</code> 与{' '}
            <code>theme="pink"</code> 配置。
          </p>
          <p>
            展开下方代码，保存为 <code>Example.tsx</code>
            ；再展开同一示例的「完整接入」，将入口保存为 <code>App.tsx</code>
            。两个文件放在同一目录，然后启动应用。
          </p>
        </>
      ),
      examples: [
        {
          id: 'first-button',
          title: '第一个按钮',
          toc: false,
          description: '点击或按 Space 切换收藏状态；示例包含样式导入、主题设置和状态管理。',
          component: GettingStarted,
          source: gettingStartedSource,
          themeScope: 'explicit',
        },
      ],
    },
    {
      id: 'copy-example',
      title: '复制其他示例',
      toc: false,
      disclosure: '查看复制步骤',
      content: (
        <>
          <ol>
            <li>
              在组件页展开代码，将源码保存为 <code>Example.tsx</code>。
            </li>
            <li>
              展开同一示例下的「完整接入」，将提供的入口保存为 <code>App.tsx</code>。
              两个文件放在同一目录。
            </li>
            <li>
              如果「完整接入」列出了素材，以 <code>Example.tsx</code>{' '}
              所在目录为起点，按清单标注的相对路径保存下载文件，保留源码中的导入路径；没有素材清单的示例无需这一步。
            </li>
          </ol>
          <p>
            完整示例在 React 19、Vite 8、TypeScript 7 的浏览器项目中验证。含素材的源码使用 Vite 的{' '}
            <code>?no-inline</code> 或 <code>?raw</code>{' '}
            导入；其他工具链需配置对应资源处理，尚未验证原样复制。
          </p>
        </>
      ),
    },
    {
      id: 'checks',
      title: '安装与样式排错',
      toc: false,
      disclosure: '查看排错方法',
      content: (
        <>
          <ul>
            <li>
              找不到组件包：确认已在正在运行的使用方项目根目录执行 <code>npm install yahha-ui</code>
              ，或安装了本地构建的 <code>.tgz</code>；React 与 React DOM 需符合上面的 peer 范围。
            </li>
            <li>
              只有内容没有样式：确认应用加载了 <code>yahha-ui/style.css</code>，组件位于设置了{' '}
              <code>theme</code> 的 <code>ThemeProvider</code> 内。
            </li>
            <li>
              报错指向 <code>?raw</code> 或 <code>?no-inline</code>
              ：检查应用是否支持源码中使用的 Vite 资源导入。
            </li>
            <li>
              场景缺图：对照「完整接入」的素材清单，检查文件相对于 <code>Example.tsx</code>{' '}
              的保存路径是否与源码导入一致。图片只影响对应场景，不是基础组件的使用前提。
            </li>
            <li>本地修改没有生效：重新构建、打包，再在使用方安装新生成的 tarball。</li>
          </ul>
        </>
      ),
    },
    {
      id: 'starter-project',
      title: '运行最小项目',
      content: (
        <>
          <p>
            在本仓库根目录完成 <code>npm ci</code> 后执行：
          </p>
          <CodeBlock language="sh" source={'npm run create:starter'} />
          <p>终端会输出生成目录的路径，其中包含组件安装包和基础示例。</p>
          <p>进入生成的项目目录后执行：</p>
          <CodeBlock language="sh" source={'npm install\nnpm run dev'} />
          <p>
            打开终端输出的地址运行示例。组件用法见 <code>src/App.tsx</code>，页面布局见{' '}
            <code>src/styles.css</code>；完成修改后，运行 <code>npm run build</code> 构建页面。
          </p>
          <p>
            用 <code>--output /absolute/path/yahha-ui-starter</code> 指定仓库外的目录。
            需要离线文档时加 <code>--with-docs</code>，导出后可运行 <code>npm run docs</code>{' '}
            查阅；需要压缩包时加 <code>--zip</code>。
          </p>
        </>
      ),
    },
    {
      id: 'optional-artwork',
      title: '按需使用 SVG 与动效',
      toc: false,
      disclosure: '查看素材入口',
      content: (
        <>
          <p>角色、场景 SVG 与字体独立提供。基础组件继承应用字体，完成上面的接入即可使用。</p>
          <p>
            <Link href="#/guides/artwork?section=artwork-language">查看素材预览与下载</Link>
            ；需要暂停与重播时，使用
            <Link href="#/guides/artwork?section=artwork-welcome">欢迎场景的完整接入</Link>。
          </p>
        </>
      ),
    },
    {
      id: 'next',
      title: '相关文档',
      content: (
        <>
          <ul>
            <li>
              <Link href="#/components">组件总览</Link>：按分类查看组件用法、示例与 API。
            </li>
            <li>
              <Link href="#/components/theme-provider">ThemeProvider</Link>
              ：了解默认配色、可选预设与语义颜色定制。
            </li>
            <li>
              <Link href="#/components/input">Input</Link>：输入、标签与表单验证示例。
            </li>
            <li>
              <Link href="#/guides/styling">使用与定制</Link>：颜色、布局、插槽与状态管理。
            </li>
            <li>
              <Link href={`${repositoryHref}/blob/main/README.md#让-ai-使用-yahha-ui`} external>
                让 AI 使用 Yahha UI
              </Link>
              ：可复制的接入说明。
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'feedback',
      title: '遇到问题',
      content: (
        <>
          <p>
            安装、样式或交互有问题时，可以在
            <Link href={feedbackHref} external>
              {' '}
              GitHub 提交问题
            </Link>
            ，附上版本、构建工具、重现代码或步骤，以及预期与实际结果。
          </p>
        </>
      ),
    },
  ],
};

export default page;
