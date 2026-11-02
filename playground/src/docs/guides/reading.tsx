import ReadingExample from '../../examples/ReadingExample';
import readingSource from '../../examples/ReadingExample.tsx?raw';
import type { DocPage } from '../types';
import { guideMetadata } from '../guide-catalog';

const page: DocPage = {
  ...guideMetadata('reading'),
  sections: [
    {
      id: 'reading',
      title: '文章阅读与收藏',
      content: (
        <p>
          此示例组合作者信息、文章列表、搜索、正文、配图与收藏。可关闭配图、切换文章、搜索标题或内容，并通过正文链接定位到文末后记。示例不依赖角色图片或文档站字体。
        </p>
      ),
      examples: [
        {
          id: 'reading-example',
          title: '个人手记',
          description:
            '文章与作者为演示内容，收藏只保留在当前页面。切换文章后定位到标题；清空无结果搜索后回到搜索框。',
          component: ReadingExample,
          source: readingSource,
          themeScope: 'explicit',
        },
      ],
    },
  ],
};

export default page;
