<!-- 此文件由 npm run sync:docs 生成；请修改 playground/src/docs/components/ 中对应页面。 -->

# Form 表单

统一管理字段值、校验、提交与重置，并定位需要修正的字段。

[安装与接入](../../README.md#安装与接入)

```tsx
import { Form, FormError } from 'yahha-ui';
```

<a id="usage"></a>

## 何时使用

多个字段需要统一管理初始值、校验、错误、提交和重置时使用 Form。通过 children 渲染函数中的绑定方法接入现有控件，字段本身提供可见标签、辅助说明和错误呈现。

字段值支持 string、boolean 和 null，字段名对应 initialValues 的顶层键。表单值、校验和提交由 Form 管理，保存到应用或服务端的逻辑写在 onSubmit 中。 使用原生 form 和 FormData 管理字段的方式见 [原生表单接入指南](../guides/forms.md)。

<a id="examples"></a>

## 代码演示

<a id="form-basic"></a>

### 基础用法与重置

绑定昵称字段，读取当前值，再恢复首次传入的初始值。

[查看示例文件](../../playground/src/examples/form/FormBasic.tsx)

<!-- example-source: playground/src/examples/form/FormBasic.tsx -->

```tsx
import { useState } from 'react';
import { Button, Form, Input, Text } from 'yahha-ui';

export default function FormBasic() {
  const [result, setResult] = useState('');

  return (
    <Form
      aria-label="昵称设置"
      initialValues={{ nickname: '库米' }}
      style={{ display: 'grid', gap: 16, maxWidth: 440 }}
      onInput={() => setResult('')}
      onReset={() => setResult('')}
      onSubmit={(values) => setResult(`读取结果：昵称为“${values.nickname}”。`)}
    >
      {(form) => (
        <>
          <Input {...form.input('nickname')} label="昵称" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Button type="submit">读取表单</Button>
            <Button type="reset" variant="secondary">
              恢复初始值
            </Button>
          </div>
          <Text size="sm" tone="muted" role="status">
            {result}
          </Text>
        </>
      )}
    </Form>
  );
}
```

<a id="form-validation"></a>

### 原生约束与自定义校验

失焦后检查必填、邮箱格式和全空格昵称；提交失败时定位第一个需要修正的字段。

[查看示例文件](../../playground/src/examples/form/FormValidation.tsx)

<!-- example-source: playground/src/examples/form/FormValidation.tsx -->

```tsx
import { useState } from 'react';
import { Button, Form, Input, Text } from 'yahha-ui';

export default function FormValidation() {
  const [result, setResult] = useState('');

  return (
    <Form
      aria-label="读者资料校验"
      initialValues={{ nickname: '', email: '' }}
      validationMode="onBlur"
      validate={(values) =>
        values.nickname !== '' && values.nickname.trim() === ''
          ? { nickname: '昵称不能只包含空格。' }
          : {}
      }
      style={{ display: 'grid', gap: 16, maxWidth: 440 }}
      onInput={() => setResult('')}
      onReset={() => setResult('')}
      onSubmit={(values) => setResult(`校验通过：${values.nickname} · ${values.email}`)}
    >
      {(form) => (
        <>
          <Input
            {...form.input('nickname')}
            label="公开昵称"
            required
            hint="必填，请填写可辨认的昵称。"
          />
          <Input
            {...form.input('email')}
            label="联系邮箱"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            hint="必填，请使用有效的邮箱格式。"
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Button type="submit">检查并读取</Button>
            <Button type="reset" variant="secondary">
              重置资料
            </Button>
          </div>
          <Text size="sm" tone="muted" role="status">
            {result}
          </Text>
        </>
      )}
    </Form>
  );
}
```

<a id="form-controls"></a>

### 七类控件与错误关联

用三种绑定方法接入七类控件；先提交查看开关与分段选择的必选错误，再完成设置。

[查看示例文件](../../playground/src/examples/form/FormControls.tsx)

<!-- example-source: playground/src/examples/form/FormControls.tsx -->

```tsx
import { useState } from 'react';
import {
  Button,
  Checkbox,
  Form,
  FormError,
  Input,
  RadioGroup,
  SegmentedControl,
  Select,
  Switch,
  Text,
  Textarea,
} from 'yahha-ui';

type Preferences = {
  title: string;
  description: string;
  category: string | null;
  newsletter: boolean;
  frequency: string;
  summary: boolean;
  view: string;
};

const initialValues: Preferences = {
  title: '河边散步小记',
  description: '记录树影和路边新开的花。',
  category: 'journal',
  newsletter: true,
  frequency: 'weekly',
  summary: false,
  view: '',
};

export default function FormControls() {
  const [result, setResult] = useState<{ values: Preferences; message: string } | null>(null);

  return (
    <Form
      aria-label="手记展示设置"
      initialValues={initialValues}
      style={{ display: 'grid', gap: 20, maxWidth: 520 }}
      onReset={() => setResult(null)}
      onSubmit={(values) =>
        setResult({
          values: { ...values },
          message: `读取结果：${values.title} · ${values.category} · ${values.newsletter ? '订阅更新' : '暂不订阅'} · ${values.view}`,
        })
      }
    >
      {(form) => (
        <>
          <Input {...form.input('title')} label="手记标题" required />
          <Textarea {...form.input('description')} label="简短介绍" rows={2} />
          <Select
            {...form.choice('category')}
            label="文章分类"
            required
            options={[
              { value: 'journal', label: '生活手记' },
              { value: 'reading', label: '读书笔记' },
            ]}
          />
          <Checkbox {...form.checked('newsletter')} label="订阅更新" />
          <RadioGroup
            {...form.choice('frequency')}
            label="来信频率"
            options={[
              { value: 'weekly', label: '每周一封' },
              { value: 'monthly', label: '每月精选' },
            ]}
          />
          <div>
            <Switch
              {...form.checked('summary', { errorPlacement: 'external' })}
              label="显示文章摘要"
              required
              hint="本例要求开启后提交。"
            />
            <FormError name="summary" />
          </div>
          <div>
            <SegmentedControl
              {...form.choice('view', { errorPlacement: 'external' })}
              label="默认视图"
              required
              options={[
                { value: 'list', label: '列表' },
                { value: 'cards', label: '卡片' },
              ]}
            />
            <FormError name="view" />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Button type="submit">读取设置</Button>
            <Button type="reset" variant="secondary">
              重置设置
            </Button>
          </div>
          <Text size="sm" tone="muted" role="status">
            {result && JSON.stringify(result.values) === JSON.stringify(form.values)
              ? result.message
              : ''}
          </Text>
        </>
      )}
    </Form>
  );
}
```

<a id="form-submission"></a>

### 异步提交与字段错误

本地 Promise 模拟提交结果，默认昵称返回字段错误，修改后可成功；本例不发送请求。

[查看示例文件](../../playground/src/examples/form/FormSubmission.tsx)

<!-- example-source: playground/src/examples/form/FormSubmission.tsx -->

```tsx
import { useState } from 'react';
import { Button, Form, Input, Text } from 'yahha-ui';

export default function FormSubmission() {
  const [result, setResult] = useState('');

  return (
    <Form
      aria-label="保存公开昵称"
      initialValues={{ nickname: '库米' }}
      validate={(values) =>
        values.nickname !== '' && values.nickname.trim() === ''
          ? { nickname: '昵称不能只包含空格。' }
          : {}
      }
      style={{ display: 'grid', gap: 16, maxWidth: 440 }}
      onInput={() => setResult('')}
      onReset={() => setResult('')}
      onSubmit={async (values, { signal }) => {
        await Promise.resolve();
        if (signal.aborted) return;
        if (values.nickname.trim() === '库米') {
          return { nickname: '这个示例昵称已被使用，请换一个。' };
        }
        setResult(`已保存昵称“${values.nickname.trim()}”。`);
      }}
    >
      {(form) => (
        <>
          <Input
            {...form.input('nickname')}
            label="公开昵称"
            required
            hint="必填，尝试保存默认昵称，再换一个昵称重试。"
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Button type="submit" loading={form.isSubmitting}>
              保存昵称
            </Button>
            <Button type="reset" variant="secondary">
              恢复初始值
            </Button>
          </div>
          <Text size="sm" tone="muted" role={form.submitError ? 'alert' : 'status'}>
            {form.submitError || result}
          </Text>
        </>
      )}
    </Form>
  );
}
```

<a id="binding"></a>

## 字段绑定与错误呈现

- `form.input(name)` 为 Input / Textarea 提供 name、value、onChange、onBlur、ref 和 error。`form.checked(name)` 使用 checked 管理 Checkbox / Switch。`form.choice(name)` 使用 value / onValueChange 管理 Select、RadioGroup 和 SegmentedControl。
- 将绑定属性展开到同一个控件，label、hint、required、type、options 等仍由该控件的公开 API 设置。字段值和变化回调由绑定方法提供；追加变化处理时先调用绑定中的原回调。
- Input、Textarea、Select、Checkbox 和 RadioGroup 使用默认的 control 错误位置，绑定结果通过 error 交给控件显示，并复用其标签和描述关联。
- Switch / SegmentedControl 使用 `{ errorPlacement: 'external' }`，并在控件后放置 `<FormError name="字段名" />`。此时绑定提供 aria-invalid 和 aria-describedby，FormError 使用对应字段的内容和 ID 呈现错误。
- initialValues 包含所有要管理的字段，每个字段使用一个独立名称。input / choice 选择字符串或 null 字段，checked 选择布尔字段，TypeScript 根据字段值类型约束方法参数。 Select 可使用 null 表达未选择，RadioGroup / SegmentedControl 使用字符串值。

<a id="validation"></a>

## 校验时机与错误来源

- 默认在提交时校验；validationMode 可改为 onBlur 或 onChange。首次提交失败后，继续编辑会 重新校验，便于及时修正已显示的错误。
- required、type、minLength、pattern 等使用浏览器的 validity 与 validationMessage。 Form 接管错误呈现与焦点，内部原生 form 使用 noValidate 避免弹出重复的浏览器提示。 显式设置 Form 的 noValidate 会跳过这部分原生约束，自定义 validate 仍会执行。
- validate 接收当前只读值快照，返回按字段名映射的错误对象，也可返回 Promise。同一个字段的 自定义错误覆盖原生错误，错误文字由调用方提供。只读、禁用与未挂载字段的原生约束遵循其 浏览器校验状态；禁用和未挂载字段的错误不会阻止提交。
- 通过 errors 属性传入外部字段错误，或在提交回调中返回错误对象。编辑字段会清除它的外部 错误；其他字段的错误继续保留。FormError 与控件的 error 入口复用同一份字段错误。
- 校验或提交抛出的异常通过 submitError 提供可见消息，onSubmitError 用于记录或通知。 调用方选择合适的 Alert 或文字呈现这个整表结果。

<a id="submission"></a>

## 提交值与异步状态

- onSubmit 接收当前 values 的只读快照。values 保留 disabled 和临时卸载字段的草稿，Checkbox / Switch 的值使用布尔类型。
- 回调第二个参数中的 formData 按浏览器原生规则构造。没有 name、禁用和未勾选的字段不产生 条目，复选项的原生 value 与 Form 管理的布尔值分别表达提交内容和勾选状态。
- isValidating 表达校验中的状态，isSubmitting 表达校验成功后执行提交回调的状态。将其接到 Button 的 loading 或页面反馈上。回调可返回 Promise，返回字段错误时交由对应控件显示。
- 编辑、重置或卸载会让当前提交失效，并使 signal 进入 aborted 状态。传给 fetch 等支持取消的任务，并在更新调用方状态前检查 signal.aborted；Form 会忽略过期提交的 字段错误和内部反馈。
- 异步示例使用已经完成的本地 Promise 演示返回值，实际等待时长取决于应用的保存任务。 提交结果只代表示例内反馈，真实保存逻辑由应用接入。

<a id="reset"></a>

## 初始值与重置

- initialValues 在首次挂载时保存快照。重置恢复该快照，同时清理字段错误、整表错误和 校验、提交状态。切换需要重新初始化的记录时，为 Form 设置新的 React key。
- 使用 `type="reset"` 的 Button，或调用 `form.reset()`。 二者都经过原生 reset 事件；onReset 中调用 preventDefault 可以取消本次重置。
- 额外的读取结果、已保存内容或业务反馈由调用方在 onReset 中清理。字段条件显示时，Form 保留未挂载字段的值；它重新出现后继续显示原草稿。

<a id="api"></a>

## API

Values 为顶层字段值对象，每项支持 string、boolean 或 null。FormErrors<Values> 按这些字段名保存字符串错误。Form 渲染原生 form，通过 JavaScript 回调处理提交。

### FormProps<Values>

| 属性                       | 说明                                                               | 类型                                                                                                                          | 默认值     |
| -------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `initialValues` **必填**   | 首次挂载时捕获的初始值，后续重置恢复这份快照。                     | `Values`                                                                                                                      | —          |
| `children` **必填**        | 通过渲染函数使用字段绑定、状态和表单方法。                         | `(form: FormState<Values>) => ReactNode`                                                                                      | —          |
| `validate`                 | 自定义校验，返回字段错误；同字段自定义文案覆盖原生错误。           | `(values: Readonly<Values>) => FormErrors<Values> \| Promise<FormErrors<Values>>`                                             | —          |
| `validationMode`           | 字段校验触发时机；提交会校验，失败后编辑会重新校验。               | `'onSubmit' \| 'onBlur' \| 'onChange'`                                                                                        | `onSubmit` |
| `errors`                   | 外部字段错误，编辑对应字段后清除。                                 | `FormErrors<Values>`                                                                                                          | —          |
| `onSubmit`                 | 校验通过后调用，可返回字段错误或等待异步任务。                     | `(values: Readonly<Values>, context: FormSubmitContext) => void \| FormErrors<Values> \| Promise<void \| FormErrors<Values>>` | —          |
| `onSubmitError`            | 校验或提交抛出异常时的通知回调，submitError 同时提供可见消息。     | `(error: unknown) => void`                                                                                                    | —          |
| `onReset`                  | 重置前触发；preventDefault 取消重置，适合清理应用自己的反馈。      | `FormEventHandler<HTMLFormElement>`                                                                                           | —          |
| `noValidate`               | 跳过浏览器字段约束，自定义 validate 保持执行。                     | `boolean`                                                                                                                     | `false`    |
| `ref / className / style`  | 作用于真实 form，ref 可调用 requestSubmit 和 reset。               | `Ref<HTMLFormElement> / string / CSSProperties`                                                                               | —          |
| `其他原生 form 属性与事件` | 传给真实 form；children、onSubmit 和 action 由组件的提交契约限定。 | `Omit<ComponentPropsWithRef<"form">, "children" \| "onSubmit" \| "action">`                                                   | —          |

### FormState<Values extends FormValues>

| 属性                         | 说明                                                                                        | 类型                                                                                    | 默认值  |
| ---------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------- |
| `values`                     | 当前字段值，包含禁用和未挂载字段的草稿。                                                    | `Readonly<Values>`                                                                      | —       |
| `errors`                     | 当前显示的字段错误。                                                                        | `FormErrors<Values>`                                                                    | —       |
| `isSubmitting`               | 校验成功后正在执行提交回调；校验和提交阶段都会阻止重复提交。                                | `boolean`                                                                               | `false` |
| `isValidating`               | 当前字段校验正在执行。                                                                      | `boolean`                                                                               | `false` |
| `submitError`                | 校验或提交异常的消息，供应用呈现。                                                          | `string \| null`                                                                        | `null`  |
| `input(name, options?)`      | 绑定 string / null 字段到 Input、Textarea，提供 value、原生 onChange、onBlur、name 和 ref。 | `FormInputBinding & FormErrorBinding<Options>`                                          | —       |
| `checked(name, options?)`    | 绑定 boolean 字段，提供 checked、原生 onChange、onBlur、name 和 ref。                       | `FormCheckedBinding & FormErrorBinding<Options>`                                        | —       |
| `choice(name, options?)`     | 绑定 string / null 字段，提供 value、onValueChange、onBlur、name 和 ref。                   | `FormChoiceBinding<Extract<Values[Name], string \| null>> & FormErrorBinding<Options>`  | —       |
| `setFieldValue(name, value)` | 更新指定字段，按与用户编辑相同的方式清理过期反馈。                                          | `<Name extends Extract<keyof Values, string>>(name: Name, value: Values[Name]) => void` | —       |
| `setErrors(errors)`          | 设置按字段名映射的当前错误。                                                                | `(errors: FormErrors<Values>) => void`                                                  | —       |
| `reset()`                    | 经过原生 reset 事件恢复首次初始值，并清理反馈。                                             | `() => void`                                                                            | —       |
| `validate()`                 | 校验当前已挂载且可用的字段，返回对应错误；本次失效或提交占用时返回 null。                   | `() => Promise<FormErrors<Values> \| null>`                                             | —       |
| `submit()`                   | 校验并提交；被阻止、失效、取消或失败时返回 false。                                          | `() => Promise<boolean>`                                                                | —       |

### FormBindingOptions

| 属性             | 说明                                                                     | 类型                      | 默认值    |
| ---------------- | ------------------------------------------------------------------------ | ------------------------- | --------- |
| `errorPlacement` | control 返回 error；external 返回错误的 ARIA 属性，配合 FormError 呈现。 | `'control' \| 'external'` | `control` |

### FormSubmitContext

| 属性       | 说明                                                | 类型          | 默认值 |
| ---------- | --------------------------------------------------- | ------------- | ------ |
| `signal`   | 编辑、重置或卸载使本次提交失效时进入 aborted 状态。 | `AbortSignal` | —      |
| `formData` | 按浏览器原生成功控件规则创建的提交数据。            | `FormData`    | —      |

### FormErrorProps

| 属性                                | 说明                                                   | 类型                                                        | 默认值 |
| ----------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------- | ------ |
| `name` **必填**                     | 对应 Form 中使用 external 错误位置的字段名称。         | `string`                                                    | —      |
| `className / style / 其他 div 属性` | 作用于错误文字容器，内容和 ID 由对应字段错误统一提供。 | `Omit<ComponentPropsWithoutRef<"div">, "children" \| "id">` | —      |

<a id="keyboard"></a>

## 可访问性与焦点

- label、hint 和 error 沿用各控件的命名与描述关联。需要表单地标时，通过 aria-label 或 aria-labelledby 命名整个 Form。
- 保留绑定中的 ref。Input / Textarea / Checkbox / Switch 聚焦真实输入节点，Select 聚焦可见触发按钮，RadioGroup / SegmentedControl 的字段集会定位组内第一个可用单选项。提交校验失败时，Form 定位第一个错误字段。
- Enter、type="submit" 按钮和 form.requestSubmit() 走提交校验。原生 reset 按钮和 form.reset() 走统一重置。将 Button 的 type 显式设置为对应动作。
- FormError 与 external 绑定使用相同的字段错误 ID，保留其 aria-describedby。 提交结果由应用选择适当的 status、Alert 或错误文字呈现。

<a id="related"></a>

## 相关组件

- [Input 输入框](input.md)：带可见标签、辅助说明和错误反馈的单行输入框。
- [Select 下拉选择器](select.md)：从文章分类、排序方式等固定选项中选一项。
- [Checkbox 复选框](checkbox.md)：用于独立选择、多项选择或确认事项，支持半选状态。
