import SkeletonExample from '../../examples/content/SkeletonExample';
import skeletonSource from '../../examples/content/SkeletonExample.tsx?raw';
import SkeletonShapes from '../../examples/content/SkeletonShapes';
import skeletonShapesSource from '../../examples/content/SkeletonShapes.tsx?raw';
import { defineComponentPage } from '../page';
import { example } from '../page-helpers';

export default defineComponentPage('skeleton', {
  importCode: "import { Skeleton } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          用于内容结构已知、数据仍在加载的区域，例如文章摘要、头像或封面。按真实内容的形状预留空间，数据就绪后替换为内容。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        example(
          'skeleton-shapes',
          '基本形状',
          '对比文本、矩形与圆形占位。',
          SkeletonShapes,
          skeletonShapesSource,
        ),
        example(
          'skeleton-content',
          '从占位到内容',
          '手动切换文章摘要的占位与内容，观察预留空间；不发起请求。',
          SkeletonExample,
          skeletonSource,
        ),
      ],
    },
    {
      id: 'design',
      title: '占位与真实内容共用布局',
      content: (
        <p>
          占位与头像、标题及摘要使用同一布局，按实际内容预留空间；加载结束后允许长内容自然增高，不靠裁切维持占位高度。减少动效时停止动画，强制颜色下保留占位轮廓。
        </p>
      ),
    },
    {
      id: 'api',
      title: 'API',
      api: [
        {
          name: 'SkeletonProps',
          rows: [
            {
              name: 'variant',
              type: "'text' | 'rect' | 'circle'",
              defaultValue: "'text'",
              description: '文本行、矩形或圆形。',
            },
            {
              name: 'width / height',
              type: 'CSSProperties 尺寸',
              description:
                '文本默认 100% × 1em，矩形默认 100% × 100px。未指定尺寸的圆形默认 44 × 44px，在窄容器内等比缩小；指定 width、height 或 style 尺寸时沿用自定义尺寸，style 中的同名属性优先。',
            },
            {
              name: 'aria-hidden',
              type: 'true',
              defaultValue: 'true',
              description: '固定隐藏于辅助技术，不能通过同名属性覆盖。',
            },
            {
              name: 'className / style',
              type: 'string / CSSProperties',
              description: '作用于根 span。',
            },
            { name: 'ref', type: 'Ref<HTMLSpanElement>', description: '指向根 span。' },
            {
              name: '其他原生属性 / 事件',
              type: 'Omit<ComponentPropsWithRef<"span">, "children">',
              description: '事件、data-* 等作用于根 span；不接收 children。',
            },
          ],
        },
      ],
    },
    {
      id: 'behavior',
      title: '加载区域与状态说明',
      content: (
        <p>
          Skeleton 固定为 aria-hidden，不接受 children。将 aria-busy
          放在正在更新的内容区域，并在加载结束时同步清除；必要的可见等待说明和状态播报放在占位之外。请求失败或确认没有内容后，应换成相应说明与恢复入口，避免一直保留加载占位。
        </p>
      ),
    },
  ],
});
