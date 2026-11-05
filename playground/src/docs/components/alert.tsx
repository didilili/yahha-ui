import AlertExample from '../../examples/content/AlertExample';
import alertSource from '../../examples/content/AlertExample.tsx?raw';
import AlertAction from '../../examples/content/AlertAction';
import alertActionSource from '../../examples/content/AlertAction.tsx?raw';
import AlertReadingNotice from '../../examples/content/AlertReadingNotice';
import alertReadingNoticeSource from '../../examples/content/AlertReadingNotice.tsx?raw';
import { defineComponentPage } from '../page';
import { example } from '../page-helpers';

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
          '对比信息、成功、警告和错误四种静态说明。',
          AlertExample,
          alertSource,
        ),
      ],
    },
    {
      id: 'integration',
      title: '进阶用法',
      disclosure: '查看重试与隐藏恢复示例',
      content: <p>订阅流程仅在当前示例中模拟，不实际保存；阅读提醒只改变当前页面的显示状态。</p>,
      examples: [
        {
          ...example(
            'alert-action',
            '失败提示与重试',
            '首次模拟失败，重试成功；选择保留，不实际订阅。',
            AlertAction,
            alertActionSource,
          ),
          toc: false,
        },
        {
          ...example(
            'alert-reading-notice',
            '隐藏与恢复提示',
            '收起提示后，可从保留的外部入口再次展开。',
            AlertReadingNotice,
            alertReadingNoticeSource,
          ),
          toc: false,
        },
      ],
    },
    {
      id: 'design',
      title: '提示内容与恢复操作',
      content: (
        <p>
          保存失败时说明原因，并提供重试或修改入口。保留用户已填写或选择的内容；等待状态和结束后的焦点由调用方管理。
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
            {
              name: 'className / style',
              type: 'string / CSSProperties',
              description: '作用于根 div 元素。',
            },
            {
              name: 'ref',
              type: "ComponentPropsWithRef<'div'>['ref']",
              description: '指向真实 div 元素。',
            },
            {
              name: '其他原生属性 / 事件',
              type: "Omit<ComponentPropsWithRef<'div'>, 'title'>",
              description: '支持 div 事件、aria-*、data-* 等属性；原生 title 由组件标题替代。',
            },
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
            提示出现时不会主动移动焦点，也没有内置关闭按钮。阅读提醒例由页面维护显示状态；仅隐藏包含当前焦点的提示时，回到持续存在的“阅读提醒”按钮。恢复时保留触发按钮焦点。
          </p>
        </>
      ),
    },
  ],
});
