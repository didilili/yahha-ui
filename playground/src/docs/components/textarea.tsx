import TextareaBasic from '../../examples/new-forms/TextareaBasic';
import TextareaBasicSource from '../../examples/new-forms/TextareaBasic.tsx?raw';
import TextareaControlled from '../../examples/new-forms/TextareaControlled';
import TextareaControlledSource from '../../examples/new-forms/TextareaControlled.tsx?raw';
import TextareaStates from '../../examples/new-forms/TextareaStates';
import TextareaStatesSource from '../../examples/new-forms/TextareaStates.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('textarea', {
  importCode: "import { Textarea } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          收集留言、文章摘要、反馈等需要换行的纯文本。只需昵称、邮箱等单行内容时使用{' '}
          <a href="#/components/text-field">TextField</a>。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      content: <p>本页示例只在本地操作，不发送或保存留言。</p>,
      examples: [
        {
          id: 'basic',
          title: '基础用法',
          description: '输入多行留言。',
          component: TextareaBasic,
          source: TextareaBasicSource,
        },
        {
          id: 'controlled',
          title: '受控内容与校验',
          description: '检查留言，查看输入长度与校验结果。',
          component: TextareaControlled,
          source: TextareaControlledSource,
        },
        {
          id: 'native',
          title: '原生重置、只读与禁用',
          description: '修改草稿后重置，并对比只读与禁用状态。',
          component: TextareaStates,
          source: TextareaStatesSource,
        },
      ],
    },
    {
      id: 'api',
      title: 'API',
      api: [
        {
          name: 'TextareaProps',
          rows: [
            {
              name: 'label',
              type: 'ReactNode',
              description: '可见标签，自动关联 textarea。',
              required: true,
            },
            {
              name: 'hint / error',
              type: 'ReactNode',
              description: '辅助和错误说明，与 aria-describedby 合并；error 设置 aria-invalid。',
            },
            { name: 'rows', type: 'number', description: '原生可见行数。', defaultValue: '4' },
            {
              name: 'value / defaultValue',
              type: 'string | readonly string[] | number',
              description:
                '沿用 React textarea 原生值类型；受控模式搭配 onChange。通常使用 string。',
            },
            {
              name: 'onChange',
              type: 'ChangeEventHandler<HTMLTextAreaElement>',
              description: '原生变化事件。',
            },
            {
              name: 'disabled / readOnly / required',
              type: 'boolean',
              description: '原生禁用、只读和必填约束。',
              defaultValue: 'false（原生）',
            },
            {
              name: 'name / form / maxLength / 其他 textarea 属性',
              type: 'ComponentPropsWithRef<"textarea">',
              description: '直接作用于 textarea，保留原生输入与表单语义。',
            },
            { name: 'className', type: 'string', description: '根字段 div 的附加类名。' },
            {
              name: 'classNames',
              type: '{ label?, textarea?, hint?, error? }',
              description: '各部分附加类名，每个值为 string。',
            },
            {
              name: 'ref / style',
              type: 'Ref<HTMLTextAreaElement> / CSSProperties',
              description: '作用于真实 textarea。默认 resize: vertical，style 可覆盖。',
            },
            {
              name: 'id',
              type: 'string',
              description: 'textarea 的 ID，用于标签及提示关联。',
              defaultValue: '自动生成',
            },
          ],
        },
      ],
    },
    {
      id: 'keyboard',
      title: '可访问性与键盘',
      content: (
        <ul>
          <li>
            label 自动关联 textarea，点击标签或按 Tab
            聚焦；保留原生的文字选择、复制和多行编辑行为。Enter 插入换行。
          </li>
          <li>
            placeholder 只提供补充示例，标签应保持可见。自定义校验失败时，用 error
            说明如何修正，并可通过 ref 聚焦输入区域；错误的设置与清除由调用方处理。
          </li>
        </ul>
      ),
    },
    {
      id: 'limits',
      title: '状态与表单',
      content: (
        <ul>
          <li>
            value / onChange 用于受控内容，defaultValue
            用于非受控初始内容。非受控内容随原生表单重置，受控内容需在 onReset 中恢复 React 状态。
          </li>
          <li>
            name、form、required 和 maxLength 沿用原生 textarea
            属性。需要长度反馈或自定义校验时，由调用方维护说明和 error。
          </li>
          <li>
            受控例使用 noValidate 跳过浏览器提交校验，由示例检查空白内容；error
            只呈现错误。输入长度与原生 maxLength 均按 UTF-16 代码单元计数，部分表情会占多个单位。
          </li>
          <li>
            readOnly 仍可聚焦、复制并参与提交；disabled
            不可编辑或聚焦，也不参与提交。必填要求应同时提供可见说明。
          </li>
        </ul>
      ),
    },
    {
      id: 'styling',
      title: '样式定制',
      content: (
        <>
          <p>
            使用 rows 设置初始可见行数，默认四行；内容超出后滚动，不会随输入自动增高。通过 style 或
            classNames.textarea 调整高度、minHeight 与 resize；字段宽度由 className
            或外层容器控制。默认允许用户垂直拖动，固定高度前应考虑长内容的编辑需要。
          </p>
          <p>
            只读例通过 <code>{"style={{ resize: 'none' }}"}</code>{' '}
            关闭拖动；只读与拖动方式分别设置。
          </p>
        </>
      ),
    },
  ],
});
