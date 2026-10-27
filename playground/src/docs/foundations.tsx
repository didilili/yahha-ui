import type { ApiRow, DocPage } from './types';
import ButtonBasic from '../examples/foundations/ButtonBasic';
import buttonBasicSource from '../examples/foundations/ButtonBasic.tsx?raw';
import ButtonVariants from '../examples/foundations/ButtonVariants';
import buttonVariantsSource from '../examples/foundations/ButtonVariants.tsx?raw';
import ButtonSizes from '../examples/foundations/ButtonSizes';
import buttonSizesSource from '../examples/foundations/ButtonSizes.tsx?raw';
import ButtonIcons from '../examples/foundations/ButtonIcons';
import buttonIconsSource from '../examples/foundations/ButtonIcons.tsx?raw';
import ButtonStates from '../examples/foundations/ButtonStates';
import buttonStatesSource from '../examples/foundations/ButtonStates.tsx?raw';
import ButtonToggle from '../examples/foundations/ButtonToggle';
import buttonToggleSource from '../examples/foundations/ButtonToggle.tsx?raw';
import ButtonForm from '../examples/foundations/ButtonForm';
import buttonFormSource from '../examples/foundations/ButtonForm.tsx?raw';
import IconButtonBasic from '../examples/foundations/IconButtonBasic';
import iconButtonBasicSource from '../examples/foundations/IconButtonBasic.tsx?raw';
import IconButtonSizes from '../examples/foundations/IconButtonSizes';
import iconButtonSizesSource from '../examples/foundations/IconButtonSizes.tsx?raw';
import IconButtonLoading from '../examples/foundations/IconButtonLoading';
import iconButtonLoadingSource from '../examples/foundations/IconButtonLoading.tsx?raw';
import BadgeTones from '../examples/foundations/BadgeTones';
import badgeTonesSource from '../examples/foundations/BadgeTones.tsx?raw';
import BadgeStatus from '../examples/foundations/BadgeStatus';
import badgeStatusSource from '../examples/foundations/BadgeStatus.tsx?raw';
import SurfaceBasic from '../examples/foundations/SurfaceBasic';
import surfaceBasicSource from '../examples/foundations/SurfaceBasic.tsx?raw';
import SurfaceComposition from '../examples/foundations/SurfaceComposition';
import surfaceCompositionSource from '../examples/foundations/SurfaceComposition.tsx?raw';
import ThemeVariants from '../examples/foundations/ThemeVariants';
import themeVariantsSource from '../examples/foundations/ThemeVariants.tsx?raw';
import ThemeTokensExample from '../examples/foundations/ThemeTokens';
import themeTokensSource from '../examples/foundations/ThemeTokens.tsx?raw';
import ThemeNested from '../examples/foundations/ThemeNested';
import themeNestedSource from '../examples/foundations/ThemeNested.tsx?raw';

const buttonNativeRows: ApiRow[] = [
  {
    name: 'children',
    type: 'ReactNode',
    description: '按钮内容。普通 Button 应包含可读的操作名称。',
  },
  {
    name: 'type',
    type: "'button' | 'submit' | 'reset'",
    defaultValue: "'button'",
    description: '原生按钮类型。提交表单时显式传入 submit。',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: '禁用按钮。loading 为 true 时也会禁用，不可通过 disabled={false} 覆盖。',
  },
  {
    name: 'onClick',
    type: 'MouseEventHandler<HTMLButtonElement>',
    description: '原生点击事件；键盘 Enter / Space 激活同样触发。',
  },
  {
    name: 'aria-pressed',
    type: "boolean | 'true' | 'false' | 'mixed'",
    description: '用于切换按钮，状态由调用方维护。true 时提供选中视觉。',
  },
  {
    name: 'className / style',
    type: 'string / CSSProperties',
    description: '作用于根 button，可局部定制尺寸与布局。',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLButtonElement>',
    description: '指向原生 button，可用于聚焦。',
  },
  {
    name: '其余原生属性',
    type: "ComponentPropsWithRef<'button'>",
    description:
      '支持 name、value、form、title、aria-*、data-* 等 button 属性，不支持 href 或 asChild。',
  },
];

const buttonVariantRows: ApiRow[] = [
  {
    name: 'variant',
    type: "'primary' | 'secondary' | 'ghost'",
    defaultValue: "'primary'",
    description: '主要、次要或文字按钮。',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    defaultValue: "'md'",
    description: '最小高度依次为 36、44、52px；IconButton 对应为方形点击区域。',
  },
  {
    name: 'loading',
    type: 'boolean',
    defaultValue: 'false',
    description: '显示加载图标并禁用按钮，设置 aria-busy。请求与完成状态由调用方管理。',
  },
];

export const foundationPages: DocPage[] = [
  {
    id: 'button',
    name: 'Button',
    chinese: '按钮',
    group: '通用',
    description: '触发提交、收藏或其他操作的原生按钮，提供三种强调程度与完整的交互状态。',
    importCode: "import { Button } from 'yahha-ui';",
    sections: [
      {
        id: 'usage',
        title: '何时使用',
        content: (
          <>
            <p>
              用于触发动作，例如提交表单、保存草稿和切换收藏。页面跳转使用原生链接；只有图标的操作使用{' '}
              <a href="#/components/icon-button">IconButton</a>。
            </p>
          </>
        ),
      },
      {
        id: 'examples',
        title: '代码演示',
        examples: [
          {
            id: 'button-basic',
            title: '基本使用',
            description: '通过 onClick 响应操作。组件不包含业务状态，问候次数由示例维护。',
            component: ButtonBasic,
            source: buttonBasicSource,
          },
          {
            id: 'button-variants',
            title: '强调程度',
            description: 'primary 突出主要操作，secondary 用于并列操作，ghost 降低视觉强调。',
            component: ButtonVariants,
            source: buttonVariantsSource,
          },
          {
            id: 'button-sizes',
            title: '三种尺寸',
            description:
              'sm、md、lg 的常规单行高度为 36、44、52px，默认 md。窄栏中的长名称完整换行，组件随内容增高。',
            component: ButtonSizes,
            source: buttonSizesSource,
          },
          {
            id: 'button-icons',
            title: '前后图标',
            description:
              'startIcon / endIcon 为装饰插槽，对辅助技术隐藏；按钮文字应能独立描述动作。',
            component: ButtonIcons,
            source: buttonIconsSource,
          },
          {
            id: 'button-states',
            title: '禁用与异步加载',
            description:
              '比较三种禁用变体，以及有、无前图标的加载。加载保留文案与宽高，1.5 秒模拟请求由示例实现，结果放在相邻状态文字中。',
            component: ButtonStates,
            source: buttonStatesSource,
          },
          {
            id: 'button-toggle',
            title: '切换状态',
            description: '使用 aria-pressed 表达收藏状态，保持操作名称稳定，选中状态由调用方控制。',
            component: ButtonToggle,
            source: buttonToggleSource,
          },
          {
            id: 'button-form',
            title: '原生表单提交',
            description:
              '默认 type 为 button，表单提交按钮需要显式写 type="submit"。必填校验使用浏览器行为。',
            component: ButtonForm,
            source: buttonFormSource,
          },
        ],
      },
      {
        id: 'design',
        title: '设计与状态',
        content: (
          <>
            <p>
              按钮像纸面上的一枚圆钝按扣：轻微不对称的暖墨轮廓承担识别，主操作以轻粉和短底边突出，
              次操作保留白纸面，辅助操作使用 ghost。同一任务中优先保留一个主操作。
            </p>
            <ul>
              <li>默认 44px；36px 用于紧凑的辅助操作，52px 用于需要突出、留白更宽松的操作。</li>
              <li>
                按压缩短底边；aria-pressed
                表达持续选中，键盘焦点单独标明当前位置，悬停不能盖掉选中。
              </li>
              <li>
                按下 60ms、松手 150ms，仅压低 1px；已选中时按住仍保留内侧墨线。减少动效时取消位移。
              </li>
              <li>
                loading 使用三墨点，保留按钮文案与图标空间；进度和完成反馈放在相邻状态文字中。
                长文案自然换行，不固定高度裁掉文字。
              </li>
            </ul>
            <p>
              尺寸、轮廓与动效遵循 <a href="#/guides/design-baseline">设计规范</a>
              ，下方示例直接使用默认实现。
            </p>
          </>
        ),
      },
      {
        id: 'api',
        title: 'API',
        api: [
          {
            name: 'ButtonProps',
            rows: [
              ...buttonVariantRows,
              {
                name: 'startIcon / endIcon',
                type: 'ReactNode',
                description:
                  '装饰内容。加载时 spinner 替换 startIcon，endIcon 与 children 仍保留。',
              },
              ...buttonNativeRows,
            ],
          },
        ],
      },
      {
        id: 'accessibility',
        title: '键盘与使用约定',
        content: (
          <>
            <p>
              保留原生按钮的 Tab 聚焦和 Enter / Space 激活行为。disabled 或 loading
              为真时，按钮不可聚焦、不可激活。loading 会设置 aria-busy，但完成后的提示由调用方提供。
            </p>
            <p>
              className、style 与 ref 均作用于
              button。按钮没有内置收藏、网络请求、导航、全宽或危险操作属性； 全宽可通过 style
              设置。系统启用减弱动态效果时，按压位移停止，三墨点以静止图形显示。
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'icon-button',
    name: 'IconButton',
    chinese: '图标按钮',
    group: '通用',
    description: '为关闭、收藏等仅用图标表达的操作提供方形点击区域与明确的可访问名称。',
    importCode: "import { IconButton } from 'yahha-ui';",
    sections: [
      {
        id: 'usage',
        title: '何时使用',
        content: (
          <p>
            用于含义明确的简短图标操作。必须提供描述动作的 aria-label，不能只依赖图标或悬停提示。
            需要同时展示文字时使用 <a href="#/components/button">Button</a>。
          </p>
        ),
      },
      {
        id: 'examples',
        title: '代码演示',
        examples: [
          {
            id: 'icon-button-basic',
            title: '基本使用',
            description: '图标作为 children 传入，aria-label 描述“关闭欢迎提示”这一动作。',
            component: IconButtonBasic,
            source: iconButtonBasicSource,
          },
          {
            id: 'icon-button-sizes',
            title: '尺寸、变体与禁用',
            description: '复用 Button 的三种尺寸与变体；方形点击区域依次为 36、44、52px。',
            component: IconButtonSizes,
            source: iconButtonSizesSource,
          },
          {
            id: 'icon-button-loading',
            title: '受控加载与选中',
            description:
              '加载时用 spinner 替换 children 图标，同时保留可访问名称。1.2 秒模拟更新由示例实现。',
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
        title: '键盘与使用约定',
        content: (
          <>
            <p>
              渲染为原生 button，支持 Tab 与 Enter / Space。禁用或加载时不能聚焦与激活。
              className、style、ref 作用于 button。默认 type="button"。
            </p>
            <p>
              Props 基于 ButtonProps，移除了 startIcon / endIcon。不包含内置图标库、Tooltip
              或收藏状态； 图标内容、提示和状态由调用方提供。
            </p>
            <p>与 Button 共用 60ms 按下、150ms 回位，不单独旋转或缩放图标；减少动效时保持静止。</p>
          </>
        ),
      },
    ],
  },
  {
    id: 'badge',
    name: 'Badge',
    chinese: '状态标记',
    group: '内容展示',
    description: '在文章标题、分类或阅读信息旁展示紧凑的静态标记。',
    importCode: "import { Badge } from 'yahha-ui';",
    sections: [
      {
        id: 'usage',
        title: '何时使用',
        content: (
          <p>
            用文字配合颜色展示分类或状态。Badge 是 span，不包含点击、筛选、关闭或键盘操作行为。
            可操作的分类入口应使用按钮或链接。
          </p>
        ),
      },
      {
        id: 'examples',
        title: '代码演示',
        examples: [
          {
            id: 'badge-tones',
            title: '三种语义',
            description:
              'neutral 使用轻纸边，accent 使用轻粉实色纸签，success 保留绿色与首行小勾；比较行内纸签和多行长内容。',
            component: BadgeTones,
            source: badgeTonesSource,
          },
          {
            id: 'badge-status',
            title: '展示动态状态',
            description:
              '操作由外部 Button 触发，状态文字由调用方更新。外层 role="status" 提供温和播报。',
            component: BadgeStatus,
            source: badgeStatusSource,
          },
        ],
      },
      {
        id: 'design',
        title: '设计与阅读',
        content: (
          <p>
            纸签使用紧凑字号与短墨框，辅助分类和状态，不与标题争抢层级。success
            的小勾跟随首行文字；长内容自然换行，含义始终由完整文字表达。Badge 自身不变成筛选按钮。
          </p>
        ),
      },
      {
        id: 'api',
        title: 'API',
        api: [
          {
            name: 'BadgeProps',
            rows: [
              {
                name: 'tone',
                type: "'neutral' | 'accent' | 'success'",
                defaultValue: "'neutral'",
                description: '标记的语义颜色。success 不随角色主题改变。',
              },
              {
                name: 'children',
                type: 'ReactNode',
                description: '状态或分类内容，应能独立表达含义。',
              },
              {
                name: 'className / style',
                type: 'string / CSSProperties',
                description: '作用于根 span。',
              },
              { name: 'ref', type: 'Ref<HTMLSpanElement>', description: '指向根 span。' },
              {
                name: '其余原生属性',
                type: "ComponentPropsWithRef<'span'>",
                description: '透传 span 属性，包括 aria-*、data-* 和事件；不会自动增加交互语义。',
              },
            ],
          },
        ],
      },
      {
        id: 'accessibility',
        title: '语义与使用约定',
        content: (
          <p>
            默认不可聚焦，没有快捷键或自动状态播报。保留能读懂的状态文字，避免只用颜色表示含义。
            不提供尺寸、数字上标、可关闭或可点击模式；交互请组合{' '}
            <a href="#/components/button">Button</a>。
          </p>
        ),
      },
    ],
  },
  {
    id: 'surface',
    name: 'Surface',
    chinese: '内容容器',
    group: '布局',
    description: '提供背景、边框、圆角与内边距的平面容器，用于组织轻量内容。',
    importCode: "import { Surface } from 'yahha-ui';",
    sections: [
      {
        id: 'usage',
        title: '何时使用',
        content: (
          <p>
            放置文章摘要、作者介绍、阅读提示等内容。Surface
            负责容器视觉，标题层级、内容布局与操作由调用方决定。 默认使用 24px
            内边距，不带悬停动作或阴影。
          </p>
        ),
      },
      {
        id: 'examples',
        title: '代码演示',
        examples: [
          {
            id: 'surface-basic',
            title: '基本使用',
            description:
              '平面奶白内容面使用轻纸边和 24px 默认内边距，通过 style 或 className 调整宽度与布局。',
            component: SurfaceBasic,
            source: surfaceBasicSource,
          },
          {
            id: 'surface-composition',
            title: '组合文章摘要',
            description:
              '与 Badge、Heading、Text 和 Button 组合；布局建立标题、摘要与操作的节奏，区域名称由 useId 关联。',
            component: SurfaceComposition,
            source: surfaceCompositionSource,
          },
        ],
      },
      {
        id: 'design',
        title: '设计与阅读',
        content: (
          <p>
            Surface 保持 24px
            内边距、细暖墨轮廓和平面纸色，适合作者介绍或阅读便笺。正文可以直接开放排布；标题、段距和操作由内部公开组件与容器布局组织，不把每一段都包进卡片。
          </p>
        ),
      },
      {
        id: 'api',
        title: 'API',
        api: [
          {
            name: 'SurfaceProps',
            rows: [
              { name: 'children', type: 'ReactNode', description: '容器内容。' },
              {
                name: 'className / style',
                type: 'string / CSSProperties',
                description: '作用于根 div，可调整布局与外观。',
              },
              { name: 'ref', type: 'Ref<HTMLDivElement>', description: '指向根 div。' },
              {
                name: '其余原生属性',
                type: "ComponentPropsWithRef<'div'>",
                description:
                  '透传 div 属性，例如 role、aria-labelledby、id、data-*。没有额外的组件专属属性。',
              },
            ],
          },
        ],
      },
      {
        id: 'accessibility',
        title: '语义与使用约定',
        content: (
          <>
            <p>
              Surface 默认是普通 div，不创建 landmark，也不可聚焦。仅在内容确实构成独立区域时提供
              role="region" 与名称。标题层级应符合所在页面。
            </p>
            <p>
              没有
              variant、asChild、内置标题或点击模式。避免让整个容器伪装成按钮；将链接与按钮放入容器内。
              背景使用 <a href="#/components/theme-provider">ThemeProvider</a> 的 surface token。
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'theme-provider',
    name: 'ThemeProvider',
    chinese: '主题配置',
    group: '主题配置',
    description: '设置默认配色、可选颜色预设与语义颜色，并在浮层 Portal 中保持一致。',
    importCode: "import { ThemeProvider, type ThemeName, type ThemeTokens } from 'yahha-ui';",
    sections: [
      {
        id: 'usage',
        title: '主题作用范围',
        content: (
          <>
            <p>
              在应用根部显式设置 ThemeProvider，并导入 yahha-ui/style.css。推荐从 chiikawa
              默认配色开始；theme 必填，也支持 hachiware、usagi 预设。Provider
              本身不管理主题切换状态。
            </p>
            <p>
              公共定制入口为 theme、tokens 与各组件公开的 className / style。 尺寸、圆角与动效的内部
              CSS 变量不属于稳定的公共 API。
            </p>
          </>
        ),
      },
      {
        id: 'examples',
        title: '代码演示',
        examples: [
          {
            id: 'theme-variants',
            title: '默认配色与可选预设',
            description:
              '推荐以 chiikawa 轻粉作为起点。hachiware 浅蓝与 usagi 浅黄只改变配色，保留同一套组件轮廓与行为。',
            component: ThemeVariants,
            source: themeVariantsSource,
            themeScope: 'explicit',
          },
          {
            id: 'theme-tokens',
            title: '定制颜色与 Portal 传播',
            description:
              '完整列出 10 个可选颜色入口。打开弹窗，可确认 tokens 在 body 中的 Portal 内仍然生效。',
            component: ThemeTokensExample,
            source: themeTokensSource,
            themeScope: 'explicit',
          },
          {
            id: 'theme-nested',
            title: '嵌套主题',
            description:
              '内层以自己的主题默认值为起点，不合并外层 tokens。需要相同覆盖时，应再次显式传入。',
            component: ThemeNested,
            source: themeNestedSource,
            themeScope: 'explicit',
          },
        ],
      },
      {
        id: 'api',
        title: 'API',
        api: [
          {
            name: 'ThemeProviderProps',
            rows: [
              {
                name: 'theme',
                type: "'chiikawa' | 'hachiware' | 'usagi'",
                required: true,
                description:
                  '当前 Provider 的配色预设名称，对应公开类型 ThemeName。推荐 chiikawa。',
              },
              {
                name: 'children',
                type: 'ReactNode',
                required: true,
                description: '主题范围内的内容。',
              },
              {
                name: 'tokens',
                type: 'ThemeTokens',
                description: '覆盖当前主题的部分语义颜色，并传入此范围中的浮层 Portal。',
              },
              {
                name: 'className',
                type: 'string',
                description: '只作用于 Provider 的根 div，不复制到浮层 Portal。',
              },
            ],
          },
          {
            name: 'ThemeTokens',
            rows: [
              {
                name: 'ink',
                type: 'string',
                defaultValue: '#462e31',
                description: '正文与主要文字，--chi-ink。',
              },
              {
                name: 'muted',
                type: 'string',
                defaultValue: '#79656a',
                description: '次要文字，--chi-muted。',
              },
              {
                name: 'accent',
                type: 'string',
                defaultValue: '吉伊 #f8dbe2 / 小八 #d7eaf5 / 乌萨奇 #f8e5a7',
                description: '主题强调色，--chi-accent。',
              },
              {
                name: 'accentHover',
                type: 'string',
                defaultValue: '吉伊 #f2c9d4 / 小八 #c3dfee / 乌萨奇 #f3da89',
                description: '强调色的悬停状态，--chi-accent-hover。',
              },
              {
                name: 'accentSoft',
                type: 'string',
                defaultValue: '吉伊 #fff6f7 / 小八 #f2f8fc / 乌萨奇 #fffaf0',
                description: '轻量强调背景，--chi-accent-soft。',
              },
              {
                name: 'line',
                type: 'string',
                defaultValue: '吉伊 #d7c3c0 / 小八 #b9cedb / 乌萨奇 #daca9f',
                description: '常规边框，--chi-line；显式指定时也覆盖按钮轮廓与按压底边。',
              },
              {
                name: 'focus',
                type: 'string',
                defaultValue: '吉伊 #ad6179 / 小八 #386d93 / 乌萨奇 #896329',
                description: '键盘焦点轮廓，--chi-focus。',
              },
              {
                name: 'surface',
                type: 'string',
                defaultValue: '#fffefa',
                description: 'Surface 与 Dialog 背景，--chi-surface。',
              },
              {
                name: 'fieldBackground',
                type: 'string',
                defaultValue: '#fffefd',
                description: '输入框默认背景，--chi-field-background；错误和禁用状态保留各自背景。',
              },
              {
                name: 'error',
                type: 'string',
                defaultValue: '#a33e4f',
                description:
                  '输入框错误边框、错误时的焦点轮廓、错误文字与 Toast 错误图标，--chi-error；错误背景固定，禁用背景优先。',
              },
            ],
          },
        ],
      },
      {
        id: 'boundaries',
        title: '继承与使用约定',
        content: (
          <>
            <p>
              Provider 不透传原生 div 属性、style 或 ref。布局可使用外层元素，或通过 className
              设置在 Provider 根元素上。Provider 本身没有键盘行为。
            </p>
            <p>
              tokens 的值会显式传到 Dialog、Select、Popover、Tooltip 与 DropdownMenu 的 Portal。仅在
              Provider 自定义类上设置的 CSS 变量沿 DOM 继承，挂载到 body
              的浮层不会自动继承这些类上的覆盖。 跨 Portal 的颜色定制应使用 tokens。
            </p>
            <p>
              这些入口仅覆盖组件已使用的语义颜色，并不替换所有固定颜色，例如 Toast 的状态背景。
              修改后应检查文字对比度、错误提示与焦点轮廓。不含内置深色模式或自动跟随系统主题功能。
            </p>
          </>
        ),
      },
    ],
  },
];
