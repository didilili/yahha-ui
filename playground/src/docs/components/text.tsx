import TextExample from '../../examples/content/TextExample';
import textSource from '../../examples/content/TextExample.tsx?raw';
import TextComposition from '../../examples/content/TextComposition';
import textCompositionSource from '../../examples/content/TextComposition.tsx?raw';
import { defineComponentPage } from '../page';
import { nativeRows, example } from '../page-helpers';

export default defineComponentPage('text', {
  importCode: "import { Text } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          用于正文、摘要和阅读提示。每个 Text 是一个段落，内部可以组合链接、强调和纸签等行内内容。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        example(
          'text-sizes',
          '字号与文字色调',
          '分别比较三档字号，以及主要文字与次要文字的色调。',
          TextExample,
          textSource,
        ),
        example(
          'text-inline-composition',
          '行内组合与换行',
          '段落内的强调、纸签和链接，以及窄栏中的长词与地址换行。',
          TextComposition,
          textCompositionSource,
        ),
      ],
    },
    {
      id: 'design',
      title: '长文的阅读节奏',
      content: (
        <p>
          Text 默认行高为 1.8，段落不带外边距；栏宽、段距和章节留白由外层布局设置。
          长词与地址可以换行，连续正文的组合写法见{' '}
          <a href="#/guides/reading?section=reading-example">完整阅读示例</a>。
        </p>
      ),
    },
    {
      id: 'api',
      title: 'API',
      api: [
        {
          name: 'TextProps',
          rows: [
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              defaultValue: "'md'",
              description: '正文独立字阶 14 / 16 / 18px，默认 md 为 16px；不改变控件字号。',
            },
            {
              name: 'tone',
              type: "'default' | 'muted'",
              defaultValue: "'default'",
              description: '正文与次要文字。',
            },
            { name: 'children', type: 'ReactNode', description: '段落内容，支持行内元素。' },
            ...nativeRows('p'),
          ],
        },
      ],
    },
    {
      id: 'behavior',
      title: '段落与行内内容',
      content: (
        <p>
          多个段落分别使用 Text；不要在其中嵌套 div、另一个 p
          或标题。列表、图片与其他内容区块放在段落之外，行内链接和纸签保持各自语义。需要截断或展开长文时，由页面提供相应布局和操作。
        </p>
      ),
    },
  ],
});
