import HeadingStructure from '../../examples/content/HeadingStructure';
import headingStructureSource from '../../examples/content/HeadingStructure.tsx?raw';
import HeadingExample from '../../examples/content/HeadingExample';
import headingSource from '../../examples/content/HeadingExample.tsx?raw';
import HeadingDecoration from '../../examples/content/HeadingDecoration';
import headingDecorationSource from '../../examples/content/HeadingDecoration.tsx?raw';
import { defineComponentPage } from '../page';
import { nativeRows, example } from '../page-helpers';

export default defineComponentPage('heading', {
  importCode: "import { Heading } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: <p>用于页面、文章和章节标题。按内容结构选择标题层级，默认字号随层级变化。</p>,
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        example(
          'heading-levels',
          '标题层级对照',
          '用相同文字比较一级至六级标题，观察各层级的默认字号。',
          HeadingExample,
          headingSource,
        ),
        example(
          'heading-decoration',
          '普通与短墨线',
          '保持文字与层级相同，对比默认无装饰与可选短墨线。',
          HeadingDecoration,
          headingDecorationSource,
        ),
        example(
          'heading-reading-layout',
          '文章标题层级',
          '在同一段文章结构中接续 h2、h3 和 h4，并保留长标题的完整文字。',
          HeadingStructure,
          headingStructureSource,
        ),
      ],
    },
    {
      id: 'recipes',
      title: '相关组合',
      kind: 'related',
      content: (
        <p>
          目录定位与章节分享由页面实现。原生章节链接、定位焦点和复制失败回退见
          <a href="#/guides/interactions?section=heading-reading-layout">章节导航与分享组合</a>。
        </p>
      ),
    },
    {
      id: 'design',
      title: '标题间距与长标题',
      content: (
        <p>
          标题默认没有外边距，使用外层布局区分章节之间与标题到正文的间距。默认
          decoration="none"，不绘制短墨线；显式设置 underline 时，任意层级均增加短墨线及 0.48em
          底部留白。长标题会自然换行，应保留完整文字；不要仅为缩小字号或改变装饰而调整标题层级。
        </p>
      ),
    },
    {
      id: 'api',
      title: 'API',
      api: [
        {
          name: 'HeadingProps',
          rows: [
            {
              name: 'level',
              type: '1 | 2 | 3 | 4 | 5 | 6',
              defaultValue: '2',
              description: '渲染的标题层级，默认字号依次为 32 / 24 / 20 / 18 / 16 / 14px。',
            },
            { name: 'children', type: 'ReactNode', description: '标题内容。' },
            {
              name: 'decoration',
              type: "'none' | 'underline'",
              defaultValue: "'none'",
              description: '可选短曲墨线，独立于语义层级；仅 underline 预留装饰所需底部空间。',
            },
            ...nativeRows('h2', 'h1–h6 标题'),
          ],
        },
      ],
    },
    {
      id: 'behavior',
      title: '接续页面的标题层级',
      content: (
        <p>
          文章标题使用 h1 时，下一级章节使用 h2，小节使用
          h3；嵌入已有页面时，接续所在页面的结构。标题层级表达内容关系，不用于单纯调整字号。
        </p>
      ),
    },
  ],
});
