import SpinnerExample from '../../examples/content/SpinnerExample';
import spinnerSource from '../../examples/content/SpinnerExample.tsx?raw';
import SpinnerVariants from '../../examples/content/SpinnerVariants';
import spinnerVariantsSource from '../../examples/content/SpinnerVariants.tsx?raw';
import SpinnerWaiting from '../../examples/content/SpinnerWaiting';
import spinnerWaitingSource from '../../examples/content/SpinnerWaiting.tsx?raw';
import { defineComponentPage } from '../page';
import { example } from '../page-helpers';

export default defineComponentPage('spinner', {
  importCode: "import { Spinner } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          适合内容区域的短暂等待。按钮请求使用 Button 的 loading；需要按已知内容结构预留空间时，使用
          Skeleton。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      content: <p>本页仅演示等待状态，不发起请求。</p>,
      examples: [
        example(
          'spinner-waiting',
          '基础等待与结果',
          '用可见文字说明等待内容，切换完成状态后移除等待图形。',
          SpinnerWaiting,
          spinnerWaitingSource,
        ),
        example(
          'spinner-sizes',
          '尺寸',
          '使用默认三墨点对比小、中、大三档尺寸。',
          SpinnerExample,
          spinnerSource,
        ),
        example(
          'spinner-variants',
          '加载图形',
          '使用相同尺寸对比默认三墨点与可选小花饼。',
          SpinnerVariants,
          spinnerVariantsSource,
        ),
      ],
    },
    {
      id: 'design',
      title: '等待标记与可见说明',
      content: (
        <p>
          区块等待应配合可见文字说明正在加载什么。默认三墨点与可选小花饼均只表示等待，不表达完成百分比；减少动效时保持静止，等待信息仍由文字传达。
        </p>
      ),
    },
    {
      id: 'api',
      title: 'API',
      api: [
        {
          name: 'SpinnerProps',
          rows: [
            {
              name: 'label',
              type: 'string',
              defaultValue: '加载中',
              description: '在 status 内提供的屏幕阅读器文字。',
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              defaultValue: "'md'",
              description: '默认 16 / 24 / 36px。',
            },
            {
              name: 'variant',
              type: "'dots' | 'biscuit'",
              defaultValue: "'dots'",
              description: '默认三墨点或可选小花饼，仅切换等待图形。',
            },
            {
              name: 'role',
              type: 'AriaRole',
              defaultValue: "'status'",
              description: '原生角色，通常保留 status。',
            },
            {
              name: 'className / style',
              type: 'string / CSSProperties',
              description: '作用于根 span。',
            },
            { name: 'ref', type: 'Ref<HTMLSpanElement>', description: '指向根 span。' },
            {
              name: '其他原生属性 / 事件',
              type: 'Omit<ComponentPropsWithRef<"span">, "children">',
              description: '事件、aria-* 和 data-* 等作用于根 span；不接收 children。',
            },
          ],
        },
      ],
    },
    {
      id: 'behavior',
      title: '只播报一份等待状态',
      content: (
        <>
          <p>
            默认 role="status"，由 label
            提供屏幕阅读器文字，图形本身为装饰。外层已有包含可见状态文字的 status 时，将内部 Spinner
            设为 role="presentation"、aria-hidden="true"，避免同一等待重复播报。
          </p>
          <p>
            请求结束时移除等待标记，并更新为实际完成、失败或空内容说明。等待过久时应提供原因或恢复入口，不让等待标记代替结果；组件不接受
            children，可见说明放在旁边。
          </p>
        </>
      ),
    },
  ],
});
