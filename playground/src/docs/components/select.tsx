import SelectBasic from '../../examples/new-forms/SelectBasic';
import SelectBasicSource from '../../examples/new-forms/SelectBasic.tsx?raw';
import SelectControlled from '../../examples/new-forms/SelectControlled';
import SelectControlledSource from '../../examples/new-forms/SelectControlled.tsx?raw';
import SelectStates from '../../examples/new-forms/SelectStates';
import SelectStatesSource from '../../examples/new-forms/SelectStates.tsx?raw';
import SelectForm from '../../examples/new-forms/SelectForm';
import SelectFormSource from '../../examples/new-forms/SelectForm.tsx?raw';
import SelectLongOptions from '../../examples/new-forms/SelectLongOptions';
import SelectLongOptionsSource from '../../examples/new-forms/SelectLongOptions.tsx?raw';
import SelectCollection from '../../examples/new-forms/SelectCollection';
import SelectCollectionSource from '../../examples/new-forms/SelectCollection.tsx?raw';
import SelectAvailableCollections from '../../examples/new-forms/SelectAvailableCollections';
import SelectAvailableCollectionsSource from '../../examples/new-forms/SelectAvailableCollections.tsx?raw';
import SelectPortalCustomization from '../../examples/customization/SelectPortalCustomization';
import selectPortalCustomizationSource from '../../examples/customization/SelectPortalCustomization.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('select', {
  importCode: "import { Select } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          用于单值选择，以下拉列表展示文章分类、排列方式等固定选项。 选项较少且要直接比较说明时使用{' '}
          <a href="#/components/radio-group">RadioGroup</a>
          ；少量简短的互斥筛选值使用 <a href="#/components/segmented-control">SegmentedControl</a>
          ；切换对应内容面板使用 <a href="#/components/tabs">Tabs</a>。当前 Select
          支持单选和键盘前缀匹配，需要输入搜索或多选时应选择适合该交互的组件。
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
          description: '从三个分类中选择一项。',
          component: SelectBasic,
          source: SelectBasicSource,
        },
        {
          id: 'controlled',
          title: '受控选择与禁用选项',
          description: '切换或清空当前选择，禁用选项不可选。',
          component: SelectControlled,
          source: SelectControlledSource,
        },
        {
          id: 'states',
          title: '错误、只读与禁用',
          description: '选择分类清除预设错误，并对比只读与禁用状态。',
          component: SelectStates,
          source: SelectStatesSource,
        },
        {
          id: 'select-collection',
          title: '自定义选项内容',
          description: '选项与选中值均显示名称和辅助说明。',
          component: SelectCollection,
          source: SelectCollectionSource,
        },
      ],
    },
    {
      id: 'integration',
      title: '进阶用法',
      disclosure: '查看表单、长选项与动态数据示例',
      content: <p>示例在本地运行，状态只保留在当前示例。</p>,
      examples: [
        {
          id: 'form',
          title: '必选表单与重置',
          description: '读取必选分类或重置为未选择。',
          toc: false,
          component: SelectForm,
          source: SelectFormSource,
        },
        {
          id: 'long-options',
          title: '长列表与长选项',
          description: '查看长选项换行与列表滚动。',
          toc: false,
          component: SelectLongOptions,
          source: SelectLongOptionsSource,
        },
        {
          id: 'select-available-collections',
          title: '动态选项与空状态',
          description: '恢复可选项，移除选中项后清空选择；空列表保留恢复入口。',
          toc: false,
          component: SelectAvailableCollections,
          source: SelectAvailableCollectionsSource,
        },
      ],
    },
    {
      id: 'design',
      title: '状态与表单',
      content: (
        <ul>
          <li>
            value / onValueChange 管理受控选择，null 表示未选择；defaultValue
            设置非受控初始值。选项值须为唯一的非空字符串。
          </li>
          <li>
            name 将选中值加入 FormData，form
            可关联外部表单。非受控选择随表单重置到初始值；受控选择需由调用方在 onReset 中恢复
            value。
          </li>
          <li>
            readOnly 允许打开并浏览选项，保留提交值但阻止修改；disabled 阻止交互与提交。单个
            disabled 选项保留在列表中但不可选择。
          </li>
          <li>
            required 保留原生必选约束。校验规则、error
            的设置和选择后的错误清除由调用方维护，必选要求还应提供可见说明。
          </li>
          <li>
            复杂 label 同时用于选项和当前值显示，使用非交互行内内容；textValue
            提供稳定的可见标题，让键盘前缀匹配不受说明文字干扰。
          </li>
          <li>
            空数据时，可用 disabled、placeholder 和 hint 说明原因，在字段旁提供创建或恢复入口。
            options 动态变化时，由调用方同步维护有效 value 并清除旧结果；移除当前项时可显式置为
            null，让用户重新选择。
          </li>
        </ul>
      ),
    },
    {
      id: 'api',
      title: 'API',
      api: [
        {
          name: 'SelectProps',
          rows: [
            {
              name: 'label',
              type: 'ReactNode',
              description: '可见标签，自动关联触发按钮。',
              required: true,
            },
            {
              name: 'options',
              type: 'readonly SelectOption[]',
              description: '选项列表。value 必须唯一且为非空字符串。',
              required: true,
            },
            {
              name: 'value',
              type: 'string | null',
              description: '受控当前值，null 表示未选择。',
            },
            {
              name: 'defaultValue',
              type: 'string | null',
              description: '非受控初始值；原生表单重置时恢复该初始值。',
              defaultValue: 'null',
            },
            {
              name: 'onValueChange',
              type: '(value: string | null) => void',
              description: '选择值变化时调用，参数为值而非 DOM 事件；受控模式需同步更新 value。',
            },
            {
              name: 'placeholder',
              type: 'ReactNode',
              description: '没有选中值时显示的补充文字，不能替代 label。',
              defaultValue: '请选择',
            },
            {
              name: 'hint / error',
              type: 'ReactNode',
              description: '通过 aria-describedby 关联；有 error 时设置 aria-invalid。',
            },
            {
              name: 'name / form',
              type: 'string',
              description: '提交字段名及外部表单 ID；传给内部表单输入。form 也作用于触发按钮。',
            },
            {
              name: 'disabled / required / readOnly',
              type: 'boolean',
              description: '禁用、必选、只读。只读允许浏览选项但阻止修改。',
              defaultValue: 'false',
            },
            {
              name: 'autoComplete',
              type: 'string',
              description: '内部表单输入的浏览器自动填充提示。',
            },
            {
              name: 'portalContainer',
              type: 'HTMLElement | ShadowRoot | RefObject<HTMLElement | ShadowRoot | null> | null',
              description: '列表的挂载目标；弹出列表保留当前 ThemeProvider 的主题配置。',
              defaultValue: 'document.body',
            },
            { name: 'className', type: 'string', description: '根字段 div 的附加类名。' },
            {
              name: 'classNames',
              type: '{ label?, trigger?, value?, popup?, option?, hint?, error? }',
              description: '各部分附加类名；每个值为 string。popup / option 位于 Portal。',
            },
            {
              name: 'ref / style / id / 其他按钮属性',
              type: 'ComponentPropsWithRef<"button">',
              description:
                '作用于真实触发 button；固定 type=button。不提供 children、type、原生 value/defaultValue/onChange。',
              defaultValue: 'id 自动生成',
            },
          ],
        },
        {
          name: 'SelectOption',
          rows: [
            {
              name: 'value',
              type: 'string',
              description: '唯一非空字符串，作为提交值。',
              required: true,
            },
            {
              name: 'label',
              type: 'ReactNode',
              description: '选项及当前值显示的内容；使用非交互行内节点。',
              required: true,
            },
            {
              name: 'disabled',
              type: 'boolean',
              description: '禁用该选项。',
              defaultValue: 'false',
            },
            {
              name: 'textValue',
              type: 'string',
              description: '带图标或复杂内容时提供明确的键盘前缀匹配文字。',
              defaultValue: '读取选项文字',
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
            Tab 聚焦触发按钮；Enter、Space 或上下方向键打开列表。方向键移动焦点，Home / End
            到达边界，输入选项文字进行前缀匹配；Enter / Space 选择，Escape 关闭并返回触发按钮。
          </li>
          <li>
            列表打开时，移动焦点不会改变选中值；禁用选项可以由方向键聚焦，以便读取名称，但不能选中。
            列表关闭且非只读时，输入字符会直接选择匹配项。
          </li>
          <li>
            选项只承载选择值，避免在 label 中嵌套按钮或链接。校验失败时，可通过 ref
            聚焦触发按钮，让用户重新选择。
          </li>
        </ul>
      ),
    },
    {
      id: 'limits',
      title: '样式定制',
      content: (
        <>
          <p>
            字段宽度通过 className 或外层容器设置；style 调整的是触发按钮。列表挂载在 Portal
            中，定制列表和选项时直接使用 classNames.popup / classNames.option，
            不依赖字段容器的后代选择器。默认长选项会换行，列表在可用视口内滚动。
          </p>
          <p>
            设置原生 dir="rtl" 或 dir="ltr"
            时，字段与弹出列表保持同一方向；未显式设置时，优先沿用最近原生容器的方向，再沿用上游方向配置。容器方向变化时，已打开的列表同步更新。
          </p>
          <p>
            定制例的 CSS 随源码一起复制，浅蓝列表背景为局部固定颜色；整体配色使用
            ThemeProvider。选中、高亮和禁用反馈保持。
          </p>
        </>
      ),
      examples: [
        {
          id: 'select-portal-customization',
          title: 'Portal 列表的局部定制',
          description: '通过 classNames 定制列表背景与选项字重。',
          component: SelectPortalCustomization,
          source: selectPortalCustomizationSource,
        },
      ],
    },
  ],
});
