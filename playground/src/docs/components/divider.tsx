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
          '正文使用语义分隔；元信息使用隐藏于辅助技术的装饰分隔。',
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
          轻纸线支持水平和垂直方向。水平线自带上下留白；放进已有 gap
          的布局时，应协调外层间距，避免重复留白。垂直分隔适合短元信息，具体高度可按所在行调整。
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
        <p>
          默认分隔会进入辅助技术的阅读结构，适合正文主题的变化。作者、日期等信息之间的线条通常只是装饰，使用
          decorative 隐藏其分隔语义。orientation
          只决定方向；垂直线也需要按内容判断是否保留语义。Divider 不接收
          children，需要分组标题时单独使用标题元素。
        </p>
      ),
    },
  ],
});
