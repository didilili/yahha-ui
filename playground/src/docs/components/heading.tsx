import HeadingExample from '../../examples/content/HeadingExample';
import headingSource from '../../examples/content/HeadingExample.tsx?raw';
import HeadingArticle from '../../examples/content/HeadingArticle';
import headingArticleSource from '../../examples/content/HeadingArticle.tsx?raw';
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
          '同一标题层级可独立选择装饰；默认不绘制短墨线，也不预留装饰空间。',
          HeadingDecoration,
          headingDecorationSource,
        ),
      ],
    },
    {
      id: 'integration',
      title: '进阶用法',
      disclosure: '查看文章层级与章节链接',
      examples: [
        example(
          'heading-reading-layout',
          '文章层级与章节链接',
          '定位章节、复制章节地址；复制失败时可手动复制。',
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
        <>
          <p>
            例如文章标题使用 h1 时，下一级章节使用 h2，小节使用
            h3；嵌入已有页面时，接续所在页面的结构。
          </p>
          <p>
            目录链接引用标题在页面内唯一的 id。定位后的滚动与焦点由页面处理；上例通过 ref
            聚焦目标标题，并设置 tabIndex={-1}，使其可被聚焦而不额外加入 Tab 顺序。
          </p>
          <p>
            章节分享属于页面任务。示例复用固定 id 与 hrefPrefix
            生成永久链接；剪贴板失败时显示可选中的只读地址，
            仍可用浏览器原生方式复制。接入自己的路由时替换 hrefPrefix，不由 Heading 自动生成地址。
            页面定位时为固定页头保留滚动留白，接入自己的站点时按路由与页头布局处理。
          </p>
        </>
      ),
    },
  ],
});
