import AlertExample from '../../examples/content/AlertExample';
import alertSource from '../../examples/content/AlertExample.tsx?raw';
import AlertAction from '../../examples/content/AlertAction';
import alertActionSource from '../../examples/content/AlertAction.tsx?raw';
import { defineComponentPage } from '../page';
import { nativeRows, example } from '../page-helpers';

export default defineComponentPage('alert', {
  importCode: "import { Alert } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          用于页面内持续可见的提示、限制或需要恢复操作的失败说明。Alert
          跟随文档布局，适合让用户阅读原因后继续处理。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        example(
          'alert-tones',
          '四种说明类型',
          '比较信息、成功、警告和错误四种外观；保存与发送文案仅为静态样本。',
          AlertExample,
          alertSource,
        ),
        example(
          'alert-action',
          '与操作组合',
          '首次模拟保存失败，再重试成功；选项保留，按钮加载和后续焦点由示例管理。仅更新本页状态，不发送网络请求或真实订阅。',
          AlertAction,
          alertActionSource,
        ),
      ],
    },
    {
      id: 'design',
      title: '提示内容与恢复操作',
      content: (
        <p>
          失败说明应写清原因，并提供重试、修改等明确操作。像示例一样保留用户已经填写或选择的内容，让用户能继续处理；请求等待和结束后的焦点由页面流程管理。
        </p>
      ),
    },
    {
      id: 'api',
      title: 'API',
      api: [
        {
          name: 'AlertProps',
          rows: [
            {
              name: 'tone',
              type: "'info' | 'success' | 'warning' | 'error'",
              defaultValue: "'info'",
              description: '说明类型，决定图标与背景颜色。',
            },
            {
              name: 'title',
              type: 'ReactNode',
              description: '可选标题，渲染为 p，不是原生 title 属性。',
            },
            { name: 'children', type: 'ReactNode', description: '内容，可组合正文、链接或按钮。' },
            {
              name: 'role',
              type: 'AriaRole',
              defaultValue: "'note'",
              description: '静态说明默认 note；紧急动态结果可显式使用 alert。',
            },
            ...nativeRows('div'),
          ],
        },
      ],
    },
    {
      id: 'behavior',
      title: '静态说明与动态播报',
      content: (
        <>
          <p>
            默认 role="note"，tone 只改变说明类型，不会自动启动播报。紧急动态结果可显式使用
            role="alert"；一般状态更新可由外层 status 或 aria-live 说明，同一结果避免多处重复播报。
          </p>
          <p>
            提示出现时不会主动移动焦点，也没有内置关闭按钮。需要允许关闭时，由页面提供按钮并更新显示状态；关闭包含操作的提示后，应把其中的焦点移到仍然存在的合理位置。
          </p>
        </>
      ),
    },
  ],
});
