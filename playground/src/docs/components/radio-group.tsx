import RadioGroupBasic from '../../examples/new-forms/RadioGroupBasic';
import RadioGroupBasicSource from '../../examples/new-forms/RadioGroupBasic.tsx?raw';
import RadioGroupDescriptions from '../../examples/new-forms/RadioGroupDescriptions';
import RadioGroupDescriptionsSource from '../../examples/new-forms/RadioGroupDescriptions.tsx?raw';
import RadioGroupStatus from '../../examples/new-forms/RadioGroupStatus';
import RadioGroupStatusSource from '../../examples/new-forms/RadioGroupStatus.tsx?raw';
import RadioGroupForm from '../../examples/new-forms/RadioGroupForm';
import RadioGroupFormSource from '../../examples/new-forms/RadioGroupForm.tsx?raw';
import RadioGroupStates from '../../examples/new-forms/RadioGroupStates';
import RadioGroupStatesSource from '../../examples/new-forms/RadioGroupStates.tsx?raw';
import RadioGroupReadingLayout from '../../examples/new-forms/RadioGroupReadingLayout';
import RadioGroupReadingLayoutSource from '../../examples/new-forms/RadioGroupReadingLayout.tsx?raw';
import RadioGroupCommentSignature from '../../examples/new-forms/RadioGroupCommentSignature';
import RadioGroupCommentSignatureSource from '../../examples/new-forms/RadioGroupCommentSignature.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('radio-group', {
  importCode: "import { RadioGroup } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          从少量互斥选项中选择一项，适合需要同时展示标签和补充说明的表单。简短的紧凑筛选使用{' '}
          <a href="#/components/segmented-control">SegmentedControl</a>；需要收起选项时使用{' '}
          <a href="#/components/select">Select</a>；切换独立内容面板使用{' '}
          <a href="#/components/tabs">Tabs</a>。
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
          description: '在两个短选项间切换，使用受控值管理选择。',
          component: RadioGroupBasic,
          source: RadioGroupBasicSource,
        },
        {
          id: 'radio-descriptions',
          title: '选项说明',
          description: '为选项提供补充说明，并说明单项禁用原因。',
          component: RadioGroupDescriptions,
          source: RadioGroupDescriptionsSource,
        },
        {
          id: 'radio-status',
          title: '错误与禁用',
          description: '选择后清除错误，并对比整组禁用状态。',
          component: RadioGroupStatus,
          source: RadioGroupStatusSource,
        },
      ],
    },
    {
      id: 'integration',
      title: '进阶用法',
      disclosure: '查看长标签、表单与联动示例',
      content: <p>选择只影响当前示例；阅读设置与留言均不会保存或发布。</p>,
      examples: [
        {
          id: 'states',
          title: '长标签与状态组合',
          description: '对比长标签换行、错误与父 fieldset 禁用。',
          component: RadioGroupStates,
          source: RadioGroupStatesSource,
          toc: false,
        },
        {
          id: 'form',
          title: '受控表单与重置',
          description: '读取必选项或重置；改选后清除上次读取结果。',
          component: RadioGroupForm,
          source: RadioGroupFormSource,
          toc: false,
        },
        {
          id: 'radio-reading-layout',
          title: '选项联动预览',
          description: '切换标准和宽松选项，比较相同内容的行距与段距。',
          component: RadioGroupReadingLayout,
          source: RadioGroupReadingLayoutSource,
          toc: false,
        },
        {
          id: 'radio-comment-signature',
          title: '条件字段与表单值',
          description: '切换选项控制昵称字段，再按实际表单值预览署名。',
          component: RadioGroupCommentSignature,
          source: RadioGroupCommentSignatureSource,
          toc: false,
        },
      ],
    },
    {
      id: 'design',
      title: '状态与表单',
      content: (
        <ul>
          <li>
            使用 value / onValueChange 管理受控选择，空字符串可表示待选择；在回调中更新
            value，选项值须保持唯一。用空字符串表示未选择时，不再将其作为有效选项值。
          </li>
          <li>
            显式设置 name 后，FormData 可读取已选值；同一表单内的独立组使用不同 name。form 同时关联
            fieldset 和组内 radio。重置时需在 onReset 中恢复 React 状态。
          </li>
          <li>
            required 将必选约束传给原生 radio；hint 和 error
            用于组级说明与错误，选择后的错误清除由调用方处理。
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
            署名例在匿名时禁用昵称字段并取消必填，保留草稿供切回；预览读取当时的 FormData，
            禁用的昵称不参与提交。条件字段与预览放在单选标签之外。
          </li>
        </ul>
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
