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
          此示例组合作者信息、正文、配图和收藏操作，支持按标题或内容搜索、查看后记及切换配图显示。不依赖角色图片或文档站字体。
        </p>
      ),
      examples: [
        {
          id: 'reading-example',
          title: '个人手记',
          description:
            '支持文章切换和正文到后记的锚点导航。切换文章后焦点移到标题，清空无结果搜索后焦点返回搜索框。文章与作者为演示内容，收藏仅保留在当前页面。',
          component: ReadingExample,
          source: readingSource,
          themeScope: 'explicit',
        },
      ],
    },
  ],
};

export default page;
