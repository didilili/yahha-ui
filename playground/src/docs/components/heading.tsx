import HeadingExample from '../../examples/content/HeadingExample';
import headingSource from '../../examples/content/HeadingExample.tsx?raw';
import HeadingArticle from '../../examples/content/HeadingArticle';
import headingArticleSource from '../../examples/content/HeadingArticle.tsx?raw';
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
          'heading-reading-layout',
          '文章结构与长标题',
          '通过目录定位章节，查看标题层级与长标题换行。',
          () => <HeadingArticle hrefPrefix="#/components/heading?section=" />,
          headingArticleSource,
        ),
      ],
    },
    {
      id: 'design',
      title: '标题间距与长标题',
      content: (
        <p>
          标题默认没有外边距，使用外层布局区分章节之间与标题到正文的间距。长标题会自然换行，应保留完整文字；不要仅为缩小字号而改变标题层级。
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
            ...nativeRows('h2', 'h1–h6 标题'),
          ],
        },
      ],
    },
    {
      id: 'behavior',
      title: '接续页面的标题层级',
      content: (
        <>
          <p>
            例如文章标题使用 h1 时，下一级章节使用 h2，小节使用
            h3；嵌入已有页面时，接续所在页面的结构。
          </p>
          <p>
            目录链接引用标题在页面内唯一的 id。定位后的滚动与焦点由页面处理；上例通过 ref
            聚焦目标标题，并设置 tabIndex={-1}，使其可被聚焦而不额外加入 Tab 顺序。
          </p>
        </>
      ),
    },
  ],
});
