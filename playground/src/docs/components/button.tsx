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
          title: '基础用法',
          description: '点击按钮，更新相邻文字中的问候次数。',
          component: ButtonBasic,
          source: buttonBasicSource,
        },
        {
          id: 'button-variants',
          title: '强调程度',
          description: '三种强调程度的静态外观对照。',
          component: ButtonVariants,
          source: buttonVariantsSource,
        },
        {
          id: 'button-sizes',
          title: '尺寸、全宽与长文案',
          description: '三档尺寸、全宽与窄栏长文案的静态对照，长文案可自然换行。',
          component: ButtonSizes,
          source: buttonSizesSource,
        },
        {
          id: 'button-icons',
          title: '前后图标',
          description: '前置与后置装饰图标的静态对照。',
          component: ButtonIcons,
          source: buttonIconsSource,
        },
        {
          id: 'button-states',
          title: '禁用与异步加载',
          description:
            '模拟保存：无图标示例保存成功，带图标示例首次失败，可再次点击重试；不发送请求。',
          component: ButtonStates,
          source: buttonStatesSource,
        },
        {
          id: 'button-toggle',
          title: '切换状态',
          description: '点击按钮切换收藏状态，通过 aria-pressed 表达是否选中。',
          component: ButtonToggle,
          source: buttonToggleSource,
        },
        {
          id: 'button-form',
          title: '提交与重置',
          description: '填写称呼后提交，或重置输入与结果；不发送请求。',
          component: ButtonForm,
          source: buttonFormSource,
        },
      ],
    },
    {
      id: 'design',
      title: '布局与定制',
      content: (
        <>
          <p>
            同一操作区域优先保留一个主要动作，例如“保存草稿”；“取消修改”等配合动作使用次要按钮，
            低强调的辅助动作使用文字按钮。这里的 <code>ghost</code> 表示文字按钮，
            不等同于其他组件库的透明描边按钮。
          </p>
          <p>
            全宽按钮可设置 <code>{"style={{ width: '100%' }}"}</code>，长名称会换行并撑高按钮。
            具体写法见上方<a href="#/components/button?section=button-sizes">尺寸、全宽与长文案</a>
            。
          </p>
          <p>
            多个按钮之间的间距和换行放在外层容器中设置，例如{' '}
            <code>{"style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}"}</code>。
            主次操作的可运行写法见<a href="#/components/button?section=button-form">提交与重置</a>。
            需要统一配色时，使用 <a href="#/components/theme-provider">ThemeProvider</a>{' '}
            的主题配置。
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
          <p>
            按钮进入原生禁用状态后，键盘焦点可能离开按钮；加载结束不会自动恢复焦点。
            应由调用方按任务安排去向，例如失败后聚焦需要修正的字段，或在原操作仍需继续时返回按钮。
            如果用户已转到其他位置，不要抢回焦点。结果文字应保留一份可访问的状态播报。
          </p>
          <p>
            需要编辑内容、失败后保留草稿、重试并在关闭后返回操作入口时，参考{' '}
            <a href="#/guides/states?section=article-actions">文章编辑与保存组合</a>。
            <code>loading</code> 只控制当前按钮的等待状态，请求清理与防止重复保存仍由业务处理。
          </p>
        </>
      ),
    },
  ],
});
