import TextareaBasic from '../../examples/new-forms/TextareaBasic';
import TextareaBasicSource from '../../examples/new-forms/TextareaBasic.tsx?raw';
import TextareaAutoSize from '../../examples/new-forms/TextareaAutoSize';
import TextareaAutoSizeSource from '../../examples/new-forms/TextareaAutoSize.tsx?raw';
import TextareaReadonlyDisabled from '../../examples/new-forms/TextareaReadonlyDisabled';
import TextareaReadonlyDisabledSource from '../../examples/new-forms/TextareaReadonlyDisabled.tsx?raw';
import TextareaControlled from '../../examples/new-forms/TextareaControlled';
import TextareaControlledSource from '../../examples/new-forms/TextareaControlled.tsx?raw';
import TextareaStates from '../../examples/new-forms/TextareaStates';
import TextareaStatesSource from '../../examples/new-forms/TextareaStates.tsx?raw';
import TextareaCommentDraft from '../../examples/new-forms/TextareaCommentDraft';
import TextareaCommentDraftSource from '../../examples/new-forms/TextareaCommentDraft.tsx?raw';
import { CodeBlock } from '../CodeBlock';
import { defineComponentPage } from '../page';

export default defineComponentPage('textarea', {
  importCode: "import { Textarea } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          用于收集留言、文章摘要、反馈等多行纯文本。只需昵称、邮箱等单行内容时使用{' '}
          <a href="#/components/input">Input</a>。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
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
          title: '受控输入与字数提示',
          description: '通过 value 与 onChange 同步内容，按 UTF-16 代码单元显示当前长度。',
          component: TextareaControlled,
          source: TextareaControlledSource,
        },
        {
          id: 'textarea-auto-size',
          title: '自动调整高度',
          description: '内容在二至八行间自动增减高度，超出后在框内滚动。',
          component: TextareaAutoSize,
          source: TextareaAutoSizeSource,
        },
        {
          id: 'textarea-states',
          title: '只读与禁用',
          description: '对比只读可复制和禁用不可编辑两种状态。',
          component: TextareaReadonlyDisabled,
          source: TextareaReadonlyDisabledSource,
        },
        {
          id: 'native',
          title: '原生表单重置',
          description: '修改非受控草稿，再通过原生 reset 恢复 defaultValue 中的初始内容。',
          component: TextareaStates,
          source: TextareaStatesSource,
        },
        {
          id: 'textarea-comment-draft',
          title: '原生表单校验与预览',
          description: '用 FormData 读取非受控草稿，手动检查空白并用 ref 回焦，预览时保留换行。',
          component: TextareaCommentDraft,
          source: TextareaCommentDraftSource,
        },
      ],
    },
    {
      id: 'limits',
      title: '状态与原生表单',
      content: (
        <ul>
          <li>
            value / onChange 用于受控内容，defaultValue 用于非受控初始内容。自行管理原生 form
            时，受控值需在 onReset 中恢复，见{' '}
            <a href="#/guides/forms?section=reset">原生表单的受控与非受控重置</a>。
          </li>
          <li>name、form、required 和 maxLength 沿用原生 textarea 属性。长度反馈由调用方维护。</li>
          <li>
            error 只呈现错误，本页原生表单的空白校验与失败回焦由示例处理，见{' '}
            <a href="#/guides/forms?section=validation">原生表单的校验与焦点</a>。输入长度与原生
            maxLength 均按 UTF-16 代码单元计数，部分表情会占多个单位。
          </li>
          <li>
            readOnly 仍可聚焦、复制并参与提交；disabled
            不可编辑或聚焦，也不参与提交。必填要求应同时提供可见说明。
          </li>
          <li>
            autoSize 默认关闭。开启后随内容、可用宽度及重置调整高度，达到 maxRows 后内部滚动，
            不改变文字、原生事件或 Enter 换行。自行管理原生 form
            时需同步恢复受控内容，取消原生重置时保留当前内容。
          </li>
          <li>
            minRows 未给时采用有效的 rows，未传 rows 则为 4；行数取正有限数，向下取整后至少为 1，
            非法 minRows 回退 rows，非法 maxRows 视为无上限，maxRows 小于 minRows 时以 minRows
            为界。
          </li>
        </ul>
      ),
    },
    {
      id: 'form-integration',
      title: '与 Form 配合',
      kind: 'integration',
      content: (
        <>
          <CodeBlock
            source={`import { Form, Textarea } from 'yahha-ui';

<Form initialValues={{ description: '' }}>
  {(form) => <Textarea {...form.input('description')} label="简短介绍" rows={3} />}
</Form>`}
          />
          <p>
            统一校验、提交与重置见 <a href="#/components/form">Form 表单</a>。
          </p>
        </>
      ),
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
              description:
                '辅助和错误说明，与 aria-describedby 合并；error 设置 aria-invalid，并在错误文字前显示提醒标记。',
            },
            { name: 'rows', type: 'number', description: '原生可见行数。', defaultValue: '4' },
            {
              name: 'autoSize',
              type: 'boolean | { minRows?: number; maxRows?: number }',
              description:
                '按内容自动调整高度，可限制行数；true 或空对象以 rows 为最小值，无最大值。',
              defaultValue: 'false',
            },
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
              description:
                '作用于真实 textarea。默认 resize: vertical；开启 autoSize 时 height、resize、overflowY 由自动高度管理。',
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
            说明如何修正，并可通过 ref
            聚焦输入区域；提醒标记辅助识别错误，不单独播报，错误的设置与清除由调用方处理。
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
            默认用 rows 设置初始可见行数并允许垂直拖动，内容超出后滚动。 开启 autoSize 时组件接管
            height、resize、overflowY；关闭后交还当前 style。 minHeight / maxHeight 仍是额外的 CSS
            约束，与行数上下限冲突时会影响实际可见行数。 字段宽度由 className 或外层容器控制。
          </p>
        </>
      ),
    },
  ],
});
