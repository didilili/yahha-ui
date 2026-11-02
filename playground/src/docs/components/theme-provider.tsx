import ThemeVariants from '../../examples/foundations/ThemeVariants';
import themeVariantsSource from '../../examples/foundations/ThemeVariants.tsx?raw';
import ThemeTokensExample from '../../examples/foundations/ThemeTokens';
import themeTokensSource from '../../examples/foundations/ThemeTokens.tsx?raw';
import ThemeNested from '../../examples/foundations/ThemeNested';
import themeNestedSource from '../../examples/foundations/ThemeNested.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('theme-provider', {
  importCode: "import { ThemeProvider, type ThemeName, type ThemeTokens } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '主题作用范围',
      content: (
        <>
          <p>
            为应用或局部区域设置组件配色，并在应用入口导入 yahha-ui/style.css。theme
            必填，推荐使用粉色预设（pink），也可选择浅蓝（blue）或浅黄（yellow）；由应用更新 theme
            切换预设。三者是同一套组件的强调色变体，布局、字阶与交互相同。
          </p>
          <p>
            通过公开的 ThemeTokens 覆盖语义颜色。尺寸、圆角与动效的内部 CSS 变量不属于稳定公共
            API；组件布局和局部外观使用各组件公开的定制入口。
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
          title: '默认配色与强调色变体',
          description:
            '比较粉色（pink）、浅蓝（blue）与浅黄（yellow）的强调色变体，布局、字阶与交互相同；按钮可观察悬停和键盘焦点，不绑定业务操作。',
          component: ThemeVariants,
          source: themeVariantsSource,
          themeScope: 'explicit',
        },
        {
          id: 'theme-tokens',
          title: '定制颜色与 Portal 传播',
          description:
            '完整列出 10 个可选颜色入口。打开弹窗，可确认颜色随主题上下文进入 body 中的 Portal，无需复制页面布局样式。',
          component: ThemeTokensExample,
          source: themeTokensSource,
          themeScope: 'explicit',
        },
        {
          id: 'theme-nested',
          title: '嵌套主题',
          description:
            '内层以自己的主题默认值为起点，不合并外层 tokens。按钮仅供配色对照，可观察悬停和键盘焦点；需要相同覆盖时，应再次显式传入。',
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
              type: 'ThemeName',
              required: true,
              description:
                '当前 Provider 的强调色预设，对应公开类型 ThemeName。推荐粉色（pink）；六个可用值及旧名映射见“ThemeName 与旧名兼容”。',
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
              defaultValue: '#49313d',
              description: '正文与主要文字，--yahha-ink。',
            },
            {
              name: 'muted',
              type: 'string',
              defaultValue: '#7a5c6d',
              description: '次要文字，--yahha-muted。',
            },
            {
              name: 'accent',
              type: 'string',
              defaultValue: '粉色 #ffc3d9 / 浅蓝 #d7eaf5 / 浅黄 #f8e5a7',
              description: '主题强调色，--yahha-accent。',
            },
            {
              name: 'accentHover',
              type: 'string',
              defaultValue: '粉色 #ffb3cf / 浅蓝 #c3dfee / 浅黄 #f3da89',
              description: '强调色的悬停状态，--yahha-accent-hover。',
            },
            {
              name: 'accentSoft',
              type: 'string',
              defaultValue: '粉色 #fff0f6 / 浅蓝 #f2f8fc / 浅黄 #fffaf0',
              description: '轻量强调背景，--yahha-accent-soft。',
            },
            {
              name: 'line',
              type: 'string',
              defaultValue: '粉色 #c58ba1 / 浅蓝 #b9cedb / 浅黄 #daca9f',
              description: '常规边框，--yahha-line；显式指定时也覆盖按钮轮廓、按压底边与轻纸边。',
            },
            {
              name: 'focus',
              type: 'string',
              defaultValue: '粉色 #b04e78 / 浅蓝 #386d93 / 浅黄 #896329',
              description: '键盘焦点轮廓，--yahha-focus。',
            },
            {
              name: 'surface',
              type: 'string',
              defaultValue: '#ffffff',
              description: '内容面与浮层等共用背景，--yahha-surface。',
            },
            {
              name: 'fieldBackground',
              type: 'string',
              defaultValue: '#ffffff',
              description: '输入框默认背景，--yahha-field-background；错误和禁用状态保留各自背景。',
            },
            {
              name: 'error',
              type: 'string',
              defaultValue: '#a33e4f',
              description:
                '输入框错误边框、错误时的焦点轮廓、错误文字与 Toast 错误图标，--yahha-error；错误背景固定，禁用背景优先。',
            },
          ],
        },
      ],
    },
    {
      id: 'theme-names',
      title: 'ThemeName 与旧名兼容',
      content: (
        <>
          <p>公开类型 ThemeName 接受三个颜色主名和三个旧名兼容值：</p>
          <ul>
            <li>
              粉色：<code>pink</code>；旧名 <code>chiikawa</code> 映射到 pink。
            </li>
            <li>
              浅蓝：<code>blue</code>；旧名 <code>hachiware</code> 映射到 blue。
            </li>
            <li>
              浅黄：<code>yellow</code>；旧名 <code>usagi</code> 映射到 yellow。
            </li>
          </ul>
          <p>
            新代码使用颜色主名。旧名进入主题上下文与 <code>data-yahha-theme</code> DOM
            属性前会规范为对应颜色主名，浮层 Portal 也使用规范值。已有 theme
            属性值可以逐步替换，兼容映射的配色相同；theme 仍为必填属性。
          </p>
        </>
      ),
    },
    {
      id: 'boundaries',
      title: '嵌套主题与 Portal 传播',
      content: (
        <>
          <p>
            嵌套 Provider 以自己的预设为起点，不合并外层
            tokens。内外层需要相同覆盖时，应再次显式传入。Provider 不透传原生 div 属性、style 或
            ref，页面布局可使用外层元素。
          </p>
          <p>
            tokens 会传到 Dialog、Select、Popover、Tooltip 与 DropdownMenu 的 Portal。仅在 Provider
            自定义类上设置的 CSS 变量沿 DOM 继承，挂载到 body 的浮层无法继承这些类上的覆盖；需要跨
            Portal 生效的颜色定制应使用 tokens。
          </p>
          <p>
            颜色入口只覆盖组件已使用的语义颜色，例如 Toast
            的状态背景仍保留固定颜色。定制后应检查文字对比度、错误提示与焦点轮廓。当前没有内置深色模式或自动跟随系统主题功能。
          </p>
        </>
      ),
    },
  ],
});
