import SurfaceBasic from '../../examples/foundations/SurfaceBasic';
import surfaceBasicSource from '../../examples/foundations/SurfaceBasic.tsx?raw';
import SurfaceComposition from '../../examples/foundations/SurfaceComposition';
import surfaceCompositionSource from '../../examples/foundations/SurfaceComposition.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('surface', {
  importCode: "import { Surface } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          用于组织文章摘要、作者介绍和阅读提示等内容。Surface
          提供平面纸面与轻边框，标题、正文和操作在容器内按内容需要组合。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        {
          id: 'surface-basic',
          title: '基础用法',
          description: '标题与正文的静态组合。',
          component: SurfaceBasic,
          source: surfaceBasicSource,
        },
        {
          id: 'surface-composition',
          title: '组合文章摘要',
          description: '点击“收藏文章”切换状态，收藏仅保留在当前示例中。',
          component: SurfaceComposition,
          source: surfaceCompositionSource,
        },
      ],
    },
    {
      id: 'design',
      title: '内容布局',
      content: (
        <>
          <p>
            默认内边距为 24px，容器宽度与内容间距由使用方安排。通过 style 或 className 设置{' '}
            <code>maxWidth</code>、<code>display: grid</code> 与 <code>gap</code>
            ，组织标题、正文与操作。
          </p>
          <p>
            连续正文按阅读顺序排布，只在需要独立纸面时使用容器。完整用法见
            <a href="#/guides/reading?section=reading-example">阅读组合中的文末便笺</a>。
          </p>
        </>
      ),
    },
    {
      id: 'api',
      title: 'API',
      api: [
        {
          name: 'SurfaceProps',
          rows: [
            { name: 'children', type: 'ReactNode', description: '容器内容。' },
            {
              name: 'className / style',
              type: 'string / CSSProperties',
              description: '作用于根 div，可调整布局与外观。',
            },
            { name: 'ref', type: 'Ref<HTMLDivElement>', description: '指向根 div。' },
            {
              name: '其余原生属性',
              type: "ComponentPropsWithRef<'div'>",
              description:
                '透传 div 属性，例如 role、aria-labelledby、id、data-*。没有额外的组件专属属性。',
            },
          ],
        },
      ],
    },
    {
      id: 'accessibility',
      title: '为内容区域命名',
      content: (
        <>
          <p>
            Surface 默认是普通 div。内容确实构成需要单独导航的区域时，再提供 role="region"，并用
            aria-labelledby 关联内部标题；标题层级应接续所在页面。
          </p>
          <p>
            阅读文章使用标题链接，收藏文章使用独立按钮。仅给整个 Surface
            绑定点击事件，不会提供相应的键盘操作或链接语义。
          </p>
        </>
      ),
    },
  ],
});
