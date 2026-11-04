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
          <p>组件提供按钮、字段、内容排版和状态反馈，页面布局与业务数据由应用管理。</p>
          <p className="guide-status">当前为早期预览，通过 npm 安装。</p>
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
              <p>原生按钮、输入与单选语义；弹窗使用 Base UI 的焦点管理。</p>
            </div>
            <div>
              <BookOpen size={21} />
              <h3>文章与内容展示</h3>
              <p>组合文字、图片、收藏操作和表单，搭建文章页、归档列表与编辑界面。</p>
            </div>
            <div>
              <Layers size={21} />
              <h3>独立提供的展示素材</h3>
              <p>CSS 单独导入。角色插画、字体和文档站工具不进入组件包，可按需另行接入。</p>
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
      title: '组件文档',
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
            当前版本为 0.0.1，通过 npm 或本地安装包接入。在 React / React DOM ^19.3.1
            的浏览器项目中验证；React 18 与服务端渲染兼容性尚未验证。
          </p>
          <p>
            项目自有内容采用 MIT，第三方内容见{' '}
            <Link href="#/guides/artwork?section=artwork-sources">来源与分发范围</Link>。
          </p>
          <p>
            文档结构参考{' '}
            <Link href="https://ant.design/components/button-cn/" target="_blank" rel="noreferrer">
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
};

export default page;
