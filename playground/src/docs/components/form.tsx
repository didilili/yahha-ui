import FormBasic from '../../examples/form/FormBasic';
import formBasicSource from '../../examples/form/FormBasic.tsx?raw';
import FormValidation from '../../examples/form/FormValidation';
import formValidationSource from '../../examples/form/FormValidation.tsx?raw';
import FormControls from '../../examples/form/FormControls';
import formControlsSource from '../../examples/form/FormControls.tsx?raw';
import FormSubmission from '../../examples/form/FormSubmission';
import formSubmissionSource from '../../examples/form/FormSubmission.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('form', {
  importCode: "import { Form, FormError } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      kind: 'usage',
      content: (
        <>
          <p>
            多个字段需要统一管理初始值、校验、错误、提交和重置时使用 Form。通过 children
            渲染函数中的绑定方法接入现有控件，字段本身提供可见标签、辅助说明和错误呈现。
          </p>
          <p>
            字段值支持 string、boolean 和 null，字段名对应 initialValues
            的顶层键。表单值、校验和提交由 Form 管理，保存到应用或服务端的逻辑写在 onSubmit 中。
            使用原生 form 和 FormData 管理字段的方式见 <a href="#/guides/forms">原生表单接入指南</a>
            。
          </p>
        </>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      kind: 'examples',
      examples: [
        {
          id: 'form-basic',
          title: '基础用法与重置',
          description: '绑定昵称字段，读取当前值，再恢复首次传入的初始值。',
          component: FormBasic,
          source: formBasicSource,
        },
        {
          id: 'form-validation',
          title: '原生约束与自定义校验',
          description: '失焦后检查必填、邮箱格式和全空格昵称；提交失败时定位第一个需要修正的字段。',
          component: FormValidation,
          source: formValidationSource,
        },
        {
          id: 'form-controls',
          title: '七类控件与错误关联',
          description:
            '用三种绑定方法接入七类控件；先提交查看开关与分段选择的必选错误，再完成设置。',
          component: FormControls,
          source: formControlsSource,
        },
        {
          id: 'form-submission',
          title: '异步提交与字段错误',
          description:
            '本地 Promise 模拟提交结果，默认昵称返回字段错误，修改后可成功；本例不发送请求。',
          component: FormSubmission,
          source: formSubmissionSource,
        },
      ],
    },
    {
      id: 'binding',
      title: '字段绑定与错误呈现',
      kind: 'integration',
      content: (
        <ul>
          <li>
            <code>form.input(name)</code> 为 Input / Textarea 提供
            name、value、onChange、onBlur、ref 和 error。<code>form.checked(name)</code> 使用
            checked 管理 Checkbox / Switch。
            <code>form.choice(name)</code> 使用 value / onValueChange 管理 Select、RadioGroup 和
            SegmentedControl。
          </li>
          <li>
            将绑定属性展开到同一个控件，label、hint、required、type、options 等仍由该控件的公开 API
            设置。字段值和变化回调由绑定方法提供；追加变化处理时先调用绑定中的原回调。
          </li>
          <li>
            Input、Textarea、Select、Checkbox 和 RadioGroup 使用默认的 control
            错误位置，绑定结果通过 error 交给控件显示，并复用其标签和描述关联。
          </li>
          <li>
            Switch / SegmentedControl 使用 <code>{"{ errorPlacement: 'external' }"}</code>
            ，并在控件后放置 <code>{'<FormError name="字段名" />'}</code>。此时绑定提供 aria-invalid
            和 aria-describedby，FormError 使用对应字段的内容和 ID 呈现错误。
          </li>
          <li>
            initialValues 包含所有要管理的字段，每个字段使用一个独立名称。input / choice
            选择字符串或 null 字段，checked 选择布尔字段，TypeScript 根据字段值类型约束方法参数。
            Select 可使用 null 表达未选择，RadioGroup / SegmentedControl 使用字符串值。
          </li>
        </ul>
      ),
    },
    {
      id: 'validation',
      title: '校验时机与错误来源',
      kind: 'behavior',
      content: (
        <ul>
          <li>
            默认在提交时校验；validationMode 可改为 onBlur 或 onChange。首次提交失败后，继续编辑会
            重新校验，便于及时修正已显示的错误。
          </li>
          <li>
            required、type、minLength、pattern 等使用浏览器的 validity 与 validationMessage。 Form
            接管错误呈现与焦点，内部原生 form 使用 noValidate 避免弹出重复的浏览器提示。 显式设置
            Form 的 noValidate 会跳过这部分原生约束，自定义 validate 仍会执行。
          </li>
          <li>
            validate 接收当前只读值快照，返回按字段名映射的错误对象，也可返回 Promise。同一个字段的
            自定义错误覆盖原生错误，错误文字由调用方提供。只读、禁用与未挂载字段的原生约束遵循其
            浏览器校验状态；禁用和未挂载字段的错误不会阻止提交。
          </li>
          <li>
            通过 errors 属性传入外部字段错误，或在提交回调中返回错误对象。编辑字段会清除它的外部
            错误；其他字段的错误继续保留。FormError 与控件的 error 入口复用同一份字段错误。
          </li>
          <li>
            校验或提交抛出的异常通过 submitError 提供可见消息，onSubmitError 用于记录或通知。
            调用方选择合适的 Alert 或文字呈现这个整表结果。
          </li>
        </ul>
      ),
    },
    {
      id: 'submission',
      title: '提交值与异步状态',
      kind: 'behavior',
      content: (
        <ul>
          <li>
            onSubmit 接收当前 values 的只读快照。values 保留 disabled 和临时卸载字段的草稿，Checkbox
            / Switch 的值使用布尔类型。
          </li>
          <li>
            回调第二个参数中的 formData 按浏览器原生规则构造。没有 name、禁用和未勾选的字段不产生
            条目，复选项的原生 value 与 Form 管理的布尔值分别表达提交内容和勾选状态。
          </li>
          <li>
            isValidating 表达校验中的状态，isSubmitting 表达校验成功后执行提交回调的状态。将其接到
            Button 的 loading 或页面反馈上。回调可返回 Promise，返回字段错误时交由对应控件显示。
          </li>
          <li>
            编辑、重置或卸载会让当前提交失效，并使 signal 进入 aborted 状态。传给 fetch
            等支持取消的任务，并在更新调用方状态前检查 signal.aborted；Form 会忽略过期提交的
            字段错误和内部反馈。
          </li>
          <li>
            异步示例使用已经完成的本地 Promise 演示返回值，实际等待时长取决于应用的保存任务。
            提交结果只代表示例内反馈，真实保存逻辑由应用接入。
          </li>
        </ul>
      ),
    },
    {
      id: 'reset',
      title: '初始值与重置',
      kind: 'behavior',
      content: (
        <ul>
          <li>
            initialValues 在首次挂载时保存快照。重置恢复该快照，同时清理字段错误、整表错误和
            校验、提交状态。切换需要重新初始化的记录时，为 Form 设置新的 React key。
          </li>
          <li>
            使用 <code>type="reset"</code> 的 Button，或调用 <code>form.reset()</code>。
            二者都经过原生 reset 事件；onReset 中调用 preventDefault 可以取消本次重置。
          </li>
          <li>
            额外的读取结果、已保存内容或业务反馈由调用方在 onReset 中清理。字段条件显示时，Form
            保留未挂载字段的值；它重新出现后继续显示原草稿。
          </li>
        </ul>
      ),
    },
    {
      id: 'api',
      title: 'API',
      kind: 'api',
      content: (
        <p>
          Values 为顶层字段值对象，每项支持 string、boolean 或 null。FormErrors&lt;Values&gt;
          按这些字段名保存字符串错误。Form 渲染原生 form，通过 JavaScript 回调处理提交。
        </p>
      ),
      api: [
        {
          name: 'FormProps<Values>',
          rows: [
            {
              name: 'initialValues',
              type: 'Values',
              required: true,
              description: '首次挂载时捕获的初始值，后续重置恢复这份快照。',
            },
            {
              name: 'children',
              type: '(form: FormState<Values>) => ReactNode',
              required: true,
              description: '通过渲染函数使用字段绑定、状态和表单方法。',
            },
            {
              name: 'validate',
              type: '(values: Readonly<Values>) => FormErrors<Values> | Promise<FormErrors<Values>>',
              description: '自定义校验，返回字段错误；同字段自定义文案覆盖原生错误。',
            },
            {
              name: 'validationMode',
              type: "'onSubmit' | 'onBlur' | 'onChange'",
              defaultValue: 'onSubmit',
              description: '字段校验触发时机；提交会校验，失败后编辑会重新校验。',
            },
            {
              name: 'errors',
              type: 'FormErrors<Values>',
              description: '外部字段错误，编辑对应字段后清除。',
            },
            {
              name: 'onSubmit',
              type: '(values: Readonly<Values>, context: FormSubmitContext) => void | FormErrors<Values> | Promise<void | FormErrors<Values>>',
              description: '校验通过后调用，可返回字段错误或等待异步任务。',
            },
            {
              name: 'onSubmitError',
              type: '(error: unknown) => void',
              description: '校验或提交抛出异常时的通知回调，submitError 同时提供可见消息。',
            },
            {
              name: 'onReset',
              type: 'FormEventHandler<HTMLFormElement>',
              description: '重置前触发；preventDefault 取消重置，适合清理应用自己的反馈。',
            },
            {
              name: 'noValidate',
              type: 'boolean',
              defaultValue: 'false',
              description: '跳过浏览器字段约束，自定义 validate 保持执行。',
            },
            {
              name: 'ref / className / style',
              type: 'Ref<HTMLFormElement> / string / CSSProperties',
              description: '作用于真实 form，ref 可调用 requestSubmit 和 reset。',
            },
            {
              name: '其他原生 form 属性与事件',
              type: 'Omit<ComponentPropsWithRef<"form">, "children" | "onSubmit" | "action">',
              description: '传给真实 form；children、onSubmit 和 action 由组件的提交契约限定。',
            },
          ],
        },
        {
          name: 'FormState<Values extends FormValues>',
          rows: [
            {
              name: 'values',
              type: 'Readonly<Values>',
              description: '当前字段值，包含禁用和未挂载字段的草稿。',
            },
            { name: 'errors', type: 'FormErrors<Values>', description: '当前显示的字段错误。' },
            {
              name: 'isSubmitting',
              type: 'boolean',
              description: '校验成功后正在执行提交回调；校验和提交阶段都会阻止重复提交。',
              defaultValue: 'false',
            },
            {
              name: 'isValidating',
              type: 'boolean',
              description: '当前字段校验正在执行。',
              defaultValue: 'false',
            },
            {
              name: 'submitError',
              type: 'string | null',
              description: '校验或提交异常的消息，供应用呈现。',
              defaultValue: 'null',
            },
            {
              name: 'input(name, options?)',
              type: 'FormInputBinding & FormErrorBinding<Options>',
              description:
                '绑定 string / null 字段到 Input、Textarea，提供 value、原生 onChange、onBlur、name 和 ref。',
            },
            {
              name: 'checked(name, options?)',
              type: 'FormCheckedBinding & FormErrorBinding<Options>',
              description: '绑定 boolean 字段，提供 checked、原生 onChange、onBlur、name 和 ref。',
            },
            {
              name: 'choice(name, options?)',
              type: 'FormChoiceBinding<Extract<Values[Name], string | null>> & FormErrorBinding<Options>',
              description:
                '绑定 string / null 字段，提供 value、onValueChange、onBlur、name 和 ref。',
            },
            {
              name: 'setFieldValue(name, value)',
              type: '<Name extends Extract<keyof Values, string>>(name: Name, value: Values[Name]) => void',
              description: '更新指定字段，按与用户编辑相同的方式清理过期反馈。',
            },
            {
              name: 'setErrors(errors)',
              type: '(errors: FormErrors<Values>) => void',
              description: '设置按字段名映射的当前错误。',
            },
            {
              name: 'reset()',
              type: '() => void',
              description: '经过原生 reset 事件恢复首次初始值，并清理反馈。',
            },
            {
              name: 'validate()',
              type: '() => Promise<FormErrors<Values> | null>',
              description:
                '校验当前已挂载且可用的字段，返回对应错误；本次失效或提交占用时返回 null。',
            },
            {
              name: 'submit()',
              type: '() => Promise<boolean>',
              description: '校验并提交；被阻止、失效、取消或失败时返回 false。',
            },
          ],
        },
        {
          name: 'FormBindingOptions',
          rows: [
            {
              name: 'errorPlacement',
              type: "'control' | 'external'",
              defaultValue: 'control',
              description:
                'control 返回 error；external 返回错误的 ARIA 属性，配合 FormError 呈现。',
            },
          ],
        },
        {
          name: 'FormSubmitContext',
          rows: [
            {
              name: 'signal',
              type: 'AbortSignal',
              description: '编辑、重置或卸载使本次提交失效时进入 aborted 状态。',
            },
            {
              name: 'formData',
              type: 'FormData',
              description: '按浏览器原生成功控件规则创建的提交数据。',
            },
          ],
        },
        {
          name: 'FormErrorProps',
          rows: [
            {
              name: 'name',
              type: 'string',
              required: true,
              description: '对应 Form 中使用 external 错误位置的字段名称。',
            },
            {
              name: 'className / style / 其他 div 属性',
              type: 'Omit<ComponentPropsWithoutRef<"div">, "children" | "id">',
              description: '作用于错误文字容器，内容和 ID 由对应字段错误统一提供。',
            },
          ],
        },
      ],
    },
    {
      id: 'keyboard',
      title: '可访问性与焦点',
      kind: 'accessibility',
      content: (
        <ul>
          <li>
            label、hint 和 error 沿用各控件的命名与描述关联。需要表单地标时，通过 aria-label 或
            aria-labelledby 命名整个 Form。
          </li>
          <li>
            保留绑定中的 ref。Input / Textarea / Checkbox / Switch 聚焦真实输入节点，Select
            聚焦可见触发按钮，RadioGroup / SegmentedControl
            的字段集会定位组内第一个可用单选项。提交校验失败时，Form 定位第一个错误字段。
          </li>
          <li>
            Enter、type="submit" 按钮和 form.requestSubmit() 走提交校验。原生 reset 按钮和
            form.reset() 走统一重置。将 Button 的 type 显式设置为对应动作。
          </li>
          <li>
            FormError 与 external 绑定使用相同的字段错误 ID，保留其 aria-describedby。
            提交结果由应用选择适当的 status、Alert 或错误文字呈现。
          </li>
        </ul>
      ),
    },
  ],
});
