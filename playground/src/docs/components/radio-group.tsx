import RadioGroupBasic from '../../examples/new-forms/RadioGroupBasic';
import RadioGroupBasicSource from '../../examples/new-forms/RadioGroupBasic.tsx?raw';
import RadioGroupHighlight from '../../examples/new-forms/RadioGroupHighlight';
import radioGroupHighlightSource from '../../examples/new-forms/RadioGroupHighlight.tsx?raw';
import RadioGroupLongLabels from '../../examples/new-forms/RadioGroupLongLabels';
import radioGroupLongLabelsSource from '../../examples/new-forms/RadioGroupLongLabels.tsx?raw';
import RadioGroupDescriptions from '../../examples/new-forms/RadioGroupDescriptions';
import RadioGroupDescriptionsSource from '../../examples/new-forms/RadioGroupDescriptions.tsx?raw';
import RadioGroupStatus from '../../examples/new-forms/RadioGroupStatus';
import RadioGroupStatusSource from '../../examples/new-forms/RadioGroupStatus.tsx?raw';
import RadioGroupForm from '../../examples/new-forms/RadioGroupForm';
import RadioGroupFormSource from '../../examples/new-forms/RadioGroupForm.tsx?raw';
import RadioGroupReadingLayout from '../../examples/new-forms/RadioGroupReadingLayout';
import RadioGroupReadingLayoutSource from '../../examples/new-forms/RadioGroupReadingLayout.tsx?raw';
import { CodeBlock } from '../CodeBlock';
import { defineComponentPage } from '../page';

export default defineComponentPage('radio-group', {
  importCode: "import { RadioGroup } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <>
          <p>
            从少量互斥选项中选择一项，适合需要同时展示标签和补充说明的表单。简短的紧凑筛选使用{' '}
            <a href="#/components/segmented-control">SegmentedControl</a>；需要收起选项时使用{' '}
            <a href="#/components/select">Select</a>；切换独立内容面板使用{' '}
            <a href="#/components/tabs">Tabs</a>。
          </p>
          <p>
            RadioGroup 只支持受控选择，需传入 value 与 onValueChange。自行管理原生 form
            时由调用方恢复重置后的 value，使用 Form 绑定时由 Form 统一管理。
          </p>
        </>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      examples: [
        {
          id: 'basic',
          title: '基础用法',
          description: '通过 value 与 onValueChange 在两个互斥选项间切换。',
          component: RadioGroupBasic,
          source: RadioGroupBasicSource,
        },
        {
          id: 'radio-descriptions',
          title: '选项说明与单项禁用',
          description: '为选项提供补充说明，并说明单项禁用原因。',
          component: RadioGroupDescriptions,
          source: RadioGroupDescriptionsSource,
        },
        {
          id: 'radio-status',
          title: '错误、清空与禁用',
          description: '清空后恢复错误，对比直接禁用与父 fieldset 禁用。',
          component: RadioGroupStatus,
          source: RadioGroupStatusSource,
        },
        {
          id: 'radio-long-labels',
          title: '长标签换行',
          description: '在窄栏中切换选项，查看长标签与说明的换行。',
          component: RadioGroupLongLabels,
          source: radioGroupLongLabelsSource,
        },
        {
          id: 'radio-highlight',
          title: '整行高亮',
          description: '两组共用选择值，对比相同内容和状态下的默认与整行高亮外观。',
          component: RadioGroupHighlight,
          source: radioGroupHighlightSource,
        },
        {
          id: 'form',
          title: '原生表单取值与重置',
          description: '演示 required 必选、FormData 取值，以及在原生 onReset 中显式恢复受控选择。',
          component: RadioGroupForm,
          source: RadioGroupFormSource,
        },
        {
          id: 'radio-reading-layout',
          title: '选项联动预览',
          description: '切换标准和宽松选项，比较相同内容的行距与段距；仅当前示例生效。',
          component: RadioGroupReadingLayout,
          source: RadioGroupReadingLayoutSource,
        },
      ],
    },
    {
      id: 'design',
      title: '状态与原生表单',
      content: (
        <ul>
          <li>
            选项标题保持固定字重，避免窄栏中的长标题因选中加粗而重新换行；默认通过圆点和白环表达选中。
            显式设置 <code>highlightSelected</code>{' '}
            为可用选中行增加轻纸色与内底缘，不改变行高或表单值。
          </li>
          <li>
            使用 value / onValueChange 管理受控选择，空字符串可表示待选择；在回调中更新
            value，选项值须保持唯一。用空字符串表示未选择时，不再将其作为有效选项值。
          </li>
          <li>
            显式 name 提供稳定的提交字段名，独立组使用不同 name；form 同时关联 fieldset 和组内
            radio。自行管理原生 form 时，需在 onReset 中恢复受控 value，见{' '}
            <a href="#/guides/forms?section=reset">原生表单重置</a>。
          </li>
          <li>
            required 将必选约束传给原生 radio，hint 和 error 用于组级说明与错误。 自行管理原生 form
            时，校验与错误关联见 <a href="#/guides/forms?section=validation">原生表单接入</a>
            。错误说明带装饰性提醒标记， 长文字换行齐文字起点；标记不单独命名或播报。
          </li>
          <li>
            disabled 禁用整组，options 中的 disabled 禁用单项，也支持父 fieldset
            禁用。禁用项不参与切换或提交；锁定选择应使用禁用状态。
          </li>
          <li>
            阅读版式例只调整下方正文的行距与段落间距，不改变控件尺寸；键盘切换时焦点随原生单选项移动，
            不跳到正文或状态提示。
          </li>
          <li>
            跨字段的条件必填、禁用值与草稿恢复见{' '}
            <a href="#/guides/interactions?section=radio-comment-signature">
              交互组合：条件字段与表单值
            </a>
            。
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
            source={`import { Form, RadioGroup } from 'yahha-ui';

<Form initialValues={{ frequency: 'weekly' }}>
  {(form) => (
    <RadioGroup
      {...form.choice('frequency')}
      label="来信频率"
      options={[
        { value: 'weekly', label: '每周' },
        { value: 'monthly', label: '每月' },
      ]}
    />
  )}
</Form>`}
          />
          <p>
            空字符串表示待选择，配合 required 实现必选。多控件接入见{' '}
            <a href="#/components/form?section=form-controls">Form 控件绑定示例</a>。
          </p>
        </>
      ),
    },
    {
      id: 'api',
      title: 'API',
      api: [
        {
          name: 'RadioGroupProps<T extends string>',
          rows: [
            {
              name: 'label',
              type: 'ReactNode',
              description: '可见的 fieldset legend，为整组命名。',
              required: true,
            },
            {
              name: 'options',
              type: 'readonly RadioOption<T>[]',
              description: '互斥选项，value 必须唯一。',
              required: true,
            },
            {
              name: 'value',
              type: 'T',
              description: '当前受控值；空字符串可表示未选择。',
              required: true,
            },
            {
              name: 'onValueChange',
              type: '(value: T) => void',
              description: '用户选择后的字符串值；调用方更新 value。',
              required: true,
            },
            {
              name: 'hint / error',
              type: 'ReactNode',
              description:
                '组说明与错误，与每项 description 一同关联单选项；error 将分组标记为无效。',
            },
            {
              name: 'name',
              type: 'string',
              description: '组内 radio 共用名称，显式设置后可读取 FormData。',
              defaultValue: '自动生成唯一名称',
            },
            {
              name: 'form',
              type: 'string',
              description: '同时关联 fieldset 与全部 radio 的外部表单 ID。',
            },
            {
              name: 'required / disabled',
              type: 'boolean',
              description: '原生必选或整组禁用；也支持父 fieldset disabled。',
              defaultValue: 'false',
            },
            {
              name: 'highlightSelected',
              type: 'boolean',
              description: '为可用选中行增加轻纸色与内底缘；圆点、焦点和表单行为始终保留。',
              defaultValue: 'false',
            },
            {
              name: 'classNames',
              type: '{ legend?, options?, option?, input?, label?, description?, hint?, error? }',
              description: '各部分附加类名，每个值为 string。',
            },
            {
              name: 'className / style / ref / 其他 fieldset 属性',
              type: 'ComponentPropsWithRef<"fieldset">',
              description:
                '作用于 fieldset；ref 为 Ref<HTMLFieldSetElement>。不提供 children、defaultValue 或 defaultChecked。选项由 options 提供，组级说明使用 hint；其他内容放在组件外。',
            },
          ],
        },
        {
          name: 'RadioOption<T extends string>',
          rows: [
            { name: 'value', type: 'T', description: '唯一选项值。', required: true },
            { name: 'label', type: 'ReactNode', description: '可访问选项名称。', required: true },
            {
              name: 'description',
              type: 'ReactNode',
              description: '补充说明，单独通过 aria-describedby 与 radio 关联。',
            },
            {
              name: 'disabled',
              type: 'boolean',
              description: '禁用单项。',
              defaultValue: 'false',
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
            Tab 进入原生单选组，方向键在可用项间移动并选择，Space
            选择聚焦项；禁用项跳过。各浏览器的组内 Tab 入口细节可能不同。
          </li>
          <li>
            选项标签内避免嵌套链接或按钮。校验后如需将焦点移到选项，应定位组内 radio 并调用
            focus；组件的 ref 指向整组 fieldset。
          </li>
        </ul>
      ),
    },
    {
      id: 'limits',
      title: '样式定制',
      content: (
        <p>
          调整整组宽度可使用 className 或 style；选项间距和排列由 classNames.options 设置。
          选项名称与补充说明分别使用
          classNames.label、classNames.description，避免用固定高度裁切长说明。
        </p>
      ),
    },
  ],
});
