import SurfaceBasic from '../../examples/foundations/SurfaceBasic';
import surfaceBasicSource from '../../examples/foundations/SurfaceBasic.tsx?raw';
import SurfaceComposition from '../../examples/foundations/SurfaceComposition';
import surfaceCompositionSource from '../../examples/foundations/SurfaceComposition.tsx?raw';
import SurfaceCover from '../../examples/foundations/SurfaceCover';
import surfaceCoverSource from '../../examples/foundations/SurfaceCover.tsx?raw';
import SurfaceNotes from '../../examples/foundations/SurfaceNotes';
import surfaceNotesSource from '../../examples/foundations/SurfaceNotes.tsx?raw';
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
          提供平整纸面与轻边框，标题、正文和操作可按内容需要组合。
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
          id: 'surface-notes',
          title: '便笺样式',
          description: '用 note 纸面呈现一段后记。',
          component: SurfaceNotes,
          source: surfaceNotesSource,
        },
      ],
    },
    {
      id: 'integration',
      title: '进阶用法',
      disclosure: '查看内容组合与贴边封面',
      examples: [
        {
          id: 'surface-composition',
          title: '内容与操作组合',
          description: '在容器中组合分类、标题、正文与独立操作区。',
          component: SurfaceComposition,
          source: surfaceCompositionSource,
          toc: false,
        },
        {
          id: 'surface-cover',
          title: '贴边封面与内容分区',
          description: '封面贴齐容器边缘，正文保留内距。',
          component: SurfaceCover,
          source: surfaceCoverSource,
          toc: false,
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
            ，组织标题与正文。
          </p>
          <p>
            连续正文按阅读顺序排布，只在需要独立纸面时使用容器。完整用法见
            <a href="#/guides/reading?section=reading-example">阅读组合中的文末便笺</a>。
          </p>
          <p>
            paper 保留默认白纸；note 使用轻底便笺与一处纸角，字阶、轮廓和 24px 内边距保持。
            封面示例通过公开 style 将 Surface 的 padding 设为 0，由内部内容区安排桌面 24px、窄屏
            16px 留白；标题链接独立导航，图片区域保留 16:9 比例。
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
            {
              name: 'variant',
              type: "'paper' | 'note'",
              defaultValue: "'paper'",
              description: '白纸或轻底便笺，仅影响视觉，不自动赋予 note 或 region 语义。',
            },
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
              description: '透传 div 属性，例如 role、aria-labelledby、id、data-*。',
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
