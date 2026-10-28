import ButtonBasic from '../../examples/foundations/ButtonBasic';
import buttonBasicSource from '../../examples/foundations/ButtonBasic.tsx?raw';
import ButtonVariants from '../../examples/foundations/ButtonVariants';
import buttonVariantsSource from '../../examples/foundations/ButtonVariants.tsx?raw';
import ButtonSizes from '../../examples/foundations/ButtonSizes';
import buttonSizesSource from '../../examples/foundations/ButtonSizes.tsx?raw';
import ButtonIcons from '../../examples/foundations/ButtonIcons';
import buttonIconsSource from '../../examples/foundations/ButtonIcons.tsx?raw';
import ButtonStates from '../../examples/foundations/ButtonStates';
import buttonStatesSource from '../../examples/foundations/ButtonStates.tsx?raw';
import ButtonToggle from '../../examples/foundations/ButtonToggle';
import buttonToggleSource from '../../examples/foundations/ButtonToggle.tsx?raw';
import ButtonForm from '../../examples/foundations/ButtonForm';
import buttonFormSource from '../../examples/foundations/ButtonForm.tsx?raw';
import { defineComponentPage } from '../page';
import { buttonNativeRows, buttonVariantRows } from '../page-helpers';

export default defineComponentPage('button', {
  importCode: "import { Button } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <>
          <p>
            用于触发动作，例如提交表单、保存草稿和切换收藏。页面或地址跳转使用{' '}
            <a href="#/components/link">Link</a>；只有图标的操作使用{' '}
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
          previewAlign: 'center',
          title: '基本使用',
          description: '点击按钮，更新相邻文字中的问候次数。',
          component: ButtonBasic,
          source: buttonBasicSource,
        },
        {
          id: 'button-variants',
          title: '强调程度',
          description: '比较主要、次要与文字按钮的外观，三者依次降低视觉强调；本例为静态对照。',
          component: ButtonVariants,
          source: buttonVariantsSource,
        },
        {
          id: 'button-sizes',
          title: '三种尺寸',
          description:
            '比较同一按钮的三档尺寸：sm、md、lg 的常规单行高度为 36、44、52px，默认 md；另展示窄栏长文案换行。本例为静态对照。',
          component: ButtonSizes,
          source: buttonSizesSource,
        },
        {
          id: 'button-icons',
          title: '前后图标',
          description:
            '比较同一按钮的前置与后置装饰图标；按钮文字应能独立描述动作。本例为静态对照。',
          component: ButtonIcons,
          source: buttonIconsSource,
        },
        {
          id: 'button-states',
          title: '禁用与异步加载',
          description:
            '上方对比三种禁用外观；下方可点击保存，体验有无前置图标时的 1.5 秒模拟加载与完成提示。',
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
            '填写称呼后提交，在本页显示问候，不发送请求。默认 type 为 button，提交需显式写 type="submit"；必填校验使用浏览器行为。',
          component: ButtonForm,
          source: buttonFormSource,
        },
      ],
    },
    {
      id: 'design',
      title: '布局与定制',
      content: (
        <p>
          全宽按钮可设置 <code>{"style={{ width: '100%' }}"}</code>，长名称会换行并撑高按钮。
          多个按钮之间的间距和换行放在外层 flex / grid 容器中设置。需要统一配色时，使用{' '}
          <a href="#/components/theme-provider">ThemeProvider</a> 的主题配置。
        </p>
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
              description: '装饰内容。加载时 spinner 替换 startIcon，endIcon 与 children 仍保留。',
            },
            ...buttonNativeRows,
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
            按 Tab 聚焦，Enter / Space 激活。切换操作用 aria-pressed 表达状态，并保持操作名称稳定，
            例如用“收藏文章”同时表示收藏和取消收藏。
          </p>
          <p>
            disabled 或 loading 为真时都会设置原生 disabled，按钮不可聚焦、不可激活。loading
            保留文案并设置
            aria-busy；请求执行、加载结束和成功或失败提示由调用方处理，结果应在按钮之外清楚呈现。
            系统启用减少动效时，按压位移和加载动画停止。
          </p>
        </>
      ),
    },
  ],
});
