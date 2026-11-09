import { Link } from 'yahha-ui';
import ToastSimple from '../../examples/feedback/ToastSimple';
import toastSimpleSource from '../../examples/feedback/ToastSimple.tsx?raw';
import ToastFocus from '../../examples/feedback/ToastFocus';
import toastFocusSource from '../../examples/feedback/ToastFocus.tsx?raw';
import ToastAction from '../../examples/feedback/ToastAction';
import toastActionSource from '../../examples/feedback/ToastAction.tsx?raw';
import ToastTones from '../../examples/feedback/ToastTones';
import toastTonesSource from '../../examples/feedback/ToastTones.tsx?raw';
import ToastAppearance from '../../examples/feedback/ToastAppearance';
import toastAppearanceSource from '../../examples/feedback/ToastAppearance.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('toast', {
  importCode: "import { Toast } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <>
          <p>
            用于保存成功、文章已归档等不需要中断当前操作的短结果提示。需要持续阅读的说明或错误可使用{' '}
            <a href="#/components/alert">Alert</a> 或直接留在页面中。
          </p>
          <p>
            Toast
            是受控展示组件，显示在调用方放置的位置。调用方管理消息内容、open、关闭时机与多条消息的排列。
          </p>
        </>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        {
          id: 'toast-simple',
          title: '基础用法',
          description: '显示并关闭提示，关闭后可重新显示。',
          component: ToastSimple,
          source: toastSimpleSource,
        },
        {
          id: 'tones',
          title: '三种反馈类型',
          description: '对比三种反馈类型，支持关闭与恢复提示。',
          component: ToastTones,
          source: toastTonesSource,
        },
        {
          id: 'toast-action',
          title: '带操作的提示',
          description: '通过 action 提供后续链接，关闭提示后可重新显示。',
          component: ToastAction,
          source: toastActionSource,
        },
        {
          id: 'appearance',
          title: '普通与回执外观',
          description: '使用相同内容和链接，对比回执增加的印签与浅色操作纸面。',
          component: ToastAppearance,
          source: toastAppearanceSource,
        },
        {
          id: 'basic',
          title: '关闭提示后的焦点恢复',
          description:
            '关闭提示时按需返回触发按钮，查看操作聚焦手记标题；常驻入口在提示关闭后仍可用。',
          component: ToastFocus,
          source: toastFocusSource,
        },
      ],
    },
    {
      id: 'design',
      title: '自动关闭与恢复入口',
      content: (
        <>
          <p>
            自动关闭由调用方实现，组件本身没有计时器。请留足阅读时间，并为撤销等重要操作保留持续入口。完整的{' '}
            <Link href="#/guides/interactions?section=timer-and-action">归档撤销与提示计时</Link>
            展示 8 秒窗口、悬停与聚焦暂停、后台暂停，以及关闭提示后的恢复操作。
          </p>
          <p>
            收藏内容不会随提示关闭而丢失。完整的{' '}
            <Link href="#/guides/interactions?section=basic">清单操作与提示回焦</Link>
            保留文章增删、清单结果和常驻查看入口。
          </p>
        </>
      ),
    },
    {
      id: 'api',
      title: 'API',
      api: [
        {
          name: 'ToastProps',
          rows: [
            {
              name: 'open',
              type: 'boolean',
              required: true,
              description: '是否显示，false 时返回 null。没有 defaultOpen。',
            },
            {
              name: 'onClose',
              type: '() => void',
              required: true,
              description: '点击内置关闭按钮时调用，调用方应将 open 更新为 false。',
            },
            {
              name: 'title',
              type: 'ReactNode',
              required: true,
              description: '提示标题，渲染在 p 内，适合文字或行内内容。',
            },
            {
              name: 'description',
              type: 'ReactNode',
              description: '可选说明，渲染在 p 内；无默认内容。',
            },
            {
              name: 'tone',
              type: "'success' | 'info' | 'error'",
              defaultValue: "'success'",
              description: '反馈视觉类型，决定颜色与状态图标，不改变播报优先级。',
            },
            {
              name: 'appearance',
              type: "'default' | 'receipt'",
              defaultValue: "'default'",
              description:
                '默认保留状态图标与操作；receipt 额外加入印签边框和带虚线分隔的浅色操作纸面。',
            },
            {
              name: 'action',
              type: 'ReactNode',
              description: '补充操作插槽；行为、关闭与后续状态由调用方实现。',
            },
            {
              name: 'className',
              type: 'string',
              description: '作用于根 status div。当前不透传 ref、style 或其他原生 div 属性。',
            },
          ],
        },
      ],
    },
    {
      id: 'behavior',
      title: '播报与关闭后的焦点',
      content: (
        <ul>
          <li>
            根元素使用 role="status" 与 aria-atomic="true"，礼貌播报整条提示；同一结果不再另设 live
            region 重复播报。需要紧急播报的错误，可使用显式设置 role="alert" 的 Alert。
          </li>
          <li>
            显示时不主动移动焦点。内置关闭按钮的名称为“关闭提示”，它与 action
            内的交互元素按页面顺序参与 Tab；组件不监听 Escape。
          </li>
          <li>
            从提示内部关闭或完成操作后，调用方应把焦点放到仍然存在的合理位置；自动关闭时不要移动页面其他位置的焦点。
          </li>
        </ul>
      ),
    },
    {
      id: 'styling',
      title: '放置提示',
      content: (
        <>
          <p>
            默认在文档流中显示。需要固定在屏幕角落时，由外层容器设置定位、窄屏边距与多条消息的排列，并避免遮挡当前操作；Toast
            不创建 Portal 或全局消息队列。
          </p>
          <p>
            默认使用普通外观，需要回执纸章时显式设置 appearance="receipt"。
            两种外观均保留状态图标、文字、操作和关闭入口，并继承外层容器的阅读方向。
          </p>
        </>
      ),
    },
  ],
});
