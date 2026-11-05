import SwitchBasic from '../../examples/new-forms/SwitchBasic';
import SwitchBasicSource from '../../examples/new-forms/SwitchBasic.tsx?raw';
import SwitchControlled from '../../examples/new-forms/SwitchControlled';
import SwitchControlledSource from '../../examples/new-forms/SwitchControlled.tsx?raw';
import SwitchForm from '../../examples/new-forms/SwitchForm';
import SwitchFormSource from '../../examples/new-forms/SwitchForm.tsx?raw';
import SwitchReadingPreference from '../../examples/new-forms/SwitchReadingPreference';
import SwitchReadingPreferenceSource from '../../examples/new-forms/SwitchReadingPreference.tsx?raw';
import SwitchDisabled from '../../examples/new-forms/SwitchDisabled';
import SwitchDisabledSource from '../../examples/new-forms/SwitchDisabled.tsx?raw';
import SwitchLoading from '../../examples/new-forms/SwitchLoading';
import SwitchLoadingSource from '../../examples/new-forms/SwitchLoading.tsx?raw';
import { defineComponentPage } from '../page';

export default defineComponentPage('switch', {
  importCode: "import { Switch } from 'yahha-ui';",
  sections: [
    {
      id: 'usage',
      title: '何时使用',
      content: (
        <p>
          打开或关闭一个即时生效的设置，例如显示文章摘要。需要先勾选、再统一提交的偏好或同意事项使用{' '}
          <a href="#/components/checkbox">Checkbox</a>；在多个互斥值中选择时使用{' '}
          <a href="#/components/radio-group">RadioGroup</a>。
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
          description: '点击或按空格切换。',
          component: SwitchBasic,
          source: SwitchBasicSource,
          previewAlign: 'center',
        },
        {
          id: 'switch-disabled',
          title: '禁用状态',
          description: '对比关闭与开启时的禁用外观。',
          component: SwitchDisabled,
          source: SwitchDisabledSource,
          previewAlign: 'center',
        },
        {
          id: 'switch-loading',
          title: '加载状态',
          description: '加载时保持当前状态，不能重复切换。',
          component: SwitchLoading,
          source: SwitchLoadingSource,
          previewAlign: 'center',
        },
        {
          id: 'controlled',
          title: '受控状态',
          description: '通过 checked 与 onChange 管理状态。',
          component: SwitchControlled,
          source: SwitchControlledSource,
          previewAlign: 'center',
        },
      ],
    },
    {
      id: 'integration',
      title: '进阶用法',
      disclosure: '查看表单与异步示例',
      content: <p>表单例演示取值与重置；异步例由使用方管理本地模拟保存。</p>,
      examples: [
        {
          id: 'form',
          title: '表单集成',
          description: '读取开关值，或重置到初始状态。',
          component: SwitchForm,
          source: SwitchFormSource,
          toc: false,
        },
        {
          id: 'switch-reading-preference',
          title: '异步切换与失败恢复',
          description: '模拟保存时显示加载状态，首次失败后回滚，可再次切换重试。',
          component: SwitchReadingPreference,
          source: SwitchReadingPreferenceSource,
          toc: false,
        },
      ],
    },
    {
      id: 'design',
      title: '状态与交互',
      content: (
        <ul>
          <li>
            checked / onChange 管理受控状态，defaultChecked 设置初始状态；从 event.target.checked
            读取结果。
          </li>
          <li>
            loading 显示圆扣内的三墨点并阻止点击、空格切换，保留当前值、焦点和表单值。
            请求、完成与失败处理由使用方控制，组件不自动发起保存。
          </li>
          <li>
            disabled 使用原生禁用行为，退出键盘顺序且不参与表单提交，支持父 fieldset 禁用。 loading
            不会自动设置原生 disabled；显式禁用仍按原生规则处理。
          </li>
        </ul>
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
              name: 'loading',
              type: 'boolean',
              description:
                '显示加载状态并阻止重复切换，保留 checked、焦点和表单值；同时设置 aria-busy 与 aria-disabled。',
              defaultValue: 'false',
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
              description:
                '原生表单属性；开启且未禁用时提交，loading 不移除表单值，required 要求开启。',
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
      title: '可访问性与键盘',
      content: (
        <ul>
          <li>
            Tab 聚焦，Space 切换，点击整条标签也可切换。读屏器通过 switch 角色与原生 checked
            状态读取开关结果。
          </li>
          <li>
            label
            使用稳定的设置名称，例如“显示文章摘要”，切换后保持不变。标签内避免嵌套其他交互控件；
            需要额外解释切换结果时，在相邻文字中说明。
          </li>
        </ul>
      ),
    },
    {
      id: 'limits',
      title: '样式定制',
      content: (
        <p>
          多个开关之间的间距在外层容器中设置；调整标签文字或提示分别使用 classNames.text /
          classNames.hint。长标签允许换行，避免通过缩小轨道或点击区域来压缩布局。
        </p>
      ),
    },
  ],
});
