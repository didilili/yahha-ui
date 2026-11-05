import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'yahha-ui';
import archivePreview from '../assets/recipes/archive.png';
import editingPreview from '../assets/recipes/editing.png';
import readingPreview from '../assets/recipes/reading.png';
import { blogHref } from './site-links';
import './home-scenes.css';

export default function HomeScenes() {
  return (
    <section className="home-scenes" aria-labelledby="home-scenes">
      <div className="home-scenes-inner">
        <header className="home-scenes-heading">
          <p className="home-scenes-eyebrow">用组件搭内容网站</p>
          {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
          <h2 id="home-scenes" tabIndex={-1}>
            阅读、归档与文章编辑
          </h2>
          <p>提供阅读、归档和文章编辑的完整组合，包含交互预览与接入代码。</p>
        </header>

        <div className="home-scenes-grid">
          <article className="home-scene home-scene-reading">
            <Link className="home-scene-link" href="#/guides/reading?section=reading-example">
              <span className="home-scene-preview">
                <img
                  src={readingPreview}
                  alt=""
                  width={910}
                  height={1831}
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <h3>
                阅读与收藏 <ArrowRight size={18} aria-hidden="true" />
              </h3>
            </Link>
            <p>组合作者信息、正文、配图与收藏操作，展示文章页的实现。</p>
          </article>

          <article className="home-scene home-scene-archive">
            <Link className="home-scene-link" href="#/guides/states?section=scene-blog-archive">
              <span className="home-scene-preview">
                <img
                  src={archivePreview}
                  alt=""
                  width={910}
                  height={1163}
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <h3>
                归档与搜索 <ArrowRight size={18} aria-hidden="true" />
              </h3>
            </Link>
            <p>按分类筛选、关键词搜索与分页浏览手记，支持清空筛选恢复列表。</p>
          </article>

          <article className="home-scene home-scene-editing">
            <Link className="home-scene-link" href="#/guides/states?section=scene-article-actions">
              <span className="home-scene-preview">
                <img
                  src={editingPreview}
                  alt=""
                  width={910}
                  height={336}
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <h3>
                文章编辑与保存 <ArrowRight size={18} aria-hidden="true" />
              </h3>
            </Link>
            <p>通过操作菜单修改标题或摘要；首次保存失败后保留输入，支持重试。</p>
          </article>
        </div>

        <div className="home-scenes-footer">
          <div>
            <p className="home-scenes-boundary">
              示例使用演示数据与当前页面状态。用到自己的项目时，需要接入数据和保存逻辑。
            </p>
            <p>完整博客示例包含首页、手记归档与文章详情。</p>
          </div>
          <Link
            className="home-scenes-blog-link"
            href={blogHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            体验示例网站 <ArrowUpRight size={17} aria-hidden="true" />
            <span className="sr-only">（新标签页打开）</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
