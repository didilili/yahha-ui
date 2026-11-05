import DividerBasic from '../../examples/content/DividerBasic';
import dividerBasicSource from '../../examples/content/DividerBasic.tsx?raw';
import DividerVertical from '../../examples/content/DividerVertical';
import dividerVerticalSource from '../../examples/content/DividerVertical.tsx?raw';
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
      content: <p>内容主题发生转折时，保留默认 hr 语义；只需分开并列元信息时，设置 decorative。</p>,
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        example(
          'divider-basic',
          '基础用法',
          '在两个内容段落之间标出主题转折。',
          DividerBasic,
          dividerBasicSource,
        ),
        example(
          'divider-vertical',
          '垂直分隔',
          '用装饰性竖线分开并列短文字。',
          DividerVertical,
          dividerVerticalSource,
        ),
      ],
    },
    {
      id: 'integration',
      title: '进阶用法',
      disclosure: '查看长元信息组合',
      examples: [
        example(
          'divider-directions',
          '响应式内容分隔',
          '窄屏隐藏元信息之间的装饰线，保留完整文字。',
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
            ...nativeRows('hr').map((row) =>
              row.name === '其他原生属性 / 事件'
                ? {
                    ...row,
                    type: "Omit<ComponentPropsWithRef<'hr'>, 'children' | 'dangerouslySetInnerHTML'>",
                    description:
                      '支持有效 hr 事件、aria-*、data-* 等属性，不接收子内容或注入 HTML。',
                  }
                : row,
            ),
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
            分隔线默认是静态内容，无需添加 tabIndex。Divider 不接收 children 或
            dangerouslySetInnerHTML，需要分组标题时单独使用标题元素。 类型检查会拒绝这两种本就无效的
            hr 用法；有效原生属性与运行时绘制保持。
          </p>
          <p>
            装饰线与对应元信息成组排列，窄屏由进阶示例的布局隐藏竖线，保留完整文字；不改变 Divider
            的方向或语义。
          </p>
        </>
      ),
    },
  ],
});
