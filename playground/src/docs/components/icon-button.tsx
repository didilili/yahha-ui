import IconButtonBasic from '../../examples/foundations/IconButtonBasic';
import iconButtonBasicSource from '../../examples/foundations/IconButtonBasic.tsx?raw';
import IconButtonSizes from '../../examples/foundations/IconButtonSizes';
import iconButtonSizesSource from '../../examples/foundations/IconButtonSizes.tsx?raw';
import IconButtonLoading from '../../examples/foundations/IconButtonLoading';
import iconButtonLoadingSource from '../../examples/foundations/IconButtonLoading.tsx?raw';
import { defineComponentPage } from '../page';
import { buttonNativeRows, buttonVariantRows } from '../page-helpers';

export default defineComponentPage('icon-button', {
  importCode: "import { IconButton } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <>
          <p>
            用于关闭、收藏等含义明确的图标操作。aria-label
            为必填属性，应直接描述动作，例如“关闭提示”；图标与悬停提示不能替代这个名称。
          </p>
          <p>
            需要同时展示文字时使用 <a href="#/components/button">Button</a>。可用{' '}
            <a href="#/components/tooltip">Tooltip</a> 补充提示，帮助用户识别图标。
          </p>
        </>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        {
          id: 'icon-button-basic',
          title: '基础用法',
          description:
            '关闭欢迎提示后，焦点移到重新显示按钮；重新显示后回到关闭按钮。回焦由示例管理，初次展示不抢焦点；图标通过 children 传入。',
          component: IconButtonBasic,
          source: iconButtonBasicSource,
        },
        {
          id: 'icon-button-sizes',
          title: '尺寸、变体与禁用',
          description:
            '分组比较尺寸、强调程度和禁用外观，每组只改变一个条件。sm、md、lg 的方形点击区域为 36、44、52px；本例为静态对照。',
          component: IconButtonSizes,
          source: iconButtonSizesSource,
        },
        {
          id: 'icon-button-loading',
          title: '受控加载与选中',
          description: '点击后模拟加载 1.2 秒，再切换收藏状态；相邻文字显示等待与完成结果。',
          component: IconButtonLoading,
          source: iconButtonLoadingSource,
        },
      ],
    },
    {
      id: 'api',
      title: 'API',
      api: [
        {
          name: 'IconButtonProps',
          rows: [
            {
              name: 'aria-label',
              type: 'string',
              required: true,
              description: '必填的可访问名称，描述动作，例如“关闭提示”。',
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: '图标内容。建议装饰图标设置 aria-hidden="true"，加载时此内容被替换。',
            },
            ...buttonVariantRows,
            ...buttonNativeRows.filter((row) => row.name !== 'children'),
          ],
        },
      ],
    },
    {
      id: 'accessibility',
      title: '可访问性与键盘',
      content: (
        <>
          <p>
            按 Tab 聚焦，Enter / Space 激活。装饰图标设置 aria-hidden="true"；收藏等切换操作通过
            aria-pressed 表达状态，aria-label 保持稳定，例如始终使用“收藏文章”。
          </p>
          <p>
            disabled 或 loading 为真时，按钮退出键盘顺序且不能激活。加载会保留可访问名称并设置
            aria-busy；请求结束后，由调用方更新 loading，并提供成功或失败的提示。
            系统启用减少动效时，按压位移和加载动画停止。
          </p>
        </>
      ),
    },
    {
      id: 'styling',
      title: '布局与定制',
      content: (
        <p>
          按钮组的间距由外层 flex / grid 容器设置；在 flex 行中，可设置{' '}
          <code>{"style={{ marginInlineStart: 'auto' }}"}</code> 将按钮推到行尾。 直接传入 SVG
          图标时保留 viewBox，组件会按 size 调整图框。统一配色使用{' '}
          <a href="#/components/theme-provider">ThemeProvider</a>。
        </p>
      ),
    },
  ],
});
