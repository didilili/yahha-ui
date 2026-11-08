import ImageExample from '../../examples/content/ImageExample';
import imageSource from '../../examples/content/ImageExample.tsx?raw';
import ImageFallback from '../../examples/content/ImageFallback';
import imageFallbackSource from '../../examples/content/ImageFallback.tsx?raw';
import ImageDetail from '../../examples/scenes/ImageDetail';
import imageDetailSource from '../../examples/scenes/ImageDetail.tsx?raw';
import teaCupAsset from '../../examples/scenes/artwork/little-days-tea-cup.svg?no-inline';
import { defineComponentPage } from '../page';
import { example } from '../page-helpers';

export default defineComponentPage('image', {
  importCode: "import { Image } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          用于文章封面和内容图片。alt 描述图片对当前内容的意义，纯装饰图片使用空字符串；图注可与外层
          figure、figcaption 组合。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        example(
          'image-cover',
          '固定比例与图注',
          '使用 16:9 比例预留图片区域，并搭配图注。',
          ImageExample,
          imageSource,
        ),
        example(
          'image-failure',
          '失败回退与恢复',
          '切换图片地址，展示加载失败时的回退与恢复。',
          ImageFallback,
          imageFallbackSource,
        ),
      ],
    },
    {
      id: 'integration',
      title: '进阶用法',
      disclosure: '查看大图预览与素材接入',
      content: (
        <p>
          使用独立按钮打开 Dialog，缩略图与大图使用同一素材。完整接入提供原样源码和 SVG，保留
          artwork 目录及相对导入路径。
        </p>
      ),
      examples: [
        {
          id: 'image-detail',
          title: '缩略图与大图预览',
          description: '通过独立按钮与 Dialog 组合预览同一图片，关闭后返回入口。',
          component: ImageDetail,
          source: imageDetailSource,
          toc: false,
          assets: [{ name: 'little-days-tea-cup.svg', href: teaCupAsset }],
        },
      ],
    },
    {
      id: 'design',
      title: '加载前后保持图片区域',
      content: (
        <>
          <p>
            封面可以用 aspectRatio 统一比例并预留空间，图片会按 cover
            裁切。需要完整展示的正文图片可以不设比例，保留自然尺寸；显式设置 aspectRatio="auto"
            时也使用自然布局，失败说明随内容展开。原生 width / height
            不能为失败回退预留相同比例；加载失败后仍需保持版面时，应显式设置固定比例。
          </p>
        </>
      ),
    },
    {
      id: 'api',
      title: 'API',
      api: [
        {
          name: 'ImageProps',
          rows: [
            {
              name: 'alt',
              type: 'string',
              required: true,
              description: '原生替代文字；失败回退也以此作为名称。',
            },
            {
              name: 'src / srcSet / sizes',
              type: '原生 img 属性',
              description: '图片地址与响应式资源选择。',
            },
            {
              name: 'aspectRatio',
              type: "CSSProperties['aspectRatio']",
              description:
                '固定比例设置在外层容器，在加载、失败和恢复期间保持预留区域；auto 使用自然布局。',
            },
            {
              name: 'fallback',
              type: 'ReactNode',
              defaultValue: '图片暂时无法显示',
              description:
                '失败后的装饰内容；可访问名称仍使用 alt。说明宜简短，固定比例内较长的内容可滚动查看。',
            },
            {
              name: 'loading',
              type: "'lazy' | 'eager'",
              defaultValue: "'lazy'",
              description: '原生加载策略；首屏关键图片可设 eager。',
            },
            { name: 'className', type: 'string', description: '作用于外层比例容器。' },
            {
              name: 'classNames',
              type: '{ image?: string; fallback?: string }',
              description: '附加到真实 img 与失败容器。',
            },
            {
              name: 'style / ref',
              type: 'CSSProperties / Ref<HTMLImageElement>',
              description: '作用于真实 img，失败时 img 仍保留但隐藏。',
            },
            {
              name: 'onLoad / onError',
              type: '原生 img 事件',
              description: '监听图片加载成功或失败，可用于更新相邻状态说明。',
            },
            {
              name: 'hidden / aria-hidden',
              type: '原生对应属性',
              description: '作用于整个图片呈现，包括失败回退；aria-hidden 不改变可见性。',
            },
            {
              name: '其他原生图片属性',
              type: "Omit<ComponentPropsWithRef<'img'>, 'alt'>",
              description: '包括 width、height、decoding 等，传给 img。',
            },
          ],
        },
      ],
    },
    {
      id: 'behavior',
      title: '替代文字与失败恢复',
      content: (
        <ul>
          {[
            '失败后仍以 alt 作为可访问名称，fallback 是装饰内容。alt="" 的图片及失败回退都保持装饰性，即使 aria-hidden={false} 也不会补出图像名称。',
            '缺少可用地址时直接显示 fallback，不触发 onError；图片加载失败也显示 fallback。更换 src 或 srcSet 会重新进入加载。清空地址后再设置原地址，也会重新加载。组件不自动重试，重试按钮应放在组件外，由页面更新资源地址。',
            '固定比例较小而失败提示过长时，回退区域允许滚动。非装饰图片的溢出回退可通过 Tab 聚焦，再用方向键或 PageDown 查看；短提示及空 alt 的装饰图片不会增加键盘入口。',
            '不要把必要说明或交互元素只放进 fallback，因为整个回退内容用于装饰。需要隐藏图片时，hidden 隐藏图片与回退，aria-hidden 仅将两者从辅助技术中隐藏。',
          ].map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ),
    },
  ],
});
