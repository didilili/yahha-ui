import { Link } from 'yahha-ui';
import TextFieldBasic from '../examples/forms/TextFieldBasic';
import textFieldBasicSource from '../examples/forms/TextFieldBasic.tsx?raw';
import TextFieldControlled from '../examples/forms/TextFieldControlled';
import textFieldControlledSource from '../examples/forms/TextFieldControlled.tsx?raw';
import TextFieldValidation from '../examples/forms/TextFieldValidation';
import textFieldValidationSource from '../examples/forms/TextFieldValidation.tsx?raw';
import TextFieldNative from '../examples/forms/TextFieldNative';
import textFieldNativeSource from '../examples/forms/TextFieldNative.tsx?raw';
import TextFieldForm from '../examples/forms/TextFieldForm';
import textFieldFormSource from '../examples/forms/TextFieldForm.tsx?raw';
import SegmentedBasic from '../examples/forms/SegmentedBasic';
import segmentedBasicSource from '../examples/forms/SegmentedBasic.tsx?raw';
import SegmentedDisabled from '../examples/forms/SegmentedDisabled';
import segmentedDisabledSource from '../examples/forms/SegmentedDisabled.tsx?raw';
import SegmentedForm from '../examples/forms/SegmentedForm';
import segmentedFormSource from '../examples/forms/SegmentedForm.tsx?raw';
import SegmentedLongLabels from '../examples/forms/SegmentedLongLabels';
import segmentedLongLabelsSource from '../examples/forms/SegmentedLongLabels.tsx?raw';
import type { DocPage } from './types';

export const formPages: DocPage[] = [
  {
    id: 'text-field',
    name: 'TextField',
    chinese: '单行输入',
    group: '表单',
    description: '带可见标签的单行输入框，用于站内搜索、个人资料和轻量表单。',
    importCode: "import { TextField } from 'yahha-ui';",
    sections: [
      {
        id: 'usage',
        title: '何时使用',
        content: (
          <p>
            收集一段单行文字，并为它提供清楚的标签、提示和错误说明。标签始终可见， placeholder
            只补充格式示例。多行内容不属于当前组件的能力范围。
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
            description:
              '只需传入 label。defaultValue 设置非受控输入的初始值，后续内容由浏览器管理。',
            component: TextFieldBasic,
            source: textFieldBasicSource,
          },
          {
            id: 'controlled',
            title: '受控输入与装饰图标',
            description:
              '通过 value / onChange 同步状态。leading 是 18×18px 的装饰图标槽，标签为输入框提供可访问名称。此例仅展示关键词状态，不执行搜索请求。',
            component: TextFieldControlled,
            source: textFieldControlledSource,
          },
          {
            id: 'validation',
            title: '提示与提交校验',
            description:
              '清空昵称或输入超过 12 个字符后提交。校验逻辑由表单实现，error 自动关联输入框；ref 用于将焦点移到错误字段。本例使用 noValidate 展示自定义校验。',
            component: TextFieldValidation,
            source: textFieldValidationSource,
          },
          {
            id: 'native',
            title: '禁用、只读与 ref',
            description:
              '比较 disabled、readOnly、password 与 email。必填要求通过可见说明告知；type、name、autoComplete、required 沿用原生 input 行为，ref 指向真实 input。',
            component: TextFieldNative,
            source: textFieldNativeSource,
          },
          {
            id: 'form',
            title: '表单提交与重置',
            description:
              '通过原生 FormData 读取 name。非受控输入随表单重置；受控输入需要在 onReset 中恢复 React 状态。此例只读取本地表单，不发送或保存数据。',
            component: TextFieldForm,
            source: textFieldFormSource,
          },
        ],
      },
      {
        id: 'design',
        title: '设计与状态',
        content: (
          <>
            <p>
              输入区域是安静的白纸长框，与饱满的操作按钮分工。暖墨线保留漫画轮廓，标签始终可见，
              提示说明格式，错误说明原因和恢复方法；不依靠粉色或 placeholder 代替字段名称。
            </p>
            <ul>
              <li>标签与输入、输入与说明保持 8px 间距，长标签和说明自然换行。</li>
              <li>单行默认 44px，手机输入文字为 16px，仍与默认 Button、Select 对齐。</li>
              <li>
                边框与错误底色沿用 150ms
                过渡，焦点轮廓立即显示；动态禁用时字段与前图标直接落到静态外观。
              </li>
              <li>
                错误状态保留输入内容；只读使用浅纸色并保留复制能力，禁用使用独立底色并退出键盘顺序。
                必填要求写在标签或提示中，required 属性同时保留原生约束。
              </li>
            </ul>
            <p>
              详细尺度见 <a href="#/guides/design-baseline">设计规范</a>
              。密码、搜索、邮箱沿用对应的原生输入类型。
            </p>
          </>
        ),
      },
      {
        id: 'api',
        title: 'API',
        content: (
          <p>
            <code>TextFieldProps</code> 继承原生 <code>input</code> 属性，但排除原生{' '}
            <code>size</code>。下表列出组件属性和常用原生入口；其余原生属性、事件也传给 input。
          </p>
        ),
        api: [
          {
            name: 'TextFieldProps',
            rows: [
              {
                name: 'label',
                type: 'ReactNode',
                required: true,
                description: '可见标签，自动关联 input。请提供有意义的字段名称。',
              },
              {
                name: 'hint',
                type: 'ReactNode',
                description: '辅助说明，通过 aria-describedby 与 input 关联。',
              },
              {
                name: 'error',
                type: 'ReactNode',
                description: '错误说明。有内容时设置 aria-invalid，不执行校验。',
              },
              {
                name: 'leading',
                type: 'ReactNode',
                description:
                  '18×18px 的装饰图标槽，超出内容会裁切；包装元素 aria-hidden，不放长前缀、交互控件或必要文字。',
              },
              {
                name: 'id',
                type: 'string',
                defaultValue: '自动生成',
                description: 'input 的 ID，同时用于标签、提示和错误关联。',
              },
              {
                name: 'value',
                type: 'TextFieldProps["value"]',
                description: '受控值，需配合 onChange。不要与 defaultValue 同时使用。',
              },
              {
                name: 'defaultValue',
                type: 'TextFieldProps["defaultValue"]',
                description: '非受控输入的初始值。不要在生命周期内切换受控模式。',
              },
              {
                name: 'onChange',
                type: 'ChangeEventHandler<HTMLInputElement>',
                description: '原生输入事件，通过 event.target.value 读取内容。',
              },
              {
                name: 'disabled',
                type: 'boolean',
                defaultValue: 'false（原生）',
                description: '禁用输入，也为根容器添加 data-disabled；禁用字段不参与表单提交。',
              },
              {
                name: 'readOnly',
                type: 'boolean',
                defaultValue: 'false（原生）',
                description: '只读但仍可聚焦、复制并参与提交。',
              },
              {
                name: 'required',
                type: 'boolean',
                defaultValue: 'false（原生）',
                description: '启用原生必填约束；组件不会据此生成 error。',
              },
              {
                name: 'type',
                type: 'HTMLInputTypeAttribute',
                defaultValue: 'text（浏览器）',
                description: '原生 input 类型，例如 email、search、password。',
              },
              {
                name: 'name / form',
                type: 'string',
                description: '提交字段名，以及通过 ID 关联的表单。',
              },
              {
                name: 'placeholder / autoComplete',
                type: 'string',
                description: '原生输入提示与自动填充设置。placeholder 不能代替 label。',
              },
              {
                name: 'className',
                type: 'string',
                description: '作用于最外层字段 div，用于字段布局。',
              },
              {
                name: 'classNames',
                type: 'TextFieldProps["classNames"]',
                description: '各部位的附加类名，见下表。与默认类名合并。',
              },
              {
                name: 'style',
                type: 'CSSProperties',
                description: '作用于 input，而非根容器。根容器布局可使用 className 或外层元素。',
              },
              {
                name: 'ref',
                type: 'Ref<HTMLInputElement>',
                description: '指向真实 input，可调用 focus、select 等原生方法。',
              },
              {
                name: 'aria-describedby',
                type: 'string',
                description: '额外描述元素的 ID，会与 hint 和 error 的描述 ID 合并。',
              },
              {
                name: 'aria-invalid',
                type: 'TextFieldProps["aria-invalid"]',
                description:
                  '无 error 时沿用传入值；有 error 时固定为 true。true 会显示错误边框，但不会自动生成错误说明。',
              },
            ],
          },
          {
            name: 'classNames',
            rows: [
              { name: 'label', type: 'string', description: '可见 label。' },
              { name: 'inputWrapper', type: 'string', description: '前缀与输入框的共同容器。' },
              { name: 'leading', type: 'string', description: '装饰性前缀的包装元素。' },
              {
                name: 'input',
                type: 'string',
                description: '真实 input；与原生 style 作用目标相同。',
              },
              { name: 'hint', type: 'string', description: '辅助说明容器，仅在有内容时渲染。' },
              { name: 'error', type: 'string', description: '错误说明容器，仅在有内容时渲染。' },
            ],
          },
        ],
      },
      {
        id: 'keyboard',
        title: '键盘与使用约定',
        content: (
          <ul>
            <li>Tab 聚焦输入框；点击可见标签也会聚焦。文字编辑与提交使用浏览器原生行为。</li>
            <li>组件只呈现 hint 和 error。校验、提交、错误后聚焦和保存状态由调用方负责。</li>
            <li>
              输入框常规单行实际高度为 44px，与默认 Button
              对齐，字段保留独立的白底长框轮廓。宽度不超过 480px 或使用粗指针的设备上，输入文字为
              16px，以减少部分移动浏览器聚焦时的页面缩放。
            </li>
            <li>
              readOnly 使用独立的浅色背景，仍可聚焦、复制和提交；disabled
              不可聚焦，也不参与提交。禁用背景优先于错误背景。
            </li>
            <li>
              单独传入 aria-invalid=true 也会显示错误边框；请通过 error 或 aria-describedby
              提供错误原因。
            </li>
            <li>
              hint 和 error 可以同时存在；数字 0 正常显示，空字符串、布尔值、null 和 undefined
              不渲染说明。
            </li>
            <li>需要自定义部位时使用 classNames，不依赖内部标签的嵌套层级。</li>
          </ul>
        ),
      },
    ],
  },
  {
    id: 'segmented-control',
    name: 'SegmentedControl',
    chinese: '分段选择',
    group: '表单',
    description: '在少量互斥选项间切换，使用原生 radio 保留表单与键盘行为。',
    importCode: "import { SegmentedControl } from 'yahha-ui';",
    sections: [
      {
        id: 'usage',
        title: '何时使用',
        content: (
          <p>
            适合文章分类、排序方式等少量单选项。它是一个受控单选组，由 fieldset、隐藏的 legend
            和原生 radio 组成。切换同一页面的内容面板时使用{' '}
            <Link href="#/components/tabs">Tabs</Link>
            ，页面路由使用链接。
          </p>
        ),
      },
      {
        id: 'examples',
        title: '代码演示',
        examples: [
          {
            id: 'basic',
            title: '基本使用与受控状态',
            description:
              'value / onValueChange 管理筛选值并更新文章列表；label 为辅助技术提供组名，需要可见标题时在外部补充。',
            component: SegmentedBasic,
            source: segmentedBasicSource,
          },
          {
            id: 'disabled',
            title: '禁用选项与整组禁用',
            description: '比较单项、整组和父 fieldset 禁用；切换演示开关可检查原生禁用与恢复。',
            component: SegmentedDisabled,
            source: segmentedDisabledSource,
          },
          {
            id: 'form',
            title: '原生表单与显式重置',
            description:
              '从未选择开始体验 required 校验；选定后读取 name 对应值，onReset 显式恢复未选择并清除错误。',
            component: SegmentedForm,
            source: segmentedFormSource,
          },
          {
            id: 'long-labels',
            title: '长标签与窄容器',
            description:
              '选项会在可用空间内换行。本例将容器限制在 350px，可在窄屏查看标签换行与选中状态。选项较多时，应考虑更适合大量选项的交互。',
            component: SegmentedLongLabels,
            source: segmentedLongLabelsSource,
          },
        ],
      },
      {
        id: 'design',
        title: '设计与状态',
        content: (
          <>
            <p>
              轻纸边托盘组织一组互斥的值，边框仍为 2px；选中纸片使用更清楚的墨边和轻内凹。它与 Tabs
              的栏目墨线分工，适合改变筛选值，不用于页面路由。
            </p>
            <ul>
              <li>每项至少 44px，托盘另含边框和内边距；长标签可以换行、增高，保持整项可点按。</li>
              <li>
                选中与键盘焦点各有标记；Tab 进入当前项，方向键沿用原生 radio 切换，禁用项跳过。
              </li>
              <li>
                底色、边框和选中内阴影在 150ms
                内同步变化，纸托盘不位移；减少动效或禁用时直接呈现结果。
              </li>
              <li>
                缺选校验与结果由调用方维护；父 fieldset 禁用仍有效，受控重置需同步 React 状态。
              </li>
            </ul>
            <p>
              默认轮廓与尺度见 <a href="#/guides/design-baseline">设计规范</a>
              。相关示例保留同一实现，并展示真实内容筛选。
            </p>
          </>
        ),
      },
      {
        id: 'api',
        title: 'API',
        content: (
          <p>
            <code>SegmentedControlProps&lt;T&gt;</code> 的 <code>T</code> 为字符串类型。 继承原生
            fieldset 属性，排除 defaultValue 和 defaultChecked；没有非受控模式。
          </p>
        ),
        api: [
          {
            name: 'SegmentedControlProps<T extends string>',
            rows: [
              {
                name: 'options',
                type: 'readonly SegmentedOption<T>[]',
                required: true,
                description: '所有选项。每项 value 必须唯一。',
              },
              {
                name: 'value',
                type: 'T',
                required: true,
                description: '当前受控值。空字符串可表示待选择；有值时应对应一个可用选项。',
              },
              {
                name: 'onValueChange',
                type: '(value: T) => void',
                required: true,
                description: '选择变化时传入选项值。调用方需要更新 value；参数不是 DOM 事件。',
              },
              {
                name: 'label',
                type: 'string',
                required: true,
                description:
                  '单选组的可访问名称，通过隐藏的 legend 提供。需要可见标题时在外部添加。',
              },
              {
                name: 'name',
                type: 'string',
                defaultValue: '自动生成唯一名称',
                description: '组内 radio 的共同名称。显式设置后可通过 FormData 读取。',
              },
              {
                name: 'form',
                type: 'string',
                description: '通过表单 ID 关联 fieldset 及内部所有 radio。',
              },
              {
                name: 'required',
                type: 'boolean',
                defaultValue: 'false',
                description: '将原生必选约束传给 radio。有效的受控选中值通常已经满足约束。',
              },
              {
                name: 'disabled',
                type: 'boolean',
                defaultValue: 'false（原生）',
                description: '禁用整个 fieldset 及全部 radio。禁用字段不参与提交。',
              },
              { name: 'className', type: 'string', description: '根 fieldset 的附加类名。' },
              {
                name: 'classNames',
                type: '{ options?: string; option?: string }',
                description: '选项容器与每个选项 label 的附加类名。',
              },
              { name: 'style', type: 'CSSProperties', description: '作用于根 fieldset。' },
              {
                name: 'ref',
                type: 'Ref<HTMLFieldSetElement>',
                description: '指向根 fieldset，不指向某个 radio。',
              },
              {
                name: '其他原生属性 / 事件',
                type: 'ComponentPropsWithRef<"fieldset">',
                description:
                  'id、aria-*、onFocus、onBlur 等作用于 fieldset；onChange 可接收冒泡事件，状态更新仍使用 onValueChange。',
              },
            ],
          },
          {
            name: 'SegmentedOption<T extends string>',
            rows: [
              {
                name: 'value',
                type: 'T',
                required: true,
                description: '唯一选项值，作为 radio 的 value 和变化回调参数。',
              },
              {
                name: 'label',
                type: 'ReactNode',
                required: true,
                description:
                  '选项内容，支持文字或简单图标组合；应包含清楚的可访问名称，不嵌套交互控件。',
              },
              {
                name: 'disabled',
                type: 'boolean',
                defaultValue: 'false',
                description: '仅禁用此选项；组件级 disabled 优先。',
              },
            ],
          },
          {
            name: 'classNames',
            rows: [
              {
                name: 'options',
                type: 'string',
                description: '选项的共同容器，可用于调整组内布局。',
              },
              {
                name: 'option',
                type: 'string',
                description: '每个选项的 label。可结合 data-checked / data-disabled 设置状态样式。',
              },
            ],
          },
        ],
      },
      {
        id: 'keyboard',
        title: '键盘与状态约定',
        content: (
          <ul>
            <li>
              Tab 进入单选组，方向键在可用选项间移动和选择，Space 选择当前项；禁用项不参与切换。
            </li>
            <li>保留原生 radio 行为，不同浏览器对组内 Tab 入口的细节可能不同。</li>
            <li>
              每项默认最小高度为
              44px，整组另含内边距和边框。长标签可换行，选中项使用主题底色与轮廓，悬停时保留选中状态。
            </li>
            <li>
              禁用项保留可读的文字；当前选中项被禁用时仍显示选中轮廓，但不能通过鼠标或键盘操作。
            </li>
            <li>表单 reset 不会替你更新 React 状态，需在 onReset 中显式恢复 value。</li>
            <li>筛选数据、切换正文、URL 同步和持久化均由调用方实现。</li>
          </ul>
        ),
      },
    ],
  },
];
