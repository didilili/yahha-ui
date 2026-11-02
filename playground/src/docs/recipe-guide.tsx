import { Link } from 'yahha-ui';
import archivePreview from '../assets/recipes/archive.png';
import editingPreview from '../assets/recipes/editing.png';
import emptyPreview from '../assets/recipes/empty.png';
import loadingPreview from '../assets/recipes/loading.png';
import notFoundPreview from '../assets/recipes/not-found.png';
import readingPreview from '../assets/recipes/reading.png';
import { blogHref } from '../site/site-links';
import type { DocPage } from './types';
import { guideMetadata } from './guide-catalog';

export const recipeGuide: DocPage = {
  ...guideMetadata('recipes'),
  sections: [
    {
      id: 'choose',
      title: '选择场景',
      content: (
        <>
          <p>按用途选择场景，进入后可体验操作、查看原始 TSX 和完整接入说明。</p>
          <dl className="recipe-list recipe-grid">
            <div>
              <dt>
                <Link href="#/guides/reading?section=reading-example">
                  <span className="recipe-preview recipe-preview-reading">
                    <img
                      src={readingPreview}
                      alt=""
                      width={910}
                      height={1831}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span>阅读与收藏</span>
                </Link>
              </dt>
              <dd>
                <p className="recipe-purpose">适合文章详情与个人手记。</p>
                <p className="recipe-actions">搜索与切换文章、显示或隐藏配图，再收藏当前文章。</p>
                <p className="recipe-components">
                  组合组件：Text、Heading、Avatar、Image、Button 等。
                </p>
              </dd>
            </div>
            <div>
              <dt>
                <Link href="#/guides/states?section=scene-blog-archive">
                  <span className="recipe-preview">
                    <img
                      src={archivePreview}
                      alt=""
                      width={910}
                      height={1163}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span>归档与搜索</span>
                </Link>
              </dt>
              <dd>
                <p className="recipe-purpose">适合带分类与搜索的文章列表。</p>
                <p className="recipe-actions">切换栏目、搜索和翻页；无结果时可清空筛选恢复文章。</p>
                <p className="recipe-components">
                  组合组件：TextField、Tabs、Pagination、Accordion、EmptyState。
                </p>
              </dd>
            </div>
            <div>
              <dt>
                <Link href="#/guides/states?section=scene-article-actions">
                  <span className="recipe-preview recipe-preview-editing">
                    <img
                      src={editingPreview}
                      alt=""
                      width={910}
                      height={336}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span>编辑与保存</span>
                </Link>
              </dt>
              <dd>
                <p className="recipe-purpose">适合带编辑、归档与收藏的文章操作区。</p>
                <p className="recipe-actions">编辑后保存，体验首次失败、保留草稿和重试成功。</p>
                <p className="recipe-components">
                  组合组件：DropdownMenu、Popover、Dialog、TextField、Alert、Toast 等。
                </p>
              </dd>
            </div>
            <div>
              <dt>
                <Link href="#/guides/states?section=scene-loading">
                  <span className="recipe-preview">
                    <img
                      src={loadingPreview}
                      alt=""
                      width={910}
                      height={653}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span>加载与重试</span>
                </Link>
              </dt>
              <dd>
                <p className="recipe-purpose">适合内容加载与失败恢复。</p>
                <p className="recipe-actions">
                  选择下次结果并重新加载，体验失败重试、无结果恢复与收藏撤销。
                </p>
                <p className="recipe-components">
                  组合组件：Spinner、Alert、EmptyState、Toast 等。
                </p>
              </dd>
            </div>
            <div>
              <dt>
                <Link href="#/guides/states?section=scene-empty">
                  <span className="recipe-preview">
                    <img
                      src={emptyPreview}
                      alt=""
                      width={910}
                      height={555}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span>空状态</span>
                </Link>
              </dt>
              <dd>
                <p className="recipe-purpose">适合首次无内容、暂无收藏与搜索无结果。</p>
                <p className="recipe-actions">切换空态，创建示例手记、浏览文章或清空筛选。</p>
                <p className="recipe-components">组合组件：EmptyState、Button 等。</p>
              </dd>
            </div>
            <div>
              <dt>
                <Link href="#/guides/states?section=scene-not-found">
                  <span className="recipe-preview">
                    <img
                      src={notFoundPreview}
                      alt=""
                      width={910}
                      height={511}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span>404 页面</span>
                </Link>
              </dt>
              <dd>
                <p className="recipe-purpose">适合地址不存在时的页面导航。</p>
                <p className="recipe-actions">通过链接前往开始使用或组件总览。</p>
                <p className="recipe-components">组合组件：Heading、Text 与原生导航链接。</p>
              </dd>
            </div>
          </dl>
        </>
      ),
    },
    {
      id: 'copy',
      title: '接入项目',
      content: (
        <ol>
          <li>
            先完成<Link href="#/guides/getting-started">安装、样式导入和主题设置</Link>。
          </li>
          <li>
            在目标场景展开代码，原样保存为 <code>Example.tsx</code>。
          </li>
          <li>
            打开「完整接入」，保存 <code>App.tsx</code>；有素材清单时，按文件名放入同级{' '}
            <code>artwork/</code> 目录。
          </li>
          <li>替换示例数据与文字。页面布局在外层容器调整，组件样式使用文档说明的公开入口。</li>
        </ol>
      ),
    },
    {
      id: 'scope',
      title: '接入边界',
      content: (
        <>
          <p>
            这些场景由页面状态驱动，不连接后台。保存、搜索、分页、计时和数据持久化按各示例的说明实现，不是所有组件都自动提供的能力。
          </p>
          <p>
            组件继承项目字体；角色、插画和文档站字体不在组件安装包内。含素材示例使用 Vite
            资源导入，工具链范围见
            <Link href="#/guides/getting-started?section=copy-example">示例工具链说明</Link>。
          </p>
          <p>
            需要调整字段或浮层时，可查看
            <Link href="#/components/text-field?section=text-field-customization">字段定制</Link>与
            <Link href="#/components/select?section=select-portal-customization">下拉面板定制</Link>
            。
          </p>
        </>
      ),
    },
    {
      id: 'blog',
      title: '完整博客',
      content: (
        <>
          <p>
            「小小日常」把首页、手记归档和文章详情连在一起，包含分类、搜索、分页和当前浏览器收藏。适合从完整网站开始修改。
          </p>
          <div className="guide-actions">
            <Link href={blogHref} target="_blank" rel="noopener noreferrer">
              体验示例网站<span className="sr-only">（新标签页打开）</span>
            </Link>
            <Link href="#/guides/getting-started?section=blog-example">运行与改站说明</Link>
          </div>
        </>
      ),
    },
  ],
};
