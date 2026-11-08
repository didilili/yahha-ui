import TextFieldBasic from '../../examples/forms/TextFieldBasic';
import textFieldBasicSource from '../../examples/forms/TextFieldBasic.tsx?raw';
import TextFieldControlled from '../../examples/forms/TextFieldControlled';
import textFieldControlledSource from '../../examples/forms/TextFieldControlled.tsx?raw';
import TextFieldSlots from '../../examples/forms/TextFieldSlots';
import textFieldSlotsSource from '../../examples/forms/TextFieldSlots.tsx?raw';
import TextFieldStates from '../../examples/forms/TextFieldStates';
import textFieldStatesSource from '../../examples/forms/TextFieldStates.tsx?raw';
import TextFieldValidation from '../../examples/forms/TextFieldValidation';
import textFieldValidationSource from '../../examples/forms/TextFieldValidation.tsx?raw';
import TextFieldNative from '../../examples/forms/TextFieldNative';
import textFieldNativeSource from '../../examples/forms/TextFieldNative.tsx?raw';
import TextFieldForm from '../../examples/forms/TextFieldForm';
import textFieldFormSource from '../../examples/forms/TextFieldForm.tsx?raw';
import TextFieldSearch from '../../examples/forms/TextFieldSearch';
import textFieldSearchSource from '../../examples/forms/TextFieldSearch.tsx?raw';
import TextFieldCopy from '../../examples/forms/TextFieldCopy';
import textFieldCopySource from '../../examples/forms/TextFieldCopy.tsx?raw';
import TextFieldCustomization from '../../examples/customization/TextFieldCustomization';
import textFieldCustomizationSource from '../../examples/customization/TextFieldCustomization.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('text-field', {
  importCode: "import { TextField } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          收集昵称、邮箱、搜索关键词等单行文字。标签说明要填什么，placeholder
          补充格式示例；需要填写留言、摘要等多行内容时使用{' '}
          <a href="#/components/textarea">Textarea</a>。只能从固定选项中选值时使用{' '}
          <a href="#/components/select">Select</a>。
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
          description: '用可见标签命名字段，并提供可编辑的初始值。',
          component: TextFieldBasic,
          source: textFieldBasicSource,
        },
        {
          id: 'controlled',
          title: '受控输入',
          description: '通过 value 与 onChange 管理输入内容。',
          component: TextFieldControlled,
          source: textFieldControlledSource,
        },
        {
          id: 'text-field-slots',
          title: '前置图标与尾部清空',
          description: '前置图标仅作装饰，示例通过尾部按钮清空内容并回焦。',
          component: TextFieldSlots,
          source: textFieldSlotsSource,
        },
        {
          id: 'text-field-states',
          title: '只读与禁用',
          description: '对比只读可复制和禁用不可编辑两种状态。',
          component: TextFieldStates,
          source: textFieldStatesSource,
        },
        {
          id: 'validation',
          title: '提示与本地校验',
          description: '检查昵称，校验失败时聚焦字段，保留已输入内容。',
          component: TextFieldValidation,
          source: textFieldValidationSource,
        },
        {
          id: 'native',
          title: '原生输入类型',
          description: '对照密码、日期和时间输入，再检查邮箱的原生格式约束。',
          component: TextFieldNative,
          source: textFieldNativeSource,
        },
      ],
    },
    {
      id: 'integration',
      title: '进阶用法',
      disclosure: '查看表单、中文输入与复制示例',
      content: <p>以下示例只在本地操作，不发送或保存表单数据。</p>,
      examples: [
        {
          id: 'form',
          title: '表单取值与重置',
          description: '读取本地表单或恢复初始值；编辑后清除上次读取结果。',
          component: TextFieldForm,
          source: textFieldFormSource,
          toc: false,
        },
        {
          id: 'text-field-search',
          title: '中文输入与实时搜索',
          description: '组合输入时保留当前结果，结束后筛选本地手记；清空后回到输入框。',
          component: TextFieldSearch,
          source: textFieldSearchSource,
          toc: false,
        },
        {
          id: 'text-field-copy',
          title: '只读输入与尾部复制',
          description: '复制示例地址；浏览器拒绝时可选中文字，使用系统复制。',
          component: TextFieldCopy,
          source: textFieldCopySource,
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
            value / onChange 管理受控输入；defaultValue
            设置非受控初始值。保持一种模式，避免同时传入两种值。
          </li>
          <li>
            设置 name 后可用 FormData 读取内容，form
            可关联外部表单。非受控输入随原生表单重置；受控输入需在 onReset 中恢复 React 状态。
          </li>
          <li>
            readOnly 保留聚焦、选择、复制和提交能力；disabled
            阻止交互并退出键盘顺序，字段也不参与提交。
          </li>
          <li>
            type、autoComplete、required 等沿用原生 input 行为。required
            启用浏览器约束，必填要求也应写在可见标签或提示中。
          </li>
          <li>
            error 以文字和装饰性提醒标记呈现错误，不执行校验；标记不另行命名或播报。本地校验例使用
            noValidate 跳过浏览器提交校验，由示例检查昵称并设置或清除
            error；邮箱例保留浏览器必填与格式校验。
          </li>
          <li>
            trailing 是可交互的尾部内容槽，与仅作装饰的 leading 分开。适合一个默认 44px 的
            IconButton；组件只负责布局，操作名称、type="button"、disabled 和行为由使用方设置。
            disabled 只禁用输入框，不递归修改槽内容；只读地址仍可提供复制操作。
          </li>
          <li>
            显式设置 <code>dir="ltr"</code> / <code>dir="rtl"</code> 或 <code>style.direction</code>{' '}
            时，前后缀布局与输入框保持同向；标签和辅助文字仍跟随外层方向。
          </li>
          <li>
            原生 composition 事件直接传给输入框。搜索例立即更新编辑值，组合期间保留上一次筛选，
            结束或取消后按输入框当前完整值更新结果；没有表单提交或远程请求。 该例使用 text +
            inputMode="search"，由一个命名按钮清空，避免与原生 search 取消按钮重复。
          </li>
        </ul>
      ),
    },
    {
      id: 'api',
      title: 'API',
      content: (
        <p>
          下表列出组件属性和常用原生入口。其余原生 <code>input</code> 属性与事件也传给输入框，
          不支持原生 <code>size</code> 属性。
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
              name: 'trailing',
              type: 'ReactNode',
              description:
                '尾部内容槽，可放命名操作；组件只布局，按钮的 type、disabled 与行为由使用方设置。',
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
              description: '禁用输入；禁用字段不可聚焦，也不参与表单提交。',
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
              description:
                '原生 input 类型，例如 email、search、password、date、time；日期时间编辑界面由浏览器提供，显示格式随浏览器与地区设置变化。',
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
            {
              name: 'inputWrapper',
              type: 'string',
              description: '前缀、输入框与尾部内容的共同容器；有 trailing 时承载字段轮廓。',
            },
            { name: 'leading', type: 'string', description: '装饰性前缀的包装元素。' },
            {
              name: 'trailing',
              type: 'string',
              description: '尾部内容的包装元素，不隐藏交互语义。',
            },
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
      title: '可访问性与键盘',
      content: (
        <ul>
          <li>
            点击标签或按 Tab 聚焦；文字编辑、选择和 Enter 提交沿用浏览器原生行为。placeholder
            只提供格式示例，不能代替可见标签。
          </li>
          <li>
            校验失败后保留已输入的内容，用 error 说明如何修正，并可通过 ref 聚焦错误字段。只设置
            aria-invalid 不会生成错误说明。
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
            字段宽度、外边距等布局通过 className 或外层容器设置。调整输入框本身的外观时使用
            classNames.input 或 style；需要单独设置提示或错误文字时使用 classNames.hint /
            classNames.error，无需依赖内部嵌套选择器。
          </p>
          <p>
            定制例的 CSS 随源码一起复制，浅粉提示背景是局部固定颜色；整体配色使用 ThemeProvider。
          </p>
        </>
      ),
      examples: [
        {
          id: 'text-field-customization',
          title: '提示区域的局部定制',
          description: '用 classNames.hint 调整提示背景与留白。',
          component: TextFieldCustomization,
          source: textFieldCustomizationSource,
        },
      ],
    },
  ],
});
