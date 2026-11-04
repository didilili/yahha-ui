import CheckboxBasic from '../../examples/new-forms/CheckboxBasic';
import CheckboxBasicSource from '../../examples/new-forms/CheckboxBasic.tsx?raw';
import CheckboxMixed from '../../examples/new-forms/CheckboxMixed';
import CheckboxMixedSource from '../../examples/new-forms/CheckboxMixed.tsx?raw';
import CheckboxForm from '../../examples/new-forms/CheckboxForm';
import CheckboxFormSource from '../../examples/new-forms/CheckboxForm.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('checkbox', {
  importCode: "import { Checkbox } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          用于可独立勾选的事项、允许多选的偏好和需要提交确认的同意项。互斥选择使用{' '}
          <a href="#/components/radio-group">RadioGroup</a>；打开或关闭一个即时生效的设置使用{' '}
          <a href="#/components/switch">Switch</a>。汇总一组子项时，可用 indeterminate
          表达部分已选。
        </p>
      ),
    },
    {
      id: 'examples',
      title: '代码演示',
      content: <p>本页示例只在本地勾选和读取，不实际订阅或保存设置。</p>,
      examples: [
        {
          id: 'basic',
          title: '基本状态',
          description: '切换勾选状态，并对比禁用与长标签。',
          component: CheckboxBasic,
          source: CheckboxBasicSource,
        },
        {
          id: 'mixed',
          title: '受控选择与半选',
          description: '全选联动分类，查看半选与数量变化。',
          component: CheckboxMixed,
          source: CheckboxMixedSource,
        },
        {
          id: 'form',
          title: '表单提交、必选与重置',
          description: '读取已勾选分类或重置；改选后清除上次读取结果。',
          component: CheckboxForm,
          source: CheckboxFormSource,
        },
      ],
    },
    {
      id: 'design',
      title: '状态与表单',
      content: (
        <ul>
          <li>
            checked / onChange 用于受控状态，defaultChecked 设置非受控初始状态。原生变化事件通过
            event.target.checked 读取是否勾选。
          </li>
          <li>
            设置 name 与 value 后，只有勾选且未禁用的项参与提交；同名多项使用 FormData.getAll
            读取。非受控勾选随表单重置，受控勾选需在 onReset 中恢复。
          </li>
          <li>
            indeterminate 表达部分选择，由调用方根据子项计算；它与 checked 独立，实际提交仍由
            checked 决定，重置时也应同步父子状态。
          </li>
          <li>
            required 逐项要求勾选；一组中“至少选一项”的规则由调用方校验，并维护 error。
            需要锁定选择时使用 disabled，Checkbox 不提供只读模式。
          </li>
        </ul>
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
              description: '受控半选状态，向辅助技术表达部分选择；不改变 checked 或提交值。',
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
      title: '可访问性与键盘',
      content: (
        <ul>
          <li>
            Tab 聚焦，Space 切换，点击整条标签也可切换。label 提供名称，避免在标签内嵌套链接或按钮。
          </li>
          <li>
            相关复选项使用 fieldset / legend 命名整组。校验失败时，用 error 说明原因，并可通过 ref
            聚焦需要修正的复选框。
          </li>
        </ul>
      ),
    },
    {
      id: 'limits',
      title: '样式定制',
      content: (
        <p>
          一组复选框的间距可通过外层 flex / grid 的 gap 设置；标签文字和辅助说明可分别用
          classNames.text、classNames.hint
          定制。长标签应允许换行，避免固定行高裁切文字或缩小可点击范围。
        </p>
      ),
    },
  ],
});
