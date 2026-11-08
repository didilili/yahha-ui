import IconBasic from '../../examples/foundations/IconBasic';
import iconBasicSource from '../../examples/foundations/IconBasic.tsx?raw';
import IconSizes from '../../examples/foundations/IconSizes';
import iconSizesSource from '../../examples/foundations/IconSizes.tsx?raw';
import IconSlots from '../../examples/foundations/IconSlots';
import iconSlotsSource from '../../examples/foundations/IconSlots.tsx?raw';
import IconGallery from '../../examples/foundations/IconGallery';
import iconGallerySource from '../../examples/foundations/IconGallery.tsx?raw';
import IconComposition from '../../examples/foundations/IconComposition';
import iconCompositionSource from '../../examples/foundations/IconComposition.tsx?raw';
import IconCustom from '../../examples/foundations/IconCustom';
import iconCustomSource from '../../examples/foundations/IconCustom.tsx?raw';
import IconAccessibility from '../../examples/foundations/IconAccessibility';
import iconAccessibilitySource from '../../examples/foundations/IconAccessibility.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('icon', {
  importCode: "import { Icon, SearchIcon, BookmarkIcon } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      kind: 'usage',
      content: (
        <>
          <p>
            Icon 是绘制 SVG 的基础容器，统一尺寸、色调与可访问名称。SearchIcon、BookmarkIcon
            等命名图标提供现成的手绘图形，可以直接使用。
          </p>
          <p>
            图标按钮使用 <a href="#/components/icon-button">IconButton</a>，带文字的操作使用{' '}
            <a href="#/components/button">Button</a>。Icon
            只承载图形，业务动作与状态由使用方管理；原生 SVG 或其他图标库的 SVG
            也可以直接放进已有插槽，无需再包一层 Icon。
          </p>
        </>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      kind: 'examples',
      examples: [
        {
          id: 'icon-basic',
          title: '基础用法',
          description: '直接使用命名图标；独立表达含义时通过 aria-label 提供名称。',
          component: IconBasic,
          source: iconBasicSource,
        },
        {
          id: 'icon-gallery',
          title: '手绘功能图标',
          description: '16 种图标的静态样张，按图形用途查找。',
          component: IconGallery,
          source: iconGallerySource,
        },
        {
          id: 'icon-sizes',
          title: '尺寸与色调',
          description: '分别保持图形不变，对比图框尺寸和语义色调。',
          component: IconSizes,
          source: iconSizesSource,
        },
        {
          id: 'icon-accessibility',
          title: '装饰与可访问名称',
          description: '对比默认装饰图标与两种可访问命名方式。',
          component: IconAccessibility,
          source: iconAccessibilitySource,
        },
        {
          id: 'icon-slots',
          title: '按钮与输入框中的图标',
          description: '通过 startIcon 和 leading 插槽放入图标，由宿主控件安排图框。',
          component: IconSlots,
          source: iconSlotsSource,
        },
        {
          id: 'icon-custom',
          title: '自定义 SVG',
          description: '分组展示自定义坐标与多色路径，外部尺寸由 size 控制。',
          component: IconCustom,
          source: iconCustomSource,
        },
      ],
    },
    {
      id: 'integration',
      kind: 'integration',
      title: '进阶用法',
      disclosure: '查看搜索与收藏组合',
      examples: [
        {
          id: 'icon-composition',
          title: '搜索与收藏组合',
          description: '提交关键词筛选本地手记，点击收藏切换状态；清空后回到输入框。',
          component: IconComposition,
          source: iconCompositionSource,
          toc: false,
        },
      ],
    },
    {
      id: 'api',
      title: 'API',
      kind: 'api',
      api: [
        {
          name: 'IconProps',
          rows: [
            {
              name: 'children',
              type: 'ReactNode',
              description: 'SVG 图形内容，例如 path、circle 或 g。命名图标已提供图形。',
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg' | number",
              defaultValue: "'md'",
              description:
                '独立图框的宽高，sm / md / lg 对应 16 / 20 / 24px；数字须为有限正数，无效数字回退到 20px。',
            },
            {
              name: 'tone',
              type: "'inherit' | 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'info'",
              defaultValue: "'inherit'",
              description:
                'inherit 沿用当前文字颜色；accent 使用主题 focus 墨色，其余值使用对应的主题语义色。',
            },
            {
              name: 'viewBox',
              type: 'string',
              defaultValue: "'0 0 24 24'",
              description: 'SVG 内部坐标系，与外部图框尺寸分开设置。',
            },
            {
              name: 'fill / stroke',
              type: 'string',
              defaultValue: 'currentColor / —',
              description:
                '原生绘制属性。Icon 默认填充当前颜色，不自动添加描边；多色图形可在子路径上分别设置颜色。',
            },
            {
              name: 'aria-label / aria-labelledby',
              type: 'string',
              description:
                '为独立表达信息的图标命名；提供非空名称时默认 role="img"，没有名称时默认 aria-hidden="true"。',
            },
            {
              name: 'role / aria-hidden',
              type: 'AriaRole / boolean',
              description:
                'aria-hidden 的显式值优先；隐藏图标不保留 role，其余图标可显式设置 role。',
            },
            {
              name: 'className / style',
              type: 'string / CSSProperties',
              description: '作用于根 svg。size 控制图框，style 仍可按原生 CSS 规则覆盖。',
            },
            {
              name: 'ref',
              type: 'Ref<SVGSVGElement>',
              description: '指向原生 svg 元素。',
            },
            {
              name: '其他原生 SVG 属性 / 事件',
              type: "ComponentPropsWithRef<'svg'>（省略 width / height）",
              description:
                '转发 strokeWidth、aria-*、data-* 及原生事件等属性；宽高统一由 size 设置，focusable 固定为 false。',
            },
          ],
        },
        {
          name: '命名图标',
          rows: [
            {
              name: '通用属性',
              type: 'GlyphProps',
              description:
                '省略 IconProps 的 children。复用尺寸、色调、命名、原生 SVG 属性、样式与 ref；命名图标直接渲染 svg。',
            },
            {
              name: 'BookmarkIcon.filled',
              type: 'boolean',
              defaultValue: 'false',
              description:
                '主体以 20% 当前颜色浅填，折角保持不填充；fill / fillOpacity 可显式覆盖主体。收藏状态由按钮的 aria-pressed 表达。',
            },
          ],
        },
      ],
    },
    {
      id: 'accessibility',
      title: '装饰、命名与操作',
      kind: 'accessibility',
      content: (
        <>
          <p>
            旁边已有同义文字时，保持图标默认的装饰状态，避免重复朗读。图标独立表达信息时，使用{' '}
            <code>aria-label</code> 或 <code>aria-labelledby</code> 提供名称；后者引用页面内唯一的
            id，示例使用隐藏文字作为命名来源。
          </p>
          <p>
            可操作入口由按钮或链接承载，名称描述动作，例如“收藏文章”。装饰图标不重复命名；收藏状态由{' '}
            <code>aria-pressed</code> 表达，切换前后保留按钮名称。Icon 固定设置{' '}
            <code>focusable="false"</code>，不提供按钮的键盘或加载行为。
          </p>
        </>
      ),
    },
    {
      id: 'limits',
      title: '尺寸与插槽',
      kind: 'styling',
      content: (
        <>
          <p>
            独立图标用 size 控制图框。Button、IconButton 与 TextField
            已设置自己的插槽尺寸，图标放入后沿用宿主的图框，不会扩大按钮的点击区域。
            命名图标的路径按 24 单位坐标绘制，修改 viewBox 不会重新计算路径；调整显示尺寸使用 size。
          </p>
          <p>
            tone="inherit" 随当前文字颜色变化。统一配色使用{' '}
            <a href="#/components/theme-provider">ThemeProvider</a>，局部多色图形在路径上设置 fill
            或 stroke。插槽也接受原生 SVG，保留原始 viewBox 即可。
          </p>
          <p>
            系统强制配色时，语义色跟随周围文字或控件的前景色；自定义多色路径沿用原生 SVG
            的颜色处理方式。信息与状态同时使用可辨的形状或文字说明。
          </p>
        </>
      ),
    },
  ],
});
