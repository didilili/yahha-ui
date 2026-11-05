import { Link } from 'yahha-ui';
import LoadingScene from '../../examples/scenes/LoadingScene';
import loadingSceneSource from '../../examples/scenes/LoadingScene.tsx?raw';
import EmptyScene from '../../examples/scenes/EmptyScene';
import emptySceneSource from '../../examples/scenes/EmptyScene.tsx?raw';
import NotFoundScene from '../../examples/scenes/NotFoundScene';
import notFoundSceneSource from '../../examples/scenes/NotFoundScene.tsx?raw';
import ArticleActions from '../../examples/scenes/ArticleActions';
import articleActionsSource from '../../examples/scenes/ArticleActions.tsx?raw';
import BlogArchive from '../../examples/scenes/BlogArchive';
import blogArchiveSource from '../../examples/scenes/BlogArchive.tsx?raw';
import loadingArtwork from '../../examples/scenes/artwork/little-days-page-wait-motion.svg?no-inline';
import loadErrorArtwork from '../../examples/scenes/artwork/little-days-load-error-motion.svg?no-inline';
import savedArtwork from '../../examples/scenes/artwork/little-days-collection-saved-motion.svg?no-inline';
import emptyArtwork from '../../examples/scenes/artwork/empty.png';
import notFoundArtwork from '../../examples/scenes/artwork/little-days-friends-lost.svg?no-inline';
import type { DocPage } from '../types';
import { guideMetadata } from '../guide-catalog';

const page: DocPage = {
  ...guideMetadata('states'),
  sections: [
    {
      id: 'archive',
      title: '文章归档与页面导航',
      content: (
        <p>
          此示例使用 Tabs 切换栏目、Pagination 翻页、Accordion
          折叠归档说明，支持栏目筛选、搜索与分页；所有操作使用同一份本地数据。
        </p>
      ),
      examples: [
        {
          id: 'scene-blog-archive',
          title: '个人博客归档',
          description:
            '每页显示三篇手记。切换栏目或搜索后返回第一页，翻页后焦点移到本页标题；无匹配结果时，可通过清空筛选恢复文章列表。',
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
          此示例组合 DropdownMenu、Dialog、Popover 和
          Tooltip，实现文章菜单、编辑弹窗、写作提示与操作提示；保存、取消、错误恢复及收藏状态由示例管理，接入应用时需配置数据与保存逻辑。
        </p>
      ),
      examples: [
        {
          id: 'scene-article-actions',
          title: '文章编辑与管理',
          description:
            '通过“手记操作”编辑标题或分类。首次保存模拟失败并保留草稿，重试成功后显示可关闭的 Toast；支持归档、恢复和收藏，Escape 可逐层关闭提示与弹窗。',
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
          此示例使用 Spinner、Alert 和 EmptyState
          分别呈现加载、失败与无结果状态；加载、恢复与收藏流程由示例管理。翻页插画可选，减少动效时显示静止画面。
        </p>
      ),
      examples: [
        {
          id: 'scene-loading',
          title: '加载、失败与恢复',
          description:
            '选择下次加载结果后，重新加载文章可切换正常、失败和无结果状态，并支持失败重试、无结果恢复与收藏撤销。请求通过 1.8 秒计时器模拟，不连接后台。',
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
          首次无内容、暂无收藏与搜索无结果分别提供创建、浏览文章和清空筛选操作。插画可选，搜索无结果时不显示大幅插画。
        </p>
      ),
      examples: [
        {
          id: 'scene-empty',
          title: '三种空态与恢复操作',
          description:
            '演示三种空状态及对应恢复操作。创建手记、浏览文章和清空筛选均由示例处理；插画可选，文字和操作由 HTML 呈现。',
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
          404 表示地址没有对应页面。此示例使用 Heading、Text
          和原生导航链接，也用于文档站的未知路由。实际网络错误应另行提供失败说明与重试操作。
        </p>
      ),
      examples: [
        {
          id: 'scene-not-found',
          title: '文档 404 与导航恢复',
          description:
            '通过链接返回使用指南或组件总览。作为整页使用时传入 asPage，标题使用 h1；嵌入示例时使用 h3。',
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
            加载失败时，用 Alert 说明原因，并给出重试入口。已有内容和输入值需要保留时，由应用管理；
            警告、错误与危险操作使用相应语义，并说明原因、影响与可用操作。
          </p>
          <p>
            翻页、加载失败与收藏动效为本项目绘制的 SVG，404 插画包含角色、路牌与地图。空态 PNG 为 AI
            生成展示资源。这些素材单独下载，不进入组件库默认产物；来源与许可状态见
            <Link href="#/guides/artwork">图标与插画</Link>。
          </p>
        </>
      ),
    },
  ],
};

export default page;
