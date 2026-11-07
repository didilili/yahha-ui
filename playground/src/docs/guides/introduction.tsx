import { ArrowUpRight, BookOpen, Layers, MousePointer2 } from 'lucide-react';
import { Link } from 'yahha-ui';
import type { DocPage } from '../types';
import { componentCatalog } from '../component-catalog';
import { guideMetadata } from '../guide-catalog';

const page: DocPage = {
  ...guideMetadata('introduction'),
  sections: [
    {
      id: 'overview',
      title: '一起做，全宇宙最可爱的 UI 组件库。',
      content: (
        <>
          <p>Yahha UI 是一套漫画手账风 React 组件库，面向个人博客、个人主页与内容网站。</p>
          <p>
            组件可组合成文章页、作者介绍和归档列表；组件负责交互与外观，页面布局与业务数据由应用管理。
          </p>
          <p className="guide-status">支持 npm 安装与本地构建。</p>
          <div className="guide-actions">
            <Link className="guide-primary" href="#/guides/getting-started">
              开始使用 <ArrowUpRight size={16} />
            </Link>
            <Link href="#/guides/reading?section=reading">体验阅读示例 →</Link>
            <Link href="#/guides/states?section=loading">查看状态与反馈 →</Link>
            <Link href="#/guides/design-baseline">查看设计规范 →</Link>
          </div>
          <div className="principles">
            <div>
              <MousePointer2 size={21} />
              <h3>原生语义与焦点管理</h3>
              <p>
                按钮、输入框和单选项保留原生语义；弹窗使用 Base UI 管理焦点，具体操作见各页说明。
              </p>
            </div>
            <div>
              <BookOpen size={21} />
              <h3>文章与内容展示</h3>
              <p>组合示例包含正文、配图、收藏、搜索与编辑，提供交互预览和可复制源码。</p>
            </div>
            <div>
              <Layers size={21} />
              <h3>可选插画与字体</h3>
              <p>
                组件 CSS
                单独导入，默认继承应用字体。角色插画、字体和文档站工具另行提供，不进入组件包。
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'try',
      title: '交互场景',
      content: (
        <nav className="guide-paths" aria-label="内容场景">
          <Link href="#/guides/reading?section=reading">
            <strong>阅读与收藏示例 →</strong>
            <span>演示文章切换、配图显隐、后记导航与收藏操作。</span>
          </Link>
          <Link href="#/guides/states?section=archive">
            <strong>文章归档示例 →</strong>
            <span>演示栏目筛选、搜索、分页与无结果恢复。</span>
          </Link>
          <Link href="#/guides/states?section=article-actions">
            <strong>文章编辑示例 →</strong>
            <span>演示标题编辑、保存失败后的草稿保留与重试。</span>
          </Link>
        </nav>
      ),
    },
    {
      id: 'components',
      title: '组件文档',
      content: (
        <div className="component-overview">
          <Link href="#/components">
            <strong>浏览组件 →</strong>
            <span>按分类查看组件用法、示例与 API，支持展开和复制代码。</span>
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
            本指南随仓库源码更新，具体功能以所安装版本为准；尚未发布的改动可通过本地构建试用。
            当前在 React / React DOM ^19.3.1 的浏览器项目中验证；React 18
            与服务端渲染兼容性尚未验证。
          </p>
          <p>
            项目自有内容采用 MIT，第三方内容见{' '}
            <Link href="#/guides/artwork?section=artwork-sources">来源与分发范围</Link>。
          </p>
        </>
      ),
    },
  ],
};

export default page;
