import SelectBasic from '../examples/new-forms/SelectBasic';
import SelectBasicSource from '../examples/new-forms/SelectBasic.tsx?raw';
import SelectControlled from '../examples/new-forms/SelectControlled';
import SelectControlledSource from '../examples/new-forms/SelectControlled.tsx?raw';
import SelectStates from '../examples/new-forms/SelectStates';
import SelectStatesSource from '../examples/new-forms/SelectStates.tsx?raw';
import SelectForm from '../examples/new-forms/SelectForm';
import SelectFormSource from '../examples/new-forms/SelectForm.tsx?raw';
import TextareaBasic from '../examples/new-forms/TextareaBasic';
import TextareaBasicSource from '../examples/new-forms/TextareaBasic.tsx?raw';
import TextareaControlled from '../examples/new-forms/TextareaControlled';
import TextareaControlledSource from '../examples/new-forms/TextareaControlled.tsx?raw';
import TextareaStates from '../examples/new-forms/TextareaStates';
import TextareaStatesSource from '../examples/new-forms/TextareaStates.tsx?raw';
import CheckboxBasic from '../examples/new-forms/CheckboxBasic';
import CheckboxBasicSource from '../examples/new-forms/CheckboxBasic.tsx?raw';
import CheckboxMixed from '../examples/new-forms/CheckboxMixed';
import CheckboxMixedSource from '../examples/new-forms/CheckboxMixed.tsx?raw';
import CheckboxForm from '../examples/new-forms/CheckboxForm';
import CheckboxFormSource from '../examples/new-forms/CheckboxForm.tsx?raw';
import RadioGroupBasic from '../examples/new-forms/RadioGroupBasic';
import RadioGroupBasicSource from '../examples/new-forms/RadioGroupBasic.tsx?raw';
import RadioGroupForm from '../examples/new-forms/RadioGroupForm';
import RadioGroupFormSource from '../examples/new-forms/RadioGroupForm.tsx?raw';
import RadioGroupStates from '../examples/new-forms/RadioGroupStates';
import RadioGroupStatesSource from '../examples/new-forms/RadioGroupStates.tsx?raw';
import SwitchBasic from '../examples/new-forms/SwitchBasic';
import SwitchBasicSource from '../examples/new-forms/SwitchBasic.tsx?raw';
import SwitchControlled from '../examples/new-forms/SwitchControlled';
import SwitchControlledSource from '../examples/new-forms/SwitchControlled.tsx?raw';
import SwitchForm from '../examples/new-forms/SwitchForm';
import SwitchFormSource from '../examples/new-forms/SwitchForm.tsx?raw';
import type { DocPage } from './types';

export const newFormPages: DocPage[] = [
  {
    id: 'select',
    name: 'Select',
    chinese: '下拉选择器',
    group: '表单',
    description: '在有限的文章分类、排序或归档选项中选择一项。',
    importCode: "import { Select } from 'yahha-ui';",
    sections: [
      {
        id: 'usage',
        title: '何时使用',
        content: (
          <p>
            从已知列表中选择一项，例如文章分类或排列方式。选项很少且需要直接比较时，可使用{' '}
            <a href="#/components/radio-group">RadioGroup</a>；切换互斥筛选值可使用{' '}
            <a href="#/components/segmented-control">SegmentedControl</a>
            。需要输入搜索或多选时，当前 Select 不适用。
          </p>
        ),
      },
      {
        id: 'examples',
        title: '代码演示',
        examples: [
          {
            id: 'basic',
            title: '基本使用',
            description: '提供 label 与 options，未选择时显示 placeholder；标签始终可见。',
            component: SelectBasic,
            source: SelectBasicSource,
          },
          {
            id: 'controlled',
            title: '受控选择与禁用选项',
            description:
              '使用 value / onValueChange 同步状态。disabled 选项不可选择，null 清空当前值。',
            component: SelectControlled,
            source: SelectControlledSource,
          },
          {
            id: 'states',
            title: '错误、只读与禁用',
            description:
              '选择分类后清除错误，校验由示例维护。readOnly 可浏览选项但不修改；disabled 不可交互。',
            component: SelectStates,
            source: SelectStatesSource,
          },
          {
            id: 'form',
            title: '表单、重置与长选项',
            description:
              'name 参与 FormData，required 保留原生必选约束；非受控选择随表单重置。八个分类展示列表滚动，长文字自然换行。',
            component: SelectForm,
            source: SelectFormSource,
          },
        ],
      },
      {
        id: 'design',
        title: '设计与状态',
        content: (
          <>
            <p>
              关闭时与 TextField
              共用白纸长框，展开后成为一张小便笺。触发器、菜单纸边、选中纸片有清楚层次，
              不把整张菜单染成强调色。
            </p>
            <ul>
              <li>常规触发器为 44px；长选中值自然换行，箭头保留独立空间。</li>
              <li>
                箭头以 150ms 转向，菜单以 180ms
                淡入、不缩放或位移，关闭立即完成；减少动效时直接展开和收起。
              </li>
              <li>
                勾记和浅色背景表示已选中，内部焦点线表示当前键盘位置；移动焦点不会提前提交选项。
              </li>
              <li>
                选项至少
                44px，多行内容按实际高度排布；菜单在视口空间内滚动，禁用项保留说明且不可选择。
              </li>
            </ul>
            <p>
              详细尺度见 <a href="#/guides/design-baseline">设计规范</a>
              。标签、错误关联与只读行为与字段组件保持一致。
            </p>
          </>
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
                description: '用户选择变化时调用，参数为值而非 DOM 事件。',
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
                description: '弹出层目标。主题及颜色覆盖通过 PortalTheme 传播。',
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
                description: '选项内容；避免嵌套交互元素。',
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
        title: '键盘与交互',
        content: (
          <p>
            使用 Tab 聚焦，Enter、Space 或方向键打开；方向键移动、Home / End
            跳到边界，输入选项文字进行前缀匹配，Enter / Space 选择，Escape
            关闭并返回触发按钮。禁用项可由方向键聚焦，但不能被选中。
          </p>
        ),
      },
      {
        id: 'limits',
        title: '状态、样式与能力边界',
        content: (
          <>
            <p>
              仅提供单字符串选择，不包含输入搜索、多选、异步加载或选项分组。需要可输入筛选时应使用专门的
              Combobox。受控表单重置须由调用方更新 value。
            </p>
            <p>
              默认操作区域至少
              44px，使用当前主题的轮廓、浅色选中背景和焦点色。禁用项不使用整体透明度。可见标签与说明中的数字
              0 正常保留，空字符串和布尔值不生成提示。
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'textarea',
    name: 'Textarea',
    chinese: '多行输入',
    group: '表单',
    description: '用于留言、评论、个人简介和需要换行的轻量表单。',
    importCode: "import { Textarea } from 'yahha-ui';",
    sections: [
      {
        id: 'examples',
        title: '代码演示',
        examples: [
          {
            id: 'basic',
            title: '基本使用',
            description: '默认四行，标签与提示统一文字起点；支持原生 rows 与垂直拖动调整高度。',
            component: TextareaBasic,
            source: TextareaBasicSource,
          },
          {
            id: 'controlled',
            title: '受控内容与校验',
            description:
              'value / onChange 管理状态。示例完整提供字数说明、提交校验与 ref 聚焦，不发送数据。',
            component: TextareaControlled,
            source: TextareaControlledSource,
          },
          {
            id: 'native',
            title: '原生重置、只读与禁用',
            description: '非受控值随表单重置；style 可控制 resize，只读参与提交，禁用不提交。',
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
        title: '键盘与交互',
        content: (
          <p>
            保留 Tab、文字选择、复制和多行编辑的原生行为；Enter 换行，组件不会将 Enter 解释为提交。
          </p>
        ),
      },
      {
        id: 'limits',
        title: '状态、样式与能力边界',
        content: (
          <>
            <p>
              不自动调整高度，不内置富文本、发送请求、字数限制或校验规则。maxLength、rows
              与样式由调用方配置；受控值需由调用方重置。
            </p>
            <p>
              边框与错误底色同步以 150ms
              变化，焦点轮廓立即显示；禁用、减少动效和强制颜色下取消过渡，不改变行数与纵向调整能力。
            </p>
            <p>
              默认操作区域至少
              44px，使用当前主题的轮廓、浅色选中背景和焦点色。禁用项不使用整体透明度。可见标签与说明中的数字
              0 正常保留，空字符串和布尔值不生成提示。
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    chinese: '复选框',
    group: '表单',
    description: '用于多项选择、订阅选项和需要主动确认的轻量表单。',
    importCode: "import { Checkbox } from 'yahha-ui';",
    sections: [
      {
        id: 'examples',
        title: '代码演示',
        examples: [
          {
            id: 'basic',
            title: '基本状态',
            description: '比较勾选、未选、两种禁用及长标签；标签行保留水平留白，提示跟随文字起点。',
            component: CheckboxBasic,
            source: CheckboxBasicSource,
          },
          {
            id: 'mixed',
            title: '受控选择与半选',
            description:
              '父项根据子项计算 indeterminate，整组用 fieldset 命名；重置恢复一项已选。半选不改变实际提交值。',
            component: CheckboxMixed,
            source: CheckboxMixedSource,
          },
          {
            id: 'form',
            title: '表单提交、必选与重置',
            description:
              '同名复选框通过 FormData.getAll 读取；缺选时显示可见错误并聚焦，勾选后清除，重置恢复初始值。',
            component: CheckboxForm,
            source: CheckboxFormSource,
          },
        ],
      },
      {
        id: 'design',
        title: '设计与状态',
        content: (
          <>
            <p>
              方形墨框、完整勾与半选短线分别表达未选、已选和部分选择。22px 标记保留细节，至少 44px
              的整行承担点按；标签行使用 4px
              水平留白，提示与错误跟随文字起点，长标签换行后仍能完整点击。
            </p>
            <ul>
              <li>用于可独立选择的事项；半选由子项状态计算，实际提交仍由 checked 决定。</li>
              <li>
                勾和短横以 150ms 显隐、轻微展开确认切换，取消时平滑收回；减少动效时直接显示结果。
              </li>
              <li>错误文字说明如何继续，勾选后由调用方清除。禁用说明保留可读性，并退出提交。</li>
              <li>一组相关事项使用 fieldset / legend 命名；受控选择在 onReset 中显式恢复。</li>
            </ul>
            <p>
              尺度与墨线遵循 <a href="#/guides/design-baseline">设计规范</a>
              。这些状态使用同一套轮廓，不另设主题。
            </p>
          </>
        ),
      },
      {
        id: 'api',
        title: 'API',
        api: [
          {
            name: 'CheckboxProps',
            rows: [
              {
                name: 'label',
                type: 'ReactNode',
                description: '可点击标签。不要在 label 中嵌套链接或按钮。',
                required: true,
              },
              {
                name: 'hint / error',
                type: 'ReactNode',
                description: '通过 aria-describedby 关联；error 设置 aria-invalid，不自动校验。',
              },
              {
                name: 'checked / defaultChecked',
                type: 'boolean',
                description: '分别用于受控状态或非受控初始状态。',
                defaultValue: 'false（原生）',
              },
              {
                name: 'onChange',
                type: 'ChangeEventHandler<HTMLInputElement>',
                description: '原生事件，从 event.target.checked 读取状态。',
              },
              {
                name: 'indeterminate',
                type: 'boolean',
                description:
                  '受控半选状态，同时设置原生 indeterminate 与 aria-checked=mixed；不改变 checked 或提交值。',
                defaultValue: 'false',
              },
              {
                name: 'name / value / form',
                type: 'string / string | number | readonly string[] / string',
                description: '原生表单入口。仅勾选且未禁用时提交，通常传字符串 value。',
                defaultValue: 'value 为 on（原生）',
              },
              {
                name: 'disabled / required',
                type: 'boolean',
                description: '原生禁用与必选；支持父 fieldset disabled。',
                defaultValue: 'false（原生）',
              },
              { name: 'className', type: 'string', description: '根字段 div 的附加类名。' },
              {
                name: 'classNames',
                type: '{ label?, input?, text?, hint?, error? }',
                description: '各部分附加类名，每个值为 string。',
              },
              {
                name: 'ref / style / id / 其他 input 属性',
                type: 'ComponentPropsWithRef<"input">',
                description:
                  '作用于真实 input。type 固定为 checkbox；不提供 readOnly、children、aria-checked。',
                defaultValue: 'id 自动生成',
              },
            ],
          },
        ],
      },
      {
        id: 'keyboard',
        title: '键盘与交互',
        content: (
          <p>Tab 聚焦，Space 切换，点击标签切换；保留原生表单校验。半选状态由调用方计算并更新。</p>
        ),
      },
      {
        id: 'limits',
        title: '状态、样式与能力边界',
        content: (
          <>
            <p>
              不提供 CheckboxGroup 或批量状态管理。原生 checkbox 没有有效只读行为，需要锁定时使用
              disabled。非受控 checked 随表单重置；受控 checked / indeterminate 由调用方管理。
            </p>
            <p>
              默认操作区域至少
              44px，使用当前主题的轮廓、浅色选中背景和焦点色。禁用项不使用整体透明度。可见标签与说明中的数字
              0 正常保留，空字符串和布尔值不生成提示。
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'radio-group',
    name: 'RadioGroup',
    chinese: '单选组',
    group: '表单',
    description: '将互斥选项和说明完整展示，适合订阅频率、可见范围等少量选择。',
    importCode: "import { RadioGroup } from 'yahha-ui';",
    sections: [
      {
        id: 'examples',
        title: '代码演示',
        examples: [
          {
            id: 'basic',
            title: '标签与选项说明',
            description:
              '可见 legend 命名单选组；选中行以轻纸色和加粗标签帮助扫描，较长 description 完整呈现。',
            component: RadioGroupBasic,
            source: RadioGroupBasicSource,
          },
          {
            id: 'form',
            title: '受控表单与重置',
            description:
              '从未选择开始体验 required 校验，选择后清除错误并读取提交值；onReset 显式恢复未选择，保持 React 与表单状态一致。',
            component: RadioGroupForm,
            source: RadioGroupFormSource,
          },
          {
            id: 'states',
            title: '长标签、错误与禁用',
            description: '错误由调用方清除，父 fieldset disabled 保留原生禁用与提交语义。',
            component: RadioGroupStates,
            source: RadioGroupStatesSource,
          },
        ],
      },
      {
        id: 'design',
        title: '设计与状态',
        content: (
          <>
            <p>
              单选保留圆墨圈与实心点，选中行增加轻纸色和加粗标签，不添加外框。组名与组级说明保持同一起点，单项说明跟随标签，长内容按行自然增长。
            </p>
            <ul>
              <li>22px 圆圈与至少 44px 的选择行分开定义；不将 radio 画成按钮或开关。</li>
              <li>
                圆点以 150ms
                显隐和小幅展开确认选择，圆框与选中行同步变色；初始选中、禁用和减少动效保持静态。
              </li>
              <li>
                选中点与键盘焦点分别可辨，禁用选中取消活跃纸色。方向键沿用原生单选行为，跳过禁用项。
              </li>
              <li>组提示、错误与单项说明同时关联到 radio。错误由调用方维护，选择有效项后清除。</li>
            </ul>
            <p>
              原生 required 阻止缺选提交；受控重置需要恢复 React 状态。默认规则见{' '}
              <a href="#/guides/design-baseline">设计规范</a>。
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
                type: 'T extends string',
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
                  '组说明与错误关联 fieldset 和每个 radio，单项 description 同时合并；aria-invalid 保留在分组。',
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
                  '作用于 fieldset；ref 为 Ref<HTMLFieldSetElement>。不提供 defaultValue 或 defaultChecked。',
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
        title: '键盘与交互',
        content: (
          <p>
            Tab 进入单选组，方向键在可用项间移动并选择，Space 选择聚焦项；禁用项不参与切换。采用原生
            radio 行为。
          </p>
        ),
      },
      {
        id: 'limits',
        title: '状态、样式与能力边界',
        content: (
          <>
            <p>
              仅受控模式，不内置表单重置。需要单行紧凑选择可使用 SegmentedControl；RadioGroup
              适合带说明或纵向排列的选项，不承担 Tabs 的面板语义。
            </p>
            <p>
              默认操作区域至少
              44px，使用当前主题的轮廓、浅色选中背景和焦点色。禁用项不使用整体透明度。可见标签与说明中的数字
              0 正常保留，空字符串和布尔值不生成提示。
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: 'switch',
    name: 'Switch',
    chinese: '开关',
    group: '表单',
    description: '切换即时生效的阅读偏好或显示选项，开与关都有清楚含义。',
    importCode: "import { Switch } from 'yahha-ui';",
    sections: [
      {
        id: 'examples',
        title: '代码演示',
        examples: [
          {
            id: 'basic',
            title: '基本状态',
            description:
              '比较开启、关闭、两种禁用和长标签。标签与提示保持对齐，整行可点按，禁用时保持可读文字。',
            component: SwitchBasic,
            source: SwitchBasicSource,
          },
          {
            id: 'controlled',
            title: '控制内容显示',
            description:
              'checked / onChange 联动文章摘要与可见状态；标签保持不变，切换结果由相邻文字说明。',
            component: SwitchControlled,
            source: SwitchControlledSource,
          },
          {
            id: 'form',
            title: '表单值与重置',
            description:
              '读取实际 name=value，比较关闭与禁用字段不提交；非受控状态随原生重置恢复。',
            component: SwitchForm,
            source: SwitchFormSource,
          },
        ],
      },
      {
        id: 'design',
        title: '设计与状态',
        content: (
          <>
            <p>
              开关通过圆钮位置与轨道底色共同表达开、关。50×30px 轨道、22px 圆钮与至少 44px
              的点击行保持分工。标签行使用 4px 水平留白，提示跟随文字起点，长标签不会挤小轨道。
            </p>
            <ul>
              <li>标签保持设置名称稳定；需要可见结果时，在相邻文字中说明已开启或已关闭。</li>
              <li>点按文字或轨道均可操作。支持悬停的设备提供轻微反馈，禁用项保持静止和可读。</li>
              <li>
                圆钮滑动与轨道颜色在 150ms 内同步落位，连续切换可直接回转；RTL
                方向镜像，减少动效时直接切换。
              </li>
              <li>切换即时显示内容的偏好使用 Switch；需要提交确认的事项可使用 Checkbox。</li>
            </ul>
            <p>
              开启且未禁用时才提交 name=value；非受控状态可原生重置。默认规则见{' '}
              <a href="#/guides/design-baseline">设计规范</a>。
            </p>
          </>
        ),
      },
      {
        id: 'api',
        title: 'API',
        api: [
          {
            name: 'SwitchProps',
            rows: [
              {
                name: 'label',
                type: 'ReactNode',
                description: '可点击标签，应表达稳定的设置名称，避免开关后改名。',
                required: true,
              },
              {
                name: 'hint',
                type: 'ReactNode',
                description: '通过 aria-describedby 关联的说明。',
              },
              {
                name: 'checked / defaultChecked',
                type: 'boolean',
                description: '分别用于受控状态与非受控初始状态。',
                defaultValue: 'false（原生）',
              },
              {
                name: 'onChange',
                type: 'ChangeEventHandler<HTMLInputElement>',
                description: '原生事件，从 event.target.checked 读取开启状态。',
              },
              {
                name: 'disabled',
                type: 'boolean',
                description: '禁用交互和提交，支持父 fieldset disabled。',
                defaultValue: 'false（原生）',
              },
              {
                name: 'name / value / form / required',
                type: '原生 input 对应属性',
                description: '原生 checkbox 表单能力；只有开启且未禁用时提交。',
                defaultValue: 'value 为 on（原生）',
              },
              { name: 'className', type: 'string', description: '根字段 div 的附加类名。' },
              {
                name: 'classNames',
                type: '{ label?, input?, text?, hint? }',
                description: '各部分附加类名，每个值为 string。',
              },
              {
                name: 'ref / style / id / 其他 input 属性',
                type: 'ComponentPropsWithRef<"input">',
                description:
                  '作用于真实 input；固定 type=checkbox、role=switch，不提供 readOnly、children、aria-checked。可访问状态由原生 checked 提供。',
                defaultValue: 'id 自动生成',
              },
            ],
          },
        ],
      },
      {
        id: 'keyboard',
        title: '键盘与交互',
        content: (
          <p>
            Tab 聚焦，Space 切换，点击整条标签切换。读屏器使用 switch 角色与原生 checked
            状态读取开关状态。
          </p>
        ),
      },
      {
        id: 'limits',
        title: '状态、样式与能力边界',
        content: (
          <>
            <p>
              不自动持久化、不调用接口、不自带加载状态。需要填写完再统一提交的多项选择时优先使用
              Checkbox。原生 checkbox 不支持有效只读，锁定设置使用 disabled。
            </p>
            <p>
              默认操作区域至少
              44px，使用当前主题的轮廓、浅色选中背景和焦点色。禁用项不使用整体透明度。可见标签与说明中的数字
              0 正常保留，空字符串和布尔值不生成提示。
            </p>
          </>
        ),
      },
    ],
  },
];
