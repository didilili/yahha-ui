import DividerExample from '../../examples/content/DividerExample';
import dividerSource from '../../examples/content/DividerExample.tsx?raw';
import { defineComponentPage } from '../page';
import { nativeRows, example } from '../page-helpers';

export default defineComponentPage('divider', {
  importCode: "import { Divider } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          用于标出内容主题的转折，或在并列元信息之间作视觉分隔。前者保留默认 hr 语义，后者设置
          decorative。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        example(
          'divider-directions',
          '水平与垂直',
          '水平主题分隔与垂直装饰分隔。',
          DividerExample,
          dividerSource,
        ),
      ],
    },
    {
      id: 'design',
      title: '分隔线与分组留白',
      content: (
        <p>
          水平线默认上下各留白 20px；放进已有 gap 的布局时，可设置{' '}
          <code>{'style={{ margin: 0 }}'}</code>，由外层统一安排间距，见
          <a href="#/guides/states?section=scene-blog-archive">文章归档组合</a>
          。垂直分隔适合短元信息，可通过 style 或 className 调整高度。
        </p>
      ),
    },
    {
      id: 'api',
      title: 'API',
      api: [
        {
          name: 'DividerProps',
          rows: [
            {
              name: 'orientation',
              type: "'horizontal' | 'vertical'",
              defaultValue: "'horizontal'",
              description: '方向，垂直默认高度 1.5em。',
            },
            {
              name: 'decorative',
              type: 'boolean',
              defaultValue: 'false',
              description: 'true 时 role=presentation、aria-hidden=true。',
            },
            ...nativeRows('hr'),
          ],
        },
      ],
    },
    {
      id: 'behavior',
      title: '主题分隔还是装饰',
      content: (
        <>
          <p>
            orientation 只决定方向；垂直线也需要按内容判断是否保留语义。设置 decorative
            后，线条仍可见，但其分隔语义隐藏于辅助技术。
          </p>
          <p>
            分隔线默认是静态内容，无需添加 tabIndex。Divider 不接收
            children，需要分组标题时单独使用标题元素。
          </p>
        </>
      ),
    },
  ],
});
