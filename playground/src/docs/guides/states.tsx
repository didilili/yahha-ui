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
          Tabs 按栏目切换文章，Pagination 分页显示列表，Accordion
          收纳归档说明。栏目、搜索和页码使用同一份本地数据。
        </p>
      ),
      examples: [
        {
          id: 'scene-blog-archive',
          title: '个人博客归档',
          description:
            '每页显示三篇手记，切换栏目或搜索后回到第一页；无结果时可清空筛选恢复文章。翻页后焦点移至本页标题。',
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
          DropdownMenu 选择操作，Dialog 编辑文章，Popover 显示写作提示，Tooltip
          说明收藏图标。保存、取消、错误恢复和收藏状态由示例管理，接入时需连接应用的数据与保存逻辑。
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
          Spinner 表示等待，Alert 提供失败说明与重试，EmptyState
          显示无结果。翻页插画为可选素材，减少动效时显示静止画面。加载、恢复与收藏流程由示例管理。
        </p>
      ),
      examples: [
        {
          id: 'scene-loading',
          title: '加载、失败与恢复',
          description:
            '选择下次结果，再重新加载文章；可重试失败请求、恢复无结果内容、收藏并撤销。请求由 1.8 秒计时器模拟，不连接后台。',
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
          按首次无内容、暂无收藏或搜索无结果显示对应说明，提供创建、浏览或清空筛选操作。插画可选，搜索无结果不显示大幅插画。
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
            使用 Alert
            说明加载失败并提供重试操作；需要保留的已有内容与输入值由应用管理。警告、错误和危险操作使用相应语义，文字说明发生了什么以及下一步操作。
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
