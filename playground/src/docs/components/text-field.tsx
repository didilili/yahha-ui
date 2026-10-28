import TextFieldBasic from '../../examples/forms/TextFieldBasic';
import textFieldBasicSource from '../../examples/forms/TextFieldBasic.tsx?raw';
import TextFieldControlled from '../../examples/forms/TextFieldControlled';
import textFieldControlledSource from '../../examples/forms/TextFieldControlled.tsx?raw';
import TextFieldValidation from '../../examples/forms/TextFieldValidation';
import textFieldValidationSource from '../../examples/forms/TextFieldValidation.tsx?raw';
import TextFieldNative from '../../examples/forms/TextFieldNative';
import textFieldNativeSource from '../../examples/forms/TextFieldNative.tsx?raw';
import TextFieldForm from '../../examples/forms/TextFieldForm';
import textFieldFormSource from '../../examples/forms/TextFieldForm.tsx?raw';
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
          title: '基本使用',
          description: '用 label 命名字段，defaultValue 填入可编辑的博客名称。',
          component: TextFieldBasic,
          source: textFieldBasicSource,
        },
        {
          id: 'controlled',
          title: '受控输入与装饰图标',
          description:
            '通过 value / onChange 同步关键词，在 leading 中放入搜索图标；结果行显示当前关键词，本例不筛选文章。',
          component: TextFieldControlled,
          source: textFieldControlledSource,
        },
        {
          id: 'validation',
          title: '提示与本地校验',
          description:
            '清空昵称或输入超过 12 个字符后点击检查。表单用 noValidate 展示本地自定义校验，error 关联输入框，ref 聚焦错误字段；校验通过也不会保存昵称。',
          component: TextFieldValidation,
          source: textFieldValidationSource,
        },
        {
          id: 'native',
          title: '字段状态与原生输入类型',
          description:
            '展示 disabled / readOnly 状态与 email、password、date、time 类型。点击“检查邮箱格式”触发浏览器必填、格式校验，ref 可聚焦邮箱；密码仅展示原生掩码。日期与时间使用浏览器原生编辑界面，显示格式随浏览器与地区设置变化；数据不保存或发送。',
          component: TextFieldNative,
          source: textFieldNativeSource,
        },
        {
          id: 'form',
          title: '表单提交与重置',
          description:
            '通过 FormData 读取 name，并显示读取结果。非受控输入随表单重置；受控输入在 onReset 中恢复 React 状态。此例只读取本地表单，不发送或保存数据。',
          component: TextFieldForm,
          source: textFieldFormSource,
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
            启用浏览器约束，必填要求也应写在可见标签或提示中；自定义校验、error
            的设置与清除由调用方处理。
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
                '原生 input 类型，例如 email、search、password、date、time；日期时间编辑界面由浏览器提供。',
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
        <p>
          字段宽度、外边距等布局通过 className 或外层容器设置。调整输入框本身的外观时使用
          classNames.input 或 style；需要单独设置提示或错误文字时使用 classNames.hint /
          classNames.error，无需依赖内部嵌套选择器。
        </p>
      ),
    },
  ],
});
