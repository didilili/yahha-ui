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
          '行内组合与长词换行',
          '分别展示正文中的纸签和链接，以及 32ch 窄栏内中英文长词的自然换行。',
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
          正文采用独立字阶和较松的行高，次要提示可使用
          muted。长文章的栏宽、段距和章节留白由外层布局建立；Text
          默认没有外边距，不会为每一段自动增加间隔。长单词与地址可以换行，窄栏中仍应检查真实内容的阅读效果。
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
