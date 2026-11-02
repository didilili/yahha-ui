import { ArrowUpRight } from 'lucide-react';
import { Alert, Link } from 'yahha-ui';
import { blogHref, feedbackHref, repositoryHref } from '../../site/site-links';
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
      title: '选择接入方式',
      content: (
        <>
          <nav className="guide-paths getting-started-paths" aria-label="接入路径">
            <Link href="#/guides/getting-started?section=install">
              <strong>在自己的项目里使用组件 →</strong>
              <span>已有 React 项目时，安装本地包，再加载样式与主题。</span>
            </Link>
            <Link href="#/guides/getting-started?section=starter-project">
              <strong>运行最小项目 →</strong>
              <span>没有现成项目时，导出包含本地包和组件用法的独立项目。</span>
            </Link>
          </nav>
          <p className="getting-started-related">
            其他示例与资源：
            <Link href="#/guides/getting-started?section=blog-example">完整博客示例</Link>
            {' · '}
            <Link href="#/guides/artwork?section=artwork-language">图标与插画</Link>
          </p>
        </>
      ),
    },
    {
      id: 'requirements',
      title: '1. 准备环境',
      content: (
        <>
          <ul>
            <li>
              <strong>使用组件</strong>：应用提供 React 与 React DOM ^19.3.1，构建工具支持 CSS
              导入。基础组件不依赖角色图片或站点字体。
            </li>
            <li>
              <strong>Node.js 与 npm</strong>：安装包与本仓库均声明 Node.js
              ≥22.22.3；本仓库打包、导出使用 npm 10.9.8。
            </li>
          </ul>
          <p>
            当前验证范围为 React 19 浏览器应用，React 18 与 SSR 尚未验证，详见
            <Link href="#/guides/introduction?section=status">当前范围</Link>。
          </p>
          <Alert className="doc-callout">
            当前通过本地包试用，尚未发布 npm，也没有在线安装包下载地址。已有 .tgz
            时按下一步安装；已取得源码时可生成安装包或最小项目。
          </Alert>
        </>
      ),
    },
    {
      id: 'install',
      title: '2. 安装组件',
      content: (
        <>
          <p>
            已拿到 <code>yahha-ui-0.0.1.tgz</code> 时，在自己的 React 项目根目录执行，
            替换成安装包的实际路径：
          </p>
          <CodeBlock language="sh" source={'npm install /absolute/path/yahha-ui-0.0.1.tgz'} />
          <p>
            如果从源码开始，先获取本仓库，在包含 <code>package.json</code>{' '}
            的组件库根目录生成安装包，再回到自己的项目执行上面的安装命令：
          </p>
          <CodeBlock language="sh" source={'npm ci\nnpm run build:lib\nnpm pack'} />
          <p>
            更新本地库后，重新构建、打包并安装新生成的 tarball。当前包为
            ESM，代码、声明和样式从公开入口使用。仓库目录名不影响导入路径，代码统一从{' '}
            <code>yahha-ui</code> 导入；<code>npm install yahha-ui</code>{' '}
            还不是当前版本的公开安装方式。
          </p>
        </>
      ),
    },
    {
      id: 'first-component',
      title: '3. 使用第一个组件',
      content: (
        <>
          <p>
            在应用入口导入一次 <code>yahha-ui/style.css</code>，用 <code>ThemeProvider</code>{' '}
            包住组件区域，并显式设置 <code>theme="pink"</code>。
          </p>
          <p>
            下例已包含样式导入和主题设置，保存为 <code>App.tsx</code> 并由应用入口渲染。
            启动后应看到「收藏这篇文章」按钮，点击或按 Space
            切换选中状态；名称保持稳定，状态通过外观与
            <code>aria-pressed</code> 表达。其他示例按下一节的两文件方式接入。
          </p>
        </>
      ),
      examples: [
        {
          id: 'first-button',
          title: '第一个按钮',
          toc: false,
          description:
            '点击切换收藏状态。其余组件页的示例默认已完成这里的 CSS 导入与 ThemeProvider 设置。',
          component: GettingStarted,
          source: gettingStartedSource,
          themeScope: 'explicit',
        },
      ],
    },
    {
      id: 'copy-example',
      title: '4. 复制其他示例',
      content: (
        <>
          <ol>
            <li>
              在组件页展开代码，将原始源码保存为 <code>Example.tsx</code>
              ，不删改其中的导入或主题设置。
            </li>
            <li>
              展开同一示例下的「完整接入」，将提供的入口保存为 <code>App.tsx</code>。
              两个文件放在同一目录，入口会按该示例是否自带主题决定包裹方式。
            </li>
            <li>
              如果「完整接入」列出了图片，下载对应文件，放入 <code>Example.tsx</code> 同级的{' '}
              <code>artwork/</code>{' '}
              目录。保留下载文件名和源码里的相对路径；没有素材清单的示例无需这一步。
            </li>
          </ol>
          <p>
            完整示例在 React 19、Vite 8、TypeScript 7 的浏览器项目中验证。含素材的源码使用 Vite 的{' '}
            <code>?no-inline</code> 或 <code>?raw</code>{' '}
            导入；其他工具链需配置对应资源处理，尚未验证原样复制。
          </p>
          <p>
            <Link href="#/components/button">Button</Link> 可以先验证普通示例，
            <Link href="#/guides/states?section=loading">加载场景</Link> 可以验证含素材的完整接入。
            组件预览与展示源码来自同一文件；不需要复制文档站的布局或字体。
          </p>
        </>
      ),
    },
    {
      id: 'checks',
      title: '5. 确认接入结果',
      content: (
        <>
          <ul>
            <li>
              找不到组件包：确认 <code>.tgz</code> 已安装到正在运行的使用方项目，且 React 与 React
              DOM 符合上面的 peer 范围。
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
              场景缺图：检查「完整接入」的素材清单，以及 <code>artwork/</code> 目录位置和文件名。
              图片只影响对应场景，不是基础组件的使用前提。
            </li>
            <li>本地修改没有生效：重新构建、打包，再在使用方安装新生成的 tarball。</li>
          </ul>
          <p>
            安装、样式和主题确认后，再复制需要的组件组合。按钮、输入、栏目等示例由页面内状态驱动，
            不会替使用方接入服务器或保存业务数据。
          </p>
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
          <p>
            命令会在系统临时目录生成独立项目和
            ZIP，终端会显示实际路径。应用源码包含当前版本的真实安装包；配套的
            <code>documentation/</code> 保留完整文档和示例网站，供本地查阅。
          </p>
          <p>进入生成的项目目录后执行：</p>
          <CodeBlock language="sh" source={'npm install\nnpm run dev'} />
          <p>
            首次安装需要网络。打开终端显示的地址，修改手记标题、切换收藏，确认样式和交互正常。
            <code>src/App.tsx</code> 包含组件用法，<code>src/styles.css</code>{' '}
            管理页面布局；改完可运行 <code>npm run build</code>。
          </p>
          <p>
            查 API 或复制其他示例时，在生成项目中运行 <code>npm run docs</code>。
            这一步无需先安装依赖。部署自己的页面时，上传构建生成的 <code>dist/</code>
            内容，保留其中的资源文件；<code>documentation/</code> 和 <code>vendor/</code>
            不作为网页输出上传。
          </p>
          <p>
            需要指定导出位置时，使用{' '}
            <code>npm run create:starter -- --output /absolute/path/yahha-ui-starter</code>
            ，选择仓库外的位置。命令不会覆盖已有非空目录或压缩包。生成 ZIP 需要系统提供{' '}
            <code>zip</code> 命令，导出前会检查；运行收到的项目不需要它。
          </p>
        </>
      ),
    },
    {
      id: 'optional-artwork',
      title: '按需使用 SVG 与动效',
      content: (
        <>
          <p>
            基础组件安装包包含组件、类型和样式。角色、场景 SVG 与字体由网站按需使用，
            不随安装包一起提供；只使用按钮、输入或栏目时，完成上面的接入即可。
          </p>
          <ul>
            <li>静态 SVG：适合章节图案、空状态和静止的欢迎场景。</li>
            <li>内置动效 SVG：作为图片播放；页面上的普通按钮不能直接暂停图片内部的时间线。</li>
            <li>
              可控欢迎场景：复制 FriendsWelcome 完整示例及其静态 SVG，获得暂停、继续、
              单独重播挥手，以及离屏和后台暂停。
            </li>
          </ul>
          <p>
            <Link href="#/guides/artwork?section=artwork-language">查看素材预览与下载</Link>
            ，或先在 <Link href="#/guides/artwork?section=artwork-welcome">欢迎场景</Link>{' '}
            中试试控制。等待场景跟随真实请求显示与结束，演示时长只用于预览。
          </p>
        </>
      ),
    },
    {
      id: 'blog-example',
      title: '完整博客示例',
      content: (
        <>
          <p>
            想看看组件怎样组成一个网站，可以运行同仓库的 <code>examples/blog/</code>。
            「小小日常」包含库米的首页、文章归档和阅读详情，使用现有公开组件构建。
          </p>
          <p>需要带走完整页面时，在仓库根目录导出：</p>
          <CodeBlock language="sh" source="npm run create:starter -- --example blog" />
          <p>
            生成的独立博客保留现有字体、排版与素材，并安装真实组件包。 进入生成目录执行{' '}
            <code>npm install</code>、<code>npm run dev</code>； 修改内容和部署自己的{' '}
            <code>dist/</code>，按随附 README 操作。
          </p>
          <p>
            <Link href={blogHref} target="_blank" rel="noopener noreferrer">
              体验示例网站 <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only">（新标签页打开）</span>
            </Link>
          </p>
          <p>在仓库根目录完成 npm ci 后执行：</p>
          <CodeBlock language="sh" source="npm run dev:blog" />
          <p>
            打开终端显示的本地地址，即可体验搜索、分类、分页和收藏。文章为演示数据，收藏保存在当前浏览器；
            <Link href={`${repositoryHref}/tree/main/examples/blog`} external>
              博客源码与说明
            </Link>
            中有启动、构建与改站步骤。
          </p>
          <p>
            这个命令在本仓库运行，复用已构建组件包和根目录工具链；自己的应用只需安装{' '}
            <code>.tgz</code>。如需检查博客构建后的效果，执行：
          </p>
          <CodeBlock language="sh" source={'npm run build:blog\nnpm run preview:blog'} />
          <p>
            也可以先在文档中试试 <Link href="#/guides/reading?section=reading">阅读与收藏组合</Link>
            ，或回到 <Link href="#/components">组件总览</Link> 选择需要的组件。
          </p>
        </>
      ),
    },
    {
      id: 'next',
      title: '接下来',
      content: (
        <>
          <ul>
            <li>
              <Link href="#/components">组件总览</Link>：按分类找到组件，查看完整示例与 API。
            </li>
            <li>
              <Link href="#/components/theme-provider">ThemeProvider</Link>
              ：了解默认配色、可选预设与语义颜色定制。
            </li>
            <li>
              <Link href="#/components/text-field">TextField</Link>：输入、标签与表单验证示例。
            </li>
            <li>
              <Link href="#/guides/styling">使用与定制</Link>：颜色、布局、插槽与状态管理。
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
            。 请填写组件包版本、React 版本、构建工具、重现步骤，以及预期与实际结果。
            可以附最小代码片段或截图，提交前去掉密钥和私人内容。
          </p>
          <p>
            完整源码与类型声明见{' '}
            <Link href={repositoryHref} external>
              Yahha UI 仓库
            </Link>
            。 本地试用项目附有文档副本，运行 <code>npm run docs</code> 即可查阅； GitHub
            入口需要网络和仓库访问权限。
          </p>
        </>
      ),
    },
  ],
};

export default page;
