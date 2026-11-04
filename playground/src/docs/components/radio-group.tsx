import RadioGroupBasic from '../../examples/new-forms/RadioGroupBasic';
import RadioGroupBasicSource from '../../examples/new-forms/RadioGroupBasic.tsx?raw';
import RadioGroupForm from '../../examples/new-forms/RadioGroupForm';
import RadioGroupFormSource from '../../examples/new-forms/RadioGroupForm.tsx?raw';
import RadioGroupStates from '../../examples/new-forms/RadioGroupStates';
import RadioGroupStatesSource from '../../examples/new-forms/RadioGroupStates.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('radio-group', {
  importCode: "import { RadioGroup } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          从少量互斥选项中选择一项，尤其适合需要同时阅读标签和补充说明的表单。简短的紧凑筛选使用{' '}
          <a href="#/components/segmented-control">SegmentedControl</a>；需要收起选项时使用{' '}
          <a href="#/components/select">Select</a>；切换独立内容面板使用{' '}
          <a href="#/components/tabs">Tabs</a>。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      content: <p>本页示例只在本地选择和读取，不实际订阅或保存设置。</p>,
      examples: [
        {
          id: 'basic',
          title: '标签与选项说明',
          description: '选择来信频率，比较各选项说明。',
          component: RadioGroupBasic,
          source: RadioGroupBasicSource,
        },
        {
          id: 'form',
          title: '受控表单与重置',
          description: '读取必选项或重置；改选后清除上次读取结果。',
          component: RadioGroupForm,
          source: RadioGroupFormSource,
        },
        {
          id: 'states',
          title: '长标签、错误与禁用',
          description: '选择范围清除预设错误，并对比长标签与整组禁用。',
          component: RadioGroupStates,
          source: RadioGroupStatesSource,
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
