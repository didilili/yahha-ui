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
            为应用或局部区域设置组件配色，并在应用入口导入 yahha-ui/style.css。theme 必填，推荐从
            chiikawa 默认配色开始，也支持 hachiware、usagi 预设；需要切换时，由应用更新 theme。
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
          title: '默认配色与可选预设',
          description:
            '比较吉伊轻粉、小八浅蓝与乌萨奇浅黄的组件外观；按钮可观察悬停和键盘焦点，不绑定业务操作。',
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
              type: "'chiikawa' | 'hachiware' | 'usagi'",
              required: true,
              description: '当前 Provider 的配色预设名称，对应公开类型 ThemeName。推荐 chiikawa。',
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
              description: '常规边框，--chi-line；显式指定时也覆盖按钮轮廓、按压底边与轻纸边。',
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
