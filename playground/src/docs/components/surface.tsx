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
          description: '默认内边距为 24px；通过 style 或 className 调整容器宽度与内容布局。',
          component: SurfaceBasic,
          source: surfaceBasicSource,
        },
        {
          id: 'surface-composition',
          title: '组合文章摘要',
          description:
            '与 Badge、Heading、Text 和 Button 组合，用标题为文章区域命名，并提供收藏操作。',
          component: SurfaceComposition,
          source: surfaceCompositionSource,
        },
      ],
    },
    {
      id: 'design',
      title: '内容布局',
      content: (
        <p>
          通过 style 或 className 设置容器宽度和内部布局。例如设置 <code>display: grid</code> 与{' '}
          <code>gap</code>，安排标题、正文与操作之间的间距。
        </p>
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
