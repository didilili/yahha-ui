import IconButtonBasic from '../../examples/foundations/IconButtonBasic';
import iconButtonBasicSource from '../../examples/foundations/IconButtonBasic.tsx?raw';
import IconButtonSizes from '../../examples/foundations/IconButtonSizes';
import iconButtonSizesSource from '../../examples/foundations/IconButtonSizes.tsx?raw';
import IconButtonVariants from '../../examples/foundations/IconButtonVariants';
import iconButtonVariantsSource from '../../examples/foundations/IconButtonVariants.tsx?raw';
import IconButtonStates from '../../examples/foundations/IconButtonStates';
import iconButtonStatesSource from '../../examples/foundations/IconButtonStates.tsx?raw';
import IconButtonLoading from '../../examples/foundations/IconButtonLoading';
import iconButtonLoadingSource from '../../examples/foundations/IconButtonLoading.tsx?raw';
import IconButtonReadingList from '../../examples/foundations/IconButtonReadingList';
import iconButtonReadingListSource from '../../examples/foundations/IconButtonReadingList.tsx?raw';
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
            用于关闭、收藏等含义明确的图标操作。<code>aria-label</code>{' '}
            为必填属性，应描述动作，例如“关闭提示”，而不是“叉号”；图标与悬停提示不能替代这个名称。
          </p>
          <p>
            需要同时展示文字时使用 <a href="#/components/button">Button</a>。可用{' '}
            <a href="#/components/tooltip?section=basic">Tooltip 组合</a>{' '}
            补充文字提示，帮助用户识别图标。
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
          description: '关闭提示后可重新显示；示例会将焦点移到可用的按钮。',
          component: IconButtonBasic,
          source: iconButtonBasicSource,
        },
        {
          id: 'icon-button-variants',
          title: '强调程度',
          description: '对比主要、次要和低强调三种外观。',
          component: IconButtonVariants,
          source: iconButtonVariantsSource,
        },
        {
          id: 'icon-button-sizes',
          title: '尺寸',
          description: '对比 36、44 和 52px 三档尺寸。',
          component: IconButtonSizes,
          source: iconButtonSizesSource,
        },
        {
          id: 'icon-button-states',
          title: '禁用与加载',
          description: '静态对比禁用和加载状态。',
          component: IconButtonStates,
          source: iconButtonStatesSource,
        },
      ],
    },
    {
      id: 'integration',
      title: '进阶用法',
      disclosure: '查看异步与列表操作',
      content: <p>收藏状态只保留在当前示例，刷新后恢复。</p>,
      examples: [
        {
          id: 'icon-button-loading',
          title: '受控加载与选中',
          description: '模拟更新收藏，展示等待与选中状态；不发送请求。',
          component: IconButtonLoading,
          source: iconButtonLoadingSource,
          toc: false,
        },
        {
          id: 'icon-button-reading-list',
          title: '列表操作与焦点恢复',
          description: '筛选收藏后移除当前项，焦点移到相邻操作或恢复入口。',
          component: IconButtonReadingList,
          source: iconButtonReadingListSource,
          toc: false,
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
            ...buttonVariantRows.map((row) =>
              row.name === 'variant'
                ? { ...row, description: '主要、次要或低强调图标按钮。' }
                : row,
            ),
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
          <p>
            加载结束不会自动恢复焦点，应由调用方按任务安排。关闭提示并卸载按钮时，需把焦点移到可用入口；
            基础示例在关闭与重新显示后管理回焦，初次展示不移动焦点。
          </p>
          <p>
            同一清单有多个收藏入口时，名称包含对应文章标题，切换前后保持不变。在收藏视图取消收藏，
            且移除的按钮正持有焦点时，由使用方将焦点移到下一项、上一项或空态入口；取消收藏不等于删除文章。
          </p>
        </>
      ),
    },
    {
      id: 'styling',
      title: '布局与定制',
      content: (
        <>
          <p>
            按钮组的间距由外层 flex / grid 容器设置；在 flex 行中，可设置{' '}
            <code>{"style={{ marginInlineStart: 'auto' }}"}</code> 将按钮推到行尾。 直接传入 SVG
            图标时保留 viewBox，组件会按 size 调整图框。统一配色使用{' '}
            <a href="#/components/theme-provider">ThemeProvider</a>。
          </p>
          <p>
            阅读列表中的收藏使用 ghost 保持低强调，选中后沿用主题色与实心图标；不改变 44px
            默认点击区域。需要标记删除等危险操作时，可使用继承自 Button 的 destructive。
          </p>
        </>
      ),
    },
  ],
});
