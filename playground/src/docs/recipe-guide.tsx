import { Link } from 'yahha-ui';
import archivePreview from '../assets/recipes/archive.png';
import editingPreview from '../assets/recipes/editing.png';
import emptyPreview from '../assets/recipes/empty.png';
import loadingPreview from '../assets/recipes/loading.png';
import notFoundPreview from '../assets/recipes/not-found.png';
import readingPreview from '../assets/recipes/reading.png';
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
          <p>按用途查看组合示例，每个示例均提供交互预览与原始 TSX，配套素材随对应示例提供。</p>
          <dl className="recipe-list recipe-grid">
            <div>
              <dt>
                <Link href="#/guides/reading?section=reading-example">
                  <span className="recipe-preview recipe-preview-reading">
                    <img
                      src={readingPreview}
                      alt=""
                      width={960}
                      height={600}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span>阅读与收藏</span>
                </Link>
              </dt>
              <dd>
                <p className="recipe-purpose">适用于文章详情与个人手记。</p>
                <p className="recipe-actions">支持按关键词搜索、切换文章、配图显隐和文章收藏。</p>
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
                      width={960}
                      height={600}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span>归档与搜索</span>
                </Link>
              </dt>
              <dd>
                <p className="recipe-purpose">适用于包含栏目筛选、搜索和分页的文章列表。</p>
                <p className="recipe-actions">
                  演示栏目筛选、搜索与分页；无匹配结果时可清空筛选恢复列表。
                </p>
                <p className="recipe-components">
                  组合组件：Input、Tabs、Pagination、Accordion、EmptyState。
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
                      width={960}
                      height={600}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span>编辑与保存</span>
                </Link>
              </dt>
              <dd>
                <p className="recipe-purpose">适用于文章编辑、归档与收藏操作区。</p>
                <p className="recipe-actions">编辑后保存，演示首次保存失败、草稿保留与重试成功。</p>
                <p className="recipe-components">
                  组合组件：DropdownMenu、Popover、Dialog、Input、Alert、Toast 等。
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
                      width={960}
                      height={600}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span>加载与重试</span>
                </Link>
              </dt>
              <dd>
                <p className="recipe-purpose">适用于内容加载、失败与结果恢复。</p>
                <p className="recipe-actions">
                  选择下次加载结果并重新加载，演示失败重试、无结果恢复与收藏撤销。
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
                      width={960}
                      height={600}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span>空状态</span>
                </Link>
              </dt>
              <dd>
                <p className="recipe-purpose">适用于首次无内容、暂无收藏与搜索无结果。</p>
                <p className="recipe-actions">
                  切换空状态，分别执行创建示例手记、浏览文章和清空筛选。
                </p>
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
                      width={960}
                      height={600}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span>404 页面</span>
                </Link>
              </dt>
              <dd>
                <p className="recipe-purpose">为没有对应页面的地址提供返回入口。</p>
                <p className="recipe-actions">通过链接前往开始使用或组件总览。</p>
                <p className="recipe-components">组合组件：Heading、Text 与原生导航链接。</p>
              </dd>
            </div>
          </dl>
        </>
      ),
    },
    {
      id: 'interactions',
      title: '交互组合',
      content: (
        <>
          <p>
            按具体任务查看完整流程，或<a href="#/guides/interactions">浏览全部交互组合</a>。
          </p>
          <ul>
            <li>
              <Link href="#/guides/interactions?section=button-delete-draft">删除确认与恢复</Link>
            </li>
            <li>
              <Link href="#/guides/interactions?section=icon-button-reading-list">
                收藏列表与焦点恢复
              </Link>
            </li>
            <li>
              <Link href="#/guides/interactions?section=icon-composition">搜索与逐项收藏</Link>
            </li>
            <li>
              <Link href="#/guides/interactions?section=checkbox-reading-topics">
                多选筛选与地址同步
              </Link>
            </li>
            <li>
              <Link href="#/guides/interactions?section=checkbox-reading-list">
                批量操作与失败恢复
              </Link>
            </li>
            <li>
              <Link href="#/guides/interactions?section=badge-status">表单校验与状态摘要</Link>
            </li>
            <li>
              <Link href="#/guides/interactions?section=alert-action">订阅设置与失败重试</Link>
            </li>
            <li>
              <Link href="#/guides/interactions?section=timer-and-action">计时提示与撤销</Link>
            </li>
            <li>
              <Link href="#/guides/interactions?section=heading-reading-layout">
                章节导航与分享
              </Link>
            </li>
            <li>
              <Link href="#/guides/interactions?section=counts">栏目计数与清单操作</Link>
            </li>
            <li>
              <Link href="#/guides/interactions?section=controlled">菜单触发器移除与恢复</Link>
            </li>
            <li>
              <Link href="#/guides/interactions?section=basic">清单操作与提示回焦</Link>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'copy',
      title: '接入项目',
      content: (
        <ol>
          <li>
            按<Link href="#/guides/getting-started?section=copy-example">集中接入说明</Link>
            配置样式和主题入口，并核对示例工具链要求。
          </li>
          <li>
            在目标场景展开代码，原样保存为 <code>Example.tsx</code>，由项目引入。
          </li>
          <li>
            有「示例素材」时，以 <code>Example.tsx</code>{' '}
            所在目录为起点，按清单标注的相对路径保存文件，保留源码中的导入路径。
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
            示例演示保存、搜索、分页与计时等交互流程，使用页面内状态，不连接后台，刷新后恢复初始数据。接入时，需由应用配置后台请求和数据持久化。
          </p>
          <p>
            组件继承项目字体，角色、插画和文档站字体独立提供。含素材示例使用 Vite
            资源导入，工具链范围见上方集中接入说明。
          </p>
          <p>
            需要调整字段或浮层时，可查看
            <Link href="#/components/input?section=text-field-customization">字段定制</Link>与
            <Link href="#/components/select?section=select-portal-customization">下拉面板定制</Link>
            。
          </p>
        </>
      ),
    },
  ],
};
