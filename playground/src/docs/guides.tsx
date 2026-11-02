import { ArrowUpRight, BookOpen, Layers, MousePointer2 } from 'lucide-react';
import { Alert, Link } from 'yahha-ui';
import { blogHref } from '../site/site-links';
import GettingStarted from '../examples/GettingStarted';
import gettingStartedSource from '../examples/GettingStarted.tsx?raw';
import ReadingExample from '../examples/ReadingExample';
import readingSource from '../examples/ReadingExample.tsx?raw';
import DesignBaseline from '../examples/design/DesignBaseline';
import designBaselineSource from '../examples/design/DesignBaseline.tsx?raw';
import DesignReading from '../examples/design/DesignReading';
import designReadingSource from '../examples/design/DesignReading.tsx?raw';
import LoadingScene from '../examples/scenes/LoadingScene';
import loadingSceneSource from '../examples/scenes/LoadingScene.tsx?raw';
import EmptyScene from '../examples/scenes/EmptyScene';
import emptySceneSource from '../examples/scenes/EmptyScene.tsx?raw';
import NotFoundScene from '../examples/scenes/NotFoundScene';
import notFoundSceneSource from '../examples/scenes/NotFoundScene.tsx?raw';
import ArticleActions from '../examples/scenes/ArticleActions';
import articleActionsSource from '../examples/scenes/ArticleActions.tsx?raw';
import BlogArchive from '../examples/scenes/BlogArchive';
import blogArchiveSource from '../examples/scenes/BlogArchive.tsx?raw';
import loadingArtwork from '../examples/scenes/artwork/little-days-page-wait-motion.svg?no-inline';
import loadErrorArtwork from '../examples/scenes/artwork/little-days-load-error-motion.svg?no-inline';
import savedArtwork from '../examples/scenes/artwork/little-days-collection-saved-motion.svg?no-inline';
import emptyArtwork from '../examples/scenes/artwork/empty.png';
import notFoundArtwork from '../examples/scenes/artwork/little-days-friends-lost.svg?no-inline';
import { CodeBlock } from './CodeBlock';
import type { DocPage } from './types';
import { componentCatalog } from './component-catalog';
import { artworkGuide } from './artwork-guide';

export const guidePages: DocPage[] = [
  {
    id: 'introduction',
    name: '项目介绍',
    chinese: '',
    group: '开始使用',
    description: '一套漫画手账风 React 组件库。Yahha 星球的朋友们给你的点子留了个位置。',
    sections: [
      {
        id: 'overview',
        title: '一起做，全宇宙最可爱的 UI 组件库。',
        content: (
          <>
            <p>Yahha UI 是一套漫画手账风 React 组件库，面向个人博客、个人主页与内容网站。</p>
            <p>
              欢迎来到 Yahha
              星球。朋友们给你留了个位置，等你带着点子坐下来。用圆润的漫画轮廓、清亮配色和白纸般的内容面，把手记、照片与天马行空的小故事放进页面。
            </p>
            <p className="guide-status">当前通过本地安装包试用，尚未发布 npm 包。</p>
            <div className="guide-actions">
              <Link className="guide-primary" href="#/guides/getting-started">
                开始使用 <ArrowUpRight size={16} />
              </Link>
              <Link href="#/guides/styling?section=reading">体验阅读示例 →</Link>
              <Link href="#/guides/states?section=loading">查看状态与反馈 →</Link>
              <Link href="#/guides/design-baseline">查看设计规范 →</Link>
            </div>
            <div className="principles">
              <div>
                <MousePointer2 size={21} />
                <h3>每次操作，都有清楚的回应</h3>
                <p>原生按钮、输入与单选语义；弹窗使用 Base UI 的焦点管理。</p>
              </div>
              <div>
                <BookOpen size={21} />
                <h3>给文章和照片留个位置</h3>
                <p>用阅读、收藏、筛选与轻量表单组件，搭建博客、个人主页与内容网站。</p>
              </div>
              <div>
                <Layers size={21} />
                <h3>请朋友们来串门</h3>
                <p>角色插画与场景按需使用。CSS 单独导入，图片、字体和文档站工具不进入组件包。</p>
              </div>
            </div>
          </>
        ),
      },
      {
        id: 'try',
        title: '翻翻手记，试试组件',
        content: (
          <nav className="guide-paths" aria-label="内容场景">
            <Link href="#/guides/styling?section=reading">
              <strong>阅读与收藏示例 →</strong>
              <span>在正文、配图和文末便笺之间，体验阅读与收藏。</span>
            </Link>
            <Link href="#/guides/states?section=archive">
              <strong>文章归档示例 →</strong>
              <span>切换栏目、搜索和翻页，看看列表与空结果如何恢复。</span>
            </Link>
            <Link href="#/guides/states?section=article-actions">
              <strong>文章编辑示例 →</strong>
              <span>从菜单进入编辑，体验取消、保存失败与重试。</span>
            </Link>
          </nav>
        ),
      },
      {
        id: 'components',
        title: '挑几个组件，一起搭起来',
        content: (
          <div className="component-overview">
            <Link href="#/components">
              <strong>浏览组件 →</strong>
              <span>按分类找到需要的组件，查看交互示例、使用方法与 API。</span>
            </Link>
            {componentCatalog.map(({ id, name, description }) => (
              <Link key={id} href={`#/components/${id}`}>
                <strong>
                  {name}
                  <span aria-hidden="true">↗</span>
                </strong>
                <span>{description}</span>
              </Link>
            ))}
          </div>
        ),
      },
      {
        id: 'status',
        title: '当前范围',
        content: (
          <>
            <p>
              当前版本为 0.0.1，尚未发布到 npm。通过本地打包安装，在 React / React DOM ^19.3.1
              的浏览器项目中验证；React 18 与服务端渲染兼容性尚未验证。
            </p>
            <p>
              这是非官方同人项目。代码的最终许可证与角色素材的完整许可清单尚未确定；文档站保留的字体
              OFL 声明只适用于相应字体。
            </p>
            <p>
              文档结构参考{' '}
              <Link
                href="https://ant.design/components/button-cn/"
                target="_blank"
                rel="noreferrer"
              >
                Ant Design
              </Link>
              、
              <Link
                href="https://www.radix-ui.com/themes/docs/components/button"
                target="_blank"
                rel="noreferrer"
              >
                Radix Themes
              </Link>{' '}
              与{' '}
              <Link
                href="https://guokaigdg.github.io/animal-island-ui/#/button"
                target="_blank"
                rel="noreferrer"
              >
                Animal Island UI
              </Link>
              ，按本库实际支持的能力提供示例和 API。
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'getting-started',
    name: '开始使用',
    chinese: '',
    group: '开始使用',
    description: '安装组件、加载样式，先把第一个按钮放进你的页面。',
    sections: [
      {
        id: 'choose-path',
        title: '从这里开始',
        content: (
          <nav className="guide-paths" aria-label="接入路径">
            <Link href="#/guides/getting-started?section=install">
              <strong>在自己的项目里使用组件 →</strong>
              <span>安装本地包，加载样式与主题，再复制需要的组件示例。</span>
            </Link>
            <Link href="#/guides/getting-started?section=blog-example">
              <strong>运行完整博客示例 →</strong>
              <span>在本仓库启动「小小日常」，看看库米如何用组件记录生活。</span>
            </Link>
            <Link href="#/guides/artwork?section=artwork-language">
              <strong>使用图标与插画 →</strong>
              <span>按需下载素材，选择图片用法或带暂停与重播的完整场景。</span>
            </Link>
          </nav>
        ),
      },
      {
        id: 'requirements',
        title: '1. 准备环境',
        content: (
          <>
            <p>
              本仓库使用 Node.js ≥22.22.3、npm 10.9.8。使用方需要 React 与 React DOM
              ^19.3.1，以及能够处理 CSS 导入的 React 构建工具。沿用已有应用，React 与 React DOM
              由应用提供。
            </p>
            <p>
              当前完整示例在 React 19、Vite 8、TypeScript 7 的浏览器项目中验证。含素材的源码使用
              Vite 的 <code>?no-inline</code> 或 <code>?raw</code>{' '}
              导入；其他工具链需配置对应资源处理，尚未验证原样复制。React 18 与 SSR 的状态见{' '}
              <Link href="#/guides/introduction?section=status">当前范围</Link>。
            </p>
            <Alert className="doc-callout">
              组件库尚未公开发布。请使用下面生成的 .tgz 文件安装。
            </Alert>
          </>
        ),
      },
      {
        id: 'install',
        title: '2. 构建并安装',
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
        title: '3. 加载样式，使用组件',
        content: (
          <>
            <p>
              在应用入口导入一次 <code>yahha-ui/style.css</code>，用 <code>ThemeProvider</code>{' '}
              包住组件区域，并显式设置 <code>theme="pink"</code>。
            </p>
            <p>
              下面的第一个按钮已经包含样式导入和主题设置，可直接保存为 <code>App.tsx</code>。
              放在已有 React 应用的源码目录，并由应用入口渲染。启动应用后，应看到带墨线和轻粉底的
              「收藏这篇文章」按钮，点击或用键盘 Space
              操作后切换选中状态；名称保持稳定，状态通过按钮外观与
              <code>aria-pressed</code> 表达。 使用其他示例时，按下一节的两文件方式操作。
            </p>
          </>
        ),
        examples: [
          {
            id: 'first-button',
            title: '第一个按钮',
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
              <Link href="#/components/button">Button</Link> 可以先验证普通示例，
              <Link href="#/guides/states?section=loading">加载场景</Link>{' '}
              可以验证含素材的完整接入。
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
            <p>
              <Link href={blogHref} target="_blank" rel="noopener noreferrer">
                体验示例网站 <ArrowUpRight size={16} aria-hidden="true" />
                <span className="sr-only">（新标签页打开）</span>
              </Link>
            </p>
            <p>在仓库根目录完成 npm ci 后执行：</p>
            <CodeBlock language="sh" source="npm run dev:blog" />
            <p>
              打开终端显示的本地地址，即可体验搜索、分类、分页和收藏。网站是本地示例，内容为演示数据；
              目录中的 README 说明启动、构建与接入方式。
            </p>
            <p>
              这个命令在本仓库运行，复用已构建组件包和根目录工具链；自己的应用只需安装{' '}
              <code>.tgz</code>。如需检查博客构建后的效果，执行：
            </p>
            <CodeBlock language="sh" source={'npm run build:blog\nnpm run preview:blog'} />
            <p>
              也可以先在文档中试试{' '}
              <Link href="#/guides/styling?section=reading">阅读与收藏组合</Link>
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
                <Link href="#/guides/styling">设计与组合</Link>：设计规则、阅读示例与组合约定。
              </li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    id: 'styling',
    name: '设计与组合',
    chinese: '',
    group: '开始使用',
    description: '从漫画墨线、纸面和配色开始，看看朋友们怎样走进你的页面。',
    sections: [
      {
        id: 'language',
        title: '把星球上的日常画进界面',
        content: (
          <>
            <p>
              纸签夹住一篇手记，朋友从页边探出头。Yahha
              星球的日常，落在圆润的墨线、纸面和角色插画里。深色墨线为按钮和字段勾出轮廓，白纸承载正文，浅粉强调少量操作与分类。浅蓝与浅黄作为可选配色保留在
              <Link href="#/components/theme-provider">ThemeProvider</Link>{' '}
              中；它们共享同一套形状、排版和交互规则。
            </p>
            <ul>
              <li>操作有轻重：主按钮饱满、有压印底边；辅助操作平整，文字操作保持轻量。</li>
              <li>选择有区别：分段选择是小纸托盘，栏目 Tabs 是无外框的墨线页签。</li>
              <li>浮层各有用途：短对白提示、锚定便笺、居中信笺分别处理轮廓和留白。</li>
              <li>
                反馈有语义：说明像一句回应，成功、警告与错误保持各自颜色；键盘位置只有一层清楚的焦点提示。
              </li>
              <li>
                文字先于装饰：组件继承应用字体，正文保持舒展行距；移除角色插画，页面仍然完整。
              </li>
              <li>加载有共同节拍：按钮与 Spinner 使用同一组三墨点，区块状态再按需加入角色场景。</li>
            </ul>
          </>
        ),
      },
      {
        id: 'reading',
        title: '用组件搭一篇生活手记',
        content: (
          <p>
            下面把作者信息、分类、搜索、摘要、正文、配图、图注与收藏放在一起。试着关闭配图、切换文章、搜索一个不存在的词，或沿正文链接读到文末便笺。整个示例不依赖角色图片或文档站字体。
          </p>
        ),
        examples: [
          {
            id: 'reading-example',
            title: '个人手记与阅读反馈',
            description:
              '用现有组件组成完整阅读区域，观察标题与段落节奏、图片占位和单一便笺容器。文章与作者为演示内容；搜索恢复、文章切换与页内链接保留明确焦点，收藏只保留在当前页面。',
            component: ReadingExample,
            source: readingSource,
            themeScope: 'explicit',
          },
        ],
      },
      {
        id: 'styles',
        title: '颜色与布局',
        content: (
          <>
            <p>
              颜色优先通过 <Link href="#/components/theme-provider">ThemeProvider 的 tokens</Link>{' '}
              定制；布局使用调用方容器或组件公开的 className / style。每页 API
              明确它们作用的元素，不依赖内部 CSS Modules 类名或 DOM 层级。
            </p>
            <p>
              例如，TextField 的 className 作用于整个字段，style 和 ref 作用于 input；Dialog 的
              className / style / ref 作用于弹窗面板。Toast、EmptyState、ThemeProvider
              不接收任意原生属性。
            </p>
          </>
        ),
      },
      {
        id: 'composition',
        title: '内容通过插槽组合',
        content: (
          <>
            <p>
              Button 的图标、EmptyState 的插画和操作、Dialog 的页脚、Toast 的后续操作都由 ReactNode
              插槽传入，不绑定图标库或图片目录。插画可省略，基础用法不依赖角色素材。
            </p>
            <p>
              装饰性图标与插画插槽会从辅助技术中隐藏。可访问名称放在正文、label 或 IconButton 的
              aria-label 中。
            </p>
          </>
        ),
      },
      {
        id: 'state',
        title: '状态由谁管理',
        content: (
          <>
            <ul>
              <li>Button 的 loading 负责禁用和视觉反馈；请求、错误恢复与重试由调用方处理。</li>
              <li>TextField 的 error 负责呈现错误；校验规则由调用方处理。</li>
              <li>SegmentedControl 和 Dialog 使用受控状态；在回调中更新 value 或 open。</li>
              <li>Toast 的计时、位置、队列与去重由调用方处理。它不会自动消失。</li>
            </ul>
          </>
        ),
      },
      {
        id: 'keyboard',
        title: '键盘与可访问性',
        content: (
          <>
            <p>
              按钮保留 Enter / Space 激活，分段单选使用原生 radio 的 Tab /
              方向键行为，弹窗管理焦点并支持
              Escape。请保留焦点样式，为所有图标操作提供准确名称，并在实际页面中检查文字对比、放大和键盘顺序。
            </p>
            <p>
              本库会响应减少动态效果的系统偏好。调用方新增的动画、图标和异步反馈也需要遵守相同约定。
            </p>
          </>
        ),
      },
      {
        id: 'examples',
        title: '如何阅读示例与 API',
        content: (
          <>
            <p>
              每个预览与展开后的代码来自同一份 TSX 文件。展开代码会显示原始示例，保存为
              Example.tsx；「完整接入」另给出
              App.tsx，包含样式导入与默认主题配置。两个文件放在同一目录即可组合使用。示例自身已配置主题时，入口不会再次包裹
              Provider。
            </p>
            <p>
              API 中「—」表示组件不设置该值。原生元素继承的全部属性不逐项罗列，请以对应 React
              原生类型为准；支持范围和作用目标在每页说明。
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'design-baseline',
    name: '设计规范',
    chinese: '',
    group: '开始使用',
    description: '让圆润轮廓、纸面细节与交互状态遵循同一套尺寸和排版规则。',
    sections: [
      {
        id: 'scope',
        title: '可爱的轮廓，清楚的尺度',
        content: (
          <>
            <p>
              奶白、暖墨与轻粉是推荐配色；不对称的圆钝轮廓、主操作的短按压底边、分类纸签和栏目墨线共同建立识别。内容面保持平整，角色素材按需进入等待与发现的场景。
            </p>
            <p>
              本页两份示例直接使用组件库默认主题与样式；复制后即可获得与组件页一致的控件高度、字号、边框和选中状态。
            </p>
          </>
        ),
      },
      {
        id: 'scale',
        title: '尺寸与文字，各有职责',
        content: (
          <>
            <ul>
              <li>
                常规单行 Button、IconButton、TextField 和 Select 以 44px 对齐；Button / IconButton
                的紧凑和宽松档分别为 36px、52px。各组件支持的尺寸配置以其 API 为准。
              </li>
              <li>
                控件文字按 12 / 14 / 16px 与 16 / 20 / 24px 行框配合；手机或粗指针下输入文字使用
                16px / 24px，同时调整内边距，保持常规高度。
              </li>
              <li>
                Text 的 sm / md / lg 为 14 / 16 / 18px。正文默认
                16px，字号增长不要求按钮、字段和所有辅助文字一起增长。
              </li>
              <li>
                Heading 的 h1–h6 默认字阶为 32 / 24 / 20 / 18 / 16 /
                14px。先选择正确语义层级，正文保持舒展行距。
              </li>
              <li>
                44px 是短单行的常规基准。长选项、多行标签和用户放大的文字允许控件增高；Textarea 按
                rows 和内容排布，不裁成单行高度。
              </li>
            </ul>
            <p>
              这些数值是本库为内容站点选定的尺度。参考主流库的 token
              与尺寸分档方法，不把其他库的默认值或点击目标要求当成统一视觉标准。
            </p>
          </>
        ),
      },
      {
        id: 'controls',
        title: '在同一个任务里验证控件',
        content: (
          <p>
            修正邮箱、选择分类、保存和收藏，再用 Tab
            检查焦点。正常、错误、只读、禁用与加载都使用同一套默认组件规则。
          </p>
        ),
        examples: [
          {
            id: 'design-controls',
            title: '规范表单与按钮尺寸',
            description:
              '常规字段和操作对齐，加载保留宽高；紧凑与宽松档通过公开 size 使用。请求与结果均为本地演示。',
            component: DesignBaseline,
            source: designBaselineSource,
            themeScope: 'explicit',
          },
        ],
      },
      {
        id: 'reading',
        title: '用真实阅读检验组合',
        content: (
          <p>
            栏目切换内容，范围筛选文章，收藏保留当前反馈。移除插画后，正文、控件与浮层仍应有清楚分工。
          </p>
        ),
        examples: [
          {
            id: 'design-reading',
            title: '默认组件组成的个人手记',
            description:
              '使用 16px 默认正文，以及 Tabs、SegmentedControl、Button 与空态；不依赖站点字体、额外 CSS 或角色素材。',
            component: DesignReading,
            source: designReadingSource,
            themeScope: 'explicit',
          },
        ],
      },
      {
        id: 'constraints',
        title: '让规范进入开发与验证',
        content: (
          <>
            <p>
              主题通过语义 token
              统一颜色与视觉规则。组合组件时由外层容器安排布局，尺寸、状态与交互使用各组件的公开属性配置。
            </p>
            <p>
              <code>npm run check:design</code>
              用于仓库开发时检查视觉规则。接入应用后，还应检查不同状态、手机字号、长内容、主题和键盘操作，确认组件适合实际页面。
            </p>
            <p>
              应用可通过公开 className / classNames / style 定制外观；内部尺寸变量不是公共定制
              API。默认示例可作为组合与排版的参考。
            </p>
            <p>
              方法参考{' '}
              <Link href="https://ant.design/docs/react/customize-theme/" external>
                Ant Design tokens
              </Link>
              、
              <Link href="https://www.radix-ui.com/themes/docs/theme/typography" external>
                Radix 排版
              </Link>
              与{' '}
              <Link href="https://github.com/guokaigdg/animal-island-ui" external>
                Animal Island UI
              </Link>
              。
              <Link
                href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html"
                external
              >
                W3C 的 44×44 点击目标
              </Link>
              与控件视觉高度分别评估。这是非官方项目的设计规范。
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'states',
    name: '状态与场景',
    chinese: '',
    group: '开始使用',
    description: '加载时说明在等什么，空页面留好下一步，遇到错误也能重新开始。',
    sections: [
      {
        id: 'archive',
        title: '文章归档与页面导航',
        content: (
          <p>
            Tabs 切换一组相关内容面板，Pagination 只更新当前列表，Accordion
            把补充说明留在阅读之后。栏目、搜索和页码来自同一份数据；重要的空结果恢复操作始终可见。
          </p>
        ),
        examples: [
          {
            id: 'scene-blog-archive',
            title: '个人博客归档',
            description:
              '浏览每页三篇手记，切换栏目或搜索后回到第一页；没有结果时恢复全部内容。翻页后从本页标题继续阅读，展开归档说明了解本地示例的状态边界。',
            component: BlogArchive,
            source: blogArchiveSource,
          },
        ],
      },
      {
        id: 'article-actions',
        title: '文章编辑与浮层组合',
        content: (
          <p>
            动作菜单负责选择操作，信笺弹窗承载编辑，便笺补充写作说明，短对白解释图标。它们各自承担不同的任务；保存、取消、错误恢复和收藏状态由使用方管理。
          </p>
        ),
        examples: [
          {
            id: 'scene-article-actions',
            title: '文章编辑与管理',
            description:
              '打开“手记操作”编辑、归档或恢复；在弹窗内选择分类、查看写作提示，再用 Escape 逐层返回。首次保存模拟失败，重试保留草稿，成功后显示可关闭的 Toast；星星按钮可以直接收藏。',
            component: ArticleActions,
            source: articleActionsSource,
          },
        ],
      },
      {
        id: 'loading',
        title: '加载、失败与恢复',
        content: (
          <p>
            按钮和行内加载使用共享三墨点。内容区配合翻页小手记
            SVG；减少动效时保留静止画面和文字。下方把正常内容、失败重试、无结果恢复与收藏撤销串起来；各组件只负责自己的呈现，流程由示例管理。
          </p>
        ),
        examples: [
          {
            id: 'scene-loading',
            title: '加载、失败与恢复',
            description:
              '选择下次结果，再重新加载；尝试失败重试、无结果恢复、收藏并撤销。1.8 秒计时器仅模拟请求，翻页 SVG 按状态播放，组件仍使用默认样式。',
            component: LoadingScene,
            source: loadingSceneSource,
            themeScope: 'explicit',
            assets: [
              { name: 'little-days-page-wait-motion.svg', href: loadingArtwork },
              { name: 'little-days-load-error-motion.svg', href: loadErrorArtwork },
              { name: 'little-days-collection-saved-motion.svg', href: savedArtwork },
            ],
          },
        ],
      },
      {
        id: 'empty',
        title: '空状态与下一步',
        content: (
          <p>
            首次无内容、暂无收藏与搜索无结果分别给出原因和操作。角色插画用于较大的首次空态，搜索无结果保持小巧；操作成功后不继续停在空态。
          </p>
        ),
        examples: [
          {
            id: 'scene-empty',
            title: '三种空态与恢复操作',
            description:
              '切换场景，创建示例手记、浏览文章或清空筛选。插画是可选素材，文字和操作始终由 HTML 呈现。',
            component: EmptyScene,
            source: emptySceneSource,
            themeScope: 'explicit',
            assets: [{ name: 'empty.png', href: emptyArtwork }],
          },
        ],
      },
      {
        id: 'not-found',
        title: '页面未找到与导航恢复',
        content: (
          <p>
            404 表示页面不存在，不是网络失败。下面用现有 Heading、Text 与 Link
            组合；实际未知文档路由也使用这份页面，页面标题保留 h1。
          </p>
        ),
        examples: [
          {
            id: 'scene-not-found',
            title: '文档 404 与导航恢复',
            description:
              '路牌插图没有烘焙文字，标题、原因和返回链接可直接读取。作为整页使用时传入 asPage。',
            component: NotFoundScene,
            source: notFoundSceneSource,
            themeScope: 'explicit',
            assets: [{ name: 'little-days-friends-lost.svg', href: notFoundArtwork }],
          },
        ],
      },
      {
        id: 'errors',
        title: '错误说明与恢复操作',
        content: (
          <>
            <p>
              加载失败使用 Alert
              与重试操作，保留用户输入或已有内容。警告、错误和危险动作有独立语义，不使用可爱表情替代原因。
            </p>
            <p>
              翻页手记是本项目绘制的 SVG，静态与动效版本见
              <Link href="#/guides/artwork">图标与插画</Link>。404 使用 v3
              人物模型与路牌、地图组成找路场景。空态 PNG 为非官方 AI
              生成展示资源，单独下载使用，不进入组件库默认产物；素材来源与授权状态见仓库内
              artwork/README.md。
            </p>
          </>
        ),
      },
    ],
  },
  artworkGuide,
];
