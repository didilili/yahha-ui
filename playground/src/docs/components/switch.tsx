import SwitchBasic from '../../examples/new-forms/SwitchBasic';
import SwitchBasicSource from '../../examples/new-forms/SwitchBasic.tsx?raw';
import SwitchControlled from '../../examples/new-forms/SwitchControlled';
import SwitchControlledSource from '../../examples/new-forms/SwitchControlled.tsx?raw';
import SwitchForm from '../../examples/new-forms/SwitchForm';
import SwitchFormSource from '../../examples/new-forms/SwitchForm.tsx?raw';
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
      content: <p>本页示例只在本地切换和读取，不保存设置或调用接口。</p>,
      examples: [
        {
          id: 'basic',
          title: '基本状态',
          description: '切换开关，并对比禁用与长标签。',
          component: SwitchBasic,
          source: SwitchBasicSource,
        },
        {
          id: 'controlled',
          title: '控制内容显示',
          description: '切换文章摘要的显示，标题始终保留。',
          component: SwitchControlled,
          source: SwitchControlledSource,
        },
        {
          id: 'form',
          title: '表单值与重置',
          description: '读取当前开关值或重置；切换后清除上次结果。',
          component: SwitchForm,
          source: SwitchFormSource,
        },
      ],
    },
    {
      id: 'design',
      title: '状态与表单',
      content: (
        <ul>
          <li>
            checked / onChange 管理受控开关，defaultChecked 设置非受控初始状态；从
            event.target.checked 读取开关结果，实际设置变化由调用方完成。
          </li>
          <li>
            设置 name 与 value 后，仅开启且未禁用时提交
            name=value。非受控状态随原生表单重置，受控状态需在 onReset 中恢复 React 状态。
          </li>
          <li>
            disabled 阻止操作并退出键盘顺序与提交，也支持父 fieldset 禁用。需要锁定设置时使用
            disabled，Switch 不提供只读模式。
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
              name: 'disabled',
              type: 'boolean',
              description: '禁用交互和提交，支持父 fieldset disabled。',
              defaultValue: 'false（原生）',
            },
            {
              name: 'name / value / form / required',
              type: '原生 input 对应属性',
              description: '原生 checkbox 表单能力；仅开启且未禁用时提交，required 要求开启。',
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
