import CheckboxBasic from '../../examples/new-forms/CheckboxBasic';
import CheckboxBasicSource from '../../examples/new-forms/CheckboxBasic.tsx?raw';
import CheckboxDisabled from '../../examples/new-forms/CheckboxDisabled';
import checkboxDisabledSource from '../../examples/new-forms/CheckboxDisabled.tsx?raw';
import CheckboxLongLabel from '../../examples/new-forms/CheckboxLongLabel';
import checkboxLongLabelSource from '../../examples/new-forms/CheckboxLongLabel.tsx?raw';
import CheckboxMixed from '../../examples/new-forms/CheckboxMixed';
import CheckboxMixedSource from '../../examples/new-forms/CheckboxMixed.tsx?raw';
import CheckboxForm from '../../examples/new-forms/CheckboxForm';
import CheckboxFormSource from '../../examples/new-forms/CheckboxForm.tsx?raw';
import CheckboxReadingTopics from '../../examples/new-forms/CheckboxReadingTopics';
import CheckboxReadingTopicsSource from '../../examples/new-forms/CheckboxReadingTopics.tsx?raw';
import CheckboxReadingList from '../../examples/new-forms/CheckboxReadingList';
import CheckboxReadingListSource from '../../examples/new-forms/CheckboxReadingList.tsx?raw';
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
      examples: [
        {
          id: 'basic',
          title: '基础用法',
          description: '点击或按空格切换勾选。',
          component: CheckboxBasic,
          source: CheckboxBasicSource,
        },
        {
          id: 'checkbox-disabled',
          title: '禁用状态',
          description: '对比禁用时未勾选与已勾选的外观。',
          component: CheckboxDisabled,
          source: checkboxDisabledSource,
        },
        {
          id: 'mixed',
          title: '受控选择与半选',
          description: '全选联动分类，查看半选与数量变化。',
          component: CheckboxMixed,
          source: CheckboxMixedSource,
        },
      ],
    },
    {
      id: 'integration',
      title: '进阶用法',
      disclosure: '查看长标签、表单与列表组合',
      content: <p>兴趣条件记录在当前地址中；清单和表单操作只保留在当前示例。</p>,
      examples: [
        {
          id: 'checkbox-long-label',
          title: '长标签换行',
          description: '窄栏中保留完整标签。',
          component: CheckboxLongLabel,
          source: checkboxLongLabelSource,
          toc: false,
        },
        {
          id: 'form',
          toc: false,
          title: '表单提交、必选与重置',
          description: '读取已勾选分类或重置；改选后清除上次读取结果。',
          component: CheckboxForm,
          source: CheckboxFormSource,
        },
        {
          id: 'checkbox-reading-topics',
          toc: false,
          title: '多选筛选与地址同步',
          description: '勾选多项筛选内容，通过链接或浏览器返回恢复条件。',
          component: CheckboxReadingTopics,
          source: CheckboxReadingTopicsSource,
        },
        {
          id: 'checkbox-reading-list',
          toc: false,
          title: '批量选择与失败重试',
          description: '全选或部分选择后确认移出；本地模拟失败时保留选择并可重试。',
          component: CheckboxReadingList,
          source: CheckboxReadingListSource,
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
          <li>
            表单例使用 onInput 清除旧读取结果，确认项勾选后清除该项错误；原生重置继续恢复初始勾选。
          </li>
          <li>
            兴趣例按任一所选主题匹配，未选择时显示全部；地址仅使用专属 query
            键记录条件，保留其他参数和当前路由。 返回、前进与分享链接恢复条件，URL 管理由示例完成。
          </li>
          <li>
            清单例只从稍后阅读移出，文章内容仍保留。确认、首次失败、重试与取消等待均由示例管理，
            成功后聚焦仍存在的复选项或恢复入口。
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
