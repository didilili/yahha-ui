import { Link } from 'yahha-ui';
import FormBasics from '../../examples/forms/FormBasics';
import formBasicsSource from '../../examples/forms/FormBasics.tsx?raw';
import type { DocPage } from '../types';
import { guideMetadata } from '../guide-catalog';

/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The comparison table needs keyboard focus for horizontal scrolling on narrow screens. */

const page: DocPage = {
  ...guideMetadata('forms'),
  sections: [
    {
      id: 'approach',
      title: '选择接入方式',
      content: (
        <>
          <p>
            多个字段需要统一绑定、校验、显示错误和重置时，使用{' '}
            <Link href="#/components/form">Form 表单</Link>。Form 的渲染函数提供 input、checked 和
            choice 三种绑定方法，完整流程见{' '}
            <Link href="#/components/form?section=form-basic">基础用法与重置</Link>。
          </p>
          <p>
            本指南介绍使用原生 <code>form</code> 与 FormData 的方式，适合应用自行管理字段状态，
            或需要读取同名多选值等原生提交数据的场景。控件页的原生表单示例用于说明各控件的
            name、value、required 和 reset 行为。
          </p>
          <p>
            当前 Form 管理顶层 string、boolean 和 null 字段。同名 Checkbox 多值可用原生
            FormData.getAll() 读取，或由应用维护选中数组。七类控件与 Form 配合的完整示例见{' '}
            <Link href="#/components/form?section=form-controls">七类控件与错误关联</Link>。
          </p>
        </>
      ),
    },
    {
      id: 'native-form',
      title: '原生表单与取值',
      content: (
        <>
          <p>
            用原生 <code>form</code> 组织字段，在 onSubmit 中通过{' '}
            <code>new FormData(event.currentTarget)</code> 读取当前值。字段的 name 是提交键，value
            是内容。同名多项用 getAll 读取。没有 name 或被 disabled 禁用的字段不参与提交，未勾选的
            Checkbox / Switch 也不会产生条目。
          </p>
          <p>
            Button 显式设置 <code>type="submit"</code> 或 <code>type="reset"</code>
            ，默认 type 为 button。组件支持的 form 属性可通过表单 ID
            关联外部字段或按钮。本例在本地读取值，昵称由 React 控制，复选框保留原生初始勾选。
          </p>
        </>
      ),
      examples: [
        {
          id: 'forms-basics',
          title: '原生取值、手动校验与重置',
          description: '用 FormData 读取昵称与勾选值，手动处理昵称错误和回焦，再恢复初始值。',
          component: FormBasics,
          source: formBasicsSource,
        },
      ],
    },
    {
      id: 'validation',
      title: '校验、错误与焦点',
      content: (
        <>
          <p>
            required、type、maxLength 等按各控件支持范围保留浏览器约束。原生提交校验不通过时，
            onSubmit 不会执行。控件的 error 用于呈现错误和关联无障碍状态。
          </p>
          <p>
            自定义校验由调用方实现。本例用 noValidate
            关闭浏览器提交校验，再检查去除首尾空白后的昵称，失败时设置 error 并用 ref 聚焦
            Input，编辑后清除过期错误与结果。Select 的 ref 指向可见触发按钮，单选组的 ref 指向
            fieldset，错误回焦需定位组内 radio。详见{' '}
            <Link href="#/components/select?section=form">Select 必选与回焦</Link>。
          </p>
          <p>
            使用 Form 绑定时，由 Form 收集原生约束和自定义 validate 的结果、关联字段错误并定位
            首个错误字段，见{' '}
            <Link href="#/components/form?section=validation">Form 校验时机与错误来源</Link>。
          </p>
        </>
      ),
    },
    {
      id: 'reset',
      title: '受控与非受控重置',
      content: (
        <>
          <p>
            Input / Textarea 的 value、Checkbox / Switch 的 checked、Select 的 value 可由 React
            管理，配套回调必须更新状态。defaultValue / defaultChecked
            只设置非受控初始值，同一字段保持一种模式。RadioGroup / SegmentedControl 只支持受控选择。
          </p>
          <p>
            原生 reset 恢复非受控初始值。自行管理的受控值、错误、读取结果和派生状态由调用方在
            onReset 中恢复。 本例浏览器恢复复选框，React 恢复昵称并清理反馈。取消 reset
            默认行为后，非受控字段也不会自动恢复。半选汇总还需同步父子状态，见{' '}
            <Link href="#/components/checkbox?section=mixed">全选与半选</Link>。
          </p>
          <p>
            使用 Form 绑定时，通过 <code>type="reset"</code> 按钮或 <code>form.reset()</code>
            恢复首次 initialValues 并清理 Form 状态。应用额外维护的预览和保存结果仍需自行处理，见{' '}
            <Link href="#/components/form?section=reset">Form 初始值与重置</Link>。
          </p>
        </>
      ),
    },
    {
      id: 'controls',
      title: '七类控件的原生接入差异',
      content: (
        <>
          <p>
            下表说明原生 form 的取值和状态规则。左右滑动查看完整表格，键盘聚焦后可用左右方向键。
          </p>
          <div className="table-scroll" role="region" aria-label="表单控件接入差异" tabIndex={0}>
            <table className="api-table">
              <thead>
                <tr>
                  <th scope="col">控件</th>
                  <th scope="col">值与提交</th>
                  <th scope="col">校验与状态</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">
                    <Link href="#/components/input?section=form">Input</Link>
                  </th>
                  <td>value / defaultValue；name 提交单行内容。</td>
                  <td>原生 type / required；ref 指向 input，readOnly 保留提交。</td>
                </tr>
                <tr>
                  <th scope="row">
                    <Link href="#/components/textarea?section=textarea-comment-draft">
                      Textarea
                    </Link>
                  </th>
                  <td>value / defaultValue；提交内容保留换行。</td>
                  <td>
                    required / maxLength；长度按 UTF-16 代码单元计数，autoSize 随重置调整高度。
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <Link href="#/components/select?section=form">Select</Link>
                  </th>
                  <td>value / defaultValue 为字符串或 null；name 提交所选值。</td>
                  <td>required 保留必选约束；失败回焦可见触发按钮。readOnly 可浏览且保留值。</td>
                </tr>
                <tr>
                  <th scope="row">
                    <Link href="#/components/checkbox?section=form">Checkbox</Link>
                  </th>
                  <td>checked / defaultChecked 控制勾选；勾选时提交 value，同名多项用 getAll。</td>
                  <td>required 要求该项勾选；indeterminate 独立于 checked，不改变提交值。</td>
                </tr>
                <tr>
                  <th scope="row">
                    <Link href="#/components/radio-group?section=form">RadioGroup</Link>
                  </th>
                  <td>只支持 value / onValueChange；显式 name 提供稳定的组字段名。</td>
                  <td>required 为组内原生必选约束；禁用项不提交，reset 需恢复 React 状态。</td>
                </tr>
                <tr>
                  <th scope="row">
                    <Link href="#/components/switch?section=form">Switch</Link>
                  </th>
                  <td>checked / defaultChecked；开启时提交 value，默认 value 为 on。</td>
                  <td>required 要求开启；loading 阻止重复切换并保留值与焦点，disabled 不提交。</td>
                </tr>
                <tr>
                  <th scope="row">
                    <Link href="#/components/segmented-control?section=form">SegmentedControl</Link>
                  </th>
                  <td>只支持 value / onValueChange；name 对应原生单选组。</td>
                  <td>
                    required 要求选择；reset 需恢复 React 状态，错误文字放在组外并关联
                    aria-describedby。
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            条件字段与完整反馈见{' '}
            <Link href="#/guides/interactions?section=feedback">交互组合：表单与反馈</Link>；
            编辑保存、失败重试和关闭恢复见{' '}
            <Link href="#/guides/states?section=scene-article-actions">文章编辑与管理</Link>。
            这些流程由示例管理，接入时配置应用自己的数据与保存逻辑。
          </p>
        </>
      ),
    },
  ],
};

export default page;
