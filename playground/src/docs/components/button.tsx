import ButtonLayout from '../../examples/foundations/ButtonLayout';
import buttonLayoutSource from '../../examples/foundations/ButtonLayout.tsx?raw';
import ButtonBasic from '../../examples/foundations/ButtonBasic';
import buttonBasicSource from '../../examples/foundations/ButtonBasic.tsx?raw';
import ButtonVariants from '../../examples/foundations/ButtonVariants';
import buttonVariantsSource from '../../examples/foundations/ButtonVariants.tsx?raw';
import ButtonAppearance from '../../examples/foundations/ButtonAppearance';
import buttonAppearanceSource from '../../examples/foundations/ButtonAppearance.tsx?raw';
import ButtonLoadingVariants from '../../examples/foundations/ButtonLoadingVariants';
import buttonLoadingVariantsSource from '../../examples/foundations/ButtonLoadingVariants.tsx?raw';
import ButtonSizes from '../../examples/foundations/ButtonSizes';
import buttonSizesSource from '../../examples/foundations/ButtonSizes.tsx?raw';
import ButtonIcons from '../../examples/foundations/ButtonIcons';
import buttonIconsSource from '../../examples/foundations/ButtonIcons.tsx?raw';
import ButtonStates from '../../examples/foundations/ButtonStates';
import ButtonAsync from '../../examples/foundations/ButtonAsync';
import buttonAsyncSource from '../../examples/foundations/ButtonAsync.tsx?raw';
import buttonStatesSource from '../../examples/foundations/ButtonStates.tsx?raw';
import ButtonToggle from '../../examples/foundations/ButtonToggle';
import buttonToggleSource from '../../examples/foundations/ButtonToggle.tsx?raw';
import ButtonForm from '../../examples/foundations/ButtonForm';
import buttonFormSource from '../../examples/foundations/ButtonForm.tsx?raw';
import ButtonDestructive from '../../examples/foundations/ButtonDestructive';
import buttonDestructiveSource from '../../examples/foundations/ButtonDestructive.tsx?raw';
import { defineComponentPage } from '../page';
import { buttonNativeRows, buttonVariantRows } from '../page-helpers';

export default defineComponentPage('button', {
  importCode: "import { Button } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          用于触发动作，例如提交表单、保存草稿和切换收藏。页面或地址跳转使用{' '}
          <a href="#/components/link">Link</a>；只有图标的操作使用{' '}
          <a href="#/components/icon-button">IconButton</a>。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        {
          id: 'button-basic',
          title: '基础用法',
          description: '点击按钮更新问候次数。',
          component: ButtonBasic,
          source: buttonBasicSource,
          previewAlign: 'center',
        },
        {
          id: 'button-variants',
          title: '强调程度',
          description: '用相同文案对比主要、次要和文字按钮。',
          component: ButtonVariants,
          source: buttonVariantsSource,
        },
        {
          id: 'button-appearance',
          title: '常规与软团外观',
          description: '保持文案、尺寸和强调程度一致，只比较 appearance。',
          component: ButtonAppearance,
          source: buttonAppearanceSource,
        },
        {
          id: 'button-sizes',
          title: '尺寸',
          description: '用相同文案对比三档尺寸，默认使用中号。',
          component: ButtonSizes,
          source: buttonSizesSource,
        },
        {
          id: 'button-icons',
          title: '前后图标',
          description: '在文字前后放置装饰图标，操作名称保持可见。',
          component: ButtonIcons,
          source: buttonIconsSource,
        },
        {
          id: 'button-layout',
          title: '全宽与长文案',
          description: '在同一窄栏中观察全宽布局和长文案换行。',
          component: ButtonLayout,
          source: buttonLayoutSource,
        },
        {
          id: 'button-destructive',
          title: '危险操作',
          description: '用相同动作对比三种强调程度的危险按钮。',
          component: ButtonDestructive,
          source: buttonDestructiveSource,
        },
        {
          id: 'button-states',
          title: '禁用与加载',
          description: '对比禁用和加载状态；加载图形保留按钮名称。',
          component: ButtonStates,
          source: buttonStatesSource,
        },
        {
          id: 'button-decorations',
          title: '加载图形',
          description: '对比默认三墨点与可选小花饼，两种图形均通过 loading 显示。',
          component: ButtonLoadingVariants,
          source: buttonLoadingVariantsSource,
        },
        {
          id: 'button-toggle',
          title: '切换按钮',
          description: '点击切换收藏状态，通过 aria-pressed 表达是否选中。',
          component: ButtonToggle,
          source: buttonToggleSource,
        },
        {
          id: 'button-form',
          title: '原生表单提交与重置',
          description: '用 type="submit" 触发表单提交，用 type="reset" 恢复输入并清理本例结果。',
          component: ButtonForm,
          source: buttonFormSource,
        },
        {
          id: 'button-async',
          title: '异步加载与重试',
          description: '模拟首次保存失败与重试成功；状态仅保留在当前示例。',
          component: ButtonAsync,
          source: buttonAsyncSource,
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
            <a href="#/guides/interactions?section=button-delete-draft">删除确认与恢复</a>
          </li>
        </ul>
      ),
    },
    {
      id: 'form-integration',
      title: '与 Form 配合',
      kind: 'integration',
      content: (
        <p>
          在 Form 中使用 <code>type="submit"</code> 提交或 <code>type="reset"</code> 重置。将{' '}
          <code>form.isSubmitting</code> 传给 loading 呈现提交状态，见{' '}
          <a href="#/components/form?section=form-submission">异步提交与字段错误</a>。
        </p>
      ),
    },
    {
      id: 'design',
      title: '布局与定制',
      content: (
        <>
          <p>
            同一操作区域优先保留一个主要动作，例如“保存草稿”，使用 <code>primary</code>；
            “取消修改”等配合动作使用 <code>secondary</code>，低强调的辅助动作使用 <code>ghost</code>
            。这里的 <code>ghost</code> 表示文字按钮，不等同于透明描边按钮。
          </p>
          <p>
            不传 <code>appearance</code> 时使用常规外观。<code>appearance="soft"</code>{' '}
            增加饱满轮廓、短高光和按压层次，可与三种强调程度组合。
            <code>startIcon</code> 和 <code>endIcon</code>{' '}
            用于补充动作含义，例如用书签表示收藏；操作名称和结果文字始终保留。
          </p>
          <p>
            加载默认使用三墨点，设置 <code>loadingVariant="biscuit"</code> 可选择小花饼，与{' '}
            <code>appearance</code> 独立。两种加载图形与前置图标使用相同的 16 / 18 / 20px
            图框，与文字间隔 8px，两侧内边距保持不变。 已有 <code>startIcon</code>{' '}
            时，加载图形替换原图标槽位，按钮宽度保持稳定；纯文字按钮加载时增加图标槽位和间距，宽度自然增长。
          </p>
          <p>
            删除等破坏性动作可设置 <code>destructive</code>，并用动作名称明确风险；它与
            <code>variant</code> 分开控制，不自动打开确认弹窗或执行删除。危险色使用既有错误语义色，
            <a href="#/components/theme-provider">ThemeProvider</a> 的 <code>tokens.error</code>
            也会影响危险按钮。
          </p>
          <p>
            全宽按钮可设置 <code>{"style={{ width: '100%' }}"}</code>，长名称会换行并撑高按钮。
            具体写法见上方<a href="#/components/button?section=button-layout">全宽与长文案</a>。
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
            显示所选加载图形、保留文案并设置
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
