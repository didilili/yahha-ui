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

const firstBatchFiles = [
  { name: 'little-days-bookmark.svg', href: bookmark, label: '收藏书签 · 静态 · 24 × 24' },
  { name: 'little-days-tea-cup.svg', href: teaCup, label: '热茶 · 静态 · 96 × 96' },
  { name: 'little-days-tea-cup-motion.svg', href: teaCupMotion, label: '热茶 · 动效 · 96 × 96' },
  { name: 'little-days-page-wait.svg', href: pageWait, label: '翻页等待 · 静态 · 240 × 168' },
  {
    name: 'little-days-page-wait-motion.svg',
    href: pageWaitMotion,
    label: '翻页等待 · 动效 · 240 × 168',
  },
  {
    name: 'little-days-empty-collection.svg',
    href: emptyCollection,
    label: '空收藏口袋 · 静态 · 240 × 180',
  },
];

const stateFiles = [
  {
    name: 'little-days-search-empty.svg',
    href: searchEmpty,
    label: '搜索无结果 · 静态 · 240 × 180',
  },
  {
    name: 'little-days-collection-saved.svg',
    href: collectionSaved,
    label: '收藏成功 · 静态 · 240 × 180',
  },
  {
    name: 'little-days-collection-saved-motion.svg',
    href: collectionSavedMotion,
    label: '收藏成功 · 单次动效 · 240 × 180',
  },
  { name: 'little-days-load-error.svg', href: loadError, label: '加载失败 · 静态 · 240 × 180' },
  {
    name: 'little-days-load-error-motion.svg',
    href: loadErrorMotion,
    label: '加载失败 · 单次动效 · 240 × 180',
  },
  { name: 'little-days-friends-lost.svg', href: friendsLost, label: '朋友找路 · 静态 · 480 × 320' },
];

const welcomeFiles = [
  {
    name: 'friends-welcome.svg',
    href: welcomeArtwork,
    label: '朋友们的欢迎场景 · 静态 · 760 × 530',
  },
  {
    name: 'friends-welcome-motion.svg',
    href: welcomeMotionArtwork,
    label: '朋友们的欢迎场景 · 动效 · 760 × 530',
  },
];
const files = [...firstBatchFiles, ...stateFiles, ...welcomeFiles];

export const artworkGuide: DocPage = {
  id: 'artwork',
  name: '小日常 SVG',
  chinese: '',
  group: '开始使用',
  description: '朋友们的生活道具与状态小故事：等待、寻找、收好纸签，再一起找到回去的小路。',
  sections: [
    {
      id: 'artwork-language',
      title: '小图标、小道具与小场景',
      content: (
        <>
          <p>
            书签、热茶、手记和口袋围绕阅读与收集展开。暖墨轮廓、奶白纸面和少量轻粉延续组件库的形状语言，
            不同尺寸保留不同细节。找路场景使用 v3 角色，与路牌和地图共同构图。
          </p>
          <ul>
            <li>操作图标在 18 / 20 / 22px 的实际大小检查识别度，按钮和点击区域沿用组件规范。</li>
            <li>生活图案承担章节转折与陪伴，小尺寸不强塞完整人物或复杂表情。</li>
            <li>状态场景保留一个主要动作，状态文字、原因与恢复操作仍然清楚可见。</li>
          </ul>
          <p>
            这些是按需下载的展示素材，不包含在组件安装包中，也没有可从 yahha-ui 导入的素材入口。
            基础组件无需这些图片即可使用；首次安装组件请先完成{' '}
            <Link href="#/guides/getting-started">开始使用</Link>。
          </p>
        </>
      ),
    },
    {
      id: 'artwork-samples',
      title: '放回真实操作里看看',
      examples: [
        {
          id: 'little-days-artwork-example',
          title: '收藏一枚纸签，等一页小手记',
          description:
            '图标、图案和场景使用各自的真实尺寸。收藏、热茶播放与等待演示相互独立；演示只改变本页状态，不保存数据或发起网络请求。',
          component: LittleDaysArtwork,
          source: littleDaysSource,
          assets: firstBatchFiles.map(({ name, href }) => ({ name, href })),
        },
      ],
    },
    {
      id: 'artwork-states',
      title: '把等待之后的小故事接起来',
      content: (
        <>
          <p>
            草芽边的放大镜对应没有结果，星星纸签落进口袋对应收藏成功，松开的纸角对应暂时失败，
            朋友围着地图与路牌对应页面不存在。同一组生活道具在不同状态中延续，原因与下一步由文字讲清楚。
          </p>
          <p>
            成功与失败的动作只播放一次，然后停在完整结果。找路场景不改造型，也不把 404
            数字或按钮画进 SVG。
          </p>
        </>
      ),
      examples: [
        {
          id: 'little-days-states-example',
          title: '一起找找，再把喜欢的收好',
          description:
            '切换搜索、成功、失败和找路预览；成功与失败可选择静态或重播单次动作。本页只演示视觉状态，不发起网络请求或保存收藏，控制按钮始终保留。',
          component: LittleDaysStates,
          source: littleDaysStatesSource,
          assets: stateFiles.map(({ name, href }) => ({ name, href })),
        },
      ],
    },
    {
      id: 'artwork-welcome',
      title: '有风经过，也有朋友打招呼',
      content: (
        <>
          <p>
            云缓慢漂移，草芽与小花以根部为支点轻摆；小八挥两下前爪便回到原位。人物五官与身型沿用原模型，地面和内容卡片保持稳定。
          </p>
          <p>
            下方 FriendsWelcome
            组合示例与官网、博客首页使用同一个控制实现。暂停会停在当前帧，继续后接着播放；再次打招呼只重播前爪，云和草不从头开始。离屏、后台及系统减少动效设置也会停止运动。
            这些控制来自示例代码，单独下载 SVG 图片不会附带控制按钮或离屏检测。
          </p>
        </>
      ),
      examples: [
        {
          id: 'friends-welcome-example',
          title: '朋友们，和你说声你好',
          description:
            '进入画面后短暂挥手。试着暂停、继续、再打个招呼，或开启系统减少动效。场景控制不会改变阅读内容、组件主题或页面位置。',
          component: FriendsWelcome,
          source: welcomeSource,
          assets: [{ name: 'friends-welcome.svg', href: welcomeArtwork }],
        },
      ],
    },
    {
      id: 'artwork-downloads',
      title: '下载与接入',
      content: (
        <>
          <p>先按需要选择一种方式，静态与动效版本保留相同画幅：</p>
          <ul>
            <li>
              <strong>只需要图案：</strong>下载静态 SVG，作为普通图片使用，不需要额外的动效库。
            </li>
            <li>
              <strong>需要自动播放：</strong>选择文件名带 <code>-motion.svg</code> 的版本。 动效 CSS
              已在文件中；用图片引用即可播放，但不会自动获得页面级暂停控制。
            </li>
            <li>
              <strong>需要暂停、继续与挥手重播：</strong>复制上方欢迎场景的完整示例和静态{' '}
              <code>friends-welcome.svg</code>，由 FriendsWelcome 控制时间线。
            </li>
          </ul>
          <p>
            例如，只使用一张空收藏图案时，将对应文件放入同级 <code>artwork/</code>
            目录，下面的组件可直接保存在 Vite React 项目中：
          </p>
          <CodeBlock
            source={`import picture from './artwork/little-days-empty-collection.svg';

export default function CollectionPicture() {
  return (
    <img
      src={picture}
      alt=""
      width={240}
      height={180}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
}`}
          />
          <p>
            这段代码只显示图片。需要空态标题和操作时，再组合{' '}
            <Link href="#/components/empty-state">EmptyState</Link>；组件的 CSS
            与主题按开始使用页配置。
          </p>
          <p>可下载的文件如下：</p>
          <ul>
            {files.map(({ name, href, label }) => (
              <li key={name}>
                <Link href={href} download={name}>
                  下载{label}
                </Link>
              </li>
            ))}
          </ul>
          <p>
            每个完整示例各有对应的素材，按该示例「完整接入」的清单，将文件原名保存到{' '}
            <code>Example.tsx</code> 同级的 <code>artwork/</code>{' '}
            目录。源码与预览来自同一个文件；无需复制文档站外壳。
          </p>
          <p>
            完整素材示例按 Vite React 项目验证，原样源码使用 <code>?no-inline</code> 资源 URL；
            欢迎场景还使用 <code>?raw</code> 读取 SVG
            文本。使用其他构建工具时，需配置对应资源导入能力。 只作为图片使用时，可按上面的普通 SVG
            导入方式接入。
          </p>
          <p>
            单独使用时，可以把图标传给 <Link href="#/components/button">Button 的 startIcon</Link>
            ，把空态图片传给 <Link href="#/components/empty-state">EmptyState 的 illustration</Link>
            。这些插槽接收 React 元素：先用 <code>{'<img src={picture} alt="" />'}</code>{' '}
            创建图片元素，再传入插槽；不要直接传入导入后的图片 URL 字符串。纯装饰图片保留空{' '}
            <code>alt</code>，操作名称和状态说明放在页面文字中。
          </p>
          <p>
            FriendsWelcome 将静态文件渲染为原生
            SVG；单独以图片引用动效版时，图片外的按钮不能直接控制其内部时间线。
            这份组合示例依赖浏览器 DOM 和可见性 API，当前未验证服务端渲染。
          </p>
        </>
      ),
    },
    {
      id: 'artwork-motion',
      title: '动效有起止，静止也完整',
      content: (
        <>
          <ul>
            <li>
              道具与状态样张默认静态。热茶可主动开启或关闭；等待演示在开始后循环，结束时切回静帧。
            </li>
            <li>
              FriendsWelcome 在主要画面可见后启动，环境循环有可见暂停入口，招呼动作短暂结束。
              它会在离屏或后台时暂停；单独以图片引用的动效 SVG
              没有这层检测。欢迎场景在窄画幅下减少远云和次要植物运动。
            </li>
            <li>收藏成功与加载失败播放一次后停止；重复播放由演示按钮或新的实际状态事件触发。</li>
            <li>
              所有动效 SVG 都遵循 <code>prefers-reduced-motion</code>
              。系统开启减少动效时，即使选择了播放，也保留完整的静止画面。
            </li>
            <li>
              真实使用时让请求控制等待状态：结束或失败就移除等待场景，或者换成静态、结果图案。
              素材本身不发起请求，也不知道请求是否结束；不要为看完整动画增加延迟，或用未知进度编造百分比。
            </li>
            <li>人物和图案不代替错误说明、必填标记或可访问名称，不遮挡文字、焦点和恢复操作。</li>
          </ul>
          <p>
            按钮内的短等待使用三墨点，区块等待可按需加入场景。查看{' '}
            <Link href="#/guides/states?section=loading">完整加载与恢复流程</Link>，或返回{' '}
            <Link href="#/guides/design-baseline">设计规范</Link>。
          </p>
        </>
      ),
    },
  ],
};
