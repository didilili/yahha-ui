import { Link } from 'yahha-ui';
import LittleDaysArtwork from '../examples/scenes/LittleDaysArtwork';
import littleDaysSource from '../examples/scenes/LittleDaysArtwork.tsx?raw';
import LittleDaysStates from '../examples/scenes/LittleDaysStates';
import littleDaysStatesSource from '../examples/scenes/LittleDaysStates.tsx?raw';
import bookmark from '../examples/scenes/artwork/little-days-bookmark.svg?no-inline';
import teaCup from '../examples/scenes/artwork/little-days-tea-cup.svg?no-inline';
import teaCupMotion from '../examples/scenes/artwork/little-days-tea-cup-motion.svg?no-inline';
import pageWait from '../examples/scenes/artwork/little-days-page-wait.svg?no-inline';
import pageWaitMotion from '../examples/scenes/artwork/little-days-page-wait-motion.svg?no-inline';
import emptyCollection from '../examples/scenes/artwork/little-days-empty-collection.svg?no-inline';
import searchEmpty from '../examples/scenes/artwork/little-days-search-empty.svg?no-inline';
import collectionSaved from '../examples/scenes/artwork/little-days-collection-saved.svg?no-inline';
import collectionSavedMotion from '../examples/scenes/artwork/little-days-collection-saved-motion.svg?no-inline';
import loadError from '../examples/scenes/artwork/little-days-load-error.svg?no-inline';
import loadErrorMotion from '../examples/scenes/artwork/little-days-load-error-motion.svg?no-inline';
import friendsLost from '../examples/scenes/artwork/little-days-friends-lost.svg?no-inline';
import FriendsWelcome from '../examples/scenes/FriendsWelcome';
import welcomeSource from '../examples/scenes/FriendsWelcome.tsx?raw';
import welcomeArtwork from '../examples/scenes/artwork/friends-welcome.svg?no-inline';
import welcomeMotionArtwork from '../examples/scenes/artwork/friends-welcome-motion.svg?no-inline';
import { CodeBlock } from './CodeBlock';
import type { DocPage } from './types';
import styles from './artwork-guide.module.css';

type ArtworkFile = { name: string; href: string };
type Artwork = {
  title: string;
  description: string;
  width: number;
  height: number;
  image: ArtworkFile;
  motion?: ArtworkFile;
  motionLabel?: string;
};

const files = {
  bookmark: { name: 'little-days-bookmark.svg', href: bookmark },
  tea: { name: 'little-days-tea-cup.svg', href: teaCup },
  teaMotion: { name: 'little-days-tea-cup-motion.svg', href: teaCupMotion },
  wait: { name: 'little-days-page-wait.svg', href: pageWait },
  waitMotion: { name: 'little-days-page-wait-motion.svg', href: pageWaitMotion },
  empty: { name: 'little-days-empty-collection.svg', href: emptyCollection },
  search: { name: 'little-days-search-empty.svg', href: searchEmpty },
  saved: { name: 'little-days-collection-saved.svg', href: collectionSaved },
  savedMotion: { name: 'little-days-collection-saved-motion.svg', href: collectionSavedMotion },
  error: { name: 'little-days-load-error.svg', href: loadError },
  errorMotion: { name: 'little-days-load-error-motion.svg', href: loadErrorMotion },
  lost: { name: 'little-days-friends-lost.svg', href: friendsLost },
  welcome: { name: 'friends-welcome.svg', href: welcomeArtwork },
  welcomeMotion: { name: 'friends-welcome-motion.svg', href: welcomeMotionArtwork },
} satisfies Record<string, ArtworkFile>;

const artworkGroups: { title: string; layout?: 'compact' | 'scene'; items: Artwork[] }[] = [
  {
    title: '图标与装饰',
    layout: 'compact',
    items: [
      {
        title: '收藏书签',
        description: '用于收藏按钮，与“收藏 / 已收藏”文字一起使用。收藏状态由按钮表达。',
        width: 24,
        height: 24,
        image: files.bookmark,
      },
      {
        title: '热茶',
        description: '用于文章页或侧栏的装饰。动效为蒸汽循环，不表示加载进度。',
        width: 96,
        height: 96,
        image: files.tea,
        motion: files.teaMotion,
        motionLabel: '循环动效',
      },
    ],
  },
  {
    title: '状态插画',
    items: [
      {
        title: '翻页等待',
        description: '用于内容区加载。请求结束后切换为内容或结果；按钮内等待可使用 Spinner。',
        width: 240,
        height: 168,
        image: files.wait,
        motion: files.waitMotion,
        motionLabel: '循环动效',
      },
      {
        title: '暂无收藏',
        description:
          '用于尚未收藏任何内容的收藏夹，可搭配浏览文章的入口。搜索无匹配时使用“搜索无结果”。',
        width: 240,
        height: 180,
        image: files.empty,
      },
      {
        title: '搜索无结果',
        description: '已有关键词或筛选条件，但没有匹配内容。搭配修改关键词或清空筛选的入口。',
        width: 240,
        height: 180,
        image: files.search,
      },
      {
        title: '收藏成功',
        description: '用于收藏完成后的结果提示。动效播放一次，结束后保留完整图案。',
        width: 240,
        height: 180,
        image: files.saved,
        motion: files.savedMotion,
        motionLabel: '单次动效',
      },
      {
        title: '加载失败',
        description: '用于请求失败、内容未能加载的情况。搭配错误原因和重试操作，与暂无内容区分。',
        width: 240,
        height: 180,
        image: files.error,
        motion: files.errorMotion,
        motionLabel: '单次动效',
      },
      {
        title: '页面不存在',
        description: '用于失效链接或 404 页面。搭配返回首页或目录的入口，提示文字放在图片外。',
        width: 480,
        height: 320,
        image: files.lost,
      },
    ],
  },
  {
    title: '欢迎场景',
    layout: 'scene',
    items: [
      {
        title: '朋友们的欢迎场景',
        description: '用于首页或介绍页。需要暂停、继续和挥手重播时，使用下方的欢迎动效示例。',
        width: 760,
        height: 530,
        image: files.welcome,
        motion: files.welcomeMotion,
        motionLabel: '场景动效',
      },
    ],
  },
];

/* oxlint-disable jsx-a11y/no-redundant-roles -- Safari needs the list role when list markers are removed. */
function ArtworkCatalog() {
  return (
    <div className={styles.catalog}>
      {artworkGroups.map((group, index) => (
        <section key={group.title} aria-labelledby={`artwork-group-${index}`}>
          <h3 id={`artwork-group-${index}`} className={styles.groupTitle}>
            {group.title}
          </h3>
          <ul
            className={[styles.grid, group.layout && styles[group.layout]]
              .filter(Boolean)
              .join(' ')}
            role="list"
          >
            {group.items.map((artwork) => (
              <li key={artwork.image.name} className={styles.item}>
                <div className={styles.preview}>
                  <img
                    src={artwork.image.href}
                    alt=""
                    width={artwork.width}
                    height={artwork.height}
                    loading="lazy"
                  />
                </div>
                <h4 className={styles.itemTitle}>{artwork.title}</h4>
                <p className={styles.metadata}>
                  {artwork.width} × {artwork.height} · {artwork.motionLabel ?? '静态'}
                </p>
                <p className={styles.description}>{artwork.description}</p>
                <div className={styles.downloads}>
                  <Link
                    href={artwork.image.href}
                    download={artwork.image.name}
                    aria-label={`下载${artwork.title}：静态 SVG`}
                  >
                    静态 SVG
                  </Link>
                  {artwork.motion && (
                    <Link
                      href={artwork.motion.href}
                      download={artwork.motion.name}
                      aria-label={`下载${artwork.title}：${artwork.motionLabel} SVG`}
                    >
                      动效 SVG
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
/* oxlint-enable jsx-a11y/no-redundant-roles */

export const artworkGuide: DocPage = {
  id: 'artwork',
  name: '图标与插画',
  chinese: '',
  group: '开始使用',
  description: '用于收藏、加载、空状态和首页的 SVG 素材，提供预览、下载与组件组合示例。',
  sections: [
    {
      id: 'artwork-language',
      title: '素材预览与下载',
      content: (
        <>
          <p>
            一杯热茶、一枚书签，还有挥手的朋友。Yahha
            星球的日常藏在这些图案里，等你把它们放进页面。操作结果与下一步仍由文字说明。
          </p>
          <p>
            小日常系列共 9 种图案，其中 5
            种提供动效版。下方预览均为静态，静态与动效文件保留相同画幅。
            素材按需下载，不随组件包安装。
          </p>
          <ArtworkCatalog />
        </>
      ),
    },
    {
      id: 'artwork-samples',
      title: '与组件组合',
      examples: [
        {
          id: 'little-days-artwork-example',
          title: '收藏按钮、等待与空收藏夹',
          description:
            '将图标放入 Button，将插画放入 EmptyState。试用收藏按钮、热茶动效和等待开关；操作仅更新本页演示。',
          component: LittleDaysArtwork,
          source: littleDaysSource,
          assets: [
            files.bookmark,
            files.tea,
            files.teaMotion,
            files.wait,
            files.waitMotion,
            files.empty,
          ],
        },
      ],
    },
    {
      id: 'artwork-states',
      title: '状态切换示例',
      examples: [
        {
          id: 'little-days-states-example',
          title: '搜索、成功、失败与 404',
          description: '切换状态查看图片与提示的组合。收藏成功和加载失败支持单次动效与重播。',
          component: LittleDaysStates,
          source: littleDaysStatesSource,
          assets: [
            files.search,
            files.saved,
            files.savedMotion,
            files.error,
            files.errorMotion,
            files.lost,
          ],
        },
      ],
    },
    {
      id: 'artwork-welcome',
      title: '欢迎动效示例',
      content: (
        <p>
          需要控制动效时，复制此示例与配套的静态 SVG。它支持暂停当前帧、继续播放和重播挥手，
          并在离屏或切到后台时暂停。
        </p>
      ),
      examples: [
        {
          id: 'friends-welcome-example',
          title: '暂停、继续与挥手重播',
          description: '暂停与继续控制整个场景；“再打个招呼”只重播挥手动作。',
          component: FriendsWelcome,
          source: welcomeSource,
          assets: [files.welcome],
        },
      ],
    },
    {
      id: 'artwork-downloads',
      title: '接入方式',
      content: (
        <>
          <p>
            从 <Link href="#/guides/artwork?section=artwork-language">素材预览区</Link>下载 SVG，
            保存到项目的 <code>artwork/</code> 目录，通过图片元素使用。下面以搜索空状态为例：
          </p>
          <CodeBlock
            source={`import { EmptyState, Link } from 'yahha-ui';
import picture from './artwork/little-days-search-empty.svg';

export default function SearchEmpty() {
  return (
    <EmptyState
      title="未找到相关文章"
      description="试试其他关键词，或返回文章列表。"
      illustration={
        <img src={picture} alt="" width={240} height={180}
          style={{ maxWidth: '100%', height: 'auto' }} />
      }
      action={<Link href="/articles">浏览全部文章</Link>}
    />
  );
}`}
          />
          <p>
            将示例链接替换为自己网站的文章列表地址。样式与 ThemeProvider 按{' '}
            <Link href="#/guides/getting-started">开始使用</Link>
            配置；只有装饰需求时，直接使用上面的 <code>img</code> 即可。
          </p>
          <p>
            <Link href="#/components/button">Button 的 startIcon</Link> 和{' '}
            <Link href="#/components/empty-state">EmptyState 的 illustration</Link> 接收 React
            元素， 传入 <code>{'<img src={picture} alt="" />'}</code>。装饰图片保留空{' '}
            <code>alt</code>， 操作名称、状态原因和下一步用图片外的文字说明。
          </p>
          <details className={styles.setup}>
            <summary>复制完整示例时的文件与构建要求</summary>
            <p>
              展开对应示例的“完整接入”，保存原样 <code>Example.tsx</code>、<code>App.tsx</code>，
              并将素材按原名放到 <code>Example.tsx</code> 同级的 <code>artwork/</code> 目录。
            </p>
            <p>
              完整示例按 Vite React 项目验证，源码使用 <code>?no-inline</code> 导入资源 URL；
              欢迎示例还使用 <code>?raw</code> 读取 SVG 文本。其他构建工具需配置相应导入能力。
              欢迎示例依赖浏览器 DOM 和可见性 API，尚未验证服务端渲染。
            </p>
          </details>
        </>
      ),
    },
    {
      id: 'artwork-motion',
      title: '动效使用说明',
      content: (
        <>
          <ul>
            <li>
              <strong>热茶与翻页等待：</strong>动效循环播放。实际请求结束或失败时，移除等待图，
              或切换为内容和结果；等待时长由请求决定。
            </li>
            <li>
              <strong>收藏成功与加载失败：</strong>动作播放一次后停止，再次播放需重新挂载图片，
              可参考状态切换示例。
            </li>
            <li>
              <strong>欢迎场景：</strong>
              动效文件可直接通过图片引用；需要外部按钮控制、离屏与后台暂停，
              请使用上方完整示例和静态文件。
            </li>
            <li>
              <strong>减少动效：</strong>所有动效 SVG 遵循 <code>prefers-reduced-motion</code>，
              系统开启减少动效时显示完整静帧。
            </li>
          </ul>
          <p>
            按钮内的短等待可用 <Link href="#/components/spinner">Spinner</Link>，固定内容占位可用{' '}
            <Link href="#/components/skeleton">Skeleton</Link>。完整流程见{' '}
            <Link href="#/guides/states?section=loading">加载与恢复示例</Link>。
          </p>
        </>
      ),
    },
  ],
};
