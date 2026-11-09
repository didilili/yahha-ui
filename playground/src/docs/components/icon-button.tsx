import IconButtonMinimal from '../../examples/foundations/IconButtonMinimal';
import iconButtonMinimalSource from '../../examples/foundations/IconButtonMinimal.tsx?raw';
import IconButtonToggle from '../../examples/foundations/IconButtonToggle';
import iconButtonToggleSource from '../../examples/foundations/IconButtonToggle.tsx?raw';
import IconButtonBasic from '../../examples/foundations/IconButtonBasic';
import iconButtonBasicSource from '../../examples/foundations/IconButtonBasic.tsx?raw';
import IconButtonSizes from '../../examples/foundations/IconButtonSizes';
import iconButtonSizesSource from '../../examples/foundations/IconButtonSizes.tsx?raw';
import IconButtonVariants from '../../examples/foundations/IconButtonVariants';
import iconButtonVariantsSource from '../../examples/foundations/IconButtonVariants.tsx?raw';
import IconButtonAppearance from '../../examples/foundations/IconButtonAppearance';
import iconButtonAppearanceSource from '../../examples/foundations/IconButtonAppearance.tsx?raw';
import IconButtonStates from '../../examples/foundations/IconButtonStates';
import iconButtonStatesSource from '../../examples/foundations/IconButtonStates.tsx?raw';
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
          id: 'icon-button-minimal',
          title: '基础用法',
          description: '用 aria-label 为图标操作命名，点击后更新相邻计数。',
          component: IconButtonMinimal,
          source: iconButtonMinimalSource,
        },
        {
          id: 'icon-button-variants',
          title: '强调程度',
          description: '对比主要、次要和低强调三种外观。',
          component: IconButtonVariants,
          source: iconButtonVariantsSource,
        },
        {
          id: 'icon-button-decorations',
          title: '常规与软团外观',
          description: '保持图标、尺寸和强调程度一致，只比较 appearance。',
          component: IconButtonAppearance,
          source: iconButtonAppearanceSource,
        },
        {
          id: 'icon-button-sizes',
          title: '尺寸',
          description: '用相同图标对比小号、中号和大号点击区域。',
          component: IconButtonSizes,
          source: iconButtonSizesSource,
        },
        {
          id: 'icon-button-states',
          title: '禁用与加载',
          description: '对比禁用和两种加载图形；图形替换图标，可访问名称仍保留。',
          component: IconButtonStates,
          source: iconButtonStatesSource,
        },
        {
          id: 'icon-button-toggle',
          title: '切换按钮',
          description: '点击切换收藏状态，按钮名称保持不变。',
          component: IconButtonToggle,
          source: iconButtonToggleSource,
        },
        {
          id: 'icon-button-loading',
          title: '异步加载与选中',
          description: '模拟更新收藏，展示等待与选中状态；不发送请求。',
          component: IconButtonLoading,
          source: iconButtonLoadingSource,
        },
        {
          id: 'icon-button-basic',
          title: '关闭与重新显示',
          description: '关闭提示后聚焦重新显示入口，再次显示后回到关闭按钮。',
          component: IconButtonBasic,
          source: iconButtonBasicSource,
        },
      ],
    },
    {
      id: 'recipes',
      title: '相关组合',
      kind: 'related',
      content: (
        <ul>
          <li>
            <a href="#/guides/interactions?section=icon-button-reading-list">收藏列表与焦点恢复</a>
          </li>
        </ul>
      ),
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
              description:
                '图标内容。建议装饰图标设置 aria-hidden="true"，加载时由居中的加载图形替换。',
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
            “关闭与重新显示”示例在切换后管理回焦，初次展示不移动焦点。
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
            不传 <code>appearance</code> 时使用常规外观。<code>appearance="soft"</code>{' '}
            使用软团轮廓和按压层次，功能图标保持居中。收藏等切换操作使用 <code>aria-pressed</code>{' '}
            与图标填色表达当前值，<code>aria-label</code> 保持稳定的动作名称。
          </p>
          <p>
            按钮组的间距由外层 flex / grid 容器设置；在 flex 行中，可设置{' '}
            <code>{"style={{ marginInlineStart: 'auto' }}"}</code> 将按钮推到行尾。 直接传入 SVG
            图标时保留 viewBox，组件会按 size 调整图框。加载默认使用三墨点，显式设置{' '}
            <code>loadingVariant="biscuit"</code> 选择小花饼，与 <code>appearance</code>{' '}
            独立；两种图形沿用 18 / 20 / 22px 图框并保持居中，按钮宽高不变。统一配色使用{' '}
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
